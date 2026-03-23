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
      environment = 'Test 1',
      orderType = "Install",
      selectedOES = "AD06465",
      selectedCoordinator = "AD06465",
      selectedNAE = "AB81208"
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

    // Build the complete payload
    const payload = {
      orderPackageDetail: {
        IsDetailUpdated: true,
        TransactionId: transactionId,
        LegacyWorkflowHistoryId: null,
        WorkflowId: workflowId,
        DueDate: null,
        DueDateTimeZone: null,
        ModifiedBy: null,
        ModifiedDate: "0001-01-01T00:00:00",
        CreatedBy: username,
        CreatedDate: new Date().toISOString(),
        IPJustificationRequired: false,
        SalesTeam: "Blue",
        RevenueCity: null,
        Source: "Swift",
        MacdGMApprove: false,
        MacdGM: null,
        CreatedInternal: true,
        ContainsInstallProducts: false,
        ContainsRenewalProducts: false,
        SendTaskToOnNet: false,
        OriginatingGroup: "Care",
        OrderPackageWorkflowID: null,
        IsOpLegacyMacdOnly: true,
        LegacyOpHasRsiProducts: true,
        BusinessOrderId: businessOrderId,
        HasLegacyOecProducts: false,
        IsCspCustomerExecutedMsa: false,
        SalesOffice: "Albany, NY",
        Status: "New",
        MaxRestartStatus: "Unknown",
        CreditApprovalId: null,
        DisconnectReasonId: null,
        IsLegacyPackage: false,
        OrderInitiator: "SWIFT_API",
        NAE_ADNAME: null,
        OrderInitiatorDisplay: "API, SWIFT",
        OrderType: orderType,
        OrderingGroup: "Install",
        ServiceCenter: "Order Entry",
        PrimaryAE: null,
        SelectedCoordinator: selectedCoordinator,
        SelectedNAE: selectedNAE,
        SelectedTAE: null,
        SelectedOES: selectedOES,
        SelectedVAE: null,
        SelectedCPM: null,
        SelectedGM: null,
        SelectedSM: null,
        SelectedTDE: null,
        SelectedTDESecurity: null,
        SelectedVSC: null,
        SelectedCSR: null,
        SelectedDirectoryListing: null,
        SelectedSolutionManager: null,
        SelectedSMDisplayName: null,
        SelectedGMDisplayName: null,
        AutoAssignOES: true,
        CustomerId: customerId,
        CustomerNumber: customerNumber,
        CustomerInfo: {
          CustomerName: "Level 3 Demo and Testing",
          CustomerId: customerId,
          CustomerNumber: customerNumber,
          ServiceLevel: "Diamond",
          SalesChannel: "Local",
          Segment: "MASS MARKETS",
          SubSegment: "MTU",
          Address: "10475 PARK MEADOWS DR LITTLETON COLORADO 80124 5433 UNITED STATES",
          DisplayAddress: null,
          LobId: 522,
          IsInternalCustomer: false,
          BusinessUnit: "Business Support"
        },
        AccountExecutiveEditable: false,
        AutoAssignOrderEntrySpecialistEditable: false,
        BillingDateEditable: false,
        CustomerProjectManagerEditable: false,
        CSREditable: false,
        DisconnectReasonEditable: false,
        FacilityPortProductChangeEditable: false,
        FacilityPortProductChangeVisible: false,
        IPJustificationEditable: false,
        IPJustificationVisible: false,
        LegacyMacdEditable: false,
        MacdGeneralManagerApprovalEditable: false,
        NetworkAccountExecutiveEditable: false,
        PortingAppliesEditable: false,
        SetEditNddRebdDatesEditable: false,
        SetEditNddRebdDatesVisible: false,
        OECProductsEditable: false,
        OrderCoordinatorEditable: false,
        OrderEntrySpecialistEditable: false,
        OrderTypeEditable: false,
        SeoProductsEditable: false,
        TaeEditable: false,
        TdeEditable: false,
        VscEditable: false,
        DirectoryListingEditable: false,
        SolutionManagerEditable: false,
        CanCreateNewPspEditable: false,
        CanCreateNewPspVisible: false,
        CanAddPsp: false,
        CommunicateWithBillingVisible: false,
        CommunicateWithBillingEditable: false,
        HasSeoProducts: true,
        HasOecProducts: false,
        HasOrderingSystemCpo: false,
        SourceDisplayName: "SwIFT",
        HasInventoryProducts: false,
        HasLegacyMacd: true,
        PortingApplies: false,
        OrderTypeRoutes: null,
        OecProductsTooltip: "",
        SeoProductsTooltip: "",
        CanCreateNewPsp: false,
        CommunicateWithRsi: false,
        CommunicateWithBilling: false,
        CreatorGlobalRegion: "NA",
        SeoType: "eProducts",
        GCAApprovalStatus: "None",
        GCACreditCheckId: null,
        CspCustomerWithExecutedMsaVisible: false,
        ChangeVersion: null,
        PreDeployStatus: "None",
        IsHwanGatekeeperOes: false,
        SuppressCustomerNotification: false,
        SuppressCustomerNotificationEditable: false,
        AccountOpportunityOwner: null,
        AccountOpportunityOwnerDisplay: null,
        HasDigitalInformationCollection: false,
        OrderTags: null,
        SecureCompany: "LUMEN",
        BundleExists: false,
        GCAApprovalStatusDescription: "",
        Session: null,
        Version: null,
        Environment: null,
        CurrentCulture: null,
        CurrentCultureUI: null,
        CurrentCultureName: "",
        CurrentCultureKendoMessage: null,
        GlobalAjaxTimeout: 0,
        ServerName: "USIDC2WVSWIFT1W",
        LocalTimezone: 3,
        LocalTimezoneDescription: "Mountain Standard Time"
      },
      productPackages: [],
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
