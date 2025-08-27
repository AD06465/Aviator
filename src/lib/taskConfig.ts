import { TaskManagementConfig } from '../types';

export const defaultTaskConfig: TaskManagementConfig = {
  completableTasks: [
    'Confirm/Schedule Activation',
    'Service Validate Field',
    'Service Validate - UNI (Tester)',
    'CM-Test and Tag',
    'Service Validate Ethernet',
    'Send Completion Details',
    'Verify or Assign Appropriate Device',
    'LOA Designate Tid and Port',
    'LOA Verification',
    'BE Installation Scheduled Date: BE completion notice',
  ],
  retryableTasks: [
    'Get Details from MESH',
    'Create Uni in ASRI',
    'Activate UNI in ACT',
    'Update Uni in ASRI',
    'Activate Path in ACT',
  ],
  taskFieldMappings: {
    'Service Validate - UNI (Tester)': {
      'Demarc_Information*': 'Test',
    },
    'CM-Test and Tag': {
      'Comments': 'Automated completion via AVIATOR',
    },
    'LOA Designate Tid and Port': {
      'TID*': '{{preferredDevice}}',
      'Port (eg: GigabitEthernet0/0/23)': '{{preferredPort}}',
      'Demarc Location': 'TEST',
    },
    'LOA Verification': {
      'Demarc Location': 'TEST',
    },
    'Verify or Assign Appropriate Device': {
      'Fallout Action': '{{workflowBasedValue}}', // 'Enter Port data' for Monarch
      'Device: *': '{{preferredDevice}}',
      'Port: *': '{{preferredPort}}',
    },
  },
};

export const defaultDevices = [
  'LAB4COZWZG001',
  'LAB4COZWZG002',
  'LAB2COZEZG001',
  'LAB2COZEW2002',
  'LAB2COZEW2001',
  'LAB4COZW4M001',
  'LAB4COZW4M002',
  'LAB4COZW4R002',
  'LAB4COZW4L003',
  'LAB4COZWYJ001',
  'LAB4COZW5M001',
];

export const workflowTypes = [
  { name: 'Monarch Onnet', value: 'monarch_onnet' },
  { name: 'Monarch Offnet', value: 'monarch_offnet' },
  { name: 'Colorless', value: 'colorless' },
];

// Task completion order priority
export const taskPriorityOrder = [
  'BE Installation Scheduled Date: BE completion notice', // Highest priority
  'Confirm/Schedule Activation',
  'Service Validate Field',
  'Service Validate - UNI (Tester)',
  'CM-Test and Tag',
  'Service Validate Ethernet',
  'Send Completion Details',
];

export const getTaskPriority = (taskName: string): number => {
  const index = taskPriorityOrder.indexOf(taskName);
  return index === -1 ? 999 : index;
};

export const shouldCompleteTask = (taskName: string, config: TaskManagementConfig): boolean => {
  return config.completableTasks.includes(taskName);
};

export const shouldRetryTask = (taskName: string, config: TaskManagementConfig): boolean => {
  return config.retryableTasks.includes(taskName);
};

export const getTaskFieldValue = (
  taskName: string,
  fieldName: string,
  config: TaskManagementConfig,
  orderForm: any
): string => {
  const mapping = config.taskFieldMappings[taskName];
  if (!mapping || !mapping[fieldName]) {
    return '';
  }

  let value = mapping[fieldName];

  // Replace placeholders with actual values
  if (value === '{{preferredDevice}}') {
    return orderForm.preferredDevice || '';
  }
  
  if (value === '{{preferredPort}}') {
    return orderForm.preferredPort || '';
  }

  if (value === '{{workflowBasedValue}}') {
    // For Verify or Assign Appropriate Device task
    if (fieldName === 'Fallout Action' && orderForm.workflowName?.toLowerCase().includes('monarch')) {
      return 'Enter Port data';
    }
    return 'Create Cap Jeop'; // Default value
  }

  return value;
};

export const formatTaskStatus = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'ready':
      return 'Ready';
    case 'assigned':
      return 'Assigned';
    case 'completed':
    case 'complete':
      return 'Completed';
    case 'failed':
      return 'Failed';
    case 'in-progress':
    case 'inprogress':
      return 'In Progress';
    default:
      return status || 'Unknown';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'ready':
      return 'status-ready';
    case 'assigned':
      return 'status-assigned';
    case 'completed':
    case 'complete':
      return 'status-completed';
    case 'failed':
      return 'status-failed';
    case 'in-progress':
    case 'inprogress':
      return 'status-in-progress';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const calculateDelayForTask = (taskName: string, taskIndex: number): number => {
  // 15 minutes delay between Service Validate - UNI (Tester) tasks
  if (taskName === 'Service Validate - UNI (Tester)' && taskIndex > 0) {
    return 15 * 60 * 1000; // 15 minutes in milliseconds
  }
  
  // Delays after validation tasks to allow system updates
  if (taskName === 'Service Validate Field') {
    return 1 * 60 * 1000; // 1 minute in milliseconds
  }
  
  if (taskName === 'Service Validate - UNI (Tester)') {
    return 2 * 60 * 1000; // 2 minutes in milliseconds
  }
  
  if (taskName === 'Service Validate Ethernet') {
    return 1 * 60 * 1000; // 1 minute in milliseconds
  }
  
  // 1 minute delay after completing CM-Test and Tag to allow system updates
  if (taskName === 'CM-Test and Tag') {
    return 1 * 60 * 1000; // 1 minute in milliseconds
  }
  
  // Default delay between API calls
  return 2000; // 2 seconds
};

export const isIgnorableFailedTask = (taskName: string): boolean => {
  // List of task names that can be ignored when failed in test environment
  const ignorableFailedTasks = [
    'CCD Master',
    'SWIFT Milestone',
    // Add more task names as needed
  ];
  
  return ignorableFailedTasks.includes(taskName);
};
