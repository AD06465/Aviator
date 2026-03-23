import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const SWIFT_ENVIRONMENTS = {
  'Test 1': 'http://swiftservicesenv1:9003/Swift/v1/WorkCenter',
  'Test 2': 'http://swiftservicesenv2:9003/Swift/v1/WorkCenter',
  'Test 4': 'http://swiftservicesenv4:9003/Swift/v1/WorkCenter',
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
        { error: 'Invalid environment specified' },
        { status: 400 }
      );
    }

    const url = `${baseUrl}/tasks/transaction/${orderId}`;
    console.log(`[Swift Proxy] Fetching tasks for order ${orderId} from ${url}`);

    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('[Swift Proxy] Error fetching tasks:', error.message);
    
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: 'Swift API Error',
          message: error.message,
          status: error.response?.status,
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
