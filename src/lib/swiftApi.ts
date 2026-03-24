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
  /**
   * Validate order package with all prechecks
   * Includes: OrderType, Coordinator, OES, PSP Dates, Documents, Contacts
   */
  async validateOrderPackage(
    orderId: string,
    orderPackageData: any,
    contactsData?: any,
    skipDocumentCheck: boolean = false
  ): Promise<{ isValid: boolean; missingFields: string[]; errors: string[]; warnings: string[] }> {
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

    // PRECHECK 1: Order Type
    if (!orderDetail.OrderType || orderDetail.OrderType === null) {
      missingFields.push('OrderType');
      errors.push('Order Type is not set');
    }

    // PRECHECK 2: Coordinator
    if (!orderDetail.SelectedCoordinator || orderDetail.SelectedCoordinator === null) {
      missingFields.push('Coordinator');
      errors.push('Order Coordinator is not set');
    }

    // PRECHECK 3: OES (Order Entry Specialist)
    if (!orderDetail.SelectedOES || orderDetail.SelectedOES === null) {
      missingFields.push('OES');
      errors.push('Order Entry Specialist (OES) is not set');
    }

    // NAE is OPTIONAL - warn but don't block
    if (!orderDetail.SelectedNAE || orderDetail.SelectedNAE === null) {
      warnings.push('Network Account Executive (NAE) is not set (optional field)');
    }

    // PRECHECK 4: PSP Dates (NDD and CRD)
    if (orderPackageData.ProductPackageSummaries && orderPackageData.ProductPackageSummaries.length > 0) {
      const pspsWithoutDates = orderPackageData.ProductPackageSummaries.filter((psp: any) => 
        !psp.NegotiatedDueDate || !psp.CustomerRequestedDate
      );
      
      if (pspsWithoutDates.length > 0) {
        missingFields.push('PSP Dates');
        errors.push(`${pspsWithoutDates.length} PSP(s) missing NDD (Negotiated Due Date) or CRD (Customer Requested Date)`);
      }
    }

    // PRECHECK 5: Documents
    if (!skipDocumentCheck) {
      try {
        const requiredDocsResult = await this.loadRequiredDocuments(orderId, orderPackageData);
        
        if (requiredDocsResult.success && requiredDocsResult.data) {
          const { requiredCount, documentTypes } = requiredDocsResult.data;
          
          if (requiredCount > 0) {
            const missingDocs = documentTypes.filter((doc: any) => !doc.attached);
            
            if (missingDocs.length > 0) {
              missingFields.push('Documents');
              const docNames = missingDocs.map((d: any) => d.name).join(', ');
              errors.push(`Missing ${missingDocs.length} required document(s): ${docNames}`);
            } else {
              console.log('[SwiftApi] ✅ All required documents are attached');
            }
          } else {
            console.log('[SwiftApi] ℹ️ No documents required for this order type');
          }
        } else {
          warnings.push('Could not verify document requirements');
        }
      } catch (error: any) {
        warnings.push(`Document validation failed: ${error.message}`);
      }
    }
    
    // PRECHECK 6: Contacts
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

    console.log(`[SwiftApi] Validation complete: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
    if (!isValid) {
      console.log(`[SwiftApi] Missing fields: ${missingFields.join(', ')}`);
    }

    return {
      isValid,
      missingFields,
      errors,
      warnings,
    };
  }

  /**
   * Check if changes would trigger a workflow restart
   * Call this BEFORE updateOrderPackage to validate changes
   */
  async checkRestartTrigger(
    orderId: string,
    orderDetail: any,
    productPackages: any[]
  ): Promise<ApiResponse<{
    willTriggerRestart: boolean;
    isRestartWorkflow: boolean;
    restartTriggeringChanges: string[];
    pspChanges: any[];
  }>> {
    try {
      console.log('[SwiftApi] Checking if changes would trigger workflow restart...');
      
      const response = await this.api.post(
        `/api/swift/check-restart-trigger/${orderId}`,
        {
          orderDetail,
          productPackages,
          environment: this.currentEnvironment.name
        }
      );

      if (response.data.success) {
        const result = response.data.data;
        
        if (result.willTriggerRestart) {
          console.warn('[SwiftApi] ⚠️ Changes WOULD trigger workflow restart!');
          console.warn('[SwiftApi] Triggering changes:', result.restartTriggeringChanges);
        } else {
          console.log('[SwiftApi] ✓ Changes will NOT trigger workflow restart');
        }
        
        return {
          success: true,
          data: result
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Failed to check restart trigger'
        };
      }
    } catch (error: any) {
      console.error('[SwiftApi] Error checking restart trigger:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to check restart trigger'
      };
    }
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
      // CRITICAL: Fetch FRESH order data to avoid "data older than current" error
      // Swift uses optimistic locking - we need the latest version with current timestamps
      console.log('[SwiftApi] Fetching fresh order data before update to avoid stale data error...');
      const freshOrderResult = await this.fetchOrderPackage(orderId);
      
      if (!freshOrderResult.success || !freshOrderResult.data) {
        console.error('[SwiftApi] Failed to fetch fresh order data:', freshOrderResult.error);
        return {
          success: false,
          error: `Cannot update - failed to fetch current order data: ${freshOrderResult.error}`
        };
      }
      
      console.log('[SwiftApi] ✓ Fresh order data fetched successfully');
      const freshOrderData = freshOrderResult.data;
      const orderDetail = freshOrderData.OrderDetail;
      
      // Prepare update payload with only missing fields
      const updatePayload: any = {
        transactionId: orderDetail.TransactionId,
        workflowId: orderDetail.WorkflowId,
        businessOrderId: orderDetail.BusinessOrderId,
        customerId: orderDetail.CustomerId,
        customerNumber: orderDetail.CustomerNumber,
        environment: this.currentEnvironment.name,
        existingOrderData: freshOrderData, // IMPORTANT: Use FRESH data to preserve PSPs and avoid version conflicts
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

      console.log('[SwiftApi] Updating order package with existing PSPs preserved');
      
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
   * Calculate business days from today
   * Skips weekends (Saturday and Sunday)
   */
  private calculateBusinessDays(daysToAdd: number): string {
    const date = new Date();
    let addedDays = 0;
    
    while (addedDays < daysToAdd) {
      date.setDate(date.getDate() + 1);
      // 0 = Sunday, 6 = Saturday
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        addedDays++;
      }
    }
    
    // Format as M/D/YYYY (Swift format)
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  /**
   * Set PSP dates (NDD and CRD) for order packages
   * Sets NegotiatedDueDate and CustomerRequestedDate for all PSPs that are missing them
   * Defaults to current date + 5 business days if dates not provided
   */
  async setPspDates(
    orderId: string,
    orderPackageData: any,
    ndd?: string,
    crd?: string
  ): Promise<ApiResponse<any>> {
    try {
      // Calculate 5 business days from today if dates not provided
      const defaultDate = this.calculateBusinessDays(5);
      
      const negotiatedDueDate = ndd || defaultDate;
      const customerRequestedDate = crd || defaultDate;
      
      console.log(`[SwiftApi] Setting PSP dates for order ${orderId}`);
      console.log(`[SwiftApi] NDD: ${negotiatedDueDate}, CRD: ${customerRequestedDate}`);
      console.log(`[SwiftApi] (Default: Current date + 5 business days = ${defaultDate})`);
      
      // Count how many PSPs will be updated
      const pspCount = orderPackageData.ProductPackageSummaries?.length || 0;
      console.log(`[SwiftApi] Updating dates for ${pspCount} PSP(s)`);
      
      const response = await this.api.post(
        `/api/swift/save-product-dates/${orderId}`,
        {
          environment: this.currentEnvironment.name,
          orderPackageData: orderPackageData,
          ndd: negotiatedDueDate,
          crd: customerRequestedDate
        }
      );

      if (response.data.success) {
        console.log('[SwiftApi] ✅ PSP dates set successfully');
        console.log('[SwiftApi] Updated PSP IDs:', response.data.updatedPspIds);
        
        return {
          success: true,
          data: response.data.data,
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Failed to set PSP dates',
        };
      }
    } catch (error: any) {
      console.error('Error setting PSP dates:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to set PSP dates',
      };
    }
  }

  /**   * Check if order has required documents attached
   * Returns list of currently attached documents
   */
  async checkDocuments(
    orderId: string,
    orderPackageData: any
  ): Promise<ApiResponse<{ hasDocuments: boolean; documentCount: number; documents: any[] }>> {
    try {
      console.log(`[SwiftApi] Checking documents for order ${orderId}`);
      
      const response = await this.api.post(
        `/api/swift/load-documents/${orderId}`,
        {
          environment: this.currentEnvironment.name,
          orderPackageData: orderPackageData
        }
      );

      if (response.data.success) {
        const hasDocuments = response.data.hasDocuments || false;
        const documentCount = response.data.documentCount || 0;
        
        console.log(`[SwiftApi] ${hasDocuments ? '✅' : '⚠️'} Found ${documentCount} document(s)`);
        
        return {
          success: true,
          data: {
            hasDocuments,
            documentCount,
            documents: response.data.data || []
          }
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Failed to check documents',
        };
      }
    } catch (error: any) {
      console.error('Error checking documents:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to check documents',
      };
    }
  }

  /**
   * Load required documents for an order
   * Returns list of documents that need to be attached
   */
  async loadRequiredDocuments(
    orderId: string,
    orderPackageData: any,
    taskData?: any
  ): Promise<ApiResponse<{ requiredCount: number; documentTypes: any[] }>> {
    try {
      console.log(`[SwiftApi] Loading required documents for order ${orderId}`);
      
      const response = await this.api.post(
        `/api/swift/load-required-documents/${orderId}`,
        {
          environment: this.currentEnvironment.name,
          orderPackageData: orderPackageData,
          taskData: taskData || null
        }
      );

      if (response.data.success) {
        const requiredCount = response.data.requiredCount || 0;
        const documentTypes = response.data.documentTypes || [];
        
        console.log(`[SwiftApi] ${requiredCount} required document(s)`);
        if (requiredCount > 0) {
          console.log(`[SwiftApi] Required:`, documentTypes.map((d: any) => d.name).join(', '));
        }
        
        return {
          success: true,
          data: {
            requiredCount,
            documentTypes
          }
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Failed to load required documents',
        };
      }
    } catch (error: any) {
      console.error('Error loading required documents:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to load required documents',
      };
    }
  }

  /**
   * Upload a document to an order
   * Uses multipart/form-data to upload PDF or other files
   */
  async uploadDocument(
    orderId: string,
    file: File,
    customerId: string,
    businessOrderId: string
  ): Promise<ApiResponse<{ fileName: string; fileSize: number }>> {
    try {
      console.log(`[SwiftApi] Uploading document ${file.name} to order ${orderId}`);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('customerId', customerId);
      formData.append('businessOrderId', businessOrderId);
      formData.append('environment', this.currentEnvironment.name);

      const response = await this.api.post(
        `/api/swift/upload-document/${orderId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        console.log(`[SwiftApi] ✅ Document uploaded: ${response.data.fileName}`);
        
        return {
          success: true,
          data: {
            fileName: response.data.fileName,
            fileSize: response.data.fileSize
          }
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Failed to upload document',
        };
      }
    } catch (error: any) {
      console.error('Error uploading document:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to upload document',
      };
    }
  }

  /**
   * Update document type/business purpose (e.g., set as "SOF")
   * Call this after uploading to categorize the document
   */
  async updateDocumentType(
    orderId: string,
    document: any,
    documentTypes: string[]
  ): Promise<ApiResponse<{ documentId: number; types: string[] }>> {
    try {
      console.log(`[SwiftApi] Updating document ${document.DocumentId} type to: ${documentTypes.join(', ')}`);
      
      const response = await this.api.post(
        `/api/swift/update-document-type/${orderId}`,
        {
          environment: this.currentEnvironment.name,
          document: document,
          documentTypes: documentTypes
        }
      );

      if (response.data.success) {
        console.log(`[SwiftApi] ✅ Document type updated successfully`);
        
        return {
          success: true,
          data: {
            documentId: response.data.documentId,
            types: response.data.types
          }
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Failed to update document type',
        };
      }
    } catch (error: any) {
      console.error('Error updating document type:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update document type',
      };
    }
  }

  /**
   * Complete document upload workflow:
   * 1. Upload file
   * 2. Get document ID from LoadDocuments
   * 3. Set document type (e.g., "SOF")
   */
  async addDocumentToOrder(
    orderId: string,
    file: File,
    orderPackageData: any,
    documentType: string = 'SOF'
  ): Promise<ApiResponse<{ documentId: number; fileName: string }>> {
    try {
      const customerId = orderPackageData.OrderDetail.CustomerId.toString();
      const businessOrderId = orderPackageData.OrderDetail.BusinessOrderId.toString();

      console.log(`[SwiftApi] Starting document upload workflow for order ${orderId}`);
      console.log(`[SwiftApi] File: ${file.name}, Type: ${documentType}`);
      
      // Step 1: Upload the file
      const uploadResult = await this.uploadDocument(orderId, file, customerId, businessOrderId);
      
      if (!uploadResult.success) {
        return {
          success: false,
          error: `Upload failed: ${uploadResult.error}`
        };
      }

      console.log(`[SwiftApi] ✅ Step 1 complete: File uploaded`);
      
      // Step 2: Get the document ID by calling LoadDocuments
      await new Promise(resolve => setTimeout(resolve, 1000)); // Brief delay for propagation
      
      const docsResult = await this.checkDocuments(orderId, orderPackageData);
      
      if (!docsResult.success || !docsResult.data) {
        return {
          success: false,
          error: 'Failed to retrieve uploaded document ID'
        };
      }

      // Find the newly uploaded document (should be the most recent)
      const uploadedDoc = docsResult.data.documents.find((doc: any) => 
        doc.FileName === file.name
      );

      if (!uploadedDoc) {
        return {
          success: false,
          error: 'Uploaded document not found in order documents list'
        };
      }

      console.log(`[SwiftApi] ✅ Step 2 complete: Document ID retrieved: ${uploadedDoc.DocumentId}`);
      
      // Step 3: Set the document type
      const updateResult = await this.updateDocumentType(
        orderId,
        uploadedDoc,
        [documentType]
      );

      if (!updateResult.success) {
        return {
          success: false,
          error: `Failed to set document type: ${updateResult.error}`
        };
      }

      console.log(`[SwiftApi] ✅ Step 3 complete: Document type set to ${documentType}`);
      console.log(`[SwiftApi] 🎉 Document upload workflow complete!`);

      return {
        success: true,
        data: {
          documentId: uploadedDoc.DocumentId,
          fileName: file.name
        }
      };
    } catch (error: any) {
      console.error('Error in document upload workflow:', error);
      return {
        success: false,
        error: error.message || 'Document upload workflow failed'
      };
    }
  }

  /**   * Check if a task should be automatically completed
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
    if (!productPackages || productPackages.length === 0) {
      return false;
    }
    
    const hasOrderedStatus = productPackages.some((pkg) => pkg.status === 'Ordered');
    
    if (hasOrderedStatus) {
      console.log('[SwiftApi] ✅ Order completed - Status: "Ordered" detected');
    }
    
    return hasOrderedStatus;
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
