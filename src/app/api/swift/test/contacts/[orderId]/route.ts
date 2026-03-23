import { NextRequest, NextResponse } from 'next/server';
import httpntlm from 'httpntlm';
import os from 'os';

const SWIFT_ENVIRONMENTS = {
  'Test 1': 'http://swiftenv1',
  'Test 2': 'http://swiftenv2',
  'Test 4': 'http://swiftenv4',
};

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
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

    // Step 1: Fetch order package to get service addresses and business order ID
    const orderPackageUrl = `${baseUrl}/OrderPackage/OrderDetail/LoadOrderPackage?transactionId=${parseInt(orderId)}`;

    const orderPackageData: any = await new Promise((resolve, reject) => {
      httpntlm.get(
        {
          url: orderPackageUrl,
          username: username,
          password: password,
          workstation: os.hostname(),
          domain: domain,
        },
        (err: any, res: any) => {
          if (err) {
            reject(err);
            return;
          }

          if (res.statusCode !== 200) {
            reject(new Error(`Failed to fetch order package: ${res.statusCode}`));
            return;
          }

          try {
            const data = JSON.parse(res.body);
            resolve(data);
          } catch (parseErr) {
            reject(parseErr);
          }
        }
      );
    });

    // Extract required data for contacts API
    const businessOrderId = orderPackageData?.OrderDetail?.BusinessOrderId;
    const serviceAddresses = orderPackageData?.ServiceAddresses || [];

    if (!businessOrderId) {
      return NextResponse.json(
        { error: 'BusinessOrderId not found in order package' },
        { status: 400 }
      );
    }

    // Step 2: Build contacts request payload
    const contactsPayload = {
      transactionId: parseInt(orderId),
      businessOrderId: businessOrderId,
      serviceAddressModels: serviceAddresses,
      orderPackageSource: 'Swift',
    };

    console.log('Contacts API Payload:', JSON.stringify(contactsPayload, null, 2));

    // Step 3: Call contacts API
    const contactsUrl = `${baseUrl}/OrderPackage/Contacts/GetOrderPackageContacts`;

    return new Promise((resolve) => {
      (httpntlm as any).post(
        {
          url: contactsUrl,
          username: username,
          password: password,
          workstation: os.hostname(),
          domain: domain,
          json: contactsPayload,
        },
        (err: any, res: any) => {
          if (err) {
            console.error('Contacts API Error:', err);
            resolve(
              NextResponse.json(
                { error: 'Failed to fetch contacts', details: err.message },
                { status: 500 }
              )
            );
            return;
          }

          if (res.statusCode === 401) {
            resolve(
              NextResponse.json(
                { error: 'Authentication failed' },
                { status: 401 }
              )
            );
            return;
          }

          if (res.statusCode !== 200) {
            resolve(
              NextResponse.json(
                { error: `Contacts API returned status ${res.statusCode}`, body: res.body },
                { status: res.statusCode }
              )
            );
            return;
          }

          try {
            const data = JSON.parse(res.body);
            resolve(
              NextResponse.json({
                success: true,
                status: res.statusCode,
                data: data,
                message: 'Order contacts retrieved successfully',
                auth: `${domain}\\${username}`,
                payload: contactsPayload,
              })
            );
          } catch (parseErr: any) {
            resolve(
              NextResponse.json(
                { error: 'Failed to parse response', details: parseErr.message },
                { status: 500 }
              )
            );
          }
        }
      );
    });
  } catch (error: any) {
    console.error('Contacts Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
