import { NextRequest, NextResponse } from 'next/server';
import { NtlmClient } from 'axios-ntlm';
import os from 'os';

const SWIFT_ENVIRONMENTS = {
  'Test 1': 'http://swiftenv1',
  'Test 2': 'http://swiftenv2',
  'Test 4': 'http://swiftenv4',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order, environment } = body;

    if (!order) {
      return NextResponse.json(
        { error: 'Order payload is required' },
        { status: 400 }
      );
    }

    const env = environment || 'Test 1';
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

    const url = `${baseUrl}/Customer/Home/CreateOrderPackage`;
    const payload = { order };

    console.log(`[Create Order API] Creating order package in ${env}`);
    console.log(`[Create Order API] URL: ${url}`);
    console.log(`[Create Order API] Customer: ${order.CustomerNumber} (ID: ${order.CustomerId})`);
    console.log(`[Create Order API] Product: ${order.SelectedProduct}`);

    const startTime = Date.now();

    try {
      console.log(`[Create Order API] 🔐 Starting NTLM authentication for ${username}@${domain}`);
      
      const ntlmClient = NtlmClient({
        username,
        password,
        domain,
        workstation: os.hostname(),
      });

      console.log(`[Create Order API] 📤 Sending POST request...`);
      
      const response = await ntlmClient.post(url, payload, {
        timeout: 60000, // 60 second timeout
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const elapsed = Math.round((Date.now() - startTime) / 1000);
      console.log(`[Create Order API] ✅ Order created successfully in ${elapsed}s`);
      console.log(`[Create Order API] Response:`, response.data);

      // Extract order number from response (Swift returns it in data.id)
      const orderNumber = response.data?.id || response.data?.TransactionId || response.data?.orderId || null;
      
      if (orderNumber) {
        console.log(`[Create Order API] 📦 Order Number: ${orderNumber}`);
      }

      return NextResponse.json({
        success: true,
        data: response.data,
        orderNumber: orderNumber, // Now returns just the number
        elapsed: elapsed * 1000,
        message: response.data?.message || 'Order package created successfully',
      });
    } catch (error: any) {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      console.error(`[Create Order API] ❌ Error after ${elapsed}s:`, error.message);

      if (error.response) {
        console.error(`[Create Order API] HTTP ${error.response.status}:`, error.response.data);
        return NextResponse.json(
          { 
            error: `Swift API returned status ${error.response.status}`, 
            body: error.response.data,
            elapsed: elapsed * 1000,
          },
          { status: error.response.status }
        );
      }

      return NextResponse.json(
        { 
          error: 'Failed to create order package', 
          details: error.message, 
          code: error.code,
          elapsed: elapsed * 1000,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[Create Order API] Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
