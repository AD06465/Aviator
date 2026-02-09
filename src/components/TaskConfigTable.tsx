'use client';
// Version: 2.0.0 - Full conditional rules support

import React, { useState, useEffect } from 'react';
import { logger } from '@/services/logging';

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

export interface TaskFieldMapping {
  fieldName: string;
  fieldValue: string;
  fieldType?: 'text' | 'dropdown';
  dropdownValue?: string;
}

export interface ConditionalRule {
  id: string;
  conditionType: 'workflow' | 'orderType' | 'custom';
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
  const [newFieldType, setNewFieldType] = useState<'text' | 'dropdown'>('text');
  const [newDropdownValue, setNewDropdownValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const [editFieldType, setEditFieldType] = useState<'text' | 'dropdown'>('text');
  const [editFieldName, setEditFieldName] = useState('');
  const [editFieldValue, setEditFieldValue] = useState('');
  const [editDropdownValue, setEditDropdownValue] = useState('');
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);

  const [showConditionalRules, setShowConditionalRules] = useState<number | null>(null);
  const [newRuleConditionType, setNewRuleConditionType] = useState<'workflow' | 'orderType' | 'custom'>('workflow');
  const [newRuleConditionValue, setNewRuleConditionValue] = useState('');
  const [newRuleFields, setNewRuleFields] = useState<TaskFieldMapping[]>([]);
  const [newRuleFieldName, setNewRuleFieldName] = useState('');
  const [newRuleFieldValue, setNewRuleFieldValue] = useState('');
  const [newRuleFieldType, setNewRuleFieldType] = useState<'text' | 'dropdown'>('text');
  const [newRuleDropdownValue, setNewRuleDropdownValue] = useState('');

  useEffect(() => {
    loadTasksFromStorage();
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!isInitialLoad && tasks.length >= 0) {
      saveTasksToStorage();
      // onConfigChange removed - TaskConfigTable manages its own localStorage
      // to prevent ConfigContext from overwriting conditionalRules
    }
  }, [tasks, isInitialLoad]);

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
    try {
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
      };

      console.log('💾 Saving task configuration:', {
        totalTasks: tasks.length,
        tasksWithRules: Object.keys(config.conditionalRules).length,
        rulesData: config.conditionalRules
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
    if (!editFieldName.trim() || !editFieldValue.trim()) {
      alert('Please enter both field name and value');
      return;
    }

    const updatedTask = { ...tasks[taskIndex] };
    if (updatedTask.fields.some(f => f.fieldName === editFieldName)) {
      alert('A field with this name already exists for this task');
      return;
    }

    const newField: TaskFieldMapping = {
      fieldName: editFieldName,
      fieldValue: editFieldValue,
      fieldType: editFieldType,
    };
    
    if (editFieldType === 'dropdown' && editDropdownValue) {
      newField.dropdownValue = editDropdownValue;
    }

    updatedTask.fields.push(newField);
    handleUpdateTask(taskIndex, updatedTask);
    setEditFieldName('');
    setEditFieldValue('');
    setEditDropdownValue('');
    setEditFieldType('text');
  };

  const handleEditField = (taskIndex: number, fieldIndex: number) => {
    const field = tasks[taskIndex].fields[fieldIndex];
    setEditFieldName(field.fieldName);
    setEditFieldValue(field.fieldValue);
    setEditFieldType(field.fieldType || 'text');
    setEditDropdownValue(field.dropdownValue || '');
    setEditingFieldIndex(fieldIndex);
  };

  const handleUpdateField = (taskIndex: number, fieldIndex: number) => {
    if (!editFieldName.trim() || !editFieldValue.trim()) {
      alert('Please enter both field name and value');
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

    updatedTask.fields[fieldIndex] = updatedField;
    handleUpdateTask(taskIndex, updatedTask);
    setEditFieldName('');
    setEditFieldValue('');
    setEditDropdownValue('');
    setEditFieldType('text');
    setEditingFieldIndex(null);
  };

  const handleCancelFieldEdit = () => {
    setEditFieldName('');
    setEditFieldValue('');
    setEditDropdownValue('');
    setEditFieldType('text');
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

    setNewRuleFields([...newRuleFields, newField]);
    setNewRuleFieldName('');
    setNewRuleFieldValue('');
    setNewRuleDropdownValue('');
    setNewRuleFieldType('text');
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

  const filteredTasks = tasks.filter(task =>
    task.taskName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportConfig = () => {
    console.log('📤 Exporting config from tasks:', tasks.map(t => ({
      name: t.taskName,
      hasRules: !!t.conditionalRules && t.conditionalRules.length > 0,
      rulesCount: t.conditionalRules?.length || 0
    })));

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
        <div className="p-6">
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
              onClick={() => setIsAddingTask(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              ➕ Add New Task
            </button>
          </div>

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
                                                  onChange={(e) => setEditFieldType(e.target.value as 'text' | 'dropdown')}
                                                  className="px-2 py-1 border rounded text-sm"
                                                >
                                                  <option value="text">📝 Text</option>
                                                  <option value="dropdown">📋 Dropdown</option>
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
                                                  placeholder="Value"
                                                  className="w-full px-3 py-1 border rounded text-sm"
                                                />
                                              ) : (
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
                                              )}
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
                                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium hover:bg-purple-200 transition-colors duration-200">📋 Dropdown</span>
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
                                        <div className="absolute left-0 top-6 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                                          <p className="font-semibold mb-2">📝 Text Field:</p>
                                          <p className="mb-1">• <b>Field Name:</b> FlightDeck field (e.g., "Requested Due Date")</p>
                                          <p className="mb-3">• <b>Value:</b> Text to set (can use {{placeholders}})</p>
                                          <p className="font-semibold mb-2">📋 Dropdown Field:</p>
                                          <p className="mb-1">• <b>Field Name:</b> FlightDeck field (e.g., "Fallout Action")</p>
                                          <p className="mb-1">• <b>Label:</b> What shows in dropdown (e.g., "Enter Port Data") <span className="text-green-300">✓ Required</span></p>
                                          <p>• <b>Value:</b> Optional - Only if different from Label</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 mb-2">
                                      <select
                                        value={editFieldType}
                                        onChange={(e) => setEditFieldType(e.target.value as 'text' | 'dropdown')}
                                        className="px-2 py-1 border rounded text-sm"
                                      >
                                        <option value="text">📝 Text</option>
                                        <option value="dropdown">📋 Dropdown</option>
                                      </select>
                                      <input
                                        type="text"
                                        value={editFieldName}
                                        onChange={(e) => setEditFieldName(e.target.value)}
                                        placeholder="Field name"
                                        className="flex-1 px-3 py-1 border rounded text-sm"
                                        title="The field name in FlightDeck (e.g., 'Fallout Action', 'Requested Due Date')"
                                      />
                                    </div>
                                    {editFieldType === 'text' ? (
                                      <input
                                        type="text"
                                        value={editFieldValue}
                                        onChange={(e) => setEditFieldValue(e.target.value)}
                                        placeholder="Value"
                                        className="w-full px-3 py-1 border rounded text-sm mb-2"
                                        title="The value to set for this field (can use placeholders like {{preferredDevice}})"
                                      />
                                    ) : (
                                      <div className="flex gap-2 mb-2">
                                        <input
                                          type="text"
                                          value={editFieldValue}
                                          onChange={(e) => setEditFieldValue(e.target.value)}
                                          placeholder="Label"
                                          className="flex-1 px-3 py-1 border rounded text-sm"
                                          title="The text shown in the dropdown (e.g., 'Enter Port Data')"
                                        />
                                        <input
                                          type="text"
                                          value={editDropdownValue}
                                          onChange={(e) => setEditDropdownValue(e.target.value)}
                                          placeholder="Value (optional)"
                                          className="flex-1 px-3 py-1 border rounded text-sm"
                                          title="Optional - Leave empty to use Label as the value. Only specify if the internal value differs from display text."
                                        />
                                      </div>
                                    )}
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
                                            <div key={idx} className="text-sm bg-purple-50 p-2 rounded">
                                              <span className="font-medium">{field.fieldName}:</span> {field.fieldValue}
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
                                        onChange={(e) => setNewRuleConditionType(e.target.value as 'workflow' | 'orderType' | 'custom')}
                                        className="px-3 py-2 border rounded-lg text-sm bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                        title="Choose what type of condition triggers this rule"
                                      >
                                        <option value="workflow">🔄 Workflow Type</option>
                                        <option value="orderType">📦 Order Type</option>
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
                                                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">📋</span>
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
                                            onChange={(e) => setNewRuleFieldType(e.target.value as 'text' | 'dropdown')}
                                            className="px-2 py-1 border rounded-lg text-sm"
                                          >
                                            <option value="text">📝 Text</option>
                                            <option value="dropdown">📋 Dropdown</option>
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
                                            placeholder="Value"
                                            className="w-full px-3 py-1 border rounded-lg text-sm mb-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                                            title="The value to set for this field (can use placeholders like {{preferredDevice}})"
                                          />
                                        ) : (
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
                                        )}
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
        </div>
      </div>
    </div>
  );
};

export default TaskConfigTable;
