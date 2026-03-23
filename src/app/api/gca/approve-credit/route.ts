import { NextRequest, NextResponse } from 'next/server';
import httpntlm from 'httpntlm';
import os from 'os';

const GCA_ENVIRONMENTS = {
  'Test 1': 'http://billingenv1.corp.intranet',
  'Test 2': 'http://billingenv2.corp.intranet',
  'Test 4': 'http://billingenv4.corp.intranet',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      requestId,
      orderId,
      requestVerificationToken,
      orderCreditResult = '2', // 2 = Approved
      orderCreditState = '3', // 3 = Credit Analyst Action Needed
      creditHoldReason = '5', // 5 = Past Due Balance
      creditHoldAction = '0', // 0 = No Action Needed
      comment = '',
      emailNotification = true,
    } = body;

    // Validate required fields
    if (!customerId || !requestId || !orderId || !requestVerificationToken) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['customerId', 'requestId', 'orderId', 'requestVerificationToken']
        },
        { status: 400 }
      );
    }

    const env = request.nextUrl.searchParams.get('env') || 'Test 1';
    const baseUrl = GCA_ENVIRONMENTS[env as keyof typeof GCA_ENVIRONMENTS];

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

    // Step 1: First GET the order page to establish session and get cookies
    const orderPageUrl = `${baseUrl}/WebUI/RevenueCreditAuthWeb/Order/Order/${orderId}`;
    
    console.log('Step 1: Getting order page to establish session:', orderPageUrl);

    // Make initial GET request to get cookies
    return new Promise((resolve) => {
      httpntlm.get(
        {
          url: orderPageUrl,
          username: username,
          password: password,
          workstation: os.hostname(),
          domain: domain,
        },
        (getErr: any, getRes: any) => {
          if (getErr) {
            console.error('GCA Get Order Page Error:', getErr);
            resolve(
              NextResponse.json(
                { 
                  error: 'Failed to establish session with GCA',
                  details: getErr.message,
                },
                { status: 500 }
              )
            );
            return;
          }

          // Extract cookies from response
          const cookies = getRes.headers?.['set-cookie'] || [];
          console.log('Got cookies:', cookies);

          // Extract fresh CSRF token from the HTML that matches this session
          const htmlBody = getRes.body || '';
          const tokenMatch = htmlBody.match(/name="__RequestVerificationToken"[^>]*value="([^"]+)"/);
          const freshToken = tokenMatch ? tokenMatch[1] : requestVerificationToken;
          
          console.log('Using CSRF token:', freshToken === requestVerificationToken ? 'original' : 'fresh from session');

          // Step 2: Now POST the approval using the same session
          const gcaUrl = `${baseUrl}/WebUI/RevenueCreditAuthWeb/Order/Save`;

          // Build multipart form data
          const boundary = `----WebKitFormBoundary${Date.now()}`;
          const formParts: string[] = [];

          // Add form fields
          const addField = (name: string, value: string) => {
            formParts.push(
              `--${boundary}\r\n` +
              `Content-Disposition: form-data; name="${name}"\r\n\r\n` +
              `${value}\r\n`
            );
          };

          // Required fields
          addField('__RequestVerificationToken', freshToken);
          addField('CustomerId', customerId);
          addField('RequestId', requestId);
          addField('OrderId', orderId);
          
          // Email notification (checkbox - needs both true and false)
          addField('EmailNotification', emailNotification ? 'true' : 'false');
          addField('EmailNotification', 'false');
          
          // Credit approval fields
          addField('OrderCreditResult', orderCreditResult);
          addField('OrderCreditState', orderCreditState);
          addField('CreditHoldReasonDisplay', creditHoldReason);
          addField('CreditHoldAction', creditHoldAction);
          addField('Comment', comment);
          
          // Empty file uploads (required by form)
          formParts.push(
            `--${boundary}\r\n` +
            `Content-Disposition: form-data; name="FileUpload"; filename=""\r\n` +
            `Content-Type: application/octet-stream\r\n\r\n\r\n`
          );
          formParts.push(
            `--${boundary}\r\n` +
            `Content-Disposition: form-data; name="FileUpload"; filename=""\r\n` +
            `Content-Type: application/octet-stream\r\n\r\n\r\n`
          );
          
          // Duplicate CustomerId at end (as in the example)
          addField('CustomerId', customerId);
          
          // Final boundary
          formParts.push(`--${boundary}--\r\n`);
          
          const formData = formParts.join('');

          console.log('Step 2: Posting approval with cookies');

          // Prepare cookie header
          const cookieHeader = Array.isArray(cookies) 
            ? cookies.map((c: string) => c.split(';')[0]).join('; ')
            : cookies.split(';')[0];

          // Make NTLM authenticated POST request with cookies
          httpntlm.post(
            {
              url: gcaUrl,
              username: username,
              password: password,
              workstation: os.hostname(),
              domain: domain,
              headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Cookie': cookieHeader,
              },
              body: formData,
            },
            (err: any, res: any) => {
              if (err) {
                console.error('GCA Approve API Error:', err);
                resolve(
                  NextResponse.json(
                    { 
                      error: 'Failed to post approval to GCA API',
                      details: err.message,
                      url: gcaUrl
                    },
                    { status: 500 }
                  )
                );
                return;
              }

              console.log('GCA Approve Response Status:', res.statusCode);
              console.log('GCA Approve Response Headers:', res.headers);

              // Check for redirect (successful save often redirects)
              const isSuccess = res.statusCode === 200 || 
                               res.statusCode === 302 || 
                               res.statusCode === 303;

              if (isSuccess) {
                const redirectLocation = res.headers?.location || '';
                
                resolve(
                  NextResponse.json({
                    success: true,
                    statusCode: res.statusCode,
                    message: 'Credit approval submitted successfully',
                    redirectLocation: redirectLocation,
                    customerId: customerId,
                    requestId: requestId,
                    orderId: orderId,
                    orderCreditResult: orderCreditResult,
                    responseBody: res.body?.substring(0, 500),
                  })
                );
              } else {
                resolve(
                  NextResponse.json(
                    {
                      error: 'GCA Approve API returned error',
                      statusCode: res.statusCode,
                      response: res.body?.substring(0, 1000),
                    },
                    { status: res.statusCode }
                  )
                );
              }
            }
          );
        }
      );
    });
  } catch (error: any) {
    console.error('GCA Approve Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
