import { NextRequest, NextResponse } from 'next/server';
import httpntlm from 'httpntlm';
import os from 'os';

const SWIFT_ENVIRONMENTS = {
  'Test 1': 'http://swiftenv1',
  'Test 2': 'http://swiftenv2',
  'Test 4': 'http://swiftenv4',
};

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const body = await request.json();
    const { contactId, glmAddressId } = body;

    // Only contactId is required, glmAddressId is optional (can be empty string or null)
    if (!contactId) {
      return NextResponse.json(
        { error: 'contactId is required' },
        { status: 400 }
      );
    }

    const env = request.nextUrl.searchParams.get('env') || 'Test 1';
    const baseUrl = SWIFT_ENVIRONMENTS[env as keyof typeof SWIFT_ENVIRONMENTS];

    if (!baseUrl) {
      return NextResponse.json(
        { error: 'Invalid environment' },
        { status: 400 }
      );
    }

    // Get Windows authentication credentials
    const username = os.userInfo().username;
    const password = process.env.SWIFT_API_PASSWORD;
    const domain = process.env.USERDOMAIN || 'CTL';

    if (!password) {
      return NextResponse.json(
        { error: 'SWIFT_API_PASSWORD not configured in .env.local' },
        { status: 500 }
      );
    }

    // Build the payload for PersistAssociations API
    // If glmAddressId is empty string, use null for EntityId2 and empty string for glmAddressId
    const entityId2 = glmAddressId || null;
    const glmAddressIdValue = glmAddressId || '';
    
    const payload = {
      contact: {
        ContactId: contactId
      },
      associations: [
        {
          Activity: "",
          Application: "",
          ContactId: contactId,
          EntityKey: {
            EntityId1: orderId,
            EntityId2: entityId2,
            Type: "OrderPackage"
          },
          Role: {
            RoleName: "Order Contact",
            RoleId: "ORDER_CON",
            Required: true,
            RoleSetSuffix: `${orderId}_`
          }
        },
        {
          Activity: "",
          Application: "",
          ContactId: contactId,
          EntityKey: {
            EntityId1: orderId,
            EntityId2: entityId2,
            Type: "OrderPackage"
          },
          Role: {
            RoleName: "Local Contact - Primary",
            RoleId: "LOCAL_BLD",
            Required: false,
            RoleSetSuffix: `${orderId}_`
          }
        },
        {
          Activity: "",
          Application: "",
          ContactId: contactId,
          EntityKey: {
            EntityId1: orderId,
            EntityId2: entityId2,
            Type: "OrderPackage"
          },
          Role: {
            RoleName: "Local Contact - Secondary",
            RoleId: "LOCAL_BLD2",
            Required: false,
            RoleSetSuffix: `${orderId}_`
          }
        }
      ],
      transactionId: orderId,
      glmAddressId: glmAddressIdValue
    };

    console.log('=== TEST: Persist Contacts API ===');
    console.log('Order ID:', orderId);
    console.log('Contact ID:', contactId);
    console.log('GLM Address ID:', glmAddressId);
    console.log('Environment:', env);
    console.log('Base URL:', baseUrl);
    console.log('Username:', username);
    console.log('Domain:', domain);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const url = `${baseUrl}/OrderPackage/Contacts/PersistAssociations`;

    return new Promise((resolve) => {
      const startTime = Date.now();

      (httpntlm as any).post(
        {
          url: url,
          username: username,
          password: password,
          workstation: os.hostname(),
          domain: domain,
          json: payload,
        },
        (err: any, res: any) => {
          const duration = Date.now() - startTime;

          if (err) {
            console.error('❌ Request Error:', err);
            resolve(
              NextResponse.json({
                success: false,
                error: 'Request failed',
                details: err.message,
                debug: {
                  orderId,
                  contactId,
                  glmAddressId,
                  environment: env,
                  baseUrl,
                  url,
                  username,
                  domain,
                  duration: `${duration}ms`,
                  payload,
                },
              })
            );
            return;
          }

          console.log('Response Status:', res.statusCode);
          console.log('Response Headers:', res.headers);
          console.log('Response Body:', res.body);
          console.log('Duration:', `${duration}ms`);

          if (res.statusCode === 401) {
            resolve(
              NextResponse.json({
                success: false,
                statusCode: 401,
                error: 'Authentication failed',
                debug: {
                  orderId,
                  contactId,
                  glmAddressId,
                  environment: env,
                  baseUrl,
                  url,
                  username,
                  domain,
                  duration: `${duration}ms`,
                  payload,
                },
              })
            );
            return;
          }

          if (res.statusCode !== 200) {
            console.error(`❌ HTTP ${res.statusCode}:`, res.body);
            resolve(
              NextResponse.json({
                success: false,
                statusCode: res.statusCode,
                body: res.body,
                debug: {
                  orderId,
                  contactId,
                  glmAddressId,
                  environment: env,
                  baseUrl,
                  url,
                  username,
                  domain,
                  duration: `${duration}ms`,
                  payload,
                },
              })
            );
            return;
          }

          try {
            const data = JSON.parse(res.body);
            console.log('✅ Success!');
            console.log('Contact associated successfully');

            resolve(
              NextResponse.json({
                success: true,
                message: 'Contact associations persisted successfully',
                data: data,
                debug: {
                  orderId,
                  contactId,
                  glmAddressId,
                  environment: env,
                  baseUrl,
                  url,
                  username,
                  domain,
                  duration: `${duration}ms`,
                  payload,
                  responseSize: res.body.length,
                },
              })
            );
          } catch (parseErr: any) {
            console.error('❌ Parse Error:', parseErr);
            resolve(
              NextResponse.json({
                success: false,
                error: 'Failed to parse response',
                details: parseErr.message,
                rawBody: res.body,
                debug: {
                  orderId,
                  contactId,
                  glmAddressId,
                  environment: env,
                  baseUrl,
                  url,
                  username,
                  domain,
                  duration: `${duration}ms`,
                  payload,
                },
              })
            );
          }
        }
      );
    });
  } catch (error: any) {
    console.error('❌ Unexpected Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
