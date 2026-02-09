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
    'Perform Engineering Solution',
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
      'Demarc_Information': 'Test',
    },
    'CM-Test and Tag': {
      'Comments': 'Automated completion via AVIATOR',
    },
    'LOA Designate Tid and Port': {
      'TID': '{{preferredDevice}}',
      'Port (eg: GigabitEthernet0/0/23)': '{{preferredPort}}',
      'Demarc Location': 'TEST',
    },
    'LOA Verification': {
      'Demarc Location': 'TEST',
    },
    'Verify or Assign Appropriate Device': {
      'Fallout Action': '{{workflowBasedValue}}', // 'Enter Port data' for Monarch, 'Create Cap Jeop' for Colorless
      'Device': '{{preferredDevice}}',
      'Port': '{{preferredPort}}',
    },
    'Perform Engineering Solution': {
      'buildTypes': 'Simple',
      'dedicatedOptions': 'Shared',
      'ospRemarks': 'Automated completion via AVIATOR',
      'surveyCategory': 'ISP',
      'procurementRequestType': 'Procurement Financial Request Materials',
      'implementationTeam': 'Standard Implementation Team',
      'buildingAccessQty': '1',
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

/**
 * Maps field labels to field names using task parameter information
 * This allows users to use either field names OR labels for configuration
 */
export const mapLabelToFieldName = (
  taskName: string,
  labelOrName: string,
  taskDetails?: any
): string => {
  // If no task details provided, return the original value (assume it's a field name)
  if (!taskDetails?.taskInstParamRequestList) {
    return labelOrName;
  }

  // First, check if the provided value is already a valid field name
  const directMatch = taskDetails.taskInstParamRequestList.find(
    (param: any) => param.name === labelOrName
  );
  if (directMatch) {
    console.log(`🎯 Direct field name match: "${labelOrName}"`);
    return labelOrName;
  }

  // If not found as field name, try to find by label (case-insensitive)
  const labelMatch = taskDetails.taskInstParamRequestList.find(
    (param: any) => {
      const paramLabel = param.jsonDescriptorObject?.label;
      if (!paramLabel) return false;
      
      // Case-insensitive comparison with trimming
      return paramLabel.toLowerCase().trim() === labelOrName.toLowerCase().trim();
    }
  );

  if (labelMatch) {
    console.log(`🏷️ Label to field name mapping: "${labelOrName}" → "${labelMatch.name}"`);
    return labelMatch.name;
  }

  // If still not found, try partial matching (in case of slight differences)
  const partialMatch = taskDetails.taskInstParamRequestList.find(
    (param: any) => {
      const paramLabel = param.jsonDescriptorObject?.label;
      if (!paramLabel) return false;
      
      const normalizedLabel = paramLabel.toLowerCase().replace(/\s+/g, '').replace(/[^\w]/g, '');
      const normalizedInput = labelOrName.toLowerCase().replace(/\s+/g, '').replace(/[^\w]/g, '');
      
      return normalizedLabel === normalizedInput;
    }
  );

  if (partialMatch) {
    console.log(`🔍 Partial label match: "${labelOrName}" → "${partialMatch.name}"`);
    return partialMatch.name;
  }

  // If no match found, log available options and return original
  console.warn(`⚠️ No field found for "${labelOrName}". Available fields:`);
  taskDetails.taskInstParamRequestList.forEach((param: any) => {
    const label = param.jsonDescriptorObject?.label || 'No label';
    console.warn(`   - Name: "${param.name}" | Label: "${label}"`);
  });

  return labelOrName; // Return original if no mapping found
};

export const getTaskFieldValue = (
  taskName: string,
  fieldName: string,
  config: TaskManagementConfig,
  orderForm: any,
  taskDetails?: any
): string => {
  const mapping = config.taskFieldMappings[taskName];
  
  // Check for conditional rules first
  const conditionalRules = (config as any).conditionalRules?.[taskName];
  if (conditionalRules && Array.isArray(conditionalRules)) {
    for (const rule of conditionalRules) {
      let conditionMet = false;
      
      // Check if condition is met
      if (rule.conditionType === 'workflow') {
        conditionMet = orderForm.workflowName?.toLowerCase() === rule.conditionValue.toLowerCase();
      } else if (rule.conditionType === 'orderType') {
        conditionMet = orderForm.orderType?.toLowerCase() === rule.conditionValue.toLowerCase();
      }
      
      if (conditionMet && rule.fields && Array.isArray(rule.fields)) {
        console.log(`🔀 Conditional rule matched: ${rule.conditionType} = "${rule.conditionValue}"`);
        
        // Look for field in conditional rule fields
        for (const condField of rule.fields) {
          const resolvedFieldName = taskDetails 
            ? mapLabelToFieldName(taskName, condField.fieldName, taskDetails)
            : condField.fieldName;
            
          if (resolvedFieldName === fieldName || condField.fieldName === fieldName) {
            let value = condField.fieldValue;
            
            // Handle dropdown field type
            if (condField.fieldType === 'dropdown' && condField.dropdownValue) {
              console.log(`📋 Conditional dropdown "${fieldName}": "${condField.dropdownValue}" (label: "${value}")`);
              return condField.dropdownValue;
            }
            
            // Replace placeholders
            if (value === '{{preferredDevice}}') {
              return orderForm.preferredDevice || '';
            }
            if (value === '{{preferredPort}}') {
              return orderForm.preferredPort || '';
            }
            
            console.log(`✓ Conditional field "${fieldName}" = "${value}"`);
            return value;
          }
        }
      }
    }
  }
  
  // If no conditional rule matched, use default mapping
  if (!mapping) {
    return '';
  }

  // Try both direct field name lookup and label-to-name mapping
  let actualFieldName = fieldName;
  let mappedValue = mapping[fieldName];

  // If direct field name doesn't exist in mapping, try looking up by label
  if (!mappedValue && taskDetails) {
    // Check if any mapped key could be a label that maps to our field name
    for (const [mappedKey, mappedVal] of Object.entries(mapping)) {
      const resolvedFieldName = mapLabelToFieldName(taskName, mappedKey, taskDetails);
      if (resolvedFieldName === fieldName) {
        console.log(`🔄 Found mapping via label: "${mappedKey}" maps to field "${fieldName}"`);
        mappedValue = mappedVal;
        break;
      }
    }
  }

  // If we found a mapping value, process it
  if (mappedValue) {
    let value = mappedValue;
    
    // Handle dropdown field type - if it's an object with dropdownValue, use that
    if (typeof value === 'object' && value.fieldType === 'dropdown' && value.dropdownValue) {
      console.log(`📋 Dropdown field "${fieldName}": using value "${value.dropdownValue}" (label: "${value.fieldValue}")`);
      return value.dropdownValue;
    }
    
    // If it's an object but not a dropdown, get the fieldValue property
    if (typeof value === 'object' && value.fieldValue) {
      value = value.fieldValue;
    }

    // Replace placeholders with actual values
    if (value === '{{preferredDevice}}') {
      return orderForm.preferredDevice || '';
    }
    
    if (value === '{{preferredPort}}') {
      return orderForm.preferredPort || '';
    }

    if (value === '{{workflowBasedValue}}') {
      // For Verify or Assign Appropriate Device task - Fallout Action field
      if (fieldName === 'Fallout Action') {
        if (orderForm.workflowName?.toLowerCase().includes('monarch')) {
          return 'Enter Port data';
        }
        if (orderForm.workflowName?.toLowerCase().includes('colorless')) {
          return 'Create Cap Jeop';
        }
        return 'Create Cap Jeop'; // Default value
      }
      return 'Create Cap Jeop'; // Default value for other fields
    }

    return value;
  }

  return '';
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
