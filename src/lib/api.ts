import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  Task,
  TaskDetails,
  TaskSearchResponse,
  Workgroup,
  WorkgroupResponse,
  ApiResponse,
  Environment,
  OrderForm,
  DeviceDetails,
} from '../types';

/**
 * Recursive workflow/job fetching and error extraction for Autopilot
 */
export class AutopilotWorkflowService {
  /**
   * Fetch workflow/job details by job ID
   */
  async fetchJobDetails(jobId: string): Promise<any> {
    const url = `${jobId.startsWith('http') ? jobId : `https://usddclvapapp011-test.corp.intranet:3443/operations-manager/jobs/${jobId}`}`;
    try {
      const response = await axios.get(url);
      return response.data.data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Fetch task details by task ID
   */
  async fetchTaskDetails(taskId: string): Promise<any> {
    const url = `https://usddclvapapp011-test.corp.intranet:3443/operations-manager/tasks/${taskId}`;
    try {
      const response = await axios.get(url);
      return response.data.data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Recursively fetch child jobs for a workflow/job
   */
  async fetchWorkflowTree(jobId: string, depth = 0): Promise<any> {
    const job = await this.fetchJobDetails(jobId);
    if (!job) return null;

    // Find child jobs from tasks with canvasName 'childJob'
    const childJobs: any[] = [];
    if (job.tasks) {
      Object.values(job.tasks).forEach((task: any) => {
        if (task.canvasName === 'childJob' && task.childJobs && Array.isArray(task.childJobs)) {
          task.childJobs.forEach((child: any) => {
            childJobs.push(child);
          });
        }
      });
    }

    // Recursively fetch children
    const children = await Promise.all(
      childJobs.map(async (childJob: any) => {
        return await this.fetchWorkflowTree(childJob._id, depth + 1);
      })
    );

    return {
      ...job,
      children,
      depth,
    };
  }

  /**
   * Fetch incoming/outgoing/error details for all tasks
   */
  async extractTaskDetails(job: any): Promise<any[]> {
    const details: any[] = [];
    if (job.tasks) {
      for (const taskId in job.tasks) {
        const task = job.tasks[taskId];
        // Fetch details for all iterations
        if (task.iterations && Array.isArray(task.iterations) && task.iterations.length > 0) {
          for (const iterationId of task.iterations) {
            const taskDetails = await this.fetchTaskDetails(iterationId);
            details.push({
              taskId: iterationId,
              taskName: task.name,
              incoming: taskDetails?.variables?.incoming,
              outgoing: taskDetails?.variables?.outgoing,
              error: taskDetails?.variables?.error,
              status: taskDetails?.status,
            });
          }
        } else {
          // Fallback: fetch by taskId
          const taskDetails = await this.fetchTaskDetails(taskId);
          details.push({
            taskId,
            taskName: task.name,
            incoming: taskDetails?.variables?.incoming,
            outgoing: taskDetails?.variables?.outgoing,
            error: taskDetails?.variables?.error,
            status: taskDetails?.status,
          });
        }
      }
    }
    return details;
  }
}

export const autopilotWorkflowService = new AutopilotWorkflowService();
class FlightDeckApiService {
  private api: AxiosInstance;
  private currentEnvironment: Environment;
  private currentUserName: string = '';

  constructor() {
    this.currentEnvironment = this.getEnvironments()[0]; // Default to Test 1
    this.api = axios.create({
      baseURL: this.currentEnvironment.apiUrl, // Set initial base URL
      timeout: 120000, // Increased to 2 minutes to avoid premature timeouts
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include username header
    this.api.interceptors.request.use((config) => {
      if (this.currentUserName) {
        config.headers['x-username'] = this.currentUserName;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  getEnvironments(): Environment[] {
    return [
      {
        name: 'Test 1',
        apiUrl: 'https://workmate-svc-test1.rke-odc-test.corp.intranet',
        flightdeckUrl: 'https://flightdeck-ui-test1.rke-odc-test.corp.intrane/#/auth/login',
        meshApiUrl: 'http://sasi-test1.rke-odc-test.corp.intranet',
      },
      {
        name: 'Test 2',
        apiUrl: 'https://workmate-svc-test2.rke-odc-test.corp.intranet',
        flightdeckUrl: 'https://flightdeck-ui-test2.rke-odc-test.corp.intranet/#/auth/login',
        meshApiUrl: 'http://sasi-test2.rke-odc-test.corp.intranet',
      },
      {
        name: 'Test 4',
        apiUrl: 'https://workmate-svc-test4.rke-odc-test.corp.intranet',
        flightdeckUrl: 'https://flightdeck-ui-test4.rke-odc-test.corp.intranet/#/auth/login',
        meshApiUrl: 'http://sasi-test4.rke-odc-test.corp.intranet',
      },
    ];
  }

  setEnvironment(environmentName: string): void {
    const env = this.getEnvironments().find(e => e.name === environmentName);
    if (env) {
      this.currentEnvironment = env;
      this.api.defaults.baseURL = env.apiUrl;
    }
  }

  setUserName(userName: string): void {
    this.currentUserName = userName;
  }

  async getUserProfile(cuid: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get(`/RestService/Enterprise/v2/Work/resource?cuid=${cuid}&include=a,r,p,wg,jd`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('getUserProfile error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get user profile'
      };
    }
  }

  async searchTasks(orderNumber: string): Promise<ApiResponse<TaskSearchResponse>> {
    try {
      const payload = {
        searchFields: [
          // Removed isSystemTask filter to include both system and user tasks
          {
            fieldName: 'TASK_INSTANCE_ID',
            value: [orderNumber],
            operator: 'contains',
            tableName: 'task_instance',
            isDateCriteria: false,
          },
          {
            fieldName: 'ORDER_COMPANY_CODE',
            value: ['LUMEN'],
            operator: 'IN',
            tableName: 'TASK_INST_PARAMS',
            isDateCriteria: false,
          },
        ],
      };

      const response: AxiosResponse<TaskSearchResponse> = await this.api.post(
        '/RestService/Enterprise/v4/Work/task/advancedSearch?include=p,aa',
        payload
      );

      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to search tasks' };
    }
  }

  async getTaskDetails(taskId: number): Promise<ApiResponse<TaskDetails>> {
    try {
      const response: AxiosResponse<TaskDetails> = await this.api.get(
        `/RestService/Enterprise/v4/Work/task/${taskId}?include=aa,tsm,c,p,wg,td,tkd,ttt`
      );

      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to get task details' };
    }
  }

  async updateTaskData(taskData: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.post('/RestService/Enterprise/v4/Work/task', taskData);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to update task data' };
    }
  }

  async completeTask(taskId: number, taskData: any): Promise<ApiResponse<any>> {
    try {
      // Extract workgroup name from workgroupList for workgroupName field
      let workgroupName = '';
      if (taskData.workgroupList && taskData.workgroupList.length > 0) {
        workgroupName = taskData.workgroupList[0].workgroupName || taskData.workgroupList[0];
      }

      const payload = {
        action: 'Complete',
        assignCuid: taskData.assignCuid || '',
        taskInstanceId: '',
        sourceSystem: 'AVIATOR',
        comments: '',
        workgroupList: taskData.workgroupList || [],
        workgroupName: workgroupName,
        taskType: '',
        allowEnrichment: false,
        paramRequests: taskData.paramRequests || [],
        taskId: taskId.toString(),
        id: taskId.toString(),
      };

      console.log(`🚀 Completing task ${taskId} with payload:`, {
        assignCuid: payload.assignCuid,
        workgroupName: payload.workgroupName,
        sourceSystem: payload.sourceSystem,
        workgroupList: payload.workgroupList
      });

      const response = await this.api.patch(
        `/RestService/Enterprise/v2/Work/task/${taskId}/action`,
        payload
      );

      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to complete task' };
    }
  }

  async retryTask(taskId: number, taskData: any): Promise<ApiResponse<any>> {
    try {
      const payload = {
        action: 'Retry',
        assignCuid: taskData.assignCuid || '',
        taskInstanceId: '',
        sourceSystem: 'AUTOPILOT',
        modifiedById: this.currentUserName || '',
        comments: 'Automated retry via AVIATOR',
        workgroupList: taskData.workgroupList || [],
        taskType: '',
        allowEnrichment: false,
        paramRequests: taskData.paramRequests || [],
        taskId: taskId.toString(),
        id: taskId.toString(),
      };

      console.log(`🔄 Retrying task ${taskId} with payload:`, {
        action: payload.action,
        modifiedById: payload.modifiedById,
        sourceSystem: payload.sourceSystem,
        workgroupList: payload.workgroupList
      });

      const response = await this.api.patch(
        `/RestService/Enterprise/v2/Work/task/${taskId}/action`,
        payload
      );

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error(`❌ Retry task ${taskId} API call failed:`, error.response?.data || error.message);
      return { success: false, error: error.response?.data?.message || error.message || 'Failed to retry task' };
    }
  }

  async getWorkgroups(): Promise<ApiResponse<WorkgroupResponse>> {
    try {
      console.log('Making workgroup API call to:', this.api.defaults.baseURL);
      console.log('Current environment:', this.currentEnvironment);
      console.log('Current username:', this.currentUserName);
      
      const response: AxiosResponse<WorkgroupResponse> = await this.api.get(
        '/RestService/Enterprise/v2/Work/workgroup/workgroupNames'
      );

      console.log('Workgroup API response:', response.data);
      console.log('Response type:', typeof response.data, 'Array:', Array.isArray(response.data));
      
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Workgroup API error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      return { success: false, error: error.message || 'Failed to get workgroups' };
    }
  }

  async getDeviceDetails(deviceName: string): Promise<ApiResponse<DeviceDetails>> {
    try {
      const meshApiUrl = this.currentEnvironment.meshApiUrl;
      const url = `${meshApiUrl}/inventory/v1/asri/devices?name=${deviceName}`;
      
      console.log(`🔍 Fetching device details for ${deviceName} from:`, url);
      
      const response = await axios.get(url, { timeout: 10000 });
      
      if (response.data?.resources && response.data.resources.length > 0) {
        const device = response.data.resources[0];
        
        // Extract ROLECODE and ROLEFULLNAME from attributes
        let roleCode = '';
        let roleFullName = '';
        if (device.attributes && Array.isArray(device.attributes)) {
          const roleCodeAttr = device.attributes.find((attr: any) => attr.name === 'ROLECODE');
          const roleFullNameAttr = device.attributes.find((attr: any) => attr.name === 'ROLEFULLNAME');
          roleCode = roleCodeAttr?.value || '';
          roleFullName = roleFullNameAttr?.value || '';
        }
        
        const deviceDetails: DeviceDetails = {
          type: device.type,
          subType: device.subType,
          status: device.status,
          roleCode: roleCode,
          roleFullName: roleFullName,
        };
        
        console.log(`✅ Device details fetched for ${deviceName}:`, deviceDetails);
        return { success: true, data: deviceDetails };
      }
      
      console.log(`⚠️ No device found with name ${deviceName}`);
      return { success: false, error: 'Device not found' };
    } catch (error: any) {
      console.error(`❌ Failed to fetch device details for ${deviceName}:`, error.message);
      return { success: false, error: error.message || 'Failed to fetch device details' };
    }
  }

  // Utility method to add delay between API calls
  async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Retry mechanism for failed API calls
  async retryApiCall<T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 5000
  ): Promise<T> {
    let lastError: any;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await apiCall();
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          await this.delay(delayMs);
        }
      }
    }
    
    throw lastError;
  }

  // Device validation using NDS API
  async validateDevice(deviceName: string): Promise<ApiResponse<any>> {
    try {
      console.log(`🔍 Validating device: ${deviceName}`);
      
      const response = await fetch(
        `http://rubicon-test01.idc1.level3.com:8080/nds.services/query/intDescriptions?tid=${deviceName}`
      );
      
      const data = await response.json();
      
      // Check for error response
      if (data.error) {
        return { 
          success: false, 
          error: data.error.message || 'Device validation failed',
          data: data 
        };
      }
      
      // Check for valid response
      if (data.q === 'intDescriptions' && data.tid === deviceName && Array.isArray(data.data)) {
        return { 
          success: true, 
          data: data 
        };
      }
      
      return { 
        success: false, 
        error: 'Invalid response format from device' 
      };
    } catch (error: any) {
      console.error('Device validation error:', error);
      return { 
        success: false, 
        error: error.message || 'Network error during device validation' 
      };
    }
  }

  // Fetch available ports from MESH API
  async fetchAvailablePorts(
    deviceName: string, 
    portSpeed: number
  ): Promise<ApiResponse<string[]>> {
    try {
      console.log(`🔍 Fetching ports for device: ${deviceName}, speed: ${portSpeed}`);
      console.log(`🌍 Current environment: ${this.currentEnvironment.name}`);
      console.log(`🔗 MESH API URL: ${this.currentEnvironment.meshApiUrl}`);
      
      const meshUrl = `${this.currentEnvironment.meshApiUrl}/inventory/v1/mesh/paths?product=Ethernet&includeColorless=yes&aend=${deviceName}&portSpeed=${portSpeed}&highBandwidth=Yes&numpaths=1&interface=Optical&productType=ELINE`;
      
      const response = await fetch(meshUrl);
      const xmlText = await response.text();
      
      // Parse XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Check for parsing errors
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        return { 
          success: false, 
          error: 'Failed to parse XML response' 
        };
      }
      
      // Extract port names from aendPort elements
      const aendPorts = xmlDoc.querySelectorAll('aendPort > name');
      const portNames: string[] = [];
      
      aendPorts.forEach(portNode => {
        const portName = portNode.textContent;
        if (portName) {
          portNames.push(portName);
        }
      });
      
      if (portNames.length === 0) {
        return { 
          success: false, 
          error: 'No available ports found for the selected device and speed' 
        };
      }
      
      console.log(`✅ Found ${portNames.length} available port(s):`, portNames);
      
      return { 
        success: true, 
        data: portNames 
      };
    } catch (error: any) {
      console.error('Port fetch error:', error);
      return { 
        success: false, 
        error: error.message || 'Network error during port fetch' 
      };
    }
  }

  /**
   * Fetch order details from Swift API and extract port speed and product name
   * Uses Next.js API route to avoid CORS issues
   * @param orderNumber - The order transaction ID
   * @param swiftEnv - Swift API environment (env1, env2, env4)
   * @returns Order details with port speed and product name
   */
  async getOrderPortSpeed(orderNumber: string, swiftEnv: string = 'env1'): Promise<ApiResponse<any>> {
    try {
      console.log(`🔍 Fetching order details for order: ${orderNumber} from ${swiftEnv}`);
      
      // Call Next.js API route (no CORS issues)
      const response = await axios.get(`/api/order-details?orderNumber=${orderNumber}&env=${swiftEnv}`, {
        timeout: 15000,
      });

      if (response.data.success) {
        console.log(`✅ Order details found:`, response.data);
        return {
          success: true,
          data: {
            portSpeed: response.data.portSpeed, // Display: "10 Gbps"
            portSpeedMbps: response.data.portSpeedMbps, // Numeric: 10000
            productName: response.data.productName, // Auto-detected product name
            rawValue: response.data.rawValue,
            foundIn: response.data.foundIn,
          }
        };
      } else {
        console.warn('⚠️ Order details not found in response');
        return {
          success: false,
          error: response.data.error || 'Order details not found'
        };
      }

    } catch (error: any) {
      console.error('❌ Error fetching order port speed:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch order details'
      };
    }
  }
}

export const flightDeckApiService = new FlightDeckApiService();
