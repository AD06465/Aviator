/**
 * Test API for Swift SaveOrderPackage
 * Used to update Order Type, OES, Coordinator, and NAE values
 */

import { NextRequest, NextResponse } from 'next/server';
import httpntlm from 'httpntlm';
import os from 'os';

const SWIFT_ENVIRONMENTS = {
  'Test 1': 'http://swiftenv1',
  'Test 2': 'http://swiftenv2',
  'Test 4': 'http://swiftenv4',
};

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { 
      transactionId,
      orderType,
      selectedOES,
      selectedCoordinator,
      selectedNAE,
      customerId,
      customerNumber,
      environment = 'Test 1'
    } = body;

    console.log('=== Swift SaveOrderPackage Test API ===');
    console.log('Environment:', environment);
    console.log('Transaction ID:', transactionId);
    console.log('Order Type:', orderType);
    console.log('Selected OES:', selectedOES);
    console.log('Selected Coordinator:', selectedCoordinator);
    console.log('Selected NAE:', selectedNAE);

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
        error: 'SWIFT_API_PASSWORD not configured in environment',
      }, { status: 500 });
    }

    // Build the complete payload
    const payload = {
      orderPackageDetail: {
        IsDetailUpdated: true,
        TransactionId: transactionId,
        LegacyWorkflowHistoryId: null,
        WorkflowId: "0900000000000000000000016675470", // Will be dynamic in production
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
        BusinessOrderId: 3568028, // Will be dynamic in production
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
        OrderType: orderType || "Install",
        OrderingGroup: "Install",
        ServiceCenter: "Order Entry",
        PrimaryAE: null,
        SelectedCoordinator: selectedCoordinator || username,
        SelectedNAE: selectedNAE || "AB81208",
        SelectedTAE: null,
        SelectedOES: selectedOES || username,
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
        CustomerId: customerId || 966529,
        CustomerNumber: customerNumber || "2-L3CJPK",
        CustomerInfo: {
          CustomerName: "Level 3 Demo and Testing",
          CustomerId: customerId || 966529,
          CustomerNumber: customerNumber || "2-L3CJPK",
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
        OecProductsTooltip: "Data Services\nAdditional MPLS/IP VPN Logical Interface\nSecure Access Site\nSecure Access Remote Location\nIP VPN\nILAN\nConverged Services (Original)\nConverged Services\nMulti-VPN\nMVP Connector\nLynkGroup\nvpnLynk Connector\nMPLS/IP VPN",
        SeoProductsTooltip: "E-Access - OVC\nE-LAN - EVC\nE-LAN - EVC Endpoint\nELine - EVC\nE-Line - EVC\neLynk - EVC\neLynk - Interconnection\neLynk Interface\nE-NNI\nEthernet Leased Line\nFabric Port\nUNI\nWholesale UNI\nWholesale Voice\n\nBulk Cross Connect Multi Point Extension\nBulk Cross Connect Single Point to Multi Point\nBulk Cross Connect Single Point to Single Point\nCo-location\nColocation EU Exterior\nColocation EU Standard Cabinet\nColocation EU Suite\nColocation NA Caged Rack\nColocation NA Exterior\nColocation NA High Density Power Cabinet\nColocation NA Open Rack\nColocation NA Standard Cabinet\nColocation NA Suite\nCo-Location Private Cage\nConduit\nDark Fiber\nDark Fiber Pair\nEthernet Private Line\nHSIP Cross Connect\nHSIP Ethernet Private Line\nHSIP Private Line\nHSIP Wavelength\nHub Facility\nPNT Node\nPrivate Line\nStand Alone Cross Connect\nTransport\nTransport - End Link\nTransport - Entrance Facility\nTransport - Ethernet\nTransport - PNT Access Channel\nTransport - Point to Point\nTransport - Storage Transport\nTransport - Video\nTransport - Wavelength\nWavelength",
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

    console.log('\n--- Request Details ---');
    console.log('Environment:', environment);
    console.log('URL:', url);
    console.log('Method: POST');
    console.log('Auth: NTLM');
    console.log('Domain:', domain);
    console.log('Username:', username);
    console.log('\n--- Payload (Key Fields) ---');
    console.log(JSON.stringify({
      TransactionId: payload.orderPackageDetail.TransactionId,
      OrderType: payload.orderPackageDetail.OrderType,
      SelectedOES: payload.orderPackageDetail.SelectedOES,
      SelectedCoordinator: payload.orderPackageDetail.SelectedCoordinator,
      SelectedNAE: payload.orderPackageDetail.SelectedNAE,
      CustomerId: payload.orderPackageDetail.CustomerId,
      CustomerNumber: payload.orderPackageDetail.CustomerNumber
    }, null, 2));

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
        },
        (err: any, res: any) => {
          if (err) {
            console.error('NTLM Request Error:', err);
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log('\n--- Response Details ---');
    console.log('Status Code:', response.statusCode);
    console.log('Duration:', duration, 'ms');
    console.log('Response Body:', JSON.stringify(response.body, null, 2));

    if (response.statusCode === 200) {
      return NextResponse.json({
        success: true,
        data: response.body,
        metadata: {
          transactionId,
          orderType,
          selectedOES,
          selectedCoordinator,
          selectedNAE,
          statusCode: response.statusCode,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
          authentication: {
            domain,
            username,
            method: 'NTLM'
          }
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Swift API returned non-200 status',
        statusCode: response.statusCode,
        responseBody: response.body,
        duration: `${duration}ms`
      }, { status: response.statusCode || 500 });
    }

  } catch (error: any) {
    console.error('Error calling Swift SaveOrderPackage API:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error occurred',
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
