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
} from '../types';

class FlightDeckApiService {
  private api: AxiosInstance;
  private currentEnvironment: Environment;
  private currentUserName: string = '';

  constructor() {
    this.currentEnvironment = this.getEnvironments()[0]; // Default to Test 1
    this.api = axios.create({
      baseURL: this.currentEnvironment.apiUrl, // Set initial base URL
      timeout: 30000,
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
      },
      {
        name: 'Test 2',
        apiUrl: 'https://workmate-svc-test4.rke-odc-test.corp.intranet',
        flightdeckUrl: 'https://flightdeck-ui-test4.rke-odc-test.corp.intranet/#/auth/login',
      },
      {
        name: 'Test 4',
        apiUrl: 'https://workmate-svc-test2.rke-odc-test.corp.intranet',
        flightdeckUrl: 'https://flightdeck-ui-test2.rke-odc-test.corp.intranet/#/auth/login',
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
          {
            fieldName: 'isSystemTask',
            value: ['Yes'],
            operator: 'IN',
            tableName: 'task_type_sys_param',
            isDateCriteria: false,
          },
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
      const payload = {
        action: 'Complete',
        assignCuid: '',
        taskInstanceId: '',
        sourceSystem: 'AUTOPILOT',
        comments: '',
        workgroupList: taskData.workgroupList || [],
        taskType: '',
        allowEnrichment: false,
        paramRequests: taskData.paramRequests || [],
        taskId: taskId.toString(),
        id: taskId.toString(),
      };

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
        assignCuid: '',
        taskInstanceId: '',
        sourceSystem: 'AUTOPILOT',
        comments: '',
        workgroupList: taskData.workgroupList || [],
        taskType: '',
        allowEnrichment: false,
        paramRequests: taskData.paramRequests || [],
        taskId: taskId.toString(),
        id: taskId.toString(),
      };

      const response = await this.api.patch(
        `/RestService/Enterprise/v2/Work/task/${taskId}/action`,
        payload
      );

      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to retry task' };
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
}

export const flightDeckApiService = new FlightDeckApiService();
