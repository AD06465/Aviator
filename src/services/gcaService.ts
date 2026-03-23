/**
 * GCA (Global Credit Auth) API Service
 * Handles credit approval automation for Swift orders
 */

export interface GCAOrderSearchResult {
  success: boolean;
  gcaOrderId?: string;
  orderCreditState?: string;
  orderCreditResult?: string;
  error?: string;
}

export interface GCAOrderDetails {
  success: boolean;
  customerId?: string;
  requestId?: string;
  orderId?: string;
  requestVerificationToken?: string;
  orderAction?: string;
  accountStatus?: string;
  error?: string;
}

export interface GCAApprovalResult {
  success: boolean;
  message?: string;
  statusCode?: number;
  error?: string;
}

class GCAService {
  private baseUrl = '/api/gca';

  /**
   * Search for order in GCA by Swift order ID
   */
  async searchOrder(orderId: string, environment: string = 'Test 1'): Promise<GCAOrderSearchResult> {
    try {
      const response = await fetch(`${this.baseUrl}/search-order/${orderId}?env=${encodeURIComponent(environment)}`);
      const data = await response.json();

      if (data.success && data.extractedData) {
        return {
          success: true,
          gcaOrderId: data.extractedData.gcaOrderId,
          orderCreditState: data.extractedData.orderCreditState,
          orderCreditResult: data.extractedData.orderCreditResult,
        };
      }

      return {
        success: false,
        error: data.error || 'Failed to search order in GCA',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error searching GCA',
      };
    }
  }

  /**
   * Get order details from GCA
   */
  async getOrderDetails(gcaOrderId: string, swiftOrderId: string, environment: string = 'Test 1'): Promise<GCAOrderDetails> {
    try {
      const response = await fetch(`${this.baseUrl}/order-details/${gcaOrderId}?env=${encodeURIComponent(environment)}`);
      const data = await response.json();

      if (data.success && data.extractedData && data.extractedData.formData) {
        const formData = data.extractedData.formData;
        const customerInfo = data.extractedData.customerInfo;

        return {
          success: true,
          customerId: formData.customerId,
          requestId: swiftOrderId,
          orderId: gcaOrderId,
          requestVerificationToken: formData.requestVerificationToken,
          orderAction: customerInfo?.orderAction,
          accountStatus: customerInfo?.accountStatus,
        };
      }

      return {
        success: false,
        error: data.error || 'Failed to get order details from GCA',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error getting order details',
      };
    }
  }

  /**
   * Approve credit check in GCA
   */
  async approveCredit(
    customerId: string,
    requestId: string,
    orderId: string,
    requestVerificationToken: string,
    environment: string = 'Test 1'
  ): Promise<GCAApprovalResult> {
    try {
      const payload = {
        customerId,
        requestId,
        orderId,
        requestVerificationToken,
        orderCreditResult: '2', // 2 = Approved
        orderCreditState: '3', // 3 = Credit Analyst Action Needed
        creditHoldReason: '5', // 5 = Past Due Balance
        creditHoldAction: '0', // 0 = No Action Needed
        comment: 'Automated approval via AVIATOR',
        emailNotification: true,
      };

      const response = await fetch(`${this.baseUrl}/approve-credit?env=${encodeURIComponent(environment)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          message: data.message || 'Credit approved successfully',
          statusCode: data.statusCode,
        };
      }

      return {
        success: false,
        error: data.error || 'Failed to approve credit',
        statusCode: data.statusCode,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error approving credit',
      };
    }
  }

  /**
   * Complete credit approval flow (search → details → approve)
   */
  async completeCreditApproval(
    orderId: string,
    environment: string = 'Test 1'
  ): Promise<GCAApprovalResult> {
    // Step 1: Search for order in GCA
    const searchResult = await this.searchOrder(orderId, environment);
    
    if (!searchResult.success || !searchResult.gcaOrderId) {
      return {
        success: false,
        error: `GCA Search Failed: ${searchResult.error || 'Order not found in GCA'}`,
      };
    }

    // Check if already approved
    if (searchResult.orderCreditResult?.toLowerCase().includes('approved')) {
      return {
        success: true,
        message: 'Credit already approved in GCA',
      };
    }

    // Step 2: Get order details
    const detailsResult = await this.getOrderDetails(
      searchResult.gcaOrderId,
      orderId,
      environment
    );

    if (!detailsResult.success || !detailsResult.customerId || !detailsResult.requestVerificationToken) {
      return {
        success: false,
        error: `GCA Details Failed: ${detailsResult.error || 'Missing required data'}`,
      };
    }

    // Step 3: Approve credit
    const approvalResult = await this.approveCredit(
      detailsResult.customerId,
      detailsResult.requestId!,
      detailsResult.orderId!,
      detailsResult.requestVerificationToken,
      environment
    );

    return approvalResult;
  }
}

export const gcaService = new GCAService();
export default gcaService;
