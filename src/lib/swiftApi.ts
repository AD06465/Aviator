import axios, { AxiosInstance } from 'axios';
import { SwiftTask, SwiftProductPackage, SwiftEnvironment, ApiResponse } from '../types';

/**
 * Swift API Service
 * Handles all Swift application API calls for order processing
 */
class SwiftApiService {
  private api: AxiosInstance;
  private currentEnvironment: SwiftEnvironment;
  private environments: SwiftEnvironment[] = [
    {
      name: 'Test 1',
      taskApiUrl: 'http://swiftservicesenv1:9003/Swift/v1/WorkCenter',
      orderApiUrl: 'http://swiftservicesenv1.corp.global.level3.com:9000/Customer/v3/Ordering',
    },
    {
      name: 'Test 2',
      taskApiUrl: 'http://swiftservicesenv2:9003/Swift/v1/WorkCenter',
      orderApiUrl: 'http://swiftservicesenv2.corp.global.level3.com:9000/Customer/v3/Ordering',
    },
    {
      name: 'Test 4',
      taskApiUrl: 'http://swiftservicesenv4:9003/Swift/v1/WorkCenter',
      orderApiUrl: 'http://swiftservicesenv4.corp.global.level3.com:9000/Customer/v3/Ordering',
    },
  ];

  // Task names that should be automatically completed
  private completableTaskNames = [
    'Prepare Order Package',
    'Analyze/Adjust PSPs',
    'Approve Package',
    'Customer Coordination',
    'Welcome Customer',
  ];

  // Task names that require special handling (automated but not directly completed)
  private specialHandlingTasks = [
    'Wait For Credit Approval', // Approved in GCA, Swift auto-completes
  ];

  // Task names that require manual completion
  private manualTaskNames: string[] = [
    // Empty - all tasks are now automated or have special handling
  ];

  constructor() {
    this.currentEnvironment = this.environments[0]; // Default to Test 1
    this.api = axios.create({
      timeout: 130000, // 130 seconds timeout (allow 120s backend + 10s buffer)
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Swift API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Set the current environment
   */
  setEnvironment(environmentName: string): void {
    const env = this.environments.find((e) => e.name === environmentName);
    if (env) {
      this.currentEnvironment = env;
      console.log(`Swift API environment set to: ${environmentName}`);
    }
  }

  /**
   * Get all environments
   */
  getEnvironments(): SwiftEnvironment[] {
    return this.environments;
  }

  /**
   * Get current environment
   */
  getCurrentEnvironment(): SwiftEnvironment {
    return this.currentEnvironment;
  }

  /**
   * Fetch tasks for a specific order/transaction
   */
  async fetchTasks(orderId: string): Promise<ApiResponse<SwiftTask[]>> {
    try {
      // Use API route instead of direct call
      const url = `/api/swift/tasks/${orderId}?env=${this.currentEnvironment.name}`;
      console.log(`Fetching Swift tasks from API route: ${url}`);
      
      const response = await this.api.get<SwiftTask[]>(url);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error fetching Swift tasks:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch Swift tasks',
      };
    }
  }

  /**
   * Complete a task by task ID
   */
  async completeTask(taskId: number): Promise<ApiResponse<any>> {
    try {
      // Use API route instead of direct call
      const url = `/api/swift/task/${taskId}/complete?env=${this.currentEnvironment.name}`;
      console.log(`Completing Swift task ${taskId} via API route: ${url}`);
      
      const response = await this.api.put(url);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error(`Error completing Swift task ${taskId}:`, error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to complete Swift task',
      };
    }
  }

  /**
   * Fetch product package details for an order
   */
  async fetchProductPackage(orderId: string): Promise<ApiResponse<SwiftProductPackage[]>> {
    try {
      // Use API route instead of direct call
      const url = `/api/swift/order/${orderId}/productPackage?env=${this.currentEnvironment.name}`;
      console.log(`Fetching Swift product package from API route: ${url}`);
      
      const response = await this.api.get<SwiftProductPackage[]>(url);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error fetching Swift product package:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch Swift product package',
      };
    }
  }

  /**
   * Fetch order package details (including OES, Coordinator, OrderType validation)
   */
  async fetchOrderPackage(orderId: string): Promise<ApiResponse<any>> {
    try {
      // Use API route instead of direct call
      const url = `/api/swift/orderpackage/${orderId}?env=${this.currentEnvironment.name}`;
      console.log(`Fetching Swift order package from API route: ${url}`);
      
      const response = await this.api.get(url);
      
      return {
        success: true,
        data: response.data?.data || response.data,
      };
    } catch (error: any) {
      console.error('Error fetching Swift order package:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch Swift order package',
      };
    }
  }

  /**
   * Fetch order contacts
   */
  async fetchOrderContacts(orderId: string): Promise<ApiResponse<any>> {
    try {
      // Use API route instead of direct call
      const url = `/api/swift/contacts/${orderId}?env=${this.currentEnvironment.name}`;
      console.log(`Fetching Swift order contacts from API route: ${url}`);
      
      const response = await this.api.get(url);
      
      return {
        success: true,
        data: response.data?.data || response.data,
      };
    } catch (error: any) {
      console.error('Error fetching Swift order contacts:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch Swift order contacts',
      };
    }
  }

  /**
   * Fetch available contacts for a customer number
   */
  async fetchAvailableContacts(customerId: string): Promise<ApiResponse<any>> {
    try {
      // Use API route instead of direct call
      const url = `/api/swift/available-contacts/${customerId}?environment=${this.currentEnvironment.name}`;
      console.log(`Fetching available contacts for customer ${customerId} from API route: ${url}`);
      
      const response = await this.api.get(url);
      
      // Backend now does the parsing and filtering
      const responseData = response.data || {};
      const contacts = responseData.contacts || [];
      const firstContactId = responseData.firstContactId || null;
      
      console.log(`[SwiftApi] Received ${responseData.totalCount || contacts.length} contacts, valid contact: ${firstContactId ? 'found' : 'not found'}`);
      
      return {
        success: true,
        data: {
          contacts,
          firstContactId,
          firstValidContact: responseData.firstValidContact,
          customerNumber: customerId,
          totalCount: responseData.totalCount,
          processedCount: responseData.processedCount,
        },
      };
    } catch (error: any) {
      console.error('Error fetching available contacts:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch available contacts',
      };
    }
  }

  /**
   * Persist contact associations to order
   */
  async persistContactAssociations(orderId: string, contactId: number, glmAddressId: string): Promise<ApiResponse<any>> {
    try {
      const url = `/api/swift/persist-contacts/${orderId}?env=${this.currentEnvironment.name}`;
      console.log(`Persisting contact ${contactId} to order ${orderId} with address ${glmAddressId}`);
      
      const response = await this.api.post(url, {
        contactId,
        glmAddressId,
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error persisting contact associations:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to persist contact associations',
      };
    }
  }

  /**
   * Validate order package - check if required fields are set
   */
  validateOrderPackage(orderPackageData: any, contactsData?: any): { isValid: boolean; missingFields: string[]; errors: string[]; warnings: string[] } {
    const missingFields: string[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!orderPackageData || !orderPackageData.OrderDetail) {
      return {
        isValid: false,
        missingFields: [],
        errors: ['Order package data not found'],
        warnings: [],
      };
    }

    const orderDetail = orderPackageData.OrderDetail;

    // Check CRITICAL required fields (block task processing if missing)
    if (!orderDetail.SelectedCoordinator || orderDetail.SelectedCoordinator === null) {
      missingFields.push('Coordinator');
      errors.push('Order Coordinator is not set');
    }

    if (!orderDetail.OrderType || orderDetail.OrderType === null) {
      missingFields.push('OrderType');
      errors.push('Order Type is not set');
    }

    if (!orderDetail.SelectedOES || orderDetail.SelectedOES === null) {
      missingFields.push('OES');
      errors.push('Order Entry Specialist (OES) is not set');
    }

    // NAE is OPTIONAL - warn but don't block
    if (!orderDetail.SelectedNAE || orderDetail.SelectedNAE === null) {
      warnings.push('Network Account Executive (NAE) is not set (optional field)');
    }

    // Check contacts if provided
    if (contactsData) {
      const hasContacts = 
        (contactsData.OrderPackageContacts && contactsData.OrderPackageContacts.length > 0) ||
        (contactsData.BusinessOrderContacts && contactsData.BusinessOrderContacts.length > 0) ||
        (contactsData.ServiceAddressContacts && contactsData.ServiceAddressContacts.length > 0);

      if (!hasContacts) {
        missingFields.push('Contacts');
        errors.push('Order Contacts are not set');
      }
    }

    const isValid = missingFields.length === 0;

    return {
      isValid,
      missingFields,
      errors,
      warnings,
    };
  }

  /**
   * Update order package with missing fields (OrderType, OES, Coordinator, NAE)
   */
  async updateOrderPackage(
    orderId: string,
    orderPackageData: any,
    missingFields: string[]
  ): Promise<ApiResponse<any>> {
    try {
      const orderDetail = orderPackageData.OrderDetail;
      
      // Prepare update payload with only missing fields
      const updatePayload: any = {
        transactionId: orderDetail.TransactionId,
        workflowId: orderDetail.WorkflowId,
        businessOrderId: orderDetail.BusinessOrderId,
        customerId: orderDetail.CustomerId,
        customerNumber: orderDetail.CustomerNumber,
        environment: this.currentEnvironment.name,
      };

      // Only include fields that are missing
      if (missingFields.includes('OrderType')) {
        updatePayload.orderType = 'Install';
      }
      
      if (missingFields.includes('OES')) {
        updatePayload.selectedOES = 'AD06465';
      }
      
      if (missingFields.includes('Coordinator')) {
        updatePayload.selectedCoordinator = 'AD06465';
      }
      
      if (missingFields.includes('NAE')) {
        updatePayload.selectedNAE = 'AB81208';
      }

      const response = await this.api.post(
        `/api/swift/save-order-package/${orderId}`,
        updatePayload
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Failed to update order package',
        };
      }
    } catch (error: any) {
      console.error('Error updating order package:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update order package',
      };
    }
  }

  /**
   * Check if a task should be automatically completed
   */
  isCompletableTask(task: SwiftTask): boolean {
    return this.completableTaskNames.includes(task.displayName);
  }

  /**
   * Check if a task requires manual completion
   */
  isManualTask(task: SwiftTask): boolean {
    return this.manualTaskNames.includes(task.displayName);
  }

  /**
   * Filter tasks that are in "Ready" status and can be processed
   */
  getReadyTasks(tasks: SwiftTask[]): SwiftTask[] {
    return tasks.filter((task) => task.status === 'Ready');
  }

  /**
   * Filter tasks that can be automatically completed
   */
  getCompletableTasks(tasks: SwiftTask[]): SwiftTask[] {
    return tasks.filter((task) => task.status === 'Ready' && this.isCompletableTask(task));
  }

  /**
   * Filter tasks that require manual completion
   */
  getManualTasks(tasks: SwiftTask[]): SwiftTask[] {
    return tasks.filter((task) => task.status === 'Ready' && this.isManualTask(task));
  }

  /**
   * Check if the order has reached "Ordered" status
   */
  isOrderCompleted(productPackages: SwiftProductPackage[]): boolean {
    return productPackages.some((pkg) => pkg.status === 'Ordered');
  }

  /**
   * Extract order details summary from product package
   */
  extractOrderSummary(productPackages: SwiftProductPackage[]): {
    businessOrderId?: number;
    transactionId?: number;
    status?: string;
    productCount: number;
    products: Array<{ name: string; action: string }>;
  } {
    if (!productPackages || productPackages.length === 0) {
      return { productCount: 0, products: [] };
    }

    const pkg = productPackages[0];
    const products = pkg.products.map((p) => ({
      name: p.productName,
      action: p.action,
    }));

    return {
      businessOrderId: pkg.businessOrderId,
      transactionId: pkg.transactionId,
      status: pkg.status,
      productCount: pkg.products.length,
      products,
    };
  }
}

export const swiftApiService = new SwiftApiService();
export default swiftApiService;
