import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import httpntlm from 'httpntlm';
import os from 'os';

const SWIFT_ORDER_PACKAGE_URLS = {
  'Test 1': 'http://swiftenv1',
  'Test 2': 'http://swiftenv2',
  'Test 4': 'http://swiftenv4',
};

// Get current Windows username
function getCurrentUsername() {
  const userInfo = os.userInfo();
  return userInfo.username;
}

// Get domain from environment
function getDomain() {
  return process.env.USERDOMAIN || 'CTL';
}

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const env = request.nextUrl.searchParams.get('env') || 'Test 1';
    
    const baseUrl = SWIFT_ORDER_PACKAGE_URLS[env as keyof typeof SWIFT_ORDER_PACKAGE_URLS];
    if (!baseUrl) {
      return NextResponse.json(
        { error: 'Invalid environment specified' },
        { status: 400 }
      );
    }

    const username = getCurrentUsername();
    const domain = getDomain();
    const password = process.env.SWIFT_API_PASSWORD || '';
    
    const url = `${baseUrl}/OrderPackage/OrderDetail/LoadOrderPackage`;
    
    console.log(`[Swift Windows Auth] Testing endpoint: ${url}`);
    console.log(`[Swift Windows Auth] Domain: ${domain}`);
    console.log(`[Swift Windows Auth] Username: ${username}`);
    console.log(`[Swift Windows Auth] Password configured: ${password ? 'Yes' : 'No'}`);
    console.log(`[Swift Windows Auth] Transaction ID: ${orderId}`);

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Configuration Required',
          message: 'Windows password not configured',
          help: {
            step1: 'Create a file named .env.local in the project root',
            step2: 'Add this line: SWIFT_API_PASSWORD=your_windows_password',
            step3: 'Restart the development server (npm run dev)',
            example: 'See .env.local.example for reference'
          },
          auth: `${domain}\\${username}`
        },
        { status: 400 }
      );
    }

    // Use httpntlm for Windows authentication
    // Note: httpntlm uses 'qs' for query string parameters
    // Swift API expects transactionId as integer query parameter
    return new Promise((resolve) => {
      httpntlm.get({
        url: `${url}?transactionId=${parseInt(orderId)}`,
        username: username,
        password: password,
        workstation: os.hostname(),
        domain: domain
      }, (err: any, res: any) => {
        if (err) {
          console.error('[Swift Windows Auth] NTLM Error:', err);
          resolve(NextResponse.json(
            {
              success: false,
              error: 'Windows Authentication Failed',
              message: err.message,
              details: err,
              endpoint: url,
              auth: `${domain}\\${username}`
            },
            { status: 500 }
          ));
          return;
        }

        if (res.statusCode !== 200) {
          console.error(`[Swift Windows Auth] HTTP Error: ${res.statusCode}`);
          console.error('[Swift Windows Auth] Response:', res.body?.substring(0, 500));
          
          resolve(NextResponse.json(
            {
              success: false,
              error: `HTTP ${res.statusCode}`,
              message: `Request failed with status code ${res.statusCode}`,
              status: res.statusCode,
              details: res.body,
              endpoint: url,
              auth: `${domain}\\${username}`,
              help: res.statusCode === 401 ? 'Check if password is correct in .env.local' : undefined
            },
            { status: res.statusCode }
          ));
          return;
        }

        console.log(`[Swift Windows Auth] SUCCESS! Status: ${res.statusCode}`);
        console.log(`[Swift Windows Auth] Response preview:`, res.body?.substring(0, 500));

        try {
          const data = JSON.parse(res.body);
          resolve(NextResponse.json({
            success: true,
            status: res.statusCode,
            data: data,
            message: 'Windows authentication successful! Data retrieved.',
            auth: `${domain}\\${username}`
          }));
        } catch (parseError) {
          // If not JSON, return raw response
          resolve(NextResponse.json({
            success: true,
            status: res.statusCode,
            data: res.body,
            message: 'Windows authentication successful! (Non-JSON response)',
            auth: `${domain}\\${username}`
          }));
        }
      });
    });

  } catch (error: any) {
    console.error('[Swift Windows Auth] Unexpected error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error', 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
