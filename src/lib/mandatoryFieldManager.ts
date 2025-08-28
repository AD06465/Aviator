import { 
  TaskDetails, 
  TaskParameter, 
  TaskField, 
  MandatoryFieldResult, 
  UserFieldInput 
} from '@/types';
import { getTaskFieldValue } from './taskConfig';

export interface MandatoryField {
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  currentValue: string | null;
  isRequired: boolean;
  isEditable: boolean;
  hasValue: boolean;
  optionsList?: string[];
}

export interface MandatoryFieldsAnalysis {
  taskId: string;
  taskName: string;
  totalMandatoryFields: number;
  missingFields: MandatoryField[];
  providedFields: MandatoryField[];
  canProceed: boolean;
  needsUserInput: boolean;
}

export class MandatoryFieldManager {
  /**
   * Analyzes a task to identify all mandatory fields and their current state
   */
  static analyzeMandatoryFields(taskDetails: TaskDetails): MandatoryFieldsAnalysis {
    const mandatoryFields: MandatoryField[] = [];
    const missingFields: MandatoryField[] = [];
    const providedFields: MandatoryField[] = [];

    // Extract mandatory fields from taskInstParamRequestList
    if (taskDetails.taskInstParamRequestList) {
      taskDetails.taskInstParamRequestList.forEach((param: TaskParameter) => {
        const descriptor = param.jsonDescriptorObject;
        
        // Check if field is required and editable
        if (descriptor?.required && descriptor?.editable) {
          const fieldTypeInfo = this.getFieldType(param, descriptor);
          
          const fieldInfo: MandatoryField = {
            fieldName: param.name,
            fieldLabel: descriptor.label || param.name,
            fieldType: fieldTypeInfo.type,
            currentValue: param.value,
            isRequired: true,
            isEditable: true,
            hasValue: this.hasValidValue(param.value),
            optionsList: fieldTypeInfo.options || descriptor.optionsList || undefined
          };

          mandatoryFields.push(fieldInfo);

          if (fieldInfo.hasValue) {
            providedFields.push(fieldInfo);
          } else {
            missingFields.push(fieldInfo);
          }
        }
      });
    }

    return {
      taskId: taskDetails.id,
      taskName: taskDetails.taskName,
      totalMandatoryFields: mandatoryFields.length,
      missingFields,
      providedFields,
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
    
    if (paramType === 'date' || paramType === 'isodate' || descriptorType === 'date') {
      return { type: 'date' };
    }
    
    if (paramType === 'dropdown' || descriptor?.optionsList?.length > 0) {
      const options = descriptor?.optionsList || [];
      return { type: 'dropdown', options };
    }
    
    if (paramType === 'textarea') {
      return { type: 'textarea' };
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
      'SFP_Required': 'No'
    };

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
      'capacityOverride': 'Override capacity limitations'
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
   * Simple method to check if task has missing mandatory fields
   */
  static async checkMissingValues(taskDetails: TaskDetails): Promise<boolean> {
    console.log(`🔍 MandatoryFieldManager: Analyzing task "${taskDetails.taskName}" for mandatory fields...`);
    
    const analysis = this.analyzeMandatoryFields(taskDetails);
    
    console.log(`📊 Mandatory field analysis for "${taskDetails.taskName}":`, {
      totalMandatoryFields: analysis.totalMandatoryFields,
      missingFields: analysis.missingFields.length,
      providedFields: analysis.providedFields.length,
      canProceed: analysis.canProceed,
      needsUserInput: analysis.needsUserInput
    });
    
    if (analysis.missingFields.length > 0) {
      console.log(`❌ Missing mandatory fields for "${taskDetails.taskName}":`, 
        analysis.missingFields.map(f => `${f.fieldLabel} (${f.fieldName})`));
    }
    
    if (analysis.canProceed) {
      console.log(`✅ Task "${taskDetails.taskName}" has all mandatory fields - can proceed`);
      return true; // No missing fields, can proceed
    }

    console.log(`🚨 Task "${taskDetails.taskName}" needs user input for ${analysis.missingFields.length} mandatory fields`);
    
    // Show popup to user for missing mandatory fields
    try {
      console.log(`🔧 Showing modal popup for mandatory fields...`);
      const userInputs = await this.promptUserForInput(analysis.missingFields, taskDetails);
      
      if (!userInputs || Object.keys(userInputs).length === 0) {
        console.log(`❌ User cancelled mandatory field input or provided no values`);
        return false; // User cancelled or provided no input
      }

      console.log(`✅ User provided values for mandatory fields:`, Object.keys(userInputs));
      
      // Update task parameters with user-provided values
      this.updateTaskParameters(taskDetails, userInputs);
      
      console.log(`🔄 Updated task parameters with user input`);
      return true;
    } catch (error) {
      console.error(`💥 Error in mandatory field modal:`, error);
      return false;
    }
  }

  /**
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
    console.log(`🎨 Creating modal HTML for task "${taskDetails.taskName}"...`);
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-96 overflow-y-auto shadow-xl';
    
    console.log(`📋 Missing fields to display:`, missingFields.map(f => `${f.fieldLabel} (${f.fieldType})`));
    
    // Generate field inputs based on field type
    const fieldInputsHTML = missingFields.map((field, index) => {
      return this.generateFieldInput(field, index);
    }).join('');
    
    modalContent.innerHTML = `
      <div class="mb-6">
        <h3 class="text-xl font-bold text-gray-900 mb-2">⚠️ Mandatory Fields Required</h3>
        <p class="text-sm text-gray-600">
          Task "${taskDetails.taskName}" requires values for the following fields before it can be completed:
        </p>
      </div>
      
      <form id="mandatoryFieldsForm" class="space-y-6">
        ${fieldInputsHTML}
        
        <div class="flex justify-end space-x-4 mt-8 pt-4 border-t">
          <button 
            type="button" 
            id="cancelBtn" 
            class="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue
          </button>
        </div>
      </form>
    `;
    
    modal.appendChild(modalContent);

    // Handle form submission
    const form = modalContent.querySelector('#mandatoryFieldsForm') as HTMLFormElement;
    const cancelBtn = modalContent.querySelector('#cancelBtn') as HTMLButtonElement;

    console.log(`🔧 Setting up modal event listeners...`);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      console.log(`📤 Form submitted - collecting user input...`);
      
      const formData = new FormData(form);
      const inputs: Record<string, string> = {};
      
      missingFields.forEach((field) => {
        const value = formData.get(field.fieldName) as string;
        if (value && value.trim()) {
          inputs[field.fieldName] = value.trim();
          console.log(`  ✅ Got value for ${field.fieldName}: "${value.trim()}"`);
        } else {
          console.log(`  ⚠️ No value provided for ${field.fieldName}`);
        }
      });
      
      console.log(`🗑️ Removing modal from DOM...`);
      document.body.removeChild(modal);
      
      console.log(`✅ Returning user inputs:`, inputs);
      onComplete(inputs);
    });

    cancelBtn.addEventListener('click', () => {
      console.log(`❌ User cancelled mandatory field input`);
      document.body.removeChild(modal);
      onComplete(null);
    });

    console.log(`✅ Modal created successfully with ${missingFields.length} input fields`);
    return modal;
  }

  /**
   * Generates appropriate HTML input for different field types
   */
  private static generateFieldInput(field: MandatoryField, index: number): string {
    const baseClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    
    switch (field.fieldType) {
      case 'date':
        return `
          <div class="form-group">
            <label for="field_${index}" class="block text-sm font-semibold text-gray-700 mb-2">
              📅 ${field.fieldLabel} <span class="text-red-500">*</span>
            </label>
            <input 
              type="date" 
              id="field_${index}" 
              name="${field.fieldName}"
              class="${baseClasses}"
              min="${this.getMinDate()}"
              required
            />
            <p class="text-xs text-gray-500 mt-1">Select a date for ${field.fieldLabel.toLowerCase()}</p>
          </div>
        `;
        
      case 'dropdown':
        const options = field.optionsList || [];
        const optionsHTML = options.map(option => 
          `<option value="${option}">${option}</option>`
        ).join('');
        
        return `
          <div class="form-group">
            <label for="field_${index}" class="block text-sm font-semibold text-gray-700 mb-2">
              📋 ${field.fieldLabel} <span class="text-red-500">*</span>
            </label>
            <select 
              id="field_${index}" 
              name="${field.fieldName}"
              class="${baseClasses}"
              required
            >
              <option value="">Select ${field.fieldLabel.toLowerCase()}...</option>
              ${optionsHTML}
            </select>
            <p class="text-xs text-gray-500 mt-1">Choose an option for ${field.fieldLabel.toLowerCase()}</p>
          </div>
        `;
        
      case 'textarea':
        return `
          <div class="form-group">
            <label for="field_${index}" class="block text-sm font-semibold text-gray-700 mb-2">
              📝 ${field.fieldLabel} <span class="text-red-500">*</span>
            </label>
            <textarea 
              id="field_${index}" 
              name="${field.fieldName}"
              class="${baseClasses}"
              rows="4"
              placeholder="Enter ${field.fieldLabel.toLowerCase()}..."
              required
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">Enter detailed information for ${field.fieldLabel.toLowerCase()}</p>
          </div>
        `;
        
      default: // text input
        return `
          <div class="form-group">
            <label for="field_${index}" class="block text-sm font-semibold text-gray-700 mb-2">
              ✏️ ${field.fieldLabel} <span class="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              id="field_${index}" 
              name="${field.fieldName}"
              class="${baseClasses}"
              placeholder="Enter ${field.fieldLabel.toLowerCase()}..."
              required
            />
            <p class="text-xs text-gray-500 mt-1">Field: ${field.fieldName}</p>
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
    Object.entries(userInputs).forEach(([fieldName, value]) => {
      const param = taskDetails.taskInstParamRequestList.find(
        p => p.name === fieldName
      );
      
      if (param) {
        param.value = value;
      }
    });
  }
}
