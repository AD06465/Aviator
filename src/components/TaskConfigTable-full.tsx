'use client';

import React, { useState, useEffect } from 'react';
import { logger } from '@/services/logging';

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

  const [showConditionalRules, setShowConditionalRules] = useState<number | null>(null);
  const [newRuleConditionType, setNewRuleConditionType] = useState<'workflow' | 'orderType' | 'custom'>('workflow');
  const [newRuleConditionValue, setNewRuleConditionValue] = useState('');
  const [newRuleFields, setNewRuleFields] = useState<TaskFieldMapping[]>([]);

  useEffect(() => {
    loadTasksFromStorage();
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (tasks.length > 0 && !isExpanded) {
      setIsExpanded(true);
    }
  }, [tasks.length]);

  useEffect(() => {
    if (!isInitialLoad && tasks.length >= 0) {
      saveTasksToStorage();
      if (onConfigChange) {
        onConfigChange(tasks);
      }
    }
  }, [tasks, isInitialLoad, onConfigChange]);

  const loadTasksFromStorage = () => {
    try {
      const stored = localStorage.getItem('aviator-task-config');
      if (stored) {
        const config = JSON.parse(stored);
        const taskConfigs: TaskConfiguration[] = [];

        if (config.completableTasks) {
          config.completableTasks.forEach((taskName: string) => {
            const existing = taskConfigs.find(t => t.taskName === taskName);
            if (!existing) {
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
                conditionalRules: config.conditionalRules?.[taskName] || [],
              });
            }
          });
        }

        if (config.retryableTasks) {
          config.retryableTasks.forEach((taskName: string) => {
            const existing = taskConfigs.find(t => t.taskName === taskName);
            if (!existing) {
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

        setTasks(taskConfigs);
        logger.info('Task configuration loaded', {
          component: 'TaskConfigTable',
          taskCount: taskConfigs.length,
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

      localStorage.setItem('aviator-task-config', JSON.stringify(config));
      logger.info('Task configuration saved', {
        component: 'TaskConfigTable',
        taskCount: tasks.length,
      });
    } catch (error) {
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

  const handleDeleteField = (taskIndex: number, fieldIndex: number) => {
    const updatedTask = { ...tasks[taskIndex] };
    updatedTask.fields = updatedTask.fields.filter((_, i) => i !== fieldIndex);
    handleUpdateTask(taskIndex, updatedTask);
  };

  const handleAddConditionalRule = (taskIndex: number) => {
    if (!newRuleConditionValue.trim()) {
      alert('Please enter a condition value');
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

    updatedTask.conditionalRules.push(newRule);
    handleUpdateTask(taskIndex, updatedTask);
    setNewRuleConditionType('workflow');
    setNewRuleConditionValue('');
    setNewRuleFields([]);
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
    <div className="bg-white rounded-lg shadow-lg">
      <div 
        className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isExpanded ? '⚙️' : '📋'}</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Task Configuration Manager</h2>
            <p className="text-sm text-gray-600 mt-1">
              {isExpanded ? 'Manage task automation rules and mandatory field mappings' : `${tasks.length} task${tasks.length !== 1 ? 's' : ''} configured - Click to expand`}
            </p>
          </div>
        </div>
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={exportConfig}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            📥 Export Config
          </button>
          <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer text-sm">
            📤 Import Config
            <input
              type="file"
              accept=".json"
              onChange={importConfig}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-2xl hover:bg-gray-200 rounded-full p-1"
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 border-t border-gray-200">
          <div className="mb-4 flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md"
            />
            <button
              onClick={() => setIsAddingTask(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{task.taskName}</td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={task.isCompletable}
                              onChange={(e) => handleUpdateTask(actualIndex, { isCompletable: e.target.checked })}
                              className="w-4 h-4 text-blue-600"
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={task.isRetryable}
                              onChange={(e) => handleUpdateTask(actualIndex, { isRetryable: e.target.checked })}
                              className="w-4 h-4 text-blue-600"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {task.fields.length} field{task.fields.length !== 1 ? 's' : ''}
                            {task.conditionalRules && task.conditionalRules.length > 0 && (
                              <span className="ml-2 text-purple-600">+ {task.conditionalRules.length} rule{task.conditionalRules.length !== 1 ? 's' : ''}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => setEditingTaskIndex(isEditing ? null : actualIndex)}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                              >
                                {isEditing ? '✓ Done' : '✏️ Edit'}
                              </button>
                              <button
                                onClick={() => setShowConditionalRules(showConditionalRules === actualIndex ? null : actualIndex)}
                                className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                              >
                                🔀 Rules
                              </button>
                              <button
                                onClick={() => handleDeleteTask(actualIndex)}
                                className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>

                        {isEditing && (
                          <tr>
                            <td colSpan={5} className="px-4 py-4 bg-blue-50">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">Mandatory Fields</h4>
                                  {task.fields.length === 0 ? (
                                    <p className="text-sm text-gray-500 mb-2">No fields configured</p>
                                  ) : (
                                    <div className="space-y-2 mb-4">
                                      {task.fields.map((field, fieldIndex) => (
                                        <div key={fieldIndex} className="flex items-center gap-2 bg-white p-2 rounded">
                                          <span className="font-medium text-sm">{field.fieldName}:</span>
                                          <span className="text-sm text-gray-600">{field.fieldValue}</span>
                                          {field.fieldType === 'dropdown' && (
                                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Dropdown</span>
                                          )}
                                          <button
                                            onClick={() => handleDeleteField(actualIndex, fieldIndex)}
                                            className="ml-auto px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  <div className="bg-white p-3 rounded border border-gray-300">
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
                                      />
                                    </div>
                                    {editFieldType === 'text' ? (
                                      <input
                                        type="text"
                                        value={editFieldValue}
                                        onChange={(e) => setEditFieldValue(e.target.value)}
                                        placeholder="Value"
                                        className="w-full px-3 py-1 border rounded text-sm mb-2"
                                      />
                                    ) : (
                                      <div className="flex gap-2 mb-2">
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
                                    <button
                                      onClick={() => handleAddField(actualIndex)}
                                      className="w-full px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                    >
                                      ➕ Add Field
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}

                        {showConditionalRules === actualIndex && (
                          <tr>
                            <td colSpan={5} className="px-4 py-4 bg-purple-50">
                              <div className="space-y-4">
                                <h4 className="font-medium text-purple-900">Conditional Rules</h4>
                                
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
                                  <h5 className="font-medium text-purple-900 mb-3">➕ Add New Rule</h5>
                                  <div className="space-y-3">
                                    <div className="flex gap-2">
                                      <select
                                        value={newRuleConditionType}
                                        onChange={(e) => setNewRuleConditionType(e.target.value as 'workflow' | 'orderType' | 'custom')}
                                        className="px-3 py-2 border rounded-md text-sm bg-white"
                                      >
                                        <option value="workflow">Workflow Type</option>
                                        <option value="orderType">Order Type</option>
                                        <option value="custom">Custom</option>
                                      </select>
                                      <input
                                        type="text"
                                        value={newRuleConditionValue}
                                        onChange={(e) => setNewRuleConditionValue(e.target.value)}
                                        placeholder='e.g., "Monarch Onnet" or "Colorless"'
                                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                                      />
                                    </div>
                                    
                                    <div className="text-sm text-gray-600">
                                      Fields for this rule: {newRuleFields.length}
                                    </div>

                                    <button
                                      onClick={() => handleAddConditionalRule(actualIndex)}
                                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                    >
                                      Add Conditional Rule
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
      )}
    </div>
  );
};

export default TaskConfigTable;
