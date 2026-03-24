import { NextRequest, NextResponse } from 'next/server';
import { NtlmClient } from 'axios-ntlm';
import os from 'os';
import fs from 'fs';
import path from 'path';

const SWIFT_ENVIRONMENTS = {
  'Test 1': 'http://swiftenv1',
  'Test 2': 'http://swiftenv2',
  'Test 4': 'http://swiftenv4',
};

// Original IDs from the template that need to be replaced
const TEMPLATE_IDS = {
  TRANSACTION_ID: 556181595,
  PRODUCT_PACKAGE_ID: 464259129,
  PRODUCT_INSTANCE_ID_1: 352951848,
  PRODUCT_INSTANCE_ID_2: 352951849,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, environment, productPackageId, productInstanceId1, productInstanceId2 } = body;

    if (!orderNumber || !productPackageId || !productInstanceId1 || !productInstanceId2) {
      return NextResponse.json(
        { error: 'orderNumber, productPackageId, productInstanceId1, and productInstanceId2 are required' },
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

    // Load the payload template from the file
    const templatePath = path.join(process.cwd(), 'add product package.java');
    
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        { error: 'Payload template file not found: add product package.java' },
        { status: 500 }
      );
    }

    console.log(`[Add Product Package API] Loading payload template from: ${templatePath}`);
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    
    // Extract the JSON payload from the file by finding the opening brace
    // and counting braces to find the matching closing brace
    const startIndex = templateContent.indexOf('{');
    
    if (startIndex === -1) {
      return NextResponse.json(
        { error: 'Could not find JSON payload start in template file' },
        { status: 500 }
      );
    }
    
    // Find the complete JSON object by counting braces
    let braceCount = 0;
    let endIndex = startIndex;
    let inString = false;
    let escapeNext = false;
    
    for (let i = startIndex; i < templateContent.length; i++) {
      const char = templateContent[i];
      
      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      
      if (char === '"') {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIndex = i + 1;
            break;
          }
        }
      }
    }
    
    if (braceCount !== 0) {
      return NextResponse.json(
        { error: 'Malformed JSON in template file - unmatched braces' },
        { status: 500 }
      );
    }
    
    let payloadStr = templateContent.substring(startIndex, endIndex);
    
    // Replace all occurrences of the template IDs with the new generated IDs
    console.log(`[Add Product Package API] Replacing IDs in payload...`);
    console.log(`[Add Product Package API]   Transaction ID: ${TEMPLATE_IDS.TRANSACTION_ID} -> ${orderNumber}`);
    console.log(`[Add Product Package API]   Product Package ID: ${TEMPLATE_IDS.PRODUCT_PACKAGE_ID} -> ${productPackageId}`);
    console.log(`[Add Product Package API]   Product Instance ID 1: ${TEMPLATE_IDS.PRODUCT_INSTANCE_ID_1} -> ${productInstanceId1}`);
    console.log(`[Add Product Package API]   Product Instance ID 2: ${TEMPLATE_IDS.PRODUCT_INSTANCE_ID_2} -> ${productInstanceId2}`);
    
    // Use regex with word boundaries to ensure we only replace complete numbers
    payloadStr = payloadStr.replace(new RegExp(`\\b${TEMPLATE_IDS.TRANSACTION_ID}\\b`, 'g'), orderNumber.toString());
    payloadStr = payloadStr.replace(new RegExp(`\\b${TEMPLATE_IDS.PRODUCT_PACKAGE_ID}\\b`, 'g'), productPackageId.toString());
    payloadStr = payloadStr.replace(new RegExp(`\\b${TEMPLATE_IDS.PRODUCT_INSTANCE_ID_1}\\b`, 'g'), productInstanceId1.toString());
    payloadStr = payloadStr.replace(new RegExp(`\\b${TEMPLATE_IDS.PRODUCT_INSTANCE_ID_2}\\b`, 'g'), productInstanceId2.toString());
    
    // Parse the JSON to validate it
    let payload;
    try {
      payload = JSON.parse(payloadStr);
    } catch (parseError: any) {
      console.error('[Add Product Package API] JSON Parse Error:', parseError.message);
      return NextResponse.json(
        { error: 'Invalid JSON in payload template', details: parseError.message },
        { status: 500 }
      );
    }

    const url = `${baseUrl}/OrderPackage/ProductPackages/SaveProductKey`;

    console.log(`[Add Product Package API] Adding product package to order ${orderNumber} in ${env}`);
    console.log(`[Add Product Package API] URL: ${url}`);
    console.log(`[Add Product Package API] Product: ${payload.productViewModel?.ProductName || 'Unknown'}`);

    const startTime = Date.now();

    try {
      console.log(`[Add Product Package API] 🔐 Starting NTLM authentication for ${username}@${domain}`);
      
      const ntlmClient = NtlmClient({
        username,
        password,
        domain,
        workstation: os.hostname(),
      });

      console.log(`[Add Product Package API] 📤 Sending POST request...`);
      
      const response = await ntlmClient.post(url, payload, {
        timeout: 60000, // 60 second timeout
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const elapsed = Math.round((Date.now() - startTime) / 1000);
      console.log(`[Add Product Package API] ✅ Product package added successfully in ${elapsed}s`);
      console.log(`[Add Product Package API] Response:`, response.data);

      return NextResponse.json({
        success: true,
        data: response.data,
        orderNumber: orderNumber,
        productPackageId: productPackageId,
        elapsed: elapsed * 1000,
        message: response.data?.message || 'Product package added successfully',
      });
    } catch (error: any) {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      console.error(`[Add Product Package API] ❌ Error after ${elapsed}s:`, error.message);

      if (error.response) {
        console.error(`[Add Product Package API] HTTP ${error.response.status}:`, error.response.data);
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
          error: 'Failed to add product package', 
          details: error.message, 
          code: error.code,
          elapsed: elapsed * 1000,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[Add Product Package API] Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
