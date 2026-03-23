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
  { params }: { params: { gcaOrderId: string } }
) {
  try {
    const { gcaOrderId } = params;

    if (!gcaOrderId) {
      return NextResponse.json(
        { error: 'gcaOrderId is required' },
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
    const password = process.env.SWIFT_API_PASSWORD;
    const domain = process.env.USERDOMAIN || 'CTL';

    if (!password) {
      return NextResponse.json(
        { error: 'SWIFT_API_PASSWORD not configured in .env.local' },
        { status: 500 }
      );
    }

    // Build the GCA order details URL
    const gcaUrl = `${baseUrl}/WebUI/RevenueCreditAuthWeb/Order/Order/${gcaOrderId}`;

    console.log('GCA Order Details Request:', {
      url: gcaUrl,
      username,
      domain,
    });

    // Make NTLM authenticated request
    return new Promise((resolve) => {
      httpntlm.get(
        {
          url: gcaUrl,
          username: username,
          password: password,
          workstation: os.hostname(),
          domain: domain,
        },
        (err: any, res: any) => {
          if (err) {
            console.error('GCA Order Details API Error:', err);
            resolve(
              NextResponse.json(
                { 
                  error: 'Failed to connect to GCA API',
                  details: err.message,
                  url: gcaUrl
                },
                { status: 500 }
              )
            );
            return;
          }

          console.log('GCA Order Details Response Status:', res.statusCode);

          if (res.statusCode === 200) {
            const htmlResponse = res.body;

            // Parse order details from HTML
            let extractedData = null;
            try {
              extractedData = parseGCAOrderDetails(htmlResponse);
            } catch (parseError) {
              console.error('Failed to parse order details HTML:', parseError);
            }

            resolve(
              NextResponse.json({
                success: true,
                statusCode: res.statusCode,
                gcaOrderId: gcaOrderId,
                environment: env,
                htmlResponse: htmlResponse,
                extractedData: extractedData,
                message: 'GCA Order Details API call successful',
              })
            );
          } else {
            resolve(
              NextResponse.json(
                {
                  error: 'GCA Order Details API returned error',
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
    console.error('GCA Order Details Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Parse GCA Order Details HTML
function parseGCAOrderDetails(html: string): any {
  try {
    const data: any = {
      customerInfo: {},
      contactInfo: {},
      financialInfo: {},
      formData: {},
      actions: {
        orderResultOptions: [],
        orderStatusOptions: [],
        holdReasonOptions: [],
        holdActionOptions: [],
      },
    };

    // Extract Request ID
    const requestIdMatch = html.match(/Request Id:<\/dt>\s*<dd>\s*(\d+)/);
    if (requestIdMatch) data.customerInfo.requestId = requestIdMatch[1];

    // Extract BusOrg ID
    const busOrgMatch = html.match(/BusOrg ID:<\/dt>\s*<dd>\s*([^<]+)/);
    if (busOrgMatch) data.customerInfo.busOrgId = busOrgMatch[1].trim();

    // Extract Company Name
    const companyMatch = html.match(/Company Name:<\/dt>\s*<dd>\s*<a[^>]*>([^<]+)/);
    if (companyMatch) data.customerInfo.companyName = companyMatch[1].trim();

    // Extract Order Type
    const orderTypeMatch = html.match(/Order Type:<\/dt>\s*<dd>\s*([^<]+)/);
    if (orderTypeMatch) data.customerInfo.orderType = orderTypeMatch[1].trim();

    // Extract Order Action
    const orderActionMatch = html.match(/Order Action:<\/dt>\s*<dd>\s*([^<]+)/);
    if (orderActionMatch) data.customerInfo.orderAction = orderActionMatch[1].trim();

    // Extract Account Status
    const accountStatusMatch = html.match(/Account Status:<\/dt>\s*<dd>\s*([^<]+)/);
    if (accountStatusMatch) data.customerInfo.accountStatus = accountStatusMatch[1].trim();

    // Extract Source System
    const sourceSystemMatch = html.match(/Source System:<\/dt>\s*<dd>\s*([^<]+)/);
    if (sourceSystemMatch) data.customerInfo.sourceSystem = sourceSystemMatch[1].trim();

    // Extract Last Updated By
    const lastUpdatedByMatch = html.match(/Last Updated By:<\/dt>\s*<dd>\s*([^<]+)/);
    if (lastUpdatedByMatch) data.customerInfo.lastUpdatedBy = lastUpdatedByMatch[1].trim();

    // Extract Last Updated
    const lastUpdatedMatch = html.match(/Last Updated:<\/dt>\s*<dd>\s*([^<]+)/);
    if (lastUpdatedMatch) data.customerInfo.lastUpdated = lastUpdatedMatch[1].trim();

    // Extract Region
    const regionMatch = html.match(/Region:<\/dt>\s*<dd>\s*([^<]+)/);
    if (regionMatch) data.customerInfo.region = regionMatch[1].trim();

    // Extract Business Connect
    const businessConnectMatch = html.match(/Business Connect:<\/dt>\s*<dd>\s*([^<]+)/);
    if (businessConnectMatch) data.customerInfo.businessConnect = businessConnectMatch[1].trim();

    // Extract Financial Information
    const mrcMatch = html.match(/MRC:<\/dt>\s*<dd>\s*\$?([\d,\.]+)/);
    if (mrcMatch) data.financialInfo.mrc = mrcMatch[1];

    const nrcMatch = html.match(/NRC:<\/dt>\s*<dd>\s*\$?([\d,\.]+)/);
    if (nrcMatch) data.financialInfo.nrc = nrcMatch[1];

    const totalMatch = html.match(/Total:<\/dt>\s*<dd>\s*\$?([\d,\.]+)/);
    if (totalMatch) data.financialInfo.total = totalMatch[1];

    const creditLimitMatch = html.match(/Credit Limit:<\/dt>\s*<dd>\s*\$?([\d,\.]+)/);
    if (creditLimitMatch) data.financialInfo.creditLimit = creditLimitMatch[1];

    const availableCreditMatch = html.match(/Available Credit:<\/dt>\s*<dd>\s*\$?([\d,\.]+)/);
    if (availableCreditMatch) data.financialInfo.availableCredit = availableCreditMatch[1];

    const creditRatingMatch = html.match(/Credit Rating:<\/dt>\s*<dd>\s*([^<]+)/);
    if (creditRatingMatch) data.financialInfo.creditRating = creditRatingMatch[1].trim();

    const arIndicatorMatch = html.match(/A\/R Indicator:<\/dt>\s*<dd>\s*([^<]+)/);
    if (arIndicatorMatch) data.financialInfo.arIndicator = arIndicatorMatch[1].trim();

    // Extract Form Data (for Save action)
    const customerIdMatch = html.match(/name="CustomerId"[^>]*value="(\d+)"/);
    if (customerIdMatch) data.formData.customerId = customerIdMatch[1];

    const requestIdFormMatch = html.match(/name="RequestId"[^>]*value="(\d+)"/);
    if (requestIdFormMatch) data.formData.requestId = requestIdFormMatch[1];

    const orderIdMatch = html.match(/name="OrderId"[^>]*value="(\d+)"/);
    if (orderIdMatch) data.formData.orderId = orderIdMatch[1];

    const tokenMatch = html.match(/name="__RequestVerificationToken"[^>]*value="([^"]+)"/);
    if (tokenMatch) data.formData.requestVerificationToken = tokenMatch[1];

    // Extract Order Result dropdown options
    const orderResultRegex = /<select[^>]*id="OrderCreditResult"[^>]*>([\s\S]*?)<\/select>/;
    const orderResultSelectMatch = html.match(orderResultRegex);
    if (orderResultSelectMatch) {
      const optionsRegex = /<option[^>]*value="(\d+)"[^>]*>([^<]+)<\/option>/g;
      let match;
      while ((match = optionsRegex.exec(orderResultSelectMatch[1])) !== null) {
        data.actions.orderResultOptions.push({
          value: match[1],
          text: match[2].trim(),
          selected: match[0].includes('selected'),
        });
      }
    }

    // Extract Order Status dropdown options
    const orderStatusRegex = /<select[^>]*id="OrderCreditState"[^>]*>([\s\S]*?)<\/select>/;
    const orderStatusSelectMatch = html.match(orderStatusRegex);
    if (orderStatusSelectMatch) {
      const optionsRegex = /<option[^>]*value="(\d+)"[^>]*>([^<]+)<\/option>/g;
      let match;
      while ((match = optionsRegex.exec(orderStatusSelectMatch[1])) !== null) {
        data.actions.orderStatusOptions.push({
          value: match[1],
          text: match[2].trim(),
          selected: match[0].includes('selected'),
        });
      }
    }

    // Extract Hold Reason dropdown options
    const holdReasonRegex = /<select[^>]*id="CreditHoldReasonDisplay"[^>]*>([\s\S]*?)<\/select>/;
    const holdReasonSelectMatch = html.match(holdReasonRegex);
    if (holdReasonSelectMatch) {
      const optionsRegex = /<option[^>]*value="(\d+)"[^>]*>([^<]+)<\/option>/g;
      let match;
      while ((match = optionsRegex.exec(holdReasonSelectMatch[1])) !== null) {
        data.actions.holdReasonOptions.push({
          value: match[1],
          text: match[2].trim(),
          selected: match[0].includes('selected'),
        });
      }
    }

    // Extract Hold Action dropdown options
    const holdActionRegex = /<select[^>]*id="CreditHoldAction"[^>]*>([\s\S]*?)<\/select>/;
    const holdActionSelectMatch = html.match(holdActionRegex);
    if (holdActionSelectMatch) {
      const optionsRegex = /<option[^>]*value="(\d+)"[^>]*>([^<]+)<\/option>/g;
      let match;
      while ((match = optionsRegex.exec(holdActionSelectMatch[1])) !== null) {
        data.actions.holdActionOptions.push({
          value: match[1],
          text: match[2].trim(),
          selected: match[0].includes('selected'),
        });
      }
    }

    // Get current selected values
    const selectedOrderResult = data.actions.orderResultOptions.find((o: any) => o.selected);
    if (selectedOrderResult) data.formData.currentOrderResult = selectedOrderResult.text;

    const selectedOrderStatus = data.actions.orderStatusOptions.find((o: any) => o.selected);
    if (selectedOrderStatus) data.formData.currentOrderStatus = selectedOrderStatus.text;

    const selectedHoldReason = data.actions.holdReasonOptions.find((o: any) => o.selected);
    if (selectedHoldReason) data.formData.currentHoldReason = selectedHoldReason.text;

    const selectedHoldAction = data.actions.holdActionOptions.find((o: any) => o.selected);
    if (selectedHoldAction) data.formData.currentHoldAction = selectedHoldAction.text;

    return data;
  } catch (error) {
    console.error('Parse error:', error);
    return { error: 'Failed to parse HTML response' };
  }
}
