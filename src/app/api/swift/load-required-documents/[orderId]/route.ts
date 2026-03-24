/**
 * Swift LoadRequiredDocuments API
 * Gets the list of required documents for an order
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
      taskData,          // Task data (can be null for initial check)
    } = body;

    // Get environment-specific base URL
    const baseUrl = SWIFT_ENVIRONMENTS[environment as keyof typeof SWIFT_ENVIRONMENTS];
    
    if (!baseUrl) {
      return NextResponse.json({
        success: false,
        error: `Invalid environment: ${environment}`,
      }, { status: 400 });
    }

    if (!orderPackageData) {
      return NextResponse.json({
        success: false,
        error: 'Order package data is required',
      }, { status: 400 });
    }

    const url = `${baseUrl}/OrderPackage/Documents/LoadRequiredDocuments`;

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
      task: taskData || null,  // Can be null for initial document check
      orderPackage: orderPackageData
    };

    console.log(`[Swift LoadRequiredDocuments] Loading required documents for order ${orderId} in ${environment}`);

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
      let requiredDocuments;
      try {
        requiredDocuments = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
      } catch (e) {
        return NextResponse.json({
          success: false,
          error: 'Failed to parse Swift API response',
          rawResponse: response.body
        }, { status: 500 });
      }

      console.log(`[Swift LoadRequiredDocuments] Found ${requiredDocuments.length} required document(s)`);
      
      if (requiredDocuments.length > 0) {
        console.log(`[Swift LoadRequiredDocuments] Required docs:`, requiredDocuments.map((d: any) => d.DocumentName).join(', '));
      }

      // Return simplified format only
      const documentTypes = requiredDocuments.map((doc: any) => ({
        type: doc.DocType,
        name: doc.DocumentName,
        group: doc.VerificationGroup,
        attached: doc.AttachmentExists || false,
        legalReview: doc.IsLegalComplianceReviewRequired || false
      }));

      return NextResponse.json({
        success: true,
        requiredCount: requiredDocuments.length,
        documentTypes: documentTypes
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
    console.error('Error calling Swift LoadRequiredDocuments API:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error occurred'
    }, { status: 500 });
  }
}
