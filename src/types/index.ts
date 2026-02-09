export interface DeviceDetails {
  type?: string;          // Device Type
  subType?: string;       // Device SubType
  status?: string;        // Status
  roleCode?: string;      // ROLECODE from attributes
  roleFullName?: string;  // ROLEFULLNAME from attributes
}

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
  meshApiUrl: string;
}

export interface WorkflowType {
  name: string;
  value: string;
}

export interface Device {
  id: string;
  name: string;
  isValid?: boolean;
  validationError?: string;
  lastValidated?: Date;
}

export interface DeviceValidationResponse {
  q: string;
  data: string[];
  tid: string;
}

export interface DeviceValidationError {
  error: {
    type: string;
    message: string;
  };
}

export interface PortSpeed {
  label: string;
  value: number; // 1000, 10000, 100000
}

export interface PortInfo {
  name: string;
  portSysId: string;
  type: string;
  status: string;
  class: string;
}

export interface Workgroup {
  workgroupId: string;
  workgroupName: string;
}

// Type for workgroup API response which can be either objects or strings
export type WorkgroupResponse = Workgroup[] | string[];

export interface UserWorkgroup {
  id: string;
  name: string;
  description?: string;
  roles: Array<{
    workgroupName: string;
    workgroupRoleName: string;
  }>;
}

export interface UserProfile {
  id: string;
  cuid: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  workgroupsList: UserWorkgroup[];
}

export interface OrderForm {
  orderNumber: string;
  productName: string;
  workflowName: string;
  environment: string;
  userName: string;
  workgroup: string;
  preferredDevice?: string;
  preferredPort?: string;
  portSpeed?: string; // Display format: "10 Gbps"
  portSpeedMbps?: number; // Numeric format for API: 10000
  // User profile data from API
  userCuid?: string;
  userFullName?: string;
  userEmail?: string;
}

export interface TaskManagementConfig {
  completableTasks: string[];
  retryableTasks: string[];
  taskFieldMappings: Record<string, Record<string, any>>;
  conditionalRules?: Record<string, Array<{
    id: string;
    conditionType: 'workflow' | 'orderType' | 'custom';
    conditionValue: string;
    fields: Array<{
      fieldName: string;
      fieldValue: string;
      fieldType?: 'text' | 'dropdown';
      dropdownValue?: string;
    }>;
  }>>;
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

export interface TaskField {
  name: string;
  value: string;
  required: boolean;
  editable: boolean;
  label: string;
  type?: string;
}

export interface MandatoryFieldResult {
  hasMissingFields: boolean;
  missingFields: TaskField[];
  allMandatoryFields: TaskField[];
}

export interface UserFieldInput {
  fieldName: string;
  value: string;
}
