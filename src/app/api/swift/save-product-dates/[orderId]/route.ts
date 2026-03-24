/**
 * Swift SaveProductPackageDatesBulk API
 * Sets NDD (NegotiatedDueDate) and CRD (CustomerRequestedDate) for product packages
 * Updates ALL PSPs on the order with the specified dates
 * Date format: M/D/YYYY (e.g., "3/30/2026")
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
      ndd,               // Negotiated Due Date (format: "M/D/YYYY")
      crd,               // Customer Requested Date (format: "M/D/YYYY")
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

    if (!ndd || !crd) {
      return NextResponse.json({
        success: false,
        error: 'Both NDD and CRD dates are required',
      }, { status: 400 });
    }

    const url = `${baseUrl}/OrderPackage/ProductPackages/SaveProductPackageDatesBulk`;

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

    // Build PSP rules - mark all PSPs as dates editable
    const pspRules = orderPackageData.ProductPackageSummaries?.map((psp: any) => ({
      ProductPackageId: psp.ProductPackageId,
      ProductAttributesEditable: true,
      ProductAttributeEditable: true,
      DetailsEditable: true,
      ProductPriceInfoEditable: true,
      ChargeAttributesEditable: true,
      TechnicalServiceAttributesEditable: true,
      RelatedNumbersEditable: true,
      ServiceAddressesEditable: true,
      ServiceAddressesZEditable: false,
      RelatedPSPsEditable: true,
      CancelRemovePspEditable: true,
      EndUserClliEditable: true,
      NRCPriceInfoEditable: true,
      VrfHidden: true,
      EndUserClliEditableDropdown: true,
      PspSetEditDatesEditable: true,
      InstallIntervalEditable: false,
      AccountNumberEditable: true,
      AccountNumberOverrideEditable: false,
      RebdEditable: false,
      NddEditable: true,
      CrdEditable: true,
      SpaceCodeEditable: false,
      DiaVoiceOrderReminder: false,
      ProductAttributeEditableExcludeList: ["Multi Service"],
      IRChildProductKeyResults: {}
    })) || [];

    // Build product package view model list - mark all as checked for date updates
    const productPkgViewModelList = orderPackageData.ProductPackageSummaries?.map((psp: any) => ({
      Checked: true,
      ...psp,
      NegotiatedDueDate: null,  // Set to null to trigger update
      CustomerRequestedDate: null,  // Set to null to trigger update
      RequestedEffectiveBillDate: null,
      DesiredDueDate: null,
      CommittedDueDate: null
    })) || [];

    // Build the complete payload
    const payload = {
      transactionDetailViewModel: orderPackageData.OrderDetail,
      productPkgViewModelList: productPkgViewModelList,
      pspRules: pspRules,
      ndd: ndd,             // Format: "3/30/2026"
      rebd: null,
      ddd: null,
      initiatorId: 0,
      reasonId: 0,
      rebdDeleted: false,
      crd: crd              // Format: "3/30/2026"
    };

    console.log(`[Swift SaveProductDates] Setting dates for order ${orderId} in ${environment}`);
    console.log(`[Swift SaveProductDates] NDD: ${ndd}, CRD: ${crd}`);
    console.log(`[Swift SaveProductDates] Updating ${productPkgViewModelList.length} PSP(s) with dates`);
    console.log(`[Swift SaveProductDates] PSP IDs: ${productPkgViewModelList.map((p: any) => p.ProductPackageId).join(', ')}`);

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
      if (swiftResult.IsSuccess === false || swiftResult.Results?.IsSuccess === false) {
        const errorMessages = swiftResult.Messages || swiftResult.Results?.Messages || ['Unknown error'];
        console.log('[Swift SaveProductDates] Swift returned IsSuccess: false');
        console.log('[Swift SaveProductDates] Error messages:', errorMessages);
        
        return NextResponse.json({
          success: false,
          error: `Swift update failed: ${errorMessages.join('; ')}`,
          messages: errorMessages,
          swiftResponse: swiftResult
        }, { status: 400 });
      }

      // Success
      console.log('[Swift SaveProductDates] ✅ Dates updated successfully');
      console.log('[Swift SaveProductDates] Updated PSP IDs:', swiftResult.Results?.UpdatedProductPackageIDs);
      
      return NextResponse.json({
        success: true,
        data: swiftResult,
        updatedPspIds: swiftResult.Results?.UpdatedProductPackageIDs || [],
        changeMap: swiftResult.Results?.ChangeMap || {}
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
    console.error('Error calling Swift SaveProductDates API:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error occurred'
    }, { status: 500 });
  }
}
