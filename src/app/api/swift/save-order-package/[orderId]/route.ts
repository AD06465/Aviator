/**
 * Swift SaveOrderPackage API
 * Updates Order Type, OES, Coordinator, and NAE values for orders
 */

import { NextRequest, NextResponse } from 'next/server';
import httpntlm from 'httpntlm';
import os from 'os';

const SWIFT_ENVIRONMENTS = {
  'Test 1': 'http://swiftenv1.corp.global.level3.com',
  'Test 2': 'http://swiftenv2.corp.global.level3.com',
  'Test 4': 'http://swiftenv4.corp.global.level3.com',
};

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;
    const body = await request.json();
    const { 
      transactionId,
      workflowId,
      businessOrderId,
      customerId,
      customerNumber,
      environment = 'Test 1',  // Only keep default for environment
      orderType,               // ✅ NO default - only set if provided
      selectedOES,             // ✅ NO default - only set if provided
      selectedCoordinator,     // ✅ NO default - only set if provided
      selectedNAE,             // ✅ NO default - only set if provided
      existingOrderData        // NEW: Pass existing order data to preserve PSPs
    } = body;

    // Get environment-specific base URL
    const baseUrl = SWIFT_ENVIRONMENTS[environment as keyof typeof SWIFT_ENVIRONMENTS];
    
    if (!baseUrl) {
      return NextResponse.json({
        success: false,
        error: `Invalid environment: ${environment}`,
      }, { status: 400 });
    }

    const url = `${baseUrl}/OrderPackage/Home/SaveOrderPackage/`;

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

    // CRITICAL: Use existing OrderDetail with original timestamps to avoid version conflicts
    // Swift's optimistic locking requires exact timestamps - we only override specific fields
    const existingOrderDetail = existingOrderData?.OrderDetail || {};
    const existingProductPackages = existingOrderData?.ProductPackages || [];
    
    console.log(`[Swift SaveOrderPackage] Using existing OrderDetail with original timestamps`);
    console.log(`[Swift SaveOrderPackage] Original ModifiedDate: ${existingOrderDetail.ModifiedDate}`);
    console.log(`[Swift SaveOrderPackage] Preserving ${existingProductPackages.length} existing PSPs to prevent workflow restart`);
    
    if (existingProductPackages.length > 0) {
      console.log(`[Swift SaveOrderPackage] PSP IDs:`, existingProductPackages.map((p: any) => p.ProductPackageId).join(', '));
    }

    // Build payload using complete existing OrderDetail
    // CRITICAL: Only override fields that were explicitly provided to avoid triggering updates on unchanged fields
    const orderDetailOverrides: any = {
      ...existingOrderDetail,
      IsDetailUpdated: true,
    };

    // Conditionally add fields ONLY if they were provided in the request
    if (orderType !== undefined) {
      orderDetailOverrides.OrderType = orderType;
      console.log(`[Swift SaveOrderPackage] Updating OrderType to: ${orderType}`);
    }
    if (selectedCoordinator !== undefined) {
      orderDetailOverrides.SelectedCoordinator = selectedCoordinator;
      console.log(`[Swift SaveOrderPackage] Updating Coordinator to: ${selectedCoordinator}`);
    }
    if (selectedOES !== undefined) {
      orderDetailOverrides.SelectedOES = selectedOES;
      console.log(`[Swift SaveOrderPackage] Updating OES to: ${selectedOES}`);
    }
    if (selectedNAE !== undefined) {
      orderDetailOverrides.SelectedNAE = selectedNAE;
      console.log(`[Swift SaveOrderPackage] Updating NAE to: ${selectedNAE}`);
    }

    const payload = {
      orderPackageDetail: orderDetailOverrides,
      productPackages: existingProductPackages, // PRESERVE existing PSPs to prevent workflow restart
      cancelRemovePsps: [],
      workFlowPspChangesForRestart: {
        IsWorkflowRestarting: false,
        WorkflowRestartOption: 0,
        ProductServicePackageIds: null,
        CurrentProductServicePackages: null,
        RestartTriggeringChanges: null,
        PspChanges: null
      }
    };

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
      // Parse the Swift response body to check actual success status
      let swiftResult;
      try {
        swiftResult = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
      } catch (e) {
        return NextResponse.json({
          success: false,
          error: 'Failed to parse Swift API response',
          rawResponse: response.body
        }, { status: 500 });
      }

      // Check Swift's actual IsSuccess field
      if (swiftResult.IsSuccess === false) {
        const errorMessages = swiftResult.Messages || ['Unknown error'];
        console.log('[Swift SaveOrderPackage] Swift returned IsSuccess: false');
        console.log('[Swift SaveOrderPackage] Error messages:', errorMessages);
        
        return NextResponse.json({
          success: false,
          error: `Swift update failed: ${errorMessages.join('; ')}`,
          messages: errorMessages,
          swiftResponse: swiftResult
        }, { status: 400 });
      }

      // Success - Swift returned IsSuccess: true
      return NextResponse.json({
        success: true,
        data: swiftResult,
        updatedFields: {
          orderType,
          selectedOES,
          selectedCoordinator,
          selectedNAE
        }
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
    console.error('Error calling Swift SaveOrderPackage API:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error occurred'
    }, { status: 500 });
  }
}
