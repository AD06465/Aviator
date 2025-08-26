export interface Task {
  ID: number;
  TASK_NAME: string;
  TASK_STATUS: string;
  TASK_STATUS_CODE: string;
  CREATED_DTTM: string;
  MODIFIED_DTTM: string;
  ORDER_ID: string;
  TASK_INSTANCE_ID: string;
  SOURCE_SYSTEM_VALUE: string;
  DESCRIPTION?: string;
  AGE?: string;
  allowedActions?: string;
  ASSIGNED_WORKGROUP?: string;
  STATUS_MESSAGE?: string;
  PARENT_TASK_ID?: number;
}

export interface TaskDetails {
  id: string;
  sourceTaskId: string;
  taskName: string;
  description: string;
  statusDetails: {
    status: string;
    statusCode: string;
    statusMessage: string;
  };
  assignedCuid: string;
  assignedUserName: string;
  createdDateTime: string;
  modifiedDateTime: string;
  workgroupList: Array<{
    workgroupId: string;
    workgroupName: string;
    roles?: string[];
  }>;
  taskInstParamRequestList: TaskParameter[];
  allowedactions: Array<{
    actionName: string;
    actionLabel: string;
    restricted: boolean;
  }>;
  commonInformation: {
    orderId: string;
    orderSource: string;
    serviceId?: string;
    serviceComponentId?: string;
    productName?: string;
    dispatchArea?: string;
  };
}

export interface TaskFailureDetails {
  errorMessage?: string;
  requestPayload?: string;
  responsePayload?: string;
  statusCode?: string;
  statusMessage?: string;
  tripTime?: string;
  retryMethodType?: string;
  retryRequestURL?: string;
  retryRequestHeader?: string;
}

export interface TaskParameter {
  id: string;
  taskInstId: string;
  type: string;
  header: string;
  name: string;
  value: string;
  jsonDescriptor?: string;
  sourceFieldName: string;
  jsonDescriptorObject?: {
    label: string;
    editable: boolean;
    required: boolean;
    visible: boolean;
    optionsList?: string[];
    [key: string]: any;
  };
}

export interface Environment {
  name: string;
  apiUrl: string;
  flightdeckUrl: string;
}

export interface WorkflowType {
  name: string;
  value: string;
}

export interface Device {
  name: string;
  value: string;
}

export interface Workgroup {
  workgroupId: string;
  workgroupName: string;
}

// Type for workgroup API response which can be either objects or strings
export type WorkgroupResponse = Workgroup[] | string[];

export interface OrderForm {
  orderNumber: string;
  productName: string;
  workflowName: string;
  environment: string;
  userName: string;
  workgroup: string;
  preferredDevice?: string;
  preferredPort?: string;
}

export interface TaskManagementConfig {
  completableTasks: string[];
  retryableTasks: string[];
  taskFieldMappings: Record<string, Record<string, any>>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TaskSearchResponse {
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
  };
  taskResults: Task[];
  warningMessage?: string;
}

export interface ProcessingStatus {
  isProcessing: boolean;
  currentTask?: string;
  totalTasks: number;
  completedTasks: number;
  failedTasks: Task[];
  lastUpdate: Date;
}
