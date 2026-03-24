/**
 * Swift UpdateDocumentType API
 * Sets the document type/business purpose (e.g., "SOF") for an uploaded document
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
      document,  // Document object from LoadDocuments
      documentTypes,  // Array of types to set, e.g., ["SOF", "Workbook/Order Form"]
    } = body;

    // Get environment-specific base URL
    const baseUrl = SWIFT_ENVIRONMENTS[environment as keyof typeof SWIFT_ENVIRONMENTS];
    
    if (!baseUrl) {
      return NextResponse.json({
        success: false,
        error: `Invalid environment: ${environment}`,
      }, { status: 400 });
    }

    if (!document || !document.DocumentId) {
      return NextResponse.json({
        success: false,
        error: 'Document object with DocumentId is required',
      }, { status: 400 });
    }

    if (!documentTypes || !Array.isArray(documentTypes) || documentTypes.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Document types array is required (e.g., ["SOF"])',
      }, { status: 400 });
    }

    const url = `${baseUrl}/Document/UpdateDocumentType`;

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

    // Update document with BusinessPurposeType
    const updatedDocument = {
      ...document,
      BusinessPurposeType: documentTypes
    };

    const payload = {
      doc: updatedDocument
    };

    console.log(`[Swift UpdateDocumentType] Updating document ${document.DocumentId} with types: ${documentTypes.join(', ')}`);

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
      console.log(`[Swift UpdateDocumentType] ✅ Document type updated successfully`);
      
      return NextResponse.json({
        success: true,
        message: 'Document type updated successfully',
        documentId: document.DocumentId,
        types: documentTypes
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
    console.error('Error updating document type in Swift:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error occurred'
    }, { status: 500 });
  }
}
