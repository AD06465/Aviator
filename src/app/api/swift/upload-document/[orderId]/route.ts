/**
 * Swift AddDocuments API
 * Uploads a document file to an order using multipart/form-data
 */

import { NextRequest, NextResponse } from 'next/server';
import httpntlm from 'httpntlm';
import os from 'os';
import FormData from 'form-data';

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
    const orderId = params.orderId;
    
    // Parse the multipart form data from request
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const customerId = formData.get('customerId') as string;
    const businessOrderId = formData.get('businessOrderId') as string;
    const environment = formData.get('environment') as string || 'Test 1';

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided',
      }, { status: 400 });
    }

    if (!customerId || !businessOrderId) {
      return NextResponse.json({
        success: false,
        error: 'Customer ID and Business Order ID are required',
      }, { status: 400 });
    }

    // Get environment-specific base URL
    const baseUrl = SWIFT_ENVIRONMENTS[environment as keyof typeof SWIFT_ENVIRONMENTS];
    
    if (!baseUrl) {
      return NextResponse.json({
        success: false,
        error: `Invalid environment: ${environment}`,
      }, { status: 400 });
    }

    const url = `${baseUrl}/Document/AddDocuments`;

    // Get Windows credentials
    const username = process.env.SWIFT_API_USERNAME || os.userInfo().username;
    const password = process.env.SWIFT_API_PASSWORD;
    const domain = process.env.SWIFT_API_DOMAIN || 'CTL';

    if (!password) {
      return NextResponse.json({
        success: false,
        error: 'SWIFT_API_PASSWORD not configured',
      }, { status: 500 });
    }

    console.log(`[Swift Upload] Uploading document for order ${orderId}: ${file.name} (${file.size} bytes)`);

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create FormData for multipart upload
    const uploadForm = new FormData();
    uploadForm.append('customerId', customerId);
    uploadForm.append('transactionId', orderId);
    uploadForm.append('businessOrderId', businessOrderId);
    uploadForm.append('docs', buffer, {
      filename: file.name,
      contentType: file.type || 'application/pdf',
    });

    // Make NTLM request with multipart form data
    const response: any = await new Promise((resolve, reject) => {
      httpntlm.post(
        {
          url: url,
          username: username,
          password: password,
          domain: domain,
          headers: uploadForm.getHeaders(),
          body: uploadForm.getBuffer(),
        } as any,
        (err: any, res: any) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });

    if (response.statusCode === 200) {
      console.log(`[Swift Upload] ✅ Document uploaded successfully: ${file.name}`);
      
      return NextResponse.json({
        success: true,
        message: response.body || 'Document Uploaded Successfully',
        fileName: file.name,
        fileSize: file.size
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Swift API returned non-200 status',
        statusCode: response.statusCode,
        responseBody: response.body
      }, { status: response.statusCode || 500 });
    }

  } catch (error: any) {
    console.error('Error uploading document to Swift:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error occurred'
    }, { status: 500 });
  }
}
