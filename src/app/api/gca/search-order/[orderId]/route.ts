import { NextRequest, NextResponse } from 'next/server';
import httpntlm from 'httpntlm';
import os from 'os';

const GCA_ENVIRONMENTS = {
  'Test 1': 'http://billingenv1.corp.intranet',
  'Test 2': 'http://billingenv2.corp.intranet',
  'Test 4': 'http://billingenv4.corp.intranet',
};

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId is required' },
        { status: 400 }
      );
    }

    const env = request.nextUrl.searchParams.get('env') || 'Test 1';
    const baseUrl = GCA_ENVIRONMENTS[env as keyof typeof GCA_ENVIRONMENTS];

    if (!baseUrl) {
      return NextResponse.json(
        { error: 'Invalid environment' },
        { status: 400 }
      );
    }

    // Get Windows authentication credentials
    const username = os.userInfo().username;
    const password = process.env.SWIFT_API_PASSWORD; // Reusing same password
    const domain = process.env.USERDOMAIN || 'CTL';

    if (!password) {
      return NextResponse.json(
        { error: 'SWIFT_API_PASSWORD not configured in .env.local' },
        { status: 500 }
      );
    }

    // Build the GCA search URL
    const gcaUrl = `${baseUrl}/WebUI/RevenueCreditAuthWeb/Order/List`;
    const queryParams = new URLSearchParams({
      RequestId: orderId,
      SelectedOrderView: 'GlobalActionNeeded',
      SelectedOrderViewDisplay: '0',
      Page: '1',
    });

    const fullUrl = `${gcaUrl}?${queryParams.toString()}`;

    console.log('GCA Search Request:', {
      url: fullUrl,
      username,
      domain,
    });

    // Make NTLM authenticated request
    return new Promise((resolve) => {
      httpntlm.get(
        {
          url: fullUrl,
          username: username,
          password: password,
          workstation: os.hostname(),
          domain: domain,
        },
        (err: any, res: any) => {
          if (err) {
            console.error('GCA API Error:', err);
            resolve(
              NextResponse.json(
                { 
                  error: 'Failed to connect to GCA API',
                  details: err.message,
                  url: fullUrl
                },
                { status: 500 }
              )
            );
            return;
          }

          console.log('GCA Response Status:', res.statusCode);

          if (res.statusCode === 200) {
            // Return the HTML response
            const htmlResponse = res.body;

            // Try to extract key data from HTML (basic parsing)
            let extractedData = null;
            try {
              extractedData = parseGCAResponse(htmlResponse);
            } catch (parseError) {
              console.error('Failed to parse HTML:', parseError);
            }

            resolve(
              NextResponse.json({
                success: true,
                statusCode: res.statusCode,
                orderId: orderId,
                environment: env,
                htmlResponse: htmlResponse,
                extractedData: extractedData,
                message: 'GCA API call successful',
              })
            );
          } else {
            resolve(
              NextResponse.json(
                {
                  error: 'GCA API returned error',
                  statusCode: res.statusCode,
                  response: res.body,
                },
                { status: res.statusCode }
              )
            );
          }
        }
      );
    });
  } catch (error: any) {
    console.error('GCA Search Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Basic HTML parsing function to extract order data
function parseGCAResponse(html: string): any {
  try {
    const data: any = {
      orderFound: false,
      requestId: null,
      orderCreditState: null,
      orderCreditResult: null,
      gcaOrderId: null,
      lastUpdatedOn: null,
      companyName: null,
      sourceSystem: null,
    };

    // Check if order was found
    if (html.includes('(0) order(s) showing')) {
      return { ...data, message: 'No order found in GCA' };
    }

    data.orderFound = html.includes('(1) order(s) showing') || html.includes('grid-row');

    // Extract Request ID
    const requestIdMatch = html.match(/data-name="RequestId">(\d+)</);
    if (requestIdMatch) data.requestId = requestIdMatch[1];

    // Extract Order Credit State
    const creditStateMatch = html.match(/data-name="OrderCreditState">([^<]+)</);
    if (creditStateMatch) data.orderCreditState = creditStateMatch[1].trim();

    // Extract Order Credit Result
    const creditResultMatch = html.match(/data-name="OrderCreditResult">([^<]+)</);
    if (creditResultMatch) data.orderCreditResult = creditResultMatch[1].trim();

    // Extract GCA Order ID from Details link
    const gcaOrderIdMatch = html.match(/href="\/WebUI\/RevenueCreditAuthWeb\/Order\/Order\/(\d+)"/);
    if (gcaOrderIdMatch) data.gcaOrderId = gcaOrderIdMatch[1];

    // Extract Last Updated
    const lastUpdatedMatch = html.match(/data-name="LastUpdatedOn">([^<]+)</);
    if (lastUpdatedMatch) data.lastUpdatedOn = lastUpdatedMatch[1].trim();

    // Extract Company Name
    const companyMatch = html.match(/data-name="OrgName">([^<]+)</);
    if (companyMatch) data.companyName = companyMatch[1].trim();

    // Extract Source System
    const sourceMatch = html.match(/data-name="SourceSystem">([^<]+)</);
    if (sourceMatch) data.sourceSystem = sourceMatch[1].trim();

    // Extract Customer Number (BusOrg ID)
    const customerMatch = html.match(/data-name="CustomerNumber">([^<]+)</);
    if (customerMatch) data.customerNumber = customerMatch[1].trim();

    // Extract Region
    const regionMatch = html.match(/data-name="Region">([^<]+)</);
    if (regionMatch) data.region = regionMatch[1].trim();

    // Extract Hold Reason
    const holdReasonMatch = html.match(/data-name="CreditHoldReason">([^<]+)</);
    if (holdReasonMatch) data.creditHoldReason = holdReasonMatch[1].trim();

    // Extract Hold Action
    const holdActionMatch = html.match(/data-name="CreditHoldAction">([^<]+)</);
    if (holdActionMatch) data.creditHoldAction = holdActionMatch[1].trim();

    return data;
  } catch (error) {
    return { error: 'Failed to parse HTML response' };
  }
}
