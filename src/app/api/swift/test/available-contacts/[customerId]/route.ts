import { NextRequest, NextResponse } from 'next/server';
import * as httpntlm from 'httpntlm';
import * as os from 'os';

interface TestAvailableContactsParams {
  params: {
    customerId: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: TestAvailableContactsParams
) {
  try {
    const { customerId } = params;
    
    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get environment from query parameter - match other test APIs
    const { searchParams } = new URL(request.url);
    const env = searchParams.get('env') || 'Test 1';
    
    // Map environment to Swift server - consistent with other test endpoints
    const envMap: Record<string, string> = {
      'Test 1': 'swiftenv1',
      'Test 2': 'swiftenv2',
      'Test 4': 'swiftenv4',
    };

    const baseHost = envMap[env] || 'swiftenv1';
    const url = `http://${baseHost}/OrderPackage/Contacts/LoadAvailableContacts?customerId=${customerId}`;

    // Get Windows credentials
    const password = process.env.SWIFT_API_PASSWORD;
    if (!password) {
      throw new Error('SWIFT_API_PASSWORD not configured');
    }

    const userInfo = os.userInfo();
    const username = userInfo.username;
    const domain = process.env.USERDOMAIN || 'CTL';
    const workstation = os.hostname();

    console.log('=== TEST: Available Contacts API ===');
    console.log('Customer ID:', customerId);
    console.log('Environment:', env);
    console.log('Base Host:', baseHost);
    console.log('URL:', url);
    console.log('Username:', username);
    console.log('Domain:', domain);
    console.log('Workstation:', workstation);

    // Make NTLM authenticated request
    return new Promise<NextResponse>((resolve, reject) => {
      const startTime = Date.now();

      httpntlm.get(
        {
          url,
          username,
          password,
          domain,
          workstation,
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
                  customerId,
                  environment: env,
                  baseHost,
                  url,
                  username,
                  domain,
                  workstation,
                  duration: `${duration}ms`,
                },
              })
            );
            return;
          }

          console.log('Response Status:', res.statusCode);
          console.log('Response Headers:', res.headers);
          console.log('Duration:', `${duration}ms`);

          if (res.statusCode !== 200) {
            console.error(`❌ HTTP ${res.statusCode}:`, res.body);
            resolve(
              NextResponse.json({
                success: false,
                statusCode: res.statusCode,
                body: res.body,
                debug: {
                  customerId,
                  environment: env,
                  baseHost,
                  url,
                  username,
                  domain,
                  workstation,
                  duration: `${duration}ms`,
                },
              })
            );
            return;
          }

          try {
            const data = JSON.parse(res.body);
            const contactCount = data.length || 0;
            const firstContactId = contactCount > 0 ? data[0].ContactId : null;

            console.log('✅ Success!');
            console.log('Contacts Found:', contactCount);
            console.log('First Contact ID:', firstContactId);

            resolve(
              NextResponse.json({
                success: true,
                contactCount,
                firstContactId,
                contacts: data,
                debug: {
                  customerId,
                  environment: env,
                  baseHost,
                  url,
                  username,
                  domain,
                  workstation,
                  duration: `${duration}ms`,
                  responseSize: res.body.length,
                },
              })
            );
          } catch (parseError: any) {
            console.error('❌ Parse Error:', parseError);
            resolve(
              NextResponse.json({
                success: false,
                error: 'Failed to parse response',
                details: parseError.message,
                rawBody: res.body,
                debug: {
                  customerId,
                  environment: env,
                  baseHost,
                  url,
                  username,
                  domain,
                  workstation,
                  duration: `${duration}ms`,
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
