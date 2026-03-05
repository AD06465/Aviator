'use client';
// Version: 2.0.0 - Full conditional rules support

import React, { useState, useEffect, useRef } from 'react';
import { logger } from '@/services/logging';
import { TaskSequencingManager } from './TaskSequencingManager';
import { TaskManagementConfig } from '../types';

// Predefined workflow types
const WORKFLOW_OPTIONS = [
  'Monarch Onnet',
  'Monarch Offnet',
  'Colorless',
];

// Predefined order types
const ORDER_TYPE_OPTIONS = [
  'ADD',
  'CHANGE',
  'DISCONNECT',
];

// Default custom attributes
const DEFAULT_ITENTIAL_WORKFLOWS: string[] = ['Monarch Onnet', 'Monarch Offnet', 'Colorless'];
const DEFAULT_PRODUCT_NAMES: string[] = ['DIA', 'ELINE', 'ELAN', 'ELYNK', 'IPVPN', 'UNI'];

export interface TaskFieldMapping {
  fieldName: string;
  fieldValue: string;
  fieldType?: 'text' | 'dropdown' | 'date' | 'radio' | 'checkbox';
  dropdownValue?: string;
  optionsList?: string[]; // For radio buttons
}

export interface ConditionalRule {
  id: string;
  conditionType: 'workflow' | 'orderType' | 'itentialWorkflow' | 'productName' | 'custom';
  conditionValue: string;
  fields: TaskFieldMapping[];
}

export interface TaskConfiguration {
  taskName: string;
  isCompletable: boolean;
  isRetryable: boolean;
  fields: TaskFieldMapping[];
  conditionalRules?: ConditionalRule[];
}

interface TaskConfigTableProps {
  onConfigChange?: (tasks: TaskConfiguration[]) => void;
}

const TaskConfigTable: React.FC<TaskConfigTableProps> = ({ onConfigChange }) => {
  const [tasks, setTasks] = useState<TaskConfiguration[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);
  const [newTask, setNewTask] = useState<TaskConfiguration>({
    taskName: '',
    isCompletable: true,
    isRetryable: false,
    fields: [],
  });
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'dropdown' | 'date' | 'radio' | 'checkbox'>('text');
  const [newDropdownValue, setNewDropdownValue] = useState('');
  const [newFieldRadioOptions, setNewFieldRadioOptions] = useState<string[]>([]);
  const [newFieldRadioOptionInput, setNewFieldRadioOptionInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const [editFieldType, setEditFieldType] = useState<'text' | 'dropdown' | 'date' | 'radio' | 'checkbox'>('text');
  const [editFieldName, setEditFieldName] = useState('');
  const [editFieldValue, setEditFieldValue] = useState('');
  const [editDropdownValue, setEditDropdownValue] = useState('');
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  const [editRadioOptions, setEditRadioOptions] = useState<string[]>([]);
  const [editRadioOptionInput, setEditRadioOptionInput] = useState('');

  const [showConditionalRules, setShowConditionalRules] = useState<number | null>(null);
  const [newRuleConditionType, setNewRuleConditionType] = useState<'workflow' | 'orderType' | 'itentialWorkflow' | 'productName' | 'custom'>('workflow');
  const [newRuleConditionValue, setNewRuleConditionValue] = useState('');
  const [newRuleFields, setNewRuleFields] = useState<TaskFieldMapping[]>([]);
  const [newRuleFieldName, setNewRuleFieldName] = useState('');
  const [newRuleFieldValue, setNewRuleFieldValue] = useState('');
  const [newRuleFieldType, setNewRuleFieldType] = useState<'text' | 'dropdown' | 'date' | 'radio' | 'checkbox'>('text');
  const [newRuleDropdownValue, setNewRuleDropdownValue] = useState('');
  const [newRuleRadioOptions, setNewRuleRadioOptions] = useState<string[]>([]);
  const [newRuleRadioOptionInput, setNewRuleRadioOptionInput] = useState('');

  // Custom attribute management
  const [itentialWorkflows, setItentialWorkflows] = useState<string[]>(DEFAULT_ITENTIAL_WORKFLOWS);
  const [productNames, setProductNames] = useState<string[]>(DEFAULT_PRODUCT_NAMES);
  const [showAttributeManager, setShowAttributeManager] = useState(false);
  const [newItentialWorkflow, setNewItentialWorkflow] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [activeTab, setActiveTab] = useState<'tasks' | 'sequencing'>('tasks');
  const [sequencingVersion, setSequencingVersion] = useState(0); // Force re-render for sequencing changes
  
  // Ref to prevent saveTasksToStorage from running during sequencing updates
  const isSequencingUpdate = useRef(false);

  // Get current date in YYYY-MM-DD format for date field examples
  const getCurrentDateExample = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    loadTasksFromStorage();
    loadCustomAttributes();
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!isInitialLoad && tasks.length >= 0) {
      saveTasksToStorage();
      // onConfigChange removed - TaskConfigTable manages its own localStorage
      // to prevent ConfigContext from overwriting conditionalRules
    }
  }, [tasks, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad) {
      saveCustomAttributes();
    }
  }, [itentialWorkflows, productNames, isInitialLoad]);

  const loadTasksFromStorage = () => {
    try {
      const stored = localStorage.getItem('aviator-task-config');
      if (stored) {
        const config = JSON.parse(stored);
        const taskConfigs: TaskConfiguration[] = [];
        const processedTasks = new Set<string>();

        console.log('📥 Loading config from localStorage:', {
          hasConditionalRules: !!config.conditionalRules,
          conditionalRulesKeys: Object.keys(config.conditionalRules || {}),
          conditionalRulesData: config.conditionalRules
        });

        // Load completable tasks
        if (config.completableTasks) {
          config.completableTasks.forEach((taskName: string) => {
            processedTasks.add(taskName);
            const rules = config.conditionalRules?.[taskName] || [];
            console.log(`📋 Loading task "${taskName}":`, {
              hasRules: rules.length > 0,
              rulesCount: rules.length,
              rules: rules
            });
            taskConfigs.push({
              taskName,
              isCompletable: true,
              isRetryable: config.retryableTasks?.includes(taskName) || false,
              fields: Object.entries(config.taskFieldMappings?.[taskName] || {}).map(
                ([fieldName, fieldValue]: [string, any]) => {
                  if (typeof fieldValue === 'object' && fieldValue.fieldType === 'dropdown') {
                    return {
                      fieldName,
                      fieldValue: fieldValue.fieldValue,
                      fieldType: 'dropdown' as const,
                      dropdownValue: fieldValue.dropdownValue
                    };
                  }
                  return {
                    fieldName,
                    fieldValue: String(fieldValue),
                    fieldType: 'text' as const
                  };
                }
              ),
              conditionalRules: rules,
            });
          });
        }

        // Load retryable tasks (that aren't already processed)
        if (config.retryableTasks) {
          config.retryableTasks.forEach((taskName: string) => {
            if (!processedTasks.has(taskName)) {
              processedTasks.add(taskName);
              taskConfigs.push({
                taskName,
                isCompletable: false,
                isRetryable: true,
                fields: Object.entries(config.taskFieldMappings?.[taskName] || {}).map(
                  ([fieldName, fieldValue]: [string, any]) => {
                    if (typeof fieldValue === 'object' && fieldValue.fieldType === 'dropdown') {
                      return {
                        fieldName,
                        fieldValue: fieldValue.fieldValue,
                        fieldType: 'dropdown' as const,
                        dropdownValue: fieldValue.dropdownValue
                      };
                    }
                    return {
                      fieldName,
                      fieldValue: String(fieldValue),
                      fieldType: 'text' as const
                    };
                  }
                ),
                conditionalRules: config.conditionalRules?.[taskName] || [],
              });
            }
          });
        }

        // Load any tasks that have conditional rules but aren't in completable/retryable lists
        if (config.conditionalRules) {
          Object.keys(config.conditionalRules).forEach((taskName: string) => {
            if (!processedTasks.has(taskName)) {
              processedTasks.add(taskName);
              taskConfigs.push({
                taskName,
                isCompletable: false,
                isRetryable: false,
                fields: Object.entries(config.taskFieldMappings?.[taskName] || {}).map(
                  ([fieldName, fieldValue]: [string, any]) => {
                    if (typeof fieldValue === 'object' && fieldValue.fieldType === 'dropdown') {
                      return {
                        fieldName,
                        fieldValue: fieldValue.fieldValue,
                        fieldType: 'dropdown' as const,
                        dropdownValue: fieldValue.dropdownValue
                      };
                    }
                    return {
                      fieldName,
                      fieldValue: String(fieldValue),
                      fieldType: 'text' as const
                    };
                  }
                ),
                conditionalRules: config.conditionalRules[taskName] || [],
              });
            }
          });
        }

        setTasks(taskConfigs);
        logger.info('Task configuration loaded', {
          component: 'TaskConfigTable',
          taskCount: taskConfigs.length,
          tasksWithRules: Object.keys(config.conditionalRules || {}).length,
        });
      }
    } catch (error) {
      logger.error('Failed to load task configuration', {
        component: 'TaskConfigTable',
      }, error as Error);
    }
  };

  const saveTasksToStorage = () => {
    console.log('🚀 saveTasksToStorage called. isSequencingUpdate flag:', isSequencingUpdate.current);
    
    // Skip if we're in the middle of a sequencing update to prevent race condition
    if (isSequencingUpdate.current) {
      console.log('⏭️ Skipping saveTasksToStorage during sequencing update');
      return;
    }

    try {
      // Load existing config to preserve taskSequencing
      const existingConfig = localStorage.getItem('aviator-task-config');
      let existingTaskSequencing = {};
      if (existingConfig) {
        try {
          const parsed = JSON.parse(existingConfig);
          existingTaskSequencing = parsed.taskSequencing || {};
          console.log('🔄 Preserving existing taskSequencing:', Object.keys(existingTaskSequencing));
        } catch (e) {
          console.error('Error parsing existing config:', e);
        }
      }

      const config = {
        completableTasks: tasks.filter(t => t.isCompletable).map(t => t.taskName),
        retryableTasks: tasks.filter(t => t.isRetryable).map(t => t.taskName),
        taskFieldMappings: tasks.reduce((acc, task) => {
          if (task.fields.length > 0) {
            acc[task.taskName] = task.fields.reduce((fieldAcc, field) => {
              if (field.fieldType === 'dropdown') {
                fieldAcc[field.fieldName] = {
                  fieldValue: field.fieldValue,
                  fieldType: field.fieldType,
                  dropdownValue: field.dropdownValue || field.fieldValue
                };
              } else {
                fieldAcc[field.fieldName] = field.fieldValue;
              }
              return fieldAcc;
            }, {} as Record<string, any>);
          }
          return acc;
        }, {} as Record<string, Record<string, any>>),
        conditionalRules: tasks.reduce((acc, task) => {
          if (task.conditionalRules && task.conditionalRules.length > 0) {
            acc[task.taskName] = task.conditionalRules;
          }
          return acc;
        }, {} as Record<string, ConditionalRule[]>),
        taskSequencing: existingTaskSequencing, // ← PRESERVE EXISTING TASK SEQUENCING
      };

      console.log('💾 Saving task configuration:', {
        totalTasks: tasks.length,
        tasksWithRules: Object.keys(config.conditionalRules).length,
        rulesData: config.conditionalRules,
        hasTaskSequencing: Object.keys(existingTaskSequencing).length > 0,
        taskSequencingKeys: Object.keys(existingTaskSequencing)
      });

      localStorage.setItem('aviator-task-config', JSON.stringify(config));
      logger.info('Task configuration saved', {
        component: 'TaskConfigTable',
        taskCount: tasks.length,
        tasksWithRules: Object.keys(config.conditionalRules).length,
      });
    } catch (error) {
      console.error('❌ Failed to save task configuration:', error);
      logger.error('Failed to save task configuration', {
        component: 'TaskConfigTable',
      }, error as Error);
    }
  };

  const loadCustomAttributes = () => {
    try {
      const stored = localStorage.getItem('aviator-custom-attributes');
      if (stored) {
        const data = JSON.parse(stored);
        setItentialWorkflows(data.itentialWorkflows || DEFAULT_ITENTIAL_WORKFLOWS);
        setProductNames(data.productNames || DEFAULT_PRODUCT_NAMES);
      }
    } catch (error) {
      logger.error('Failed to load custom attributes', { component: 'TaskConfigTable' }, error as Error);
    }
  };

  const saveCustomAttributes = () => {
    try {
      const data = {
        itentialWorkflows,
        productNames,
      };
      localStorage.setItem('aviator-custom-attributes', JSON.stringify(data));
      
      // Trigger storage event for other components to pick up changes
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'aviator-custom-attributes',
        newValue: JSON.stringify(data),
      }));
    } catch (error) {
      logger.error('Failed to save custom attributes', { component: 'TaskConfigTable' }, error as Error);
    }
  };

  const handleAddItentialWorkflow = () => {
    if (!newItentialWorkflow.trim()) {
      alert('Please enter an Itential Workflow Name');
      return;
    }
    if (itentialWorkflows.includes(newItentialWorkflow.trim())) {
      alert('This workflow name already exists');
      return;
    }
    setItentialWorkflows([...itentialWorkflows, newItentialWorkflow.trim()]);
    setNewItentialWorkflow('');
  };

  const handleDeleteItentialWorkflow = (workflow: string) => {
    setItentialWorkflows(itentialWorkflows.filter(w => w !== workflow));
  };

  const handleAddProductName = () => {
    if (!newProductName.trim()) {
      alert('Please enter a Product Name');
      return;
    }
    if (productNames.includes(newProductName.trim())) {
      alert('This product name already exists');
      return;
    }
    setProductNames([...productNames, newProductName.trim()]);
    setNewProductName('');
  };

  const handleDeleteProductName = (product: string) => {
    setProductNames(productNames.filter(p => p !== product));
  };

  const handleAddTask = () => {
    if (!newTask.taskName.trim()) {
      alert('Please enter a task name');
      return;
    }

    if (tasks.some(t => t.taskName === newTask.taskName)) {
      alert('A task with this name already exists');
      return;
    }

    setTasks([...tasks, { ...newTask }]);
    setNewTask({
      taskName: '',
      isCompletable: true,
      isRetryable: false,
      fields: [],
    });
    setIsAddingTask(false);
  };

  const handleDeleteTask = (index: number) => {
    const taskName = tasks[index].taskName;
    if (confirm(`Are you sure you want to delete "${taskName}"?`)) {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };

  const handleUpdateTask = (index: number, updates: Partial<TaskConfiguration>) => {
    setTasks(tasks.map((task, i) => (i === index ? { ...task, ...updates } : task)));
  };

  const handleAddField = (taskIndex: number) => {
    if (!newFieldName.trim() || !newFieldValue.trim()) {
      alert('Please enter both field name and value');
      return;
    }

    // Validate radio button has options
    if (newFieldType === 'radio' && newFieldRadioOptions.length === 0) {
      alert('Please add at least one option for the radio button');
      return;
    }

    const updatedTask = { ...tasks[taskIndex] };
    if (updatedTask.fields.some(f => f.fieldName === newFieldName)) {
      alert('A field with this name already exists for this task');
      return;
    }

    const newField: TaskFieldMapping = {
      fieldName: newFieldName,
      fieldValue: newFieldValue,
      fieldType: newFieldType,
    };
    
    if (newFieldType === 'dropdown' && newDropdownValue) {
      newField.dropdownValue = newDropdownValue;
    }

    if (newFieldType === 'radio' && newFieldRadioOptions.length > 0) {
      newField.optionsList = newFieldRadioOptions;
    }

    updatedTask.fields.push(newField);
    handleUpdateTask(taskIndex, updatedTask);
    setNewFieldName('');
    setNewFieldValue('');
    setNewDropdownValue('');
    setNewFieldType('text');
    setNewFieldRadioOptions([]);
    setNewFieldRadioOptionInput('');
  };

  const handleEditField = (taskIndex: number, fieldIndex: number) => {
    const field = tasks[taskIndex].fields[fieldIndex];
    setEditFieldName(field.fieldName);
    setEditFieldValue(field.fieldValue);
    setEditFieldType(field.fieldType || 'text');
    setEditDropdownValue(field.dropdownValue || '');
    setEditRadioOptions(field.optionsList || []);
    setEditRadioOptionInput('');
    setEditingFieldIndex(fieldIndex);
  };

  const handleUpdateField = (taskIndex: number, fieldIndex: number) => {
    if (!editFieldName.trim() || !editFieldValue.trim()) {
      alert('Please enter both field name and value');
      return;
    }

    // Validate radio button has at least one option
    if (editFieldType === 'radio' && (!editRadioOptions || editRadioOptions.length === 0)) {
      alert('Radio buttons must have at least one option');
      return;
    }

    const updatedTask = { ...tasks[taskIndex] };
    const existingField = updatedTask.fields.find((f, idx) => f.fieldName === editFieldName && idx !== fieldIndex);
    if (existingField) {
      alert('A field with this name already exists for this task');
      return;
    }

    const updatedField: TaskFieldMapping = {
      fieldName: editFieldName,
      fieldValue: editFieldValue,
      fieldType: editFieldType,
    };
    
    if (editFieldType === 'dropdown' && editDropdownValue) {
      updatedField.dropdownValue = editDropdownValue;
    }

    if (editFieldType === 'radio' && editRadioOptions) {
      updatedField.optionsList = editRadioOptions;
    }

    updatedTask.fields[fieldIndex] = updatedField;
    handleUpdateTask(taskIndex, updatedTask);
    setEditFieldName('');
    setEditFieldValue('');
    setEditDropdownValue('');
    setEditFieldType('text');
    setEditRadioOptions([]);
    setEditRadioOptionInput('');
    setEditingFieldIndex(null);
  };

  const handleCancelFieldEdit = () => {
    setEditFieldName('');
    setEditFieldValue('');
    setEditDropdownValue('');
    setEditFieldType('text');
    setEditRadioOptions([]);
    setEditRadioOptionInput('');
    setEditingFieldIndex(null);
  };

  const handleDeleteField = (taskIndex: number, fieldIndex: number) => {
    const updatedTask = { ...tasks[taskIndex] };
    updatedTask.fields = updatedTask.fields.filter((_, i) => i !== fieldIndex);
    handleUpdateTask(taskIndex, updatedTask);
  };

  const handleAddFieldToRule = () => {
    if (!newRuleFieldName.trim() || !newRuleFieldValue.trim()) {
      alert('Please enter both field name and value');
      return;
    }

    // Validate radio button has at least one option
    if (newRuleFieldType === 'radio' && (!newRuleRadioOptions || newRuleRadioOptions.length === 0)) {
      alert('Radio buttons must have at least one option');
      return;
    }

    if (newRuleFields.some(f => f.fieldName === newRuleFieldName)) {
      alert('A field with this name already exists in this rule');
      return;
    }

    const newField: TaskFieldMapping = {
      fieldName: newRuleFieldName,
      fieldValue: newRuleFieldValue,
      fieldType: newRuleFieldType,
    };

    if (newRuleFieldType === 'dropdown' && newRuleDropdownValue) {
      newField.dropdownValue = newRuleDropdownValue;
    }

    if (newRuleFieldType === 'radio' && newRuleRadioOptions) {
      newField.optionsList = newRuleRadioOptions;
    }

    setNewRuleFields([...newRuleFields, newField]);
    setNewRuleFieldName('');
    setNewRuleFieldValue('');
    setNewRuleDropdownValue('');
    setNewRuleFieldType('text');
    setNewRuleRadioOptions([]);
    setNewRuleRadioOptionInput('');
  };

  const handleDeleteRuleField = (fieldIndex: number) => {
    setNewRuleFields(newRuleFields.filter((_, i) => i !== fieldIndex));
  };

  const handleAddConditionalRule = (taskIndex: number) => {
    if (!newRuleConditionValue.trim()) {
      alert('Please select/enter a condition value');
      return;
    }

    if (newRuleFields.length === 0) {
      alert('Please add at least one field to this rule');
      return;
    }

    const updatedTask = { ...tasks[taskIndex] };
    if (!updatedTask.conditionalRules) {
      updatedTask.conditionalRules = [];
    }

    const newRule: ConditionalRule = {
      id: `rule-${Date.now()}`,
      conditionType: newRuleConditionType,
      conditionValue: newRuleConditionValue,
      fields: newRuleFields,
    };

    console.log('🔀 Adding conditional rule:', {
      taskName: updatedTask.taskName,
      rule: newRule,
      totalRules: updatedTask.conditionalRules.length + 1
    });

    updatedTask.conditionalRules.push(newRule);
    handleUpdateTask(taskIndex, updatedTask);
    
    // Clear all rule-related state
    setNewRuleConditionType('workflow');
    setNewRuleConditionValue('');
    setNewRuleFields([]);
    setNewRuleFieldName('');
    setNewRuleFieldValue('');
    setNewRuleDropdownValue('');
    setNewRuleFieldType('text');

    alert(`✅ Conditional rule added successfully!\nTask: ${updatedTask.taskName}\nCondition: ${newRuleConditionType} = ${newRuleConditionValue}\nFields: ${newRule.fields.length}`);
  };

  const handleDeleteConditionalRule = (taskIndex: number, ruleId: string) => {
    const updatedTask = { ...tasks[taskIndex] };
    if (updatedTask.conditionalRules) {
      updatedTask.conditionalRules = updatedTask.conditionalRules.filter(r => r.id !== ruleId);
    }
    handleUpdateTask(taskIndex, updatedTask);
  };

  const getCurrentTaskConfig = (): TaskManagementConfig => {
    // Load from localStorage to get taskSequencing
    const stored = localStorage.getItem('aviator-task-config');
    let taskSequencing = {};
    if (stored) {
      const config = JSON.parse(stored);
      console.log('📖 getCurrentTaskConfig - parsed config has these keys:', Object.keys(config));
      console.log('📖 config.taskSequencing exists?', !!config.taskSequencing);
      console.log('📖 config.taskSequencing value:', config.taskSequencing);
      taskSequencing = config.taskSequencing || {};
      console.log('📖 Final taskSequencing keys:', Object.keys(taskSequencing));
      console.log('📖 Final taskSequencing data:', JSON.stringify(taskSequencing, null, 2));
    } else {
      console.log('⚠️ getCurrentTaskConfig - no config in localStorage');
    }

    return {
      completableTasks: tasks.filter(t => t.isCompletable).map(t => t.taskName),
      retryableTasks: tasks.filter(t => t.isRetryable).map(t => t.taskName),
      taskFieldMappings: tasks.reduce((acc, task) => {
        if (task.fields.length > 0) {
          acc[task.taskName] = task.fields.reduce((fieldAcc, field) => {
            if (field.fieldType === 'dropdown') {
              fieldAcc[field.fieldName] = {
                fieldValue: field.fieldValue,
                fieldType: field.fieldType,
                dropdownValue: field.dropdownValue || field.fieldValue
              };
            } else {
              fieldAcc[field.fieldName] = field.fieldValue;
            }
            return fieldAcc;
          }, {} as Record<string, any>);
        }
        return acc;
      }, {} as Record<string, Record<string, any>>),
      conditionalRules: tasks.reduce((acc, task) => {
        if (task.conditionalRules && task.conditionalRules.length > 0) {
          acc[task.taskName] = task.conditionalRules;
        }
        return acc;
      }, {} as Record<string, ConditionalRule[]>),
      taskSequencing: taskSequencing,
    };
  };

  const handleSequencingConfigChange = (newConfig: TaskManagementConfig) => {
    console.log('📥 TaskConfigTable received sequencing config change:');
    console.log('   Keys:', Object.keys(newConfig.taskSequencing || {}));
    console.log('   Data:', JSON.stringify(newConfig.taskSequencing, null, 2));
    
    // Set flag to prevent saveTasksToStorage from overwriting
    isSequencingUpdate.current = true;
    
    // Read existing config from localStorage and ONLY update taskSequencing
    const existingStored = localStorage.getItem('aviator-task-config');
    let finalConfig = newConfig;
    
    if (existingStored) {
      try {
        const existingConfig = JSON.parse(existingStored);
        // Merge: keep all existing properties, only update taskSequencing
        finalConfig = {
          ...existingConfig,
          taskSequencing: newConfig.taskSequencing || {},
        };
        console.log('📝 Merged with existing config. Final taskSequencing keys:', Object.keys(finalConfig.taskSequencing || {}));
      } catch (e) {
        console.error('Error parsing existing config:', e);
      }
    }
    
    // Save merged config to localStorage
    const stringified = JSON.stringify(finalConfig);
    console.log('💾 About to save merged config. taskSequencing:', JSON.stringify(finalConfig.taskSequencing, null, 2));
    localStorage.setItem('aviator-task-config', stringified);
    
    // Verify it was saved
    const readBack = localStorage.getItem('aviator-task-config');
    const parsed = readBack ? JSON.parse(readBack) : null;
    console.log('✅ Verified saved. taskSequencing keys:', Object.keys(parsed?.taskSequencing || {}));
    
    // Use setTimeout to ensure localStorage write completes and prevent race condition
    // This ensures saveTasksToStorage() won't overwrite the sequencing data
    setTimeout(() => {
      // Force re-render to pick up the new sequencing config
      setSequencingVersion(prev => {
        console.log(`🔄 Incrementing sequencingVersion: ${prev} → ${prev + 1}`);
        return prev + 1;
      });
      
      // Clear flag after a short delay to allow re-render to complete
      setTimeout(() => {
        isSequencingUpdate.current = false;
        console.log('✅ Sequencing update complete, saveTasksToStorage re-enabled');
      }, 50);
    }, 10); // Small delay to ensure write completes
    
    // DON'T notify parent during sequencing updates - we manage localStorage directly
    // to prevent parent from overwriting our taskSequencing data
  };

  const filteredTasks = tasks.filter(task =>
    task.taskName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportConfig = () => {
    console.log('📤 Exporting config from tasks:', tasks.map(t => ({
      name: t.taskName,
      hasRules: !!t.conditionalRules && t.conditionalRules.length > 0,
      rulesCount: t.conditionalRules?.length || 0
    })));

    // Get taskSequencing from localStorage
    const stored = localStorage.getItem('aviator-task-config');
    let taskSequencing = {};
    if (stored) {
      const config = JSON.parse(stored);
      taskSequencing = config.taskSequencing || {};
    }

    const config = {
      completableTasks: tasks.filter(t => t.isCompletable).map(t => t.taskName),
      retryableTasks: tasks.filter(t => t.isRetryable).map(t => t.taskName),
      taskFieldMappings: tasks.reduce((acc, task) => {
        if (task.fields.length > 0) {
          acc[task.taskName] = task.fields.reduce((fieldAcc, field) => {
            if (field.fieldType === 'dropdown') {
              fieldAcc[field.fieldName] = {
                fieldValue: field.fieldValue,
                fieldType: field.fieldType,
                dropdownValue: field.dropdownValue || field.fieldValue
              };
            } else {
              fieldAcc[field.fieldName] = field.fieldValue;
            }
            return fieldAcc;
          }, {} as Record<string, any>);
        }
        return acc;
      }, {} as Record<string, Record<string, any>>),
      conditionalRules: tasks.reduce((acc, task) => {
        if (task.conditionalRules && task.conditionalRules.length > 0) {
          console.log(`✅ Task "${task.taskName}" has ${task.conditionalRules.length} rule(s):`, task.conditionalRules);
          acc[task.taskName] = task.conditionalRules;
        }
        return acc;
      }, {} as Record<string, ConditionalRule[]>),
      taskSequencing: taskSequencing,
    };

    console.log('📦 Final export config:', config);

    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aviator-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        localStorage.setItem('aviator-task-config', e.target?.result as string);
        loadTasksFromStorage();
        alert('Configuration imported successfully!');
      } catch (err) {
        alert('Failed to import configuration');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div 
        className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-all duration-200 border-b border-gray-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-90' : 'rotate-0'}`}>
            <span className="text-2xl">▶️</span>
          </div>
          <span className="text-2xl">⚙️</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Task Configuration Manager</h2>
            <p className="text-sm text-gray-600 mt-1">
              {isExpanded ? 'Manage task automation rules and mandatory field mappings' : `${tasks.length} task${tasks.length !== 1 ? 's' : ''} configured - Click to expand`}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
          {isExpanded && (
            <div className="flex gap-2 animate-fadeIn">
              <button
                onClick={exportConfig}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transform hover:scale-105 hover:shadow-lg transition-all duration-200 text-sm active:scale-95"
              >
                📥 Export Config
              </button>
              <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer text-sm active:scale-95">
                📤 Import Config
                <input
                  type="file"
                  accept=".json"
                  onChange={importConfig}
                  className="hidden"
                />
              </label>
            </div>
          )}
          <div className="text-gray-400 text-sm font-medium">
            {isExpanded ? 'Click to collapse' : 'Click to expand'}
          </div>
        </div>
      </div>

      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Tabs */}
        {isExpanded && (
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex px-6" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`py-4 px-6 font-medium text-sm transition-all duration-200 border-b-2 ${
                  activeTab === 'tasks'
                    ? 'border-blue-500 text-blue-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📝 Task Configuration & Rules
              </button>
              <button
                onClick={() => setActiveTab('sequencing')}
                className={`py-4 px-6 font-medium text-sm transition-all duration-200 border-b-2 ${
                  activeTab === 'sequencing'
                    ? 'border-blue-500 text-blue-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔄 Task Sequencing & Dependencies
              </button>
            </nav>
          </div>
        )}

        <div className="p-6">
          {/* Task Configuration Tab */}
          {activeTab === 'tasks' && (
            <>
              <div className="mb-4 flex gap-4 items-center">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="🔍 Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-blue-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setShowAttributeManager(!showAttributeManager)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transform hover:scale-105 hover:shadow-lg transition-all duration-200 active:scale-95"
                >
                  ⚙️ Manage Attributes
                </button>
                <button
                  onClick={() => setIsAddingTask(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 hover:shadow-lg transition-all duration-200 active:scale-95"
                >
                  ➕ Add New Task
                </button>
              </div>
            </>
          )}

          {/* Task Sequencing Tab */}
          {activeTab === 'sequencing' && (
            <TaskSequencingManager 
              key={sequencingVersion} // Force re-mount when config changes
              config={getCurrentTaskConfig()} 
              onConfigChange={handleSequencingConfigChange}
            />
          )}

          {/* Task Configuration Content - only show in tasks tab */}
          {activeTab === 'tasks' && (
            <>
              {showAttributeManager && (
            <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-5 shadow-md animate-slideDown">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-bold text-purple-900">⚙️ Custom Attribute Manager</h3>
                <div className="group relative">
                  <span className="text-purple-600 cursor-help text-sm">ℹ️</span>
                  <div className="absolute left-0 top-6 w-96 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                    <p className="font-semibold mb-2">📋 How it works:</p>
                    <p className="mb-2">1. Add values here for Product Names and Itential Workflow Names</p>
                    <p className="mb-2">2. These values will appear as dropdown options in the Order Form</p>
                    <p className="mb-2">3. Use these values to create conditional rules in Task Configuration</p>
                    <p className="mb-2">4. Automation will match selected values and apply the correct rules</p>
                    <p className="text-amber-300 mt-2">⚠️ Only add valid values - random typos will not be filtered!</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Itential Workflow Names */}
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                    <span>⚡</span>
                    <span>Itential Workflow Names</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{itentialWorkflows.length}</span>
                  </h4>
                  
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newItentialWorkflow}
                      onChange={(e) => setNewItentialWorkflow(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddItentialWorkflow()}
                      placeholder="Enter workflow name"
                      className="flex-1 px-3 py-2 border rounded-lg text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    />
                    <button
                      onClick={handleAddItentialWorkflow}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm transform hover:scale-105 transition-all"
                    >
                      ➕ Add
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {itentialWorkflows.length === 0 ? (
                      <p className="text-sm text-gray-500 italic text-center py-4">No workflows added yet</p>
                    ) : (
                      itentialWorkflows.map((workflow, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-purple-50 px-3 py-2 rounded-lg border border-purple-100">
                          <span className="text-sm font-medium text-gray-700">{workflow}</span>
                          <button
                            onClick={() => handleDeleteItentialWorkflow(workflow)}
                            className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transform hover:scale-110 transition-all"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Product Names */}
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                    <span>📦</span>
                    <span>Product Names</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{productNames.length}</span>
                  </h4>
                  
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddProductName()}
                      placeholder="Enter product name"
                      className="flex-1 px-3 py-2 border rounded-lg text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    />
                    <button
                      onClick={handleAddProductName}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm transform hover:scale-105 transition-all"
                    >
                      ➕ Add
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {productNames.length === 0 ? (
                      <p className="text-sm text-gray-500 italic text-center py-4">No products added yet</p>
                    ) : (
                      productNames.map((product, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-purple-50 px-3 py-2 rounded-lg border border-purple-100">
                          <span className="text-sm font-medium text-gray-700">{product}</span>
                          <button
                            onClick={() => handleDeleteProductName(product)}
                            className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transform hover:scale-110 transition-all"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowAttributeManager(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task Name</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Completable</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Retryable</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fields ({tasks.reduce((sum, t) => sum + t.fields.length, 0)})</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      {searchQuery ? 'No tasks found matching your search' : 'No tasks configured'}
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task, taskIndex) => {
                    const actualIndex = tasks.findIndex(t => t.taskName === task.taskName);
                    const isEditing = editingTaskIndex === actualIndex;
                    
                    return (
                      <React.Fragment key={actualIndex}>
                        <tr className="border-b border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-md">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{task.taskName}</td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={task.isCompletable}
                              onChange={(e) => handleUpdateTask(actualIndex, { isCompletable: e.target.checked })}
                              className="w-5 h-5 text-blue-600 cursor-pointer transform hover:scale-110 transition-transform duration-200"
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={task.isRetryable}
                              onChange={(e) => handleUpdateTask(actualIndex, { isRetryable: e.target.checked })}
                              className="w-5 h-5 text-blue-600 cursor-pointer transform hover:scale-110 transition-transform duration-200"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                              📋 {task.fields.length} field{task.fields.length !== 1 ? 's' : ''}
                            </span>
                            {task.conditionalRules && task.conditionalRules.length > 0 && (
                              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium animate-pulse">
                                🔀 {task.conditionalRules.length} rule{task.conditionalRules.length !== 1 ? 's' : ''}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => setEditingTaskIndex(isEditing ? null : actualIndex)}
                                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transform hover:scale-110 hover:shadow-lg transition-all duration-200 active:scale-95"
                              >
                                {isEditing ? '✓ Done' : '✏️ Edit'}
                              </button>
                              <button
                                onClick={() => setShowConditionalRules(showConditionalRules === actualIndex ? null : actualIndex)}
                                className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs hover:bg-purple-700 transform hover:scale-110 hover:shadow-lg transition-all duration-200 active:scale-95"
                                title="Add conditional rules to set different field values based on workflow or order type"
                              >
                                🔀 Rules
                              </button>
                              <button
                                onClick={() => handleDeleteTask(actualIndex)}
                                className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 hover:shadow-lg transition-all duration-200 transform hover:rotate-12 active:scale-95"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>

                        {isEditing && (
                          <tr className="animate-slideDown">
                            <td colSpan={5} className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">Mandatory Fields</h4>
                                  {task.fields.length === 0 ? (
                                    <p className="text-sm text-gray-500 mb-2">No fields configured</p>
                                  ) : (
                                    <div className="space-y-2 mb-4">
                                      {task.fields.map((field, fieldIndex) => (
                                        <div key={fieldIndex} className="bg-white p-2 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transform hover:scale-[1.02] transition-all duration-200">
                                          {editingFieldIndex === fieldIndex ? (
                                            <div className="space-y-2">
                                              <div className="flex gap-2">
                                                <select
                                                  value={editFieldType}
                                                  onChange={(e) => setEditFieldType(e.target.value as 'text' | 'dropdown' | 'date' | 'radio' | 'checkbox')}
                                                  className="px-2 py-1 border rounded text-sm"
                                                >
                                                  <option value="text">📝 Text</option>
                                                  <option value="dropdown">📋 Dropdown</option>
                                                  <option value="date">📅 Date</option>
                                                  <option value="radio">🔘 Radio</option>
                                                  <option value="checkbox">☑️ Checkbox</option>
                                                </select>
                                                <input
                                                  type="text"
                                                  value={editFieldName}
                                                  onChange={(e) => setEditFieldName(e.target.value)}
                                                  placeholder="Field name"
                                                  className="flex-1 px-3 py-1 border rounded text-sm"
                                                />
                                              </div>
                                              {editFieldType === 'text' ? (
                                                <input
                                                  type="text"
                                                  value={editFieldValue}
                                                  onChange={(e) => setEditFieldValue(e.target.value)}
                                                  placeholder="Field value OR pattern: PREFIX{{random:3}}, {{date:YYYYMMDD}}-{{randomAlpha:4}}"
                                                  title="Enter field value (e.g., 'My Value') OR use pattern: PREFIX{{random:3}}, {{randomNum:4}}SUFFIX, ORD-{{date:YYYYMMDD}}-{{random:4}}, {{uuid}}"
                                                  className="w-full px-3 py-1 border rounded text-sm"
                                                />
                                              ) : editFieldType === 'date' ? (
                                                <>
                                                  <input
                                                    type="text"
                                                    value={editFieldValue}
                                                    onChange={(e) => setEditFieldValue(e.target.value)}
                                                    placeholder="e.g., {{currentDate+7}}"
                                                    title="Date placeholder"
                                                    className="w-full px-3 py-1 border rounded text-sm mb-2"
                                                  />
                                                  <div className="bg-blue-50 border border-blue-200 rounded px-3 py-2">
                                                    <p className="text-xs text-blue-800">
                                                      ℹ️ Date format: <span className="font-semibold">YYYY-MM-DD</span> (e.g., {getCurrentDateExample()})
                                                    </p>
                                                  </div>
                                                </>
                                              ) : editFieldType === 'checkbox' ? (
                                                <input
                                                  type="text"
                                                  value={editFieldValue}
                                                  onChange={(e) => setEditFieldValue(e.target.value)}
                                                  placeholder="true or false"
                                                  title="true or false"
                                                  className="w-full px-3 py-1 border rounded text-sm"
                                                />
                                              ) : editFieldType === 'dropdown' ? (
                                                <div className="flex gap-2">
                                                  <input
                                                    type="text"
                                                    value={editFieldValue}
                                                    onChange={(e) => setEditFieldValue(e.target.value)}
                                                    placeholder="Label"
                                                    className="flex-1 px-3 py-1 border rounded text-sm"
                                                  />
                                                  <input
                                                    type="text"
                                                    value={editDropdownValue}
                                                    onChange={(e) => setEditDropdownValue(e.target.value)}
                                                    placeholder="Value"
                                                    className="flex-1 px-3 py-1 border rounded text-sm"
                                                  />
                                                </div>
                                              ) : editFieldType === 'radio' ? (
                                                <div className="space-y-2">
                                                  <div className="bg-blue-50 p-2 rounded border border-blue-200">
                                                    <p className="text-xs font-medium text-blue-900 mb-2">Radio Options:</p>
                                                    {editRadioOptions.length > 0 ? (
                                                      <div className="space-y-1 mb-2">
                                                        {editRadioOptions.map((option, idx) => (
                                                          <div key={idx} className="flex items-center gap-2 bg-white px-2 py-1 rounded text-xs">
                                                            <span>{option}</span>
                                                            <button
                                                              onClick={() => setEditRadioOptions(editRadioOptions.filter((_, i) => i !== idx))}
                                                              className="ml-auto text-red-600 hover:text-red-800"
                                                            >
                                                              ✕
                                                            </button>
                                                          </div>
                                                        ))}
                                                      </div>
                                                    ) : (
                                                      <p className="text-xs text-gray-500 mb-2">No options added yet</p>
                                                    )}
                                                    <div className="flex gap-1">
                                                      <input
                                                        type="text"
                                                        value={editRadioOptionInput}
                                                        onChange={(e) => setEditRadioOptionInput(e.target.value)}
                                                        placeholder="Add option"
                                                        className="flex-1 px-2 py-1 border rounded text-xs"
                                                        onKeyPress={(e) => {
                                                          if (e.key === 'Enter' && editRadioOptionInput.trim()) {
                                                            setEditRadioOptions([...editRadioOptions, editRadioOptionInput.trim()]);
                                                            setEditRadioOptionInput('');
                                                          }
                                                        }}
                                                      />
                                                      <button
                                                        onClick={() => {
                                                          if (editRadioOptionInput.trim() && !editRadioOptions.includes(editRadioOptionInput.trim())) {
                                                            setEditRadioOptions([...editRadioOptions, editRadioOptionInput.trim()]);
                                                            setEditRadioOptionInput('');
                                                          }
                                                        }}
                                                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                                      >
                                                        +
                                                      </button>
                                                    </div>
                                                  </div>
                                                  <select
                                                    value={editFieldValue}
                                                    onChange={(e) => setEditFieldValue(e.target.value)}
                                                    className="w-full px-3 py-1 border rounded text-sm"
                                                  >
                                                    <option value="">Select default value...</option>
                                                    {editRadioOptions.map((option, idx) => (
                                                      <option key={idx} value={option}>{option}</option>
                                                    ))}
                                                  </select>
                                                </div>
                                              ) : null}
                                              <div className="flex gap-2">
                                                <button
                                                  onClick={() => handleUpdateField(actualIndex, fieldIndex)}
                                                  className="flex-1 px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transform hover:scale-105 hover:shadow-lg transition-all duration-200 active:scale-95"
                                                >
                                                  ✓ Save
                                                </button>
                                                <button
                                                  onClick={handleCancelFieldEdit}
                                                  className="flex-1 px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transform hover:scale-105 hover:shadow-lg transition-all duration-200 active:scale-95"
                                                >
                                                  ✕ Cancel
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="flex items-center gap-2">
                                              <span className="font-medium text-sm">{field.fieldName}:</span>
                                              <span className="text-sm text-gray-600">{field.fieldValue}</span>
                                              {field.fieldType === 'dropdown' && (
                                                <>
                                                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium hover:bg-purple-200 transition-colors duration-200">📋 Dropdown</span>
                                                  {field.dropdownValue && field.dropdownValue !== field.fieldValue && (
                                                    <span className="text-xs text-gray-500">(Value: {field.dropdownValue})</span>
                                                  )}
                                                </>
                                              )}
                                              {field.fieldType === 'date' && (
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium hover:bg-blue-200 transition-colors duration-200">📅 Date</span>
                                              )}
                                              {field.fieldType === 'radio' && (
                                                <>
                                                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium hover:bg-indigo-200 transition-colors duration-200">🔘 Radio</span>
                                                  {field.optionsList && field.optionsList.length > 0 && (
                                                    <span className="text-xs text-gray-500">({field.optionsList.join(', ')})</span>
                                                  )}
                                                </>
                                              )}
                                              {field.fieldType === 'checkbox' && (
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium hover:bg-green-200 transition-colors duration-200">☑️ Checkbox</span>
                                              )}
                                              <div className="ml-auto flex gap-1">
                                                <button
                                                  onClick={() => handleEditField(actualIndex, fieldIndex)}
                                                  className="px-2 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transform hover:scale-110 hover:shadow-md transition-all duration-200 active:scale-95"
                                                >
                                                  ✏️
                                                </button>
                                                <button
                                                  onClick={() => handleDeleteField(actualIndex, fieldIndex)}
                                                  className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 hover:shadow-md transition-all duration-200 transform hover:rotate-12 active:scale-95"
                                                >
                                                  🗑️
                                                </button>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  <div className="bg-white p-3 rounded border border-gray-300">
                                    <div className="flex items-center gap-2 mb-2">
                                      <p className="text-xs text-gray-600 font-medium">➕ Add New Field</p>
                                      <div className="group relative">
                                        <span className="text-blue-500 cursor-help text-xs">ℹ️</span>
                                        <div className="absolute left-0 top-6 w-[500px] bg-gray-900 text-white text-xs rounded-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl max-h-[500px] overflow-y-auto">
                                          <p className="font-semibold mb-2">📝 Text Field:</p>
                                          <p className="mb-1">• <b>Field Name:</b> FlightDeck field (e.g., "Requested Due Date")</p>
                                          <p className="mb-1">• <b>Value:</b> Enter field value OR use dynamic patterns:</p>
                                          <p className="ml-4 mb-1 text-green-300">✓ Field Value: "Completed Successfully"</p>
                                          <p className="ml-4 mb-1 text-green-300">✓ Field Value: "Test Value 123"</p>
                                          <p className="ml-4 mb-1 text-yellow-300">✓ Pattern: "ORDER-{'{{random:4}}'}"</p>
                                          <p className="ml-4 mb-3 text-yellow-300">✓ Pattern: "{'{{date:YYYYMMDD}}'}-TICKET"</p>
                                          
                                          <p className="font-semibold mb-2">📋 Dropdown Field:</p>
                                          <p className="mb-1">• <b>Field Name:</b> FlightDeck field (e.g., "Fallout Action")</p>
                                          <p className="mb-1">• <b>Label:</b> What shows in dropdown (e.g., "Enter Port Data") <span className="text-green-300">✓ Required</span></p>
                                          <p className="mb-3">• <b>Value:</b> Optional - Only if different from Label</p>
                                          
                                          <p className="font-semibold mb-2">📅 Date Field:</p>
                                          <p className="mb-1">• <b>Field Name:</b> FlightDeck field (e.g., "FOC Date")</p>
                                          <p className="mb-1">• <b>Value:</b> Date placeholder:</p>
                                          <p className="ml-4 mb-1">- {'{{currentDate}}'} = Today</p>
                                          <p className="ml-4 mb-1">- {'{{currentDate+7}}'} = 7 days from now</p>
                                          <p className="ml-4 mb-3">- {'{{currentDate-3}}'} = 3 days ago</p>
                                          
                                          <p className="font-semibold mb-2">🔘 Radio Button:</p>
                                          <p className="mb-1">• <b>Field Name:</b> FlightDeck field (e.g., "Activation Type")</p>
                                          <p className="mb-1">• <b>Options:</b> Add all available choices (e.g., "Scheduled", "Unscheduled")</p>
                                          <p className="mb-3">• <b>Value:</b> Select default from options list</p>
                                          
                                          <p className="font-semibold mb-2">☑️ Checkbox:</p>
                                          <p className="mb-1">• <b>Field Name:</b> FlightDeck field (e.g., "Redesign Required?")</p>
                                          <p className="mb-3">• <b>Value:</b> "true" or "false"</p>
                                          
                                          <div className="border-t border-gray-700 pt-2 mt-2">
                                            <p className="font-semibold mb-2 text-yellow-300">✨ Custom/Unique Value Patterns (Optional):</p>
                                            <p className="mb-1 text-gray-300">💡 <b className="text-white">Default:</b> Just enter field value (e.g., "Completed", "My Value")</p>
                                            <p className="mb-2 text-gray-300">🚀 <b className="text-white">Advanced:</b> Use patterns below to generate unique/dynamic values:</p>
                                            
                                            <p className="text-green-300 font-semibold mt-2 mb-1">🎲 Random Values:</p>
                                            <p className="ml-4 mb-1">• {'{{random:3}}'} = 3 random chars (A7X, B9K...)</p>
                                            <p className="ml-4 mb-1">• {'{{randomAlpha:4}}'} = 4 letters only (ABCD, XYZW...)</p>
                                            <p className="ml-4 mb-1">• {'{{randomNum:5}}'} = 5 numbers only (12345, 98765...)</p>
                                            <p className="ml-4 mb-2">• {'{{randomHex:6}}'} = 6 hex chars (A1F3E7, 9B2C4D...)</p>
                                            
                                            <p className="text-purple-300 font-semibold mt-2 mb-1">🔢 Counters & IDs:</p>
                                            <p className="ml-4 mb-1">• {'{{counter:4}}'} = 4-digit counter (0001, 0002, 0003...)</p>
                                            <p className="ml-4 mb-1">• {'{{uniqueId:8}}'} = 8-char unique ID (L9X7K2M4...)</p>
                                            <p className="ml-4 mb-1">• {'{{uuid}}'} = Full UUID (550e8400-e29b...)</p>
                                            <p className="ml-4 mb-2">• {'{{guid}}'} = Short GUID (8 chars)</p>
                                            
                                            <p className="text-blue-300 font-semibold mt-2 mb-1">📅 Date/Time Formats:</p>
                                            <p className="ml-4 mb-1">• {'{{date:YYYYMMDD}}'} = 20260228</p>
                                            <p className="ml-4 mb-1">• {'{{date:YYYY-MM-DD}}'} = 2026-02-28</p>
                                            <p className="ml-4 mb-1">• {'{{date:YYMMDD}}'} = 260228</p>
                                            <p className="ml-4 mb-1">• {'{{time:HHmmss}}'} = 143025</p>
                                            <p className="ml-4 mb-1">• {'{{time:HHmm}}'} = 1430</p>
                                            <p className="ml-4 mb-2">• {'{{timestamp}}'} = 1709164800000</p>
                                            
                                            <p className="text-orange-300 font-semibold mt-2 mb-1">🎯 Pattern Examples:</p>
                                            <p className="ml-4 mb-1 bg-gray-800 p-1 rounded">PREFIX{'{{random:3}}'} → PREFIXABC</p>
                                            <p className="ml-4 mb-1 bg-gray-800 p-1 rounded">{'{{random:3}}'}SUFFIX → ABCSUFFIX</p>
                                            <p className="ml-4 mb-1 bg-gray-800 p-1 rounded">ORD-{'{{date:YYYYMMDD}}'}-{'{{random:4}}'} → ORD-20260228-A7X9</p>
                                            <p className="ml-4 mb-1 bg-gray-800 p-1 rounded">DNVFCOQE{'{{randomAlpha:3}}'} → DNVFCOQEABC</p>
                                            <p className="ml-4 mb-1 bg-gray-800 p-1 rounded">ID{'{{counter:5}}'} → ID00001, ID00002...</p>
                                            <p className="ml-4 mb-2 bg-gray-800 p-1 rounded">{'{{randomNum:4}}'}-TICKET → 1234-TICKET</p>
                                            
                                            <div className="bg-blue-900 bg-opacity-50 p-2 rounded mt-2">
                                              <p className="text-white font-semibold mb-1">💡 Quick Reference:</p>
                                              <p className="ml-2 mb-1">✓ Field Value: "Completed" (always same)</p>
                                              <p className="ml-2">✓ Pattern: "REF{'{{random:4}}'}" (unique each time)</p>
                                            </div>
                                          </div>
                                          
                                          <p className="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-700">Other: {'{{preferredDevice}}'}, {'{{preferredPort}}'}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 mb-2">
                                      <select
                                        value={newFieldType}
                                        onChange={(e) => setNewFieldType(e.target.value as 'text' | 'dropdown' | 'date' | 'radio' | 'checkbox')}
                                        className="px-2 py-1 border rounded text-sm"
                                      >
                                        <option value="text">📝 Text</option>
                                        <option value="dropdown">📋 Dropdown</option>
                                        <option value="date">📅 Date</option>
                                        <option value="radio">🔘 Radio</option>
                                        <option value="checkbox">☑️ Checkbox</option>
                                      </select>
                                      <input
                                        type="text"
                                        value={newFieldName}
                                        onChange={(e) => setNewFieldName(e.target.value)}
                                        placeholder="Field name"
                                        className="flex-1 px-3 py-1 border rounded text-sm"
                                        title="The field name in FlightDeck (e.g., 'Fallout Action', 'Requested Due Date')"
                                      />
                                    </div>
                                    {newFieldType === 'text' ? (
                                      <input
                                        type="text"
                                        value={newFieldValue}
                                        onChange={(e) => setNewFieldValue(e.target.value)}
                                        placeholder="Field value OR pattern: PREFIX{{random:3}}, {{date:YYYYMMDD}}-{{randomAlpha:4}}"
                                        className="w-full px-3 py-1 border rounded text-sm mb-2"
                                        title="Enter field value (e.g., 'My Value') OR use pattern: PREFIX{{random:3}}, {{randomNum:4}}SUFFIX, ID{{counter:5}}, ORD-{{date:YYYYMMDD}}-{{random:4}}, {{uuid}}, {{preferredDevice}}"
                                      />
                                    ) : newFieldType === 'date' ? (
                                      <>
                                        <input
                                          type="text"
                                          value={newFieldValue}
                                          onChange={(e) => setNewFieldValue(e.target.value)}
                                          placeholder="e.g., {{currentDate+7}}"
                                          className="w-full px-3 py-1 border rounded text-sm mb-2"
                                          title="Date placeholder: {{currentDate}}, {{currentDate+7}}, {{currentDate-3}}"
                                        />
                                        <div className="bg-blue-50 border border-blue-200 rounded px-3 py-2 mb-2">
                                          <p className="text-xs text-blue-800">
                                            ℹ️ Date format: <span className="font-semibold">YYYY-MM-DD</span> (e.g., {getCurrentDateExample()})
                                          </p>
                                        </div>
                                      </>
                                    ) : newFieldType === 'checkbox' ? (
                                      <input
                                        type="text"
                                        value={newFieldValue}
                                        onChange={(e) => setNewFieldValue(e.target.value)}
                                        placeholder="true or false"
                                        className="w-full px-3 py-1 border rounded text-sm mb-2"
                                        title="Checkbox value: true or false"
                                      />
                                    ) : newFieldType === 'dropdown' ? (
                                      <div className="flex gap-2 mb-2">
                                        <input
                                          type="text"
                                          value={newFieldValue}
                                          onChange={(e) => setNewFieldValue(e.target.value)}
                                          placeholder="Label"
                                          className="flex-1 px-3 py-1 border rounded text-sm"
                                          title="The text shown in the dropdown (e.g., 'Enter Port Data')"
                                        />
                                        <input
                                          type="text"
                                          value={newDropdownValue}
                                          onChange={(e) => setNewDropdownValue(e.target.value)}
                                          placeholder="Value (optional)"
                                          className="flex-1 px-3 py-1 border rounded text-sm"
                                          title="Optional - Leave empty to use Label as the value. Only specify if the internal value differs from display text."
                                        />
                                      </div>
                                    ) : newFieldType === 'radio' ? (
                                      <div className="space-y-2 mb-2">
                                        <div className="bg-blue-50 p-2 rounded border border-blue-200">
                                          <p className="text-xs font-medium text-blue-900 mb-2">Radio Options:</p>
                                          {newFieldRadioOptions.length > 0 ? (
                                            <div className="space-y-1 mb-2">
                                              {newFieldRadioOptions.map((option, idx) => (
                                                <div key={idx} className="flex items-center gap-2 bg-white px-2 py-1 rounded text-xs">
                                                  <span>{option}</span>
                                                  <button
                                                    onClick={() => setNewFieldRadioOptions(newFieldRadioOptions.filter((_, i) => i !== idx))}
                                                    className="ml-auto text-red-600 hover:text-red-800"
                                                  >
                                                    ✕
                                                  </button>
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            <p className="text-xs text-gray-500 mb-2">No options added yet</p>
                                          )}
                                          <div className="flex gap-1">
                                            <input
                                              type="text"
                                              value={newFieldRadioOptionInput}
                                              onChange={(e) => setNewFieldRadioOptionInput(e.target.value)}
                                              placeholder="Add option"
                                              className="flex-1 px-2 py-1 border rounded text-xs"
                                              onKeyPress={(e) => {
                                                if (e.key === 'Enter' && newFieldRadioOptionInput.trim()) {
                                                  setNewFieldRadioOptions([...newFieldRadioOptions, newFieldRadioOptionInput.trim()]);
                                                  setNewFieldRadioOptionInput('');
                                                }
                                              }}
                                            />
                                            <button
                                              onClick={() => {
                                                if (newFieldRadioOptionInput.trim() && !newFieldRadioOptions.includes(newFieldRadioOptionInput.trim())) {
                                                  setNewFieldRadioOptions([...newFieldRadioOptions, newFieldRadioOptionInput.trim()]);
                                                  setNewFieldRadioOptionInput('');
                                                }
                                              }}
                                              className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>
                                        <select
                                          value={newFieldValue}
                                          onChange={(e) => setNewFieldValue(e.target.value)}
                                          className="w-full px-3 py-1 border rounded text-sm"
                                        >
                                          <option value="">Select default value...</option>
                                          {newFieldRadioOptions.map((option, idx) => (
                                            <option key={idx} value={option}>{option}</option>
                                          ))}
                                        </select>
                                      </div>
                                    ) : null}
                                    <button
                                      onClick={() => handleAddField(actualIndex)}
                                      disabled={editingFieldIndex !== null}
                                      className="w-full px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transform hover:scale-105 hover:shadow-lg transition-all duration-200 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                                    >
                                      ➕ Add New Field
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}

                        {showConditionalRules === actualIndex && (
                          <tr className="animate-slideDown">
                            <td colSpan={5} className="px-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500">
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-purple-900">Conditional Rules</h4>
                                  <div className="group relative">
                                    <span className="text-purple-600 cursor-help text-lg">ℹ️</span>
                                    <div className="absolute left-0 top-6 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                                      <p className="font-semibold mb-1">💡 What are Conditional Rules?</p>
                                      <p className="mb-2">Set different field values based on conditions like workflow type or order type.</p>
                                      <p className="font-semibold mb-1">📝 Example:</p>
                                      <p>• When Workflow = "Monarch Onnet" → Set "Fallout Action" = "Enter Port Data"</p>
                                      <p>• When Workflow = "Colorless" → Set "Fallout Action" = "Create Cap Jeop"</p>
                                    </div>
                                  </div>
                                </div>
                                
                                {task.conditionalRules && task.conditionalRules.length > 0 ? (
                                  <div className="space-y-2 mb-4">
                                    {task.conditionalRules.map((rule) => (
                                      <div key={rule.id} className="bg-white p-3 rounded border border-purple-200">
                                        <div className="flex justify-between items-start mb-2">
                                          <div>
                                            <span className="font-medium">When {rule.conditionType} = "{rule.conditionValue}"</span>
                                            <div className="text-sm text-gray-600 mt-1">
                                              {rule.fields.length} field{rule.fields.length !== 1 ? 's' : ''} configured
                                            </div>
                                          </div>
                                          <button
                                            onClick={() => handleDeleteConditionalRule(actualIndex, rule.id)}
                                            className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                        <div className="space-y-1">
                                          {rule.fields.map((field, idx) => (
                                            <div key={idx} className="text-sm bg-purple-50 p-2 rounded flex items-center gap-2">
                                              <span className="font-medium">{field.fieldName}:</span> {field.fieldValue}
                                              {field.fieldType === 'dropdown' && field.dropdownValue && field.dropdownValue !== field.fieldValue && (
                                                <span className="text-xs text-gray-500 ml-2">(Value: {field.dropdownValue})</span>
                                              )}
                                              {field.fieldType === 'date' && (
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">📅</span>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 mb-4">No conditional rules configured</p>
                                )}

                                <div className="bg-white p-4 rounded border border-purple-300">
                                  <div className="flex items-center gap-2 mb-3">
                                    <h5 className="font-medium text-purple-900">➕ Add New Rule</h5>
                                    <div className="group relative">
                                      <span className="text-purple-500 cursor-help text-sm">❓</span>
                                      <div className="absolute left-0 top-6 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                                        <p className="font-semibold mb-1">🎯 How to create a rule:</p>
                                        <p>1. Select condition type (Workflow/Order Type)</p>
                                        <p>2. Choose condition value from dropdown</p>
                                        <p>3. Add fields that apply when condition matches</p>
                                        <p>4. Click "Save Conditional Rule"</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div className="flex gap-2">
                                      <select
                                        value={newRuleConditionType}
                                        onChange={(e) => setNewRuleConditionType(e.target.value as any)}
                                        className="px-3 py-2 border rounded-lg text-sm bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                        title="Choose what type of condition triggers this rule"
                                      >
                                        <option value="workflow">🔄 Workflow Type</option>
                                        <option value="orderType">📦 Order Type</option>
                                        <option value="itentialWorkflow">⚡ Itential Workflow Name</option>
                                        <option value="productName">📦 Product Name</option>
                                        <option value="custom">✏️ Custom</option>
                                      </select>
                                      
                                      {newRuleConditionType === 'workflow' ? (
                                        <select
                                          value={newRuleConditionValue}
                                          onChange={(e) => setNewRuleConditionValue(e.target.value)}
                                          className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                          title="Select which workflow triggers this rule"
                                        >
                                          <option value="">-- Select Workflow --</option>
                                          {WORKFLOW_OPTIONS.map(workflow => (
                                            <option key={workflow} value={workflow}>{workflow}</option>
                                          ))}
                                        </select>
                                      ) : newRuleConditionType === 'orderType' ? (
                                        <select
                                          value={newRuleConditionValue}
                                          onChange={(e) => setNewRuleConditionValue(e.target.value)}
                                          className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                          title="Select which order type triggers this rule"
                                        >
                                          <option value="">-- Select Order Type --</option>
                                          {ORDER_TYPE_OPTIONS.map(orderType => (
                                            <option key={orderType} value={orderType}>{orderType}</option>
                                          ))}
                                        </select>
                                      ) : newRuleConditionType === 'itentialWorkflow' ? (
                                        <select
                                          value={newRuleConditionValue}
                                          onChange={(e) => setNewRuleConditionValue(e.target.value)}
                                          className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                          title="Select which Itential Workflow triggers this rule"
                                        >
                                          <option value="">-- Select Itential Workflow --</option>
                                          {itentialWorkflows.length === 0 && <option disabled>No workflows defined - Add in Attribute Manager</option>}
                                          {itentialWorkflows.map(workflow => (
                                            <option key={workflow} value={workflow}>{workflow}</option>
                                          ))}
                                        </select>
                                      ) : newRuleConditionType === 'productName' ? (
                                        <select
                                          value={newRuleConditionValue}
                                          onChange={(e) => setNewRuleConditionValue(e.target.value)}
                                          className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                          title="Select which Product Name triggers this rule"
                                        >
                                          <option value="">-- Select Product Name --</option>
                                          {productNames.length === 0 && <option disabled>No products defined - Add in Attribute Manager</option>}
                                          {productNames.map(product => (
                                            <option key={product} value={product}>{product}</option>
                                          ))}
                                        </select>
                                      ) : (
                                        <input
                                          type="text"
                                          value={newRuleConditionValue}
                                          onChange={(e) => setNewRuleConditionValue(e.target.value)}
                                          placeholder='Enter custom condition value'
                                          className="flex-1 px-3 py-2 border rounded-lg text-sm hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                        />
                                      )}
                                    </div>
                                    
                                    <div className="mt-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h6 className="text-sm font-medium text-purple-900">📋 Fields for this rule ({newRuleFields.length})</h6>
                                        <div className="group relative">
                                          <span className="text-purple-500 cursor-help text-xs">💡</span>
                                          <div className="absolute left-0 top-6 w-64 bg-gray-900 text-white text-xs rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                                            <p>These fields will be automatically filled when the condition matches</p>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {newRuleFields.length > 0 && (
                                        <div className="space-y-2 mb-3">
                                          {newRuleFields.map((field, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-purple-50 p-2 rounded-lg border border-purple-200">
                                              <span className="font-medium text-sm">{field.fieldName}:</span>
                                              <span className="text-sm text-gray-600">{field.fieldValue}</span>
                                              {field.fieldType === 'dropdown' && (
                                                <>
                                                  <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">📋</span>
                                                  {field.dropdownValue && field.dropdownValue !== field.fieldValue && (
                                                    <span className="text-xs text-gray-500">(Value: {field.dropdownValue})</span>
                                                  )}
                                                </>
                                              )}
                                              {field.fieldType === 'date' && (
                                                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">📅</span>
                                              )}
                                              {field.fieldType === 'radio' && (
                                                <>
                                                  <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full">🔘</span>
                                                  {field.optionsList && field.optionsList.length > 0 && (
                                                    <span className="text-xs text-gray-500">({field.optionsList.join(', ')})</span>
                                                  )}
                                                </>
                                              )}
                                              {field.fieldType === 'checkbox' && (
                                                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">☑️</span>
                                              )}
                                              <button
                                                onClick={() => handleDeleteRuleField(idx)}
                                                className="ml-auto px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transform hover:scale-110 transition-all"
                                              >
                                                ✕
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      <div className="bg-white p-3 rounded-lg border-2 border-purple-300">
                                        <p className="text-xs text-purple-700 font-medium mb-2">➕ Add Field to Rule</p>
                                        <div className="flex gap-2 mb-2">
                                          <select
                                            value={newRuleFieldType}
                                            onChange={(e) => setNewRuleFieldType(e.target.value as 'text' | 'dropdown' | 'date' | 'radio' | 'checkbox')}
                                            className="px-2 py-1 border rounded-lg text-sm"
                                          >
                                            <option value="text">📝 Text</option>
                                            <option value="dropdown">📋 Dropdown</option>
                                            <option value="date">📅 Date</option>
                                            <option value="radio">🔘 Radio</option>
                                            <option value="checkbox">☑️ Checkbox</option>
                                          </select>
                                          <input
                                            type="text"
                                            value={newRuleFieldName}
                                            onChange={(e) => setNewRuleFieldName(e.target.value)}
                                            placeholder="Field name"
                                            className="flex-1 px-3 py-1 border rounded-lg text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                                            title="The field name in FlightDeck (e.g., 'Fallout Action', 'Requested Due Date')"
                                          />
                                        </div>
                                        {newRuleFieldType === 'text' ? (
                                          <input
                                            type="text"
                                            value={newRuleFieldValue}
                                            onChange={(e) => setNewRuleFieldValue(e.target.value)}
                                            placeholder="Field value OR pattern: PREFIX{{random:3}}, {{date:YYYYMMDD}}-{{randomAlpha:4}}"
                                            className="w-full px-3 py-1 border rounded-lg text-sm mb-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                                            title="Enter field value (e.g., 'My Value') OR use pattern: PREFIX{{random:3}}, {{randomNum:4}}SUFFIX, ID{{counter:5}}, ORD-{{date:YYYYMMDD}}-{{random:4}}, {{uuid}}"
                                          />
                                        ) : newRuleFieldType === 'date' ? (
                                          <>
                                            <input
                                              type="text"
                                              value={newRuleFieldValue}
                                              onChange={(e) => setNewRuleFieldValue(e.target.value)}
                                              placeholder="e.g., {{currentDate+7}}"
                                              className="w-full px-3 py-1 border rounded-lg text-sm mb-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                                              title="Date placeholder: {{currentDate}}, {{currentDate+7}}, {{currentDate-3}}"
                                            />
                                            <div className="bg-blue-50 border border-blue-200 rounded px-3 py-2 mb-2">
                                              <p className="text-xs text-blue-800">
                                                ℹ️ Date format: <span className="font-semibold">YYYY-MM-DD</span> (e.g., {getCurrentDateExample()})
                                              </p>
                                            </div>
                                          </>
                                        ) : newRuleFieldType === 'checkbox' ? (
                                          <input
                                            type="text"
                                            value={newRuleFieldValue}
                                            onChange={(e) => setNewRuleFieldValue(e.target.value)}
                                            placeholder="true or false"
                                            className="w-full px-3 py-1 border rounded-lg text-sm mb-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                                            title="Checkbox value: true or false"
                                          />
                                        ) : newRuleFieldType === 'dropdown' ? (
                                          <div className="flex gap-2 mb-2">
                                            <input
                                              type="text"
                                              value={newRuleFieldValue}
                                              onChange={(e) => setNewRuleFieldValue(e.target.value)}
                                              placeholder="Label"
                                              className="flex-1 px-3 py-1 border rounded-lg text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                                              title="The text shown in the dropdown (e.g., 'Enter Port Data')"
                                            />
                                            <input
                                              type="text"
                                              value={newRuleDropdownValue}
                                              onChange={(e) => setNewRuleDropdownValue(e.target.value)}
                                              placeholder="Value (optional)"
                                              className="flex-1 px-3 py-1 border rounded-lg text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                                              title="Optional - Leave empty to use Label as the value. Only specify if the internal value differs from display text."
                                            />
                                          </div>
                                        ) : newRuleFieldType === 'radio' ? (
                                          <div className="space-y-2 mb-2">
                                            <div className="bg-purple-50 p-2 rounded border border-purple-200">
                                              <p className="text-xs font-medium text-purple-900 mb-2">Radio Options:</p>
                                              {newRuleRadioOptions.length > 0 ? (
                                                <div className="space-y-1 mb-2">
                                                  {newRuleRadioOptions.map((option, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 bg-white px-2 py-1 rounded text-xs">
                                                      <span>{option}</span>
                                                      <button
                                                        onClick={() => setNewRuleRadioOptions(newRuleRadioOptions.filter((_, i) => i !== idx))}
                                                        className="ml-auto text-red-600 hover:text-red-800"
                                                      >
                                                        ✕
                                                      </button>
                                                    </div>
                                                  ))}
                                                </div>
                                              ) : (
                                                <p className="text-xs text-gray-500 mb-2">No options added yet</p>
                                              )}
                                              <div className="flex gap-1">
                                                <input
                                                  type="text"
                                                  value={newRuleRadioOptionInput}
                                                  onChange={(e) => setNewRuleRadioOptionInput(e.target.value)}
                                                  placeholder="Add option"
                                                  className="flex-1 px-2 py-1 border rounded text-xs"
                                                  onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && newRuleRadioOptionInput.trim()) {
                                                      setNewRuleRadioOptions([...newRuleRadioOptions, newRuleRadioOptionInput.trim()]);
                                                      setNewRuleRadioOptionInput('');
                                                    }
                                                  }}
                                                />
                                                <button
                                                  onClick={() => {
                                                    if (newRuleRadioOptionInput.trim() && !newRuleRadioOptions.includes(newRuleRadioOptionInput.trim())) {
                                                      setNewRuleRadioOptions([...newRuleRadioOptions, newRuleRadioOptionInput.trim()]);
                                                      setNewRuleRadioOptionInput('');
                                                    }
                                                  }}
                                                  className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                                                >
                                                  +
                                                </button>
                                              </div>
                                            </div>
                                            <select
                                              value={newRuleFieldValue}
                                              onChange={(e) => setNewRuleFieldValue(e.target.value)}
                                              className="w-full px-3 py-1 border rounded-lg text-sm"
                                            >
                                              <option value="">Select default value...</option>
                                              {newRuleRadioOptions.map((option, idx) => (
                                                <option key={idx} value={option}>{option}</option>
                                              ))}
                                            </select>
                                          </div>
                                        ) : null}
                                        <button
                                          onClick={handleAddFieldToRule}
                                          className="w-full px-3 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transform hover:scale-105 transition-all"
                                          title="Add this field to the current rule. You can add multiple fields."
                                        >
                                          ➕ Add Field to Rule
                                        </button>
                                      </div>
                                    </div>

                                    <button
                                      onClick={() => handleAddConditionalRule(actualIndex)}
                                      disabled={newRuleFields.length === 0}
                                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transform hover:scale-105 hover:shadow-lg transition-all duration-200 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mt-4"
                                      title={newRuleFields.length === 0 ? "Please add at least one field before saving" : "Save this rule and apply it to the task"}
                                    >
                                      ✔ Save Conditional Rule ({newRuleFields.length} field{newRuleFields.length !== 1 ? 's' : ''})
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Add New Task Modal */}
          {isAddingTask && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold mb-4 text-gray-800">➕ Add New Task</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task Name
                    </label>
                    <input
                      type="text"
                      value={newTask.taskName}
                      onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                      placeholder="Enter task name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newTask.isCompletable}
                        onChange={(e) => setNewTask({ ...newTask, isCompletable: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-200"
                      />
                      <span className="text-sm font-medium text-gray-700">Completable</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newTask.isRetryable}
                        onChange={(e) => setNewTask({ ...newTask, isRetryable: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-200"
                      />
                      <span className="text-sm font-medium text-gray-700">Retryable</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setIsAddingTask(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddTask}
                    disabled={!newTask.taskName.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskConfigTable;
