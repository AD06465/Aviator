/**
 * Swift LoadDocuments API
 * Checks if required documents are attached to an order
 */

import { NextRequest, NextResponse } from 'next/server';
import httpntlm from 'httpntlm';
import os from 'os';

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
    const body = await request.json();
    const { 
      environment = 'Test 1',
      orderPackageData,  // Full order package data from LoadOrderPackage
    } = body;

    // Get environment-specific base URL
    const baseUrl = SWIFT_ENVIRONMENTS[environment as keyof typeof SWIFT_ENVIRONMENTS];
    
    if (!baseUrl) {
      return NextResponse.json({
        success: false,
        error: `Invalid environment: ${environment}`,
      }, { status: 400 });
    }

    if (!orderPackageData || !orderPackageData.OrderDetail) {
      return NextResponse.json({
        success: false,
        error: 'Order package data is required',
      }, { status: 400 });
    }

    const url = `${baseUrl}/OrderPackage/Documents/LoadDocuments`;

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

    const payload = {
      transactionId: orderPackageData.OrderDetail.TransactionId,
      businessOrderId: orderPackageData.OrderDetail.BusinessOrderId,
      detail: orderPackageData.OrderDetail
    };

    console.log(`[Swift LoadDocuments] Loading documents for order ${orderId} in ${environment}`);

    // Make NTLM request
    const response: any = await new Promise((resolve, reject) => {
      httpntlm.post(
        {
          url: url,
          username: username,
          password: password,
          domain: domain,
          json: payload,
          headers: {
            'Content-Type': 'application/json',
          },
        } as any,
        (err: any, res: any) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });

    if (response.statusCode === 200) {
      // Parse the Swift response body
      let documents;
      try {
        documents = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
      } catch (e) {
        return NextResponse.json({
          success: false,
          error: 'Failed to parse Swift API response',
          rawResponse: response.body
        }, { status: 500 });
      }

      // Check if documents array is empty
      const hasDocuments = Array.isArray(documents) && documents.length > 0;
      
      console.log(`[Swift LoadDocuments] ${hasDocuments ? '✅' : '⚠️'} Found ${documents.length} document(s)`);

      return NextResponse.json({
        success: true,
        data: documents,
        hasDocuments: hasDocuments,
        documentCount: documents.length
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
    console.error('Error calling Swift LoadDocuments API:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error occurred'
    }, { status: 500 });
  }
}
