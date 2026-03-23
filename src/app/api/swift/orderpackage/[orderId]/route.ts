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

    const url = `${baseUrl}/OrderPackage/OrderDetail/LoadOrderPackage?transactionId=${parseInt(orderId)}`;

    return new Promise((resolve) => {
      httpntlm.get(
        {
          url: url,
          username: username,
          password: password,
          workstation: os.hostname(),
          domain: domain,
        },
        (err: any, res: any) => {
          if (err) {
            console.error('OrderPackage API Error:', err);
            resolve(
              NextResponse.json(
                { error: 'Failed to fetch order package details', details: err.message },
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
                { error: `Swift API returned status ${res.statusCode}`, body: res.body },
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
                message: 'Order package details retrieved successfully',
                auth: `${domain}\\${username}`,
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
    console.error('OrderPackage Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
