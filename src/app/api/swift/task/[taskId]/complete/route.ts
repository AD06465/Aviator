import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const SWIFT_ENVIRONMENTS = {
  'Test 1': 'http://swiftservicesenv1:9003/Swift/v1/WorkCenter',
  'Test 2': 'http://swiftservicesenv2:9003/Swift/v1/WorkCenter',
  'Test 4': 'http://swiftservicesenv4:9003/Swift/v1/WorkCenter',
};

export async function PUT(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const { taskId } = params;
    const env = request.nextUrl.searchParams.get('env') || 'Test 1';
    
    const baseUrl = SWIFT_ENVIRONMENTS[env as keyof typeof SWIFT_ENVIRONMENTS];
    if (!baseUrl) {
      return NextResponse.json(
        { error: 'Invalid environment specified' },
        { status: 400 }
      );
    }

    const url = `${baseUrl}/task/${taskId}/completeWithAction`;
    console.log(`[Swift Proxy] Completing task ${taskId} at ${url}`);

    const response = await axios.put(url, {}, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('[Swift Proxy] Error completing task:', error.message);
    
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
