import { 
  TaskDetails, 
  TaskParameter, 
  TaskField, 
  MandatoryFieldResult, 
  UserFieldInput,
  TaskManagementConfig
} from '@/types';
import { getTaskFieldValue } from './taskConfig';

export interface MandatoryField {
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  currentValue: string | null;
  isRequired: boolean;
  isEditable: boolean;
  isConditionallyEditable?: boolean;
  conditionalRules?: Record<string, string[]>;
  hasValue: boolean;
  optionsList?: string[];
}

export interface MandatoryFieldsAnalysis {
  taskId: string;
  taskName: string;
  totalMandatoryFields: number;
  missingFields: MandatoryField[];
  providedFields: MandatoryField[];
  optionalEditableFields: MandatoryField[];
  canProceed: boolean;
  needsUserInput: boolean;
}

export class MandatoryFieldManager {
  // Static flag to prevent multiple popups from showing simultaneously
  private static isPopupActive = false;
  private static activePopupTaskId: string | null = null;

  /**
   * Force clear popup state (emergency cleanup)
   */
  static clearPopupState(): void {
    console.log(`🧹 Force clearing popup state`);
    this.isPopupActive = false;
    this.activePopupTaskId = null;
  }
  /**
   * Analyzes a task to identify all mandatory fields and their current state
   */
  static analyzeMandatoryFields(
    taskDetails: TaskDetails, 
    taskConfig?: TaskManagementConfig, 
    orderForm?: any
  ): MandatoryFieldsAnalysis {
    const mandatoryFields: MandatoryField[] = [];
    const missingFields: MandatoryField[] = [];
    const providedFields: MandatoryField[] = [];
    const optionalEditableFields: MandatoryField[] = [];
    
    // Track processed field names to avoid duplicates
    const processedFields = new Set<string>();

    // Extract ONLY truly editable fields that need user input from taskInstParamRequestList
    if (taskDetails.taskInstParamRequestList) {
      console.log(`🔍 Scanning ${taskDetails.taskInstParamRequestList.length} task parameters for editable fields that need input...`);
      
      taskDetails.taskInstParamRequestList.forEach((param: TaskParameter) => {
        const descriptor = param.jsonDescriptorObject;
        
        // Skip if we've already processed this field name
        if (processedFields.has(param.name)) {
          console.log(`  ⚠️ Skipping duplicate field "${param.name}"`);
          return;
        }
        
        // Strict editable field detection - check both direct editability and conditional editability
        const isDirectlyEditable = descriptor?.editable === true;
        const isConditionallyEditable = descriptor?.editableCheckObj && Object.keys(descriptor.editableCheckObj).length > 0;
        const isEditable = isDirectlyEditable || isConditionallyEditable;
        
        // Skip fields that already have values unless they're mandatory and missing
        const hasExistingValue = this.hasValidValue(param.value);
        
        console.log(`  Field "${param.name}": editable=${descriptor?.editable}, conditionallyEditable=${isConditionallyEditable}, required=${descriptor?.required}, hasValue=${hasExistingValue}`);
        
        // Log conditional editability details
        if (isConditionallyEditable) {
          console.log(`    Conditional editable rules:`, descriptor.editableCheckObj);
        }
        
        if (isEditable) {
          // Mark this field as processed
          processedFields.add(param.name);
          
          const fieldTypeInfo = this.getFieldType(param, descriptor);
          
          // Check if there's a configured value for this field
          let currentValue = param.value;
          let hasConfiguredValue = false;
          
          if (taskConfig && orderForm) {
            const configuredValue = getTaskFieldValue(taskDetails.taskName, param.name, taskConfig, orderForm, taskDetails);
            if (configuredValue) {
              currentValue = configuredValue;
              hasConfiguredValue = true;
              console.log(`    Found configured value for field '${param.name}': '${configuredValue}'`);
            }
          }
          
          const fieldInfo: MandatoryField = {
            fieldName: param.name,
            fieldLabel: descriptor?.label || param.name,
            fieldType: fieldTypeInfo.type,
            currentValue: currentValue,
            isRequired: descriptor?.required === true || String(descriptor?.required) === 'true',
            isEditable: isDirectlyEditable,
            isConditionallyEditable: isConditionallyEditable,
            conditionalRules: isConditionallyEditable ? descriptor.editableCheckObj : undefined,
            hasValue: this.hasValidValue(currentValue),
            optionsList: fieldTypeInfo.options || descriptor?.optionsList || undefined
          };

          console.log(`    Created field info: ${fieldInfo.fieldLabel} (required: ${fieldInfo.isRequired}, directlyEditable: ${fieldInfo.isEditable}, conditionallyEditable: ${fieldInfo.isConditionallyEditable}, hasValue: ${fieldInfo.hasValue})`);

          if (fieldInfo.isRequired) {
            // This is a mandatory field
            mandatoryFields.push(fieldInfo);

            if (fieldInfo.hasValue) {
              providedFields.push(fieldInfo);
            } else {
              missingFields.push(fieldInfo);
            }
          } else {
            // This is an optional editable field - only add if it doesn't have a value
            if (!fieldInfo.hasValue) {
              optionalEditableFields.push(fieldInfo);
              console.log(`    Added optional editable field without value: ${fieldInfo.fieldLabel}`);
            } else {
              console.log(`    Skipped optional field with existing value: ${fieldInfo.fieldLabel} = "${fieldInfo.currentValue}"`);
            }
          }
        } else {
          console.log(`    Skipped non-editable field: ${param.name}`);
        }
      });
    }

    console.log(`📊 Field analysis complete:`, {
      totalParameters: taskDetails.taskInstParamRequestList?.length || 0,
      processedUniqueFields: processedFields.size,
      mandatoryFields: mandatoryFields.length,
      missingFields: missingFields.length, 
      providedFields: providedFields.length,
      optionalEditableFields: optionalEditableFields.length
    });

    return {
      taskId: taskDetails.id,
      taskName: taskDetails.taskName,
      totalMandatoryFields: mandatoryFields.length,
      missingFields,
      providedFields,
      optionalEditableFields,
      canProceed: missingFields.length === 0,
      needsUserInput: missingFields.length > 0
    };
  }

  /**
   * Determines the appropriate field type for UI rendering
   */
  private static getFieldType(param: TaskParameter, descriptor: any): { type: string; options?: string[] } {
    // Use the parameter type first, then descriptor type, with fallbacks
    const paramType = param.type?.toLowerCase();
    const descriptorType = descriptor?.type?.toLowerCase();
    
    // Handle date types
    if (paramType === 'date' || paramType === 'isodate' || descriptorType === 'date') {
      return { type: 'date' };
    }
    
    // Handle dropdown/select types
    if (paramType === 'select' || paramType === 'dropdown' || paramType === 'multiselect' || 
        descriptorType === 'select' || descriptor?.optionsList?.length > 0) {
      const options = descriptor?.optionsList || [];
      return { type: 'dropdown', options };
    }
    
    // Handle textarea types
    if (paramType === 'textarea' || paramType === 'textfield') {
      return { type: 'textarea' };
    }
    
    // Handle checkbox/boolean types
    if (paramType === 'checkbox' || paramType === 'boolean') {
      return { type: 'checkbox' };
    }
    
    // Handle number types
    if (paramType === 'number' || paramType === 'integer') {
      return { type: 'number' };
    }
    
    // Special handling for Device CLLI ARM field (auto-generate format DNVFCOQE76W with random number)
    if (param.name === 'deviceCLLIARM' || param.name?.toLowerCase().includes('clli')) {
      return { type: 'text' };
    }
    
    // Default to text input
    return { type: 'text' };
  }

  /**
   * Checks if a field value is valid (not null, undefined, empty string, or "null")
   */
  private static hasValidValue(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') {
      const trimmedValue = value.trim();
      return trimmedValue !== '' && trimmedValue.toLowerCase() !== 'null';
    }
    return true;
  }

  /**
   * Validates user input for a specific field
   */
  static validateFieldInput(field: MandatoryField, userInput: string): {
    isValid: boolean;
    errorMessage?: string;
  } {
    // Basic validation
    if (!userInput || userInput.trim() === '') {
      return {
        isValid: false,
        errorMessage: `${field.fieldLabel} is required and cannot be empty`
      };
    }

    // Type-specific validation
    switch (field.fieldType?.toLowerCase()) {
      case 'select':
      case 'dropdown':
        if (field.optionsList && !field.optionsList.includes(userInput)) {
          return {
            isValid: false,
            errorMessage: `${field.fieldLabel} must be one of: ${field.optionsList.join(', ')}`
          };
        }
        break;

      case 'checkbox':
        if (!['true', 'false', 'yes', 'no'].includes(userInput.toLowerCase())) {
          return {
            isValid: false,
            errorMessage: `${field.fieldLabel} must be true/false or yes/no`
          };
        }
        break;

      case 'number':
        if (isNaN(Number(userInput))) {
          return {
            isValid: false,
            errorMessage: `${field.fieldLabel} must be a valid number`
          };
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userInput)) {
          return {
            isValid: false,
            errorMessage: `${field.fieldLabel} must be a valid email address`
          };
        }
        break;

      case 'date':
      case 'isodate':
        const dateValue = new Date(userInput);
        if (isNaN(dateValue.getTime())) {
          return {
            isValid: false,
            errorMessage: `${field.fieldLabel} must be a valid date`
          };
        }
        break;
    }

    return { isValid: true };
  }

  /**
   * Prepares field values for task update API call
   */
  static prepareFieldUpdates(
    missingFields: MandatoryField[],
    userInputs: Record<string, string>
  ): Record<string, string> {
    const updates: Record<string, string> = {};

    missingFields.forEach(field => {
      const userInput = userInputs[field.fieldName];
      if (userInput) {
        // Format the input based on field type
        switch (field.fieldType?.toLowerCase()) {
          case 'checkbox':
            updates[field.fieldName] = userInput.toLowerCase() === 'true' || userInput.toLowerCase() === 'yes' ? 'true' : 'false';
            break;
          case 'number':
            updates[field.fieldName] = String(Number(userInput));
            break;
          case 'date':
          case 'isodate':
            updates[field.fieldName] = new Date(userInput).toISOString();
            break;
          default:
            updates[field.fieldName] = userInput.trim();
        }
      }
    });

    return updates;
  }

  /**
   * Gets default values for common field names
   */
  static getDefaultValue(fieldName: string, fieldType: string): string | undefined {
    const defaults: Record<string, string> = {
      'complete_remarks': 'Automated completion by AVIATOR',
      'Demarc_Information': 'Default Demarc Information',
      'port': 'GE-0/0/0',
      'tid': 'TID001',
      'slotNumber': '1',
      'AP_CNR': 'false',
      'redesign': 'false',
      'returnBAU': 'false',
      'capacityOverride': 'false',
      'SFP_Required': 'No',
      
      // Network Build Form fields
      'rackSize': '19-inch',
      'deviceMountType': 'Front Mount',
      'backboardSize': 'Standard',
      'deviceMountProvideBy': 'Customer',
      'ecnPortOther': 'Standard Port',
      'deviceMountStatus': 'Available',
      'lagTransport': 'Single',
      'standardBIDI': 'No',
      'autoSelectECNPort': 'true',
      'deviceElevation': '42U',
      'fiberSource': 'Existing',
      'transportBandwidth': '1G',
      'deviceSubType': 'Standard',
      'deviceType': 'Router',
      
      // Engineering Solution fields
      'buildTypes': 'Simple',
      'dedicatedOptions': 'Shared',
      'ospRemarks': 'Standard configuration',
      'surveyCategory': 'ISP',
      'procurementRequestType': 'Procurement Financial Request Materials',
      'implementationTeam': 'Standard Team',
      'buildingAccessQty': '1'
    };

    // Special handling for Device CLLI ARM - generate format DNVFCOQE##W with random number
    if (fieldName === 'deviceCLLIARM' || fieldName.toLowerCase().includes('clli')) {
      const randomNum = Math.floor(Math.random() * 90) + 10; // Generate random 2-digit number
      return `DNVFCOQE${randomNum}W`;
    }

    return defaults[fieldName];
  }

  /**
   * Creates user-friendly field descriptions
   */
  static getFieldDescription(field: MandatoryField): string {
    const descriptions: Record<string, string> = {
      'Demarc_Information': 'Information about the demarcation point or equipment location',
      'complete_remarks': 'Comments or notes about the task completion',
      'port': 'Network port identifier (e.g., GE-0/0/0)',
      'tid': 'Terminal Identifier for the network element',
      'slotNumber': 'Equipment slot number',
      'SFP_Required': 'Whether Small Form-factor Pluggable transceiver is needed',
      'redesign': 'Whether the service requires redesign',
      'AP_CNR': 'Customer Not Ready status',
      'returnBAU': 'Return to Business As Usual status',
      'capacityOverride': 'Override capacity limitations',
      
      // Network Build Form fields
      'rackSize': 'Size of the equipment rack',
      'deviceMountType': 'How the device will be mounted',
      'backboardSize': 'Size of the backboard for mounting',
      'deviceMountProvideBy': 'Who provides the device mounting',
      'ecnPortOther': 'Additional ECN port information',
      'ecnDevice': 'ECN device identifier',
      'aisle': 'Rack aisle location',
      'rmu': 'Rack Mount Unit position',
      'deviceMountStatus': 'Current status of device mounting',
      'lagTransport': 'Link Aggregation Group transport type',
      'standardBIDI': 'Standard Bidirectional configuration',
      'autoSelectECNPort': 'Automatically select ECN port',
      'deviceElevation': 'Height position of device in rack',
      'bay': 'Equipment bay location',
      'room': 'Room location of equipment',
      'fiberSource': 'Source of fiber connection',
      'transportBandwidth': 'Transport bandwidth requirement',
      'deviceSubType': 'Specific device subtype',
      'deviceType': 'Type of network device',
      'deviceCLLIARM': 'Device CLLI ARM identifier (format: DNVFCOQE##W)',
      'asriTWLI': 'ASRI TWLI/CLLI identifier',
      
      // Engineering Solution fields
      'buildTypes': 'Type of network build (Simple, Small, Large, Special)',
      'ccea': 'Customer Circuit Engineering Authorization',
      'dedicatedOptions': 'Dedicated or shared resource options',
      'wfmtProjectId': 'WFMT Project identifier',
      'ospRemarks': 'Outside Plant remarks and notes',
      'constraints': 'Colorless NetworkBuild constraints',
      'orderConstraints': 'Order-specific constraints',
      'procurementRequestType': 'Type of procurement request',
      'surveyCategory': 'Survey category (ISP, OSP, BOTH)',
      'quotedSolutionType': 'Type of quoted solution',
      'implementationTeam': 'Team responsible for implementation',
      'buildingAccessQty': 'Quantity of building access required',
      'cnbProjectsOnSite': 'Existing CNB projects on site',
      'existingCmDeviceName': 'Name of existing CM device',
      'existingCmDevicePort': 'Port on existing CM device',
      'existingLegacyDevice': 'Existing legacy device information',
      'endUserName': 'Name of the end user',
      'usoOrderNumber': 'USO order number'
    };

    return descriptions[field.fieldName] || `Please provide a value for ${field.fieldLabel}`;
  }

  /**
   * Formats field information for display
   */
  static formatFieldForDisplay(field: MandatoryField): string {
    let display = `• ${field.fieldLabel}`;
    
    if (field.fieldType) {
      display += ` (${field.fieldType})`;
    }
    
    if (field.optionsList && field.optionsList.length > 0) {
      display += ` - Options: ${field.optionsList.join(', ')}`;
    }
    
    const description = this.getFieldDescription(field);
    display += `\n  ${description}`;
    
    const defaultValue = this.getDefaultValue(field.fieldName, field.fieldType);
    if (defaultValue) {
      display += `\n  Default: ${defaultValue}`;
    }
    
    return display;
  }

  /**
   * Gets conditionally editable fields that should be shown in the popup
   * These are fields that are currently not editable but can become editable based on other field values
   */
  private static getConditionallyEditableFields(taskDetails: TaskDetails): MandatoryField[] {
    const conditionalFields: MandatoryField[] = [];
    
    if (!taskDetails.taskInstParamRequestList) {
      return conditionalFields;
    }
    
    console.log(`🔍 Scanning for conditionally editable fields...`);
    
    taskDetails.taskInstParamRequestList.forEach((param: TaskParameter) => {
      const descriptor = param.jsonDescriptorObject;
      
      // Look for fields that have editableCheckObj (conditional editability rules)
      if (descriptor?.editableCheckObj && Object.keys(descriptor.editableCheckObj).length > 0) {
        const fieldTypeInfo = this.getFieldType(param, descriptor);
        
        const conditionalField: MandatoryField = {
          fieldName: param.name,
          fieldLabel: descriptor?.label || param.name,
          fieldType: fieldTypeInfo.type,
          currentValue: param.value,
          isRequired: descriptor?.required === true || String(descriptor?.required) === 'true',
          isEditable: false, // Currently not editable, but can become editable
          isConditionallyEditable: true,
          conditionalRules: descriptor.editableCheckObj,
          hasValue: this.hasValidValue(param.value),
          optionsList: fieldTypeInfo.options || descriptor?.optionsList || undefined
        };
        
        console.log(`  🎯 Found conditionally editable field: ${conditionalField.fieldLabel}`, {
          rules: descriptor.editableCheckObj,
          currentValue: param.value,
          hasValue: conditionalField.hasValue
        });
        
        conditionalFields.push(conditionalField);
      }
    });
    
    console.log(`📊 Found ${conditionalFields.length} conditionally editable fields`);
    return conditionalFields;
  }

  /**
   * Simple method to check if task has missing mandatory fields
   */
  static async checkMissingValues(
    taskDetails: TaskDetails, 
    taskConfig?: TaskManagementConfig, 
    orderForm?: any
  ): Promise<boolean> {
    console.log(`🔍 MandatoryFieldManager: Analyzing task "${taskDetails.taskName}" (ID: ${taskDetails.id}) for mandatory fields and editable fields...`);
    
    // Check if popup is already active for this or another task
    if (this.isPopupActive) {
      if (this.activePopupTaskId === taskDetails.id) {
        console.log(`⚠️ Popup already active for task ${taskDetails.id} - ignoring duplicate call`);
        return false; // Return false to prevent task processing while popup is active
      } else {
        console.log(`⚠️ Popup active for different task (${this.activePopupTaskId}) - ignoring new task ${taskDetails.id}`);
        return false; // Return false to prevent multiple popups
      }
    }
    
    const analysis = this.analyzeMandatoryFields(taskDetails, taskConfig, orderForm);
    
    console.log(`📊 Field analysis for "${taskDetails.taskName}":`, {
      totalMandatoryFields: analysis.totalMandatoryFields,
      missingFields: analysis.missingFields.length,
      providedFields: analysis.providedFields.length,
      optionalEditableFields: analysis.optionalEditableFields.length,
      canProceed: analysis.canProceed,
      needsUserInput: analysis.needsUserInput
    });
    
    // Log available field names for task configuration reference
    if (taskDetails.taskInstParamRequestList && taskDetails.taskInstParamRequestList.length > 0) {
      console.log(`🔧 Available field names for task configuration mapping (${taskDetails.taskName}):`);
      const fieldMappingInfo = taskDetails.taskInstParamRequestList.map(param => {
        const descriptor = param.jsonDescriptorObject;
        return {
          name: param.name,
          label: descriptor?.label || param.name,
          type: param.type || 'text',
          editable: descriptor?.editable,
          required: descriptor?.required
        };
      });
      
      // Deduplicate fields by name for cleaner logging
      const uniqueFields = Array.from(
        new Map(fieldMappingInfo.map(f => [f.name, f])).values()
      );
      
      // Only log if there are editable/required fields
      const importantFields = uniqueFields.filter(f => f.editable || f.required);
      if (importantFields.length > 0) {
        console.log(`📋 Task has ${importantFields.length} editable/required fields (${uniqueFields.length} total unique fields)`);
        console.table(importantFields);
      } else {
        console.log(`📋 Task has ${uniqueFields.length} total unique fields (none editable/required)`);
      }
      
      console.log(`💡 You can use EITHER field "name" OR "label" when configuring task field mappings!`);
    }
    
    // Check if there are any missing mandatory fields
    const hasMissingMandatoryFields = analysis.missingFields.length > 0;
    
    if (!hasMissingMandatoryFields) {
      console.log(`✅ Task "${taskDetails.taskName}" has no missing mandatory fields - can proceed without popup`);
      return true; // No mandatory fields missing, can proceed
    }
    
    console.log(`🚨 Task "${taskDetails.taskName}" has ${analysis.missingFields.length} missing mandatory fields - showing popup with all editable fields`);
    
    // When there's at least 1 mandatory field missing, show popup with:
    // 1. ALL missing mandatory fields 
    // 2. Only optional editable fields that don't have values
    // 3. Conditionally editable fields (even if they currently have editable=false)
    const fieldsToShow = [
      ...analysis.missingFields, // All required fields without values (these triggered the popup)
      ...analysis.optionalEditableFields // Only optional fields without values
    ];
    
    // Also include conditionally editable fields that might become editable based on user input
    const conditionalFields = this.getConditionallyEditableFields(taskDetails);
    console.log(`🔧 Found ${conditionalFields.length} conditionally editable fields to include in popup`);
    
    conditionalFields.forEach((field: MandatoryField) => {
      // Only add if not already included and doesn't have a value
      const alreadyIncluded = fieldsToShow.find(f => f.fieldName === field.fieldName);
      if (!alreadyIncluded && !field.hasValue) {
        fieldsToShow.push(field);
        console.log(`  ➕ Added conditionally editable field: ${field.fieldLabel}`);
      }
    });
    
    // Remove duplicates based on field name (extra safety in case of data issues)
    const uniqueFields = fieldsToShow.reduce((unique: MandatoryField[], field: MandatoryField) => {
      const existingField = unique.find(f => f.fieldName === field.fieldName);
      if (!existingField) {
        unique.push(field);
      } else {
        console.log(`  🔍 Found duplicate field "${field.fieldName}" - keeping first occurrence`);
      }
      return unique;
    }, []);
    
    console.log(`📋 Showing popup with ${uniqueFields.length} unique fields (before deduplication: ${fieldsToShow.length}):`, 
      uniqueFields.map(f => `${f.fieldLabel} (${f.fieldName}, required: ${f.isRequired}, hasValue: ${f.hasValue}, currentValue: "${f.currentValue || 'empty'}")`));
    
    // Show popup to user for all fields
    try {
      console.log(`🔧 Showing modal popup because of ${analysis.missingFields.length} missing mandatory fields...`);
      
      // Set popup as active to prevent duplicate calls
      this.isPopupActive = true;
      this.activePopupTaskId = taskDetails.id;
      
      const userInputs = await this.promptUserForInput(uniqueFields, taskDetails);
      
      // Clear popup state when user responds
      this.isPopupActive = false;
      this.activePopupTaskId = null;
      
      if (userInputs === null) {
        console.log(`❌ User cancelled field input - stopping all background processes`);
        return false; // User cancelled - this will stop background processing
      }
      
      if (userInputs === undefined || Object.keys(userInputs).length === 0) {
        console.log(`⚠️ User clicked continue without entering values - checking if mandatory fields are still missing`);
        
        // Check if mandatory fields still need defaults
        const mandatoryDefaults: Record<string, string> = {};
        analysis.missingFields.forEach(field => {
          const defaultValue = this.getDefaultValue(field.fieldName, field.fieldType);
          if (defaultValue) {
            mandatoryDefaults[field.fieldName] = defaultValue;
            console.log(`  Applied default to mandatory field ${field.fieldName}: "${defaultValue}"`);
          } else {
            console.log(`  ⚠️ No default available for mandatory field ${field.fieldName}`);
          }
        });
        
        this.updateTaskParameters(taskDetails, mandatoryDefaults);
        return true;
      }
      
      console.log(`✅ User provided values for fields:`, Object.keys(userInputs));
      
      // Update task parameters with user-provided values
      this.updateTaskParameters(taskDetails, userInputs);
      
      console.log(`🔄 Updated task parameters with user input`);
      return true;
    } catch (error) {
      console.error(`💥 Error in field input modal:`, error);
      
      // Clear popup state on error
      this.isPopupActive = false;
      this.activePopupTaskId = null;
      
      return false;
    }
  }

  /**
   * Determines if a field is important and should be shown to the user
   */
  private static isImportantField(fieldName: string): boolean {
    const importantFields = [
      // Network Build Form fields
      'rackSize', 'deviceMountType', 'backboardSize', 'deviceMountProvideBy',
      'ecnPortOther', 'ecnDevice', 'aisle', 'rmu', 'deviceMountStatus',
      'lagTransport', 'standardBIDI', 'autoSelectECNPort', 'deviceElevation',
      'bay', 'room', 'fiberSource', 'transportBandwidth', 'deviceSubType',
      'deviceType', 'deviceCLLIARM', 'asriTWLI', 
      
      // Engineering Solution fields
      'buildTypes', 'ccea', 'dedicatedOptions', 'wfmtProjectId', 'ospRemarks',
      'constraints', 'orderConstraints', 'procurementRequestType', 'surveyCategory',
      'quotedSolutionType', 'implementationTeam', 'buildingAccessQty',
      'cnbProjectsOnSite', 'existingCmDeviceName', 'existingCmDevicePort',
      'existingLegacyDevice', 'endUserName', 'usoOrderNumber',
      
      // Common task fields
      'complete_remarks', 'action', 'remarks', 'notes', 'comments',
      'port', 'tid', 'slotNumber', 'device', 'location'
    ];
    
    return importantFields.some(important => 
      fieldName.toLowerCase().includes(important.toLowerCase()) || 
      important.toLowerCase().includes(fieldName.toLowerCase())
    );
  }  /**
   * Prompts user for missing mandatory field values using a modal
   */
  private static async promptUserForInput(
    missingFields: MandatoryField[], 
    taskDetails: TaskDetails
  ): Promise<Record<string, string> | null> {
    console.log(`🎯 Creating modal popup for ${missingFields.length} missing fields...`);
    
    return new Promise((resolve) => {
      try {
        // Create modal popup
        console.log(`🔧 Creating modal DOM element...`);
        const modal = this.createMandatoryFieldModal(missingFields, taskDetails, resolve);
        
        console.log(`📝 Appending modal to document body...`);
        document.body.appendChild(modal);
        
        console.log(`✅ Modal popup created and shown successfully`);
        
        // Focus on the first input field
        setTimeout(() => {
          const firstInput = modal.querySelector('input[type="text"]') as HTMLInputElement;
          if (firstInput) {
            firstInput.focus();
          }
        }, 100);
        
      } catch (error) {
        console.error(`💥 Error creating modal popup:`, error);
        resolve(null);
      }
    });
  }

  /**
   * Creates a modal popup for user input of mandatory fields
   */
  private static createMandatoryFieldModal(
    missingFields: MandatoryField[],
    taskDetails: TaskDetails,
    onComplete: (inputs: Record<string, string> | null) => void
  ): HTMLElement {
    console.log(`🎨 Creating robust modal HTML for task "${taskDetails.taskName}" with ${missingFields.length} fields...`);
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2';
    modal.style.zIndex = '9999';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col relative';
    
    console.log(`📋 All editable fields to display:`, missingFields.map(f => `${f.fieldLabel} (${f.fieldType}, required: ${f.isRequired})`));
    
    // Create modal structure with guaranteed visible footer
    modalContent.innerHTML = `
      <!-- Fixed Header -->
      <div class="flex-shrink-0 p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
        <h3 class="text-2xl font-bold text-gray-900 mb-2">📝 Task Field Configuration</h3>
        <p class="text-sm text-gray-700">
          Task "<span class="font-semibold text-blue-800">${taskDetails.taskName}</span>" (ID: ${taskDetails.id}) - <span class="font-semibold text-red-600">${missingFields.filter(f => f.isRequired).length} mandatory fields</span> require input + <span class="font-semibold text-blue-600">${missingFields.filter(f => !f.isRequired).length} optional fields</span> available
        </p>
        <div class="mt-2 text-xs text-gray-600 bg-white bg-opacity-50 rounded px-2 py-1">
          💡 Popup shown because mandatory fields are missing | <span class="text-red-600 font-medium">*</span> = Required field | Blue fields are optional but editable
        </div>
        <div class="mt-1 text-xs text-yellow-700 bg-yellow-100 rounded px-2 py-1">
          ⚠️ Background task updates are blocked while this popup is active to preserve your input
        </div>
      </div>
      
      <!-- Scrollable Content Area -->
      <div class="flex-1 overflow-y-auto p-6 bg-gray-50" style="max-height: calc(90vh - 200px);">
        <form id="mandatoryFieldsForm">
          ${this.generateFieldsTable(missingFields)}
        </form>
      </div>
      
      <!-- Fixed Footer with Always Visible Continue Button -->
      <div class="flex-shrink-0 p-4 border-t border-gray-200 bg-white rounded-b-lg shadow-lg">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-600">
            <span class="font-medium">Fields:</span> ${missingFields.length} total
            | <span class="text-red-600 font-medium">Required:</span> ${missingFields.filter(f => f.isRequired).length}
            | <span class="text-blue-600 font-medium">Optional:</span> ${missingFields.filter(f => !f.isRequired).length}
          </div>
          <div class="flex space-x-3">
            <button 
              type="button" 
              id="cancelBtn" 
              class="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium border border-gray-300"
            >
              Cancel
            </button>
            <button 
              type="button" 
              id="continueBtn"
              class="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-lg border-2 border-blue-600"
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    `;
    
    modal.appendChild(modalContent);

    // Enhanced event handling with multiple approaches
    const form = modalContent.querySelector('#mandatoryFieldsForm') as HTMLFormElement;
    const cancelBtn = modalContent.querySelector('#cancelBtn') as HTMLButtonElement;
    const continueBtn = modalContent.querySelector('#continueBtn') as HTMLButtonElement;

    console.log(`🔧 Setting up robust modal event listeners...`);

    // Function to collect form data
    const collectFormData = (): Record<string, string> => {
      const formData = new FormData(form);
      const inputs: Record<string, string> = {};
      
      console.log(`📤 Collecting data from ALL ${missingFields.length} fields in popup (both mandatory and optional)...`);
      
      // Process ALL fields shown in the popup, not just mandatory ones
      missingFields.forEach((field) => {
        let value = '';
        
        // Handle different field types with specific logic
        if (field.fieldType === 'checkbox') {
          const checkbox = form.querySelector(`input[name="${field.fieldName}"]`) as HTMLInputElement;
          value = checkbox?.checked ? 'true' : 'false';
        } else if (field.fieldType === 'dropdown') {
          const select = form.querySelector(`select[name="${field.fieldName}"]`) as HTMLSelectElement;
          value = select?.value || '';
        } else if (field.fieldType === 'textarea') {
          const textarea = form.querySelector(`textarea[name="${field.fieldName}"]`) as HTMLTextAreaElement;
          value = textarea?.value || '';
        } else if (field.fieldType === 'number') {
          const numberInput = form.querySelector(`input[name="${field.fieldName}"]`) as HTMLInputElement;
          value = numberInput?.value || '';
        } else if (field.fieldType === 'date') {
          const dateInput = form.querySelector(`input[name="${field.fieldName}"]`) as HTMLInputElement;
          value = dateInput?.value || '';
        } else {
          // Default text input or other types
          value = formData.get(field.fieldName) as string || '';
        }
        
        if (value && value.trim()) {
          inputs[field.fieldName] = value.trim();
          console.log(`  ✅ ${field.fieldName} (${field.isRequired ? 'required' : 'optional'}, ${field.fieldType}): "${value.trim()}"`);
        } else {
          // Use default value if no input provided
          const defaultValue = field.currentValue || this.getDefaultValue(field.fieldName, field.fieldType);
          if (defaultValue) {
            inputs[field.fieldName] = defaultValue;
            console.log(`  🔄 ${field.fieldName} (${field.isRequired ? 'required' : 'optional'}, ${field.fieldType}): using default "${defaultValue}"`);
          } else if (field.isRequired) {
            console.log(`  ⚠️ ${field.fieldName} (required, ${field.fieldType}): no value provided - this may cause issues`);
          } else {
            console.log(`  ℹ️ ${field.fieldName} (optional, ${field.fieldType}): no value provided - skipping`);
          }
        }
      });
      
      console.log(`📦 Total field values collected: ${Object.keys(inputs).length} (${Object.keys(inputs).filter(key => missingFields.find(f => f.fieldName === key)?.isRequired).length} required, ${Object.keys(inputs).filter(key => !missingFields.find(f => f.fieldName === key)?.isRequired).length} optional)`);
      return inputs;
    };

    // Continue button click handler (primary method)
    continueBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      console.log(`✅ Continue button clicked - processing form data...`);
      
      try {
        const inputs = collectFormData();
        console.log(`🗑️ Removing modal from DOM...`);
        document.body.removeChild(modal);
        console.log(`📤 Returning collected inputs:`, inputs);
        onComplete(inputs);
      } catch (error) {
        console.error(`💥 Error in continue button handler:`, error);
        onComplete({});
      }
    });

    // Form submission handler (backup method)
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      console.log(`📋 Form submitted via enter key - triggering continue...`);
      continueBtn.click();
    });

    // Cancel button handler
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      console.log(`❌ User cancelled field input`);
      
      // Clear popup state immediately when cancelled
      document.removeEventListener('keydown', handleEscape);
      document.body.removeChild(modal);
      onComplete(null);
    });

    // ESC key handler
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log(`⌨️ ESC key pressed - cancelling modal`);
        document.removeEventListener('keydown', handleEscape);
        cancelBtn.click();
      }
    };
    document.addEventListener('keydown', handleEscape);

    console.log(`✅ Robust modal created successfully with guaranteed visible continue button`);
    return modal;
  }

  /**
   * Generates fields in a responsive table layout for better space utilization
   */
  private static generateFieldsTable(missingFields: MandatoryField[]): string {
    // Group fields into rows of 3 for better layout
    const fieldsPerRow = 3;
    const rows = [];
    
    for (let i = 0; i < missingFields.length; i += fieldsPerRow) {
      const rowFields = missingFields.slice(i, i + fieldsPerRow);
      rows.push(rowFields);
    }
    
    return `
      <div class="space-y-6">
        ${rows.map((rowFields, rowIndex) => `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${rowFields.map((field, colIndex) => {
              const globalIndex = rowIndex * fieldsPerRow + colIndex;
              return this.generateCompactFieldInput(field, globalIndex);
            }).join('')}
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Generates a more compact field input for table layout
   */
  private static generateCompactFieldInput(field: MandatoryField, index: number): string {
    const baseClasses = "w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const isRequired = field.isRequired;
    const isConditionallyEditable = field.isConditionallyEditable;
    
    // Handle conditional editability styling
    let requiredBadge = '';
    let fieldClasses = baseClasses;
    let conditionalInfo = '';
    
    if (isRequired) {
      requiredBadge = '<span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-1">Required</span>';
    } else if (isConditionallyEditable) {
      requiredBadge = '<span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 ml-1">Conditional</span>';
      fieldClasses += ' opacity-60'; // Initially dimmed
      conditionalInfo = `<p class="text-xs text-yellow-600 mt-1">⚡ Becomes editable when conditions are met</p>`;
    } else {
      requiredBadge = '<span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 ml-1">Optional</span>';
    }
    
    const requiredAttr = isRequired ? 'required' : '';
    const conditionalAttr = isConditionallyEditable ? 'data-conditional="true"' : '';
    const conditionalRulesAttr = isConditionallyEditable && field.conditionalRules 
      ? `data-conditional-rules='${JSON.stringify(field.conditionalRules)}'`
      : '';
    
    // Initial disabled state for conditional fields
    const disabledAttr = isConditionallyEditable ? 'disabled' : '';
    
    // Get default value
    const defaultValue = field.currentValue || this.getDefaultValue(field.fieldName, field.fieldType) || '';
    
    // Get field description
    const description = this.getFieldDescription(field);
    
    // Get field icon based on type
    const fieldIcon = this.getFieldIcon(field.fieldType);
    
    switch (field.fieldType) {
      case 'date':
        return `
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <label for="field_${index}" class="block text-sm font-semibold text-gray-700 mb-1">
              ${fieldIcon} ${field.fieldLabel} ${requiredBadge}
            </label>
            <input 
              type="date" 
              id="field_${index}" 
              name="${field.fieldName}"
              class="${fieldClasses}"
              min="${this.getMinDate()}"
              value="${defaultValue}"
              ${requiredAttr}
              ${disabledAttr}
              ${conditionalAttr}
              ${conditionalRulesAttr}
            />
            <p class="text-xs text-gray-500 mt-1 truncate" title="${description}">${description}</p>
            ${conditionalInfo}
          </div>
        `;
        
      case 'dropdown':
        const options = field.optionsList || [];
        const optionsHTML = options.map(option => {
          const selected = option === defaultValue ? 'selected' : '';
          return `<option value="${option}" ${selected}>${option}</option>`;
        }).join('');
        
        return `
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <label for="field_${index}" class="block text-sm font-semibold text-gray-700 mb-1">
              ${fieldIcon} ${field.fieldLabel} ${requiredBadge}
            </label>
            <select 
              id="field_${index}" 
              name="${field.fieldName}"
              class="${fieldClasses}"
              ${requiredAttr}
              ${disabledAttr}
              ${conditionalAttr}
              ${conditionalRulesAttr}
              onchange="MandatoryFieldManager.handleConditionalFieldChange(this)"
            >
              <option value="">Select option...</option>
              ${optionsHTML}
            </select>
            <p class="text-xs text-gray-500 mt-1 truncate" title="${description}">${description}</p>
            ${conditionalInfo}
          </div>
        `;
        
      case 'textarea':
        return `
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 lg:col-span-2">
            <label for="field_${index}" class="block text-sm font-semibold text-gray-700 mb-1">
              ${fieldIcon} ${field.fieldLabel} ${requiredBadge}
            </label>
            <textarea 
              id="field_${index}" 
              name="${field.fieldName}"
              class="${fieldClasses}"
              rows="3"
              placeholder="Enter ${field.fieldLabel.toLowerCase()}..."
              ${requiredAttr}
              ${disabledAttr}
              ${conditionalAttr}
              ${conditionalRulesAttr}
            >${defaultValue}</textarea>
            <p class="text-xs text-gray-500 mt-1" title="${description}">${description}</p>
            ${conditionalInfo}
          </div>
        `;
        
      case 'checkbox':
        const checked = defaultValue === 'true' || defaultValue === 'yes' ? 'checked' : '';
        return `
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div class="flex items-start">
              <input 
                type="checkbox" 
                id="field_${index}" 
                name="${field.fieldName}"
                value="true"
                class="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                ${checked}
                ${disabledAttr}
                ${conditionalAttr}
                ${conditionalRulesAttr}
              />
              <div class="ml-2">
                <label for="field_${index}" class="block text-sm font-semibold text-gray-700">
                  ${fieldIcon} ${field.fieldLabel} ${requiredBadge}
                </label>
                <p class="text-xs text-gray-500 mt-1 truncate" title="${description}">${description}</p>
                ${conditionalInfo}
              </div>
            </div>
          </div>
        `;
        
      case 'number':
        return `
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <label for="field_${index}" class="block text-sm font-semibold text-gray-700 mb-1">
              ${fieldIcon} ${field.fieldLabel} ${requiredBadge}
            </label>
            <input 
              type="number" 
              id="field_${index}" 
              name="${field.fieldName}"
              class="${fieldClasses}"
              placeholder="Enter number..."
              value="${defaultValue}"
              ${requiredAttr}
              ${disabledAttr}
              ${conditionalAttr}
              ${conditionalRulesAttr}
            />
            <p class="text-xs text-gray-500 mt-1 truncate" title="${description}">${description}</p>
            ${conditionalInfo}
          </div>
        `;
        
      default: // text input
        return `
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <label for="field_${index}" class="block text-sm font-semibold text-gray-700 mb-1">
              ${fieldIcon} ${field.fieldLabel} ${requiredBadge}
            </label>
            <input 
              type="text" 
              id="field_${index}" 
              name="${field.fieldName}"
              class="${fieldClasses}"
              placeholder="Enter ${field.fieldLabel.toLowerCase()}..."
              value="${defaultValue}"
              ${requiredAttr}
              ${disabledAttr}
              ${conditionalAttr}
              ${conditionalRulesAttr}
            />
            <p class="text-xs text-gray-500 mt-1 truncate" title="${description}">${description}</p>
            ${conditionalInfo}
          </div>
        `;
    }
  }

  /**
   * Gets appropriate icon for field type
   */
  private static getFieldIcon(fieldType: string): string {
    const icons: Record<string, string> = {
      'date': '📅',
      'dropdown': '📋',
      'textarea': '📝',
      'checkbox': '☑️',
      'number': '🔢',
      'text': '✏️'
    };
    
    return icons[fieldType] || '✏️';
  }

  /**
   * Generates appropriate HTML input for different field types
   */
  private static generateFieldInput(field: MandatoryField, index: number): string {
    const baseClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const isRequired = field.isRequired;
    const requiredText = isRequired ? ' <span class="text-red-500">*</span>' : ' <span class="text-gray-400">(optional)</span>';
    const requiredAttr = isRequired ? 'required' : '';
    
    // Get default value
    const defaultValue = field.currentValue || this.getDefaultValue(field.fieldName, field.fieldType) || '';
    
    // Get field description
    const description = this.getFieldDescription(field);
    
    switch (field.fieldType) {
      case 'date':
        return `
          <div class="form-group">
            <label for="field_${index}" class="block text-sm font-semibold text-gray-700 mb-2">
              📅 ${field.fieldLabel}${requiredText}
            </label>
            <input 
              type="date" 
              id="field_${index}" 
              name="${field.fieldName}"
              class="${baseClasses}"
              min="${this.getMinDate()}"
              value="${defaultValue}"
              ${requiredAttr}
            />
            <p class="text-xs text-gray-500 mt-1">${description}</p>
          </div>
        `;
        
      case 'dropdown':
        const options = field.optionsList || [];
        const optionsHTML = options.map(option => {
          const selected = option === defaultValue ? 'selected' : '';
          return `<option value="${option}" ${selected}>${option}</option>`;
        }).join('');
        
        return `
          <div class="form-group">
            <label for="field_${index}" class="block text-sm font-semibold text-gray-700 mb-2">
              📋 ${field.fieldLabel}${requiredText}
            </label>
            <select 
              id="field_${index}" 
              name="${field.fieldName}"
              class="${baseClasses}"
              ${requiredAttr}
            >
              <option value="">Select ${field.fieldLabel.toLowerCase()}...</option>
              ${optionsHTML}
            </select>
            <p class="text-xs text-gray-500 mt-1">${description}</p>
          </div>
        `;
        
      case 'textarea':
        return `
          <div class="form-group">
            <label for="field_${index}" class="block text-sm font-semibold text-gray-700 mb-2">
              📝 ${field.fieldLabel}${requiredText}
            </label>
            <textarea 
              id="field_${index}" 
              name="${field.fieldName}"
              class="${baseClasses}"
              rows="4"
              placeholder="Enter ${field.fieldLabel.toLowerCase()}..."
              ${requiredAttr}
            >${defaultValue}</textarea>
            <p class="text-xs text-gray-500 mt-1">${description}</p>
          </div>
        `;
        
      case 'checkbox':
        const checked = defaultValue === 'true' || defaultValue === 'yes' ? 'checked' : '';
        return `
          <div class="form-group">
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="field_${index}" 
                name="${field.fieldName}"
                value="true"
                class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                ${checked}
              />
              <label for="field_${index}" class="ml-2 block text-sm font-semibold text-gray-700">
                ☑️ ${field.fieldLabel}${requiredText}
              </label>
            </div>
            <p class="text-xs text-gray-500 mt-1 ml-6">${description}</p>
          </div>
        `;
        
      case 'number':
        return `
          <div class="form-group">
            <label for="field_${index}" class="block text-sm font-semibold text-gray-700 mb-2">
              🔢 ${field.fieldLabel}${requiredText}
            </label>
            <input 
              type="number" 
              id="field_${index}" 
              name="${field.fieldName}"
              class="${baseClasses}"
              placeholder="Enter ${field.fieldLabel.toLowerCase()}..."
              value="${defaultValue}"
              ${requiredAttr}
            />
            <p class="text-xs text-gray-500 mt-1">${description}</p>
          </div>
        `;
        
      default: // text input
        return `
          <div class="form-group">
            <label for="field_${index}" class="block text-sm font-semibold text-gray-700 mb-2">
              ✏️ ${field.fieldLabel}${requiredText}
            </label>
            <input 
              type="text" 
              id="field_${index}" 
              name="${field.fieldName}"
              class="${baseClasses}"
              placeholder="Enter ${field.fieldLabel.toLowerCase()}..."
              value="${defaultValue}"
              ${requiredAttr}
            />
            <p class="text-xs text-gray-500 mt-1">${description}</p>
          </div>
        `;
    }
  }

  /**
   * Gets the minimum date for date inputs (today)
   */
  private static getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  /**
   * Updates task parameters with user-provided values
   */
  private static updateTaskParameters(
    taskDetails: TaskDetails, 
    userInputs: Record<string, string>
  ): void {
    console.log(`🔄 Updating task parameters with ${Object.keys(userInputs).length} field values...`);
    
    let updatedCount = 0;
    let notFoundCount = 0;
    
    Object.entries(userInputs).forEach(([fieldName, value]) => {
      const param = taskDetails.taskInstParamRequestList.find(
        p => p.name === fieldName
      );
      
      if (param) {
        const oldValue = param.value;
        param.value = value;
        updatedCount++;
        console.log(`  ✅ Updated ${fieldName}: "${oldValue}" → "${value}"`);
      } else {
        notFoundCount++;
        console.log(`  ⚠️ Parameter not found in task: ${fieldName} = "${value}"`);
      }
    });
    
    console.log(`📊 Task parameter update summary: ${updatedCount} updated, ${notFoundCount} not found`);
    
    // Log final task parameters for verification
    const finalParams = taskDetails.taskInstParamRequestList
      .filter(p => p.value && p.value.trim())
      .map(p => `${p.name}="${p.value}"`)
      .join(', ');
    console.log(`📋 Final task parameters with values: ${finalParams}`);
  }

  /**
   * Handles conditional field visibility and editability based on other field values
   * This method is called when dropdown fields that control other fields change
   */
  static handleConditionalFieldChange(changedElement: HTMLSelectElement): void {
    const fieldName = changedElement.name;
    const selectedValue = changedElement.value;
    
    console.log(`🔄 Conditional field change: ${fieldName} = "${selectedValue}"`);
    
    // Find all conditional fields that depend on this field
    const conditionalFields = document.querySelectorAll('[data-conditional="true"]');
    
    conditionalFields.forEach((field: Element) => {
      const htmlField = field as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      const rulesAttr = htmlField.getAttribute('data-conditional-rules');
      
      if (rulesAttr) {
        try {
          const rules = JSON.parse(rulesAttr);
          
          // Check if this field depends on the changed field
          if (rules[fieldName]) {
            const enableValues = rules[fieldName] as string[];
            const shouldEnable = enableValues.includes(selectedValue);
            
            console.log(`  🎯 Checking conditional field ${htmlField.name}: enableOn=[${enableValues.join(', ')}], currentValue="${selectedValue}", shouldEnable=${shouldEnable}`);
            
            // Enable/disable the field
            htmlField.disabled = !shouldEnable;
            
            // Update styling
            const parentDiv = htmlField.closest('.bg-gray-50');
            if (parentDiv) {
              if (shouldEnable) {
                htmlField.classList.remove('opacity-60');
                htmlField.classList.add('opacity-100');
                parentDiv.classList.remove('opacity-60');
                parentDiv.classList.add('opacity-100');
                console.log(`    ✅ Enabled field: ${htmlField.name}`);
              } else {
                htmlField.classList.add('opacity-60');
                htmlField.classList.remove('opacity-100');
                parentDiv.classList.add('opacity-60');
                parentDiv.classList.remove('opacity-100');
                htmlField.value = ''; // Clear value when disabled
                console.log(`    🔒 Disabled field: ${htmlField.name}`);
              }
            }
          }
        } catch (error) {
          console.error(`💥 Error parsing conditional rules for field ${htmlField.name}:`, error);
        }
      }
    });
  }
}

// Expose the conditional field handler globally for HTML onchange events
if (typeof window !== 'undefined') {
  (window as any).MandatoryFieldManager = MandatoryFieldManager;
}
