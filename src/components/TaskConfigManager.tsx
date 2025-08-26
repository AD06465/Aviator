import React, { useState } from 'react';
import { TaskManagementConfig } from '../types';
import { defaultTaskConfig } from '../lib/taskConfig';

interface TaskConfigProps {
  config: TaskManagementConfig;
  onConfigChange: (config: TaskManagementConfig) => void;
}

const TaskConfigManager: React.FC<TaskConfigProps> = ({ config, onConfigChange }) => {
  const [activeTab, setActiveTab] = useState<'completable' | 'retryable'>('completable');
  const [newTaskName, setNewTaskName] = useState('');
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [selectedTaskForField, setSelectedTaskForField] = useState('');

  const addTask = (type: 'completable' | 'retryable') => {
    if (!newTaskName.trim()) return;

    const updatedConfig = { ...config };
    if (type === 'completable') {
      updatedConfig.completableTasks = [...updatedConfig.completableTasks, newTaskName.trim()];
    } else {
      updatedConfig.retryableTasks = [...updatedConfig.retryableTasks, newTaskName.trim()];
    }
    
    onConfigChange(updatedConfig);
    setNewTaskName('');
  };

  const removeTask = (taskName: string, type: 'completable' | 'retryable') => {
    const updatedConfig = { ...config };
    if (type === 'completable') {
      updatedConfig.completableTasks = updatedConfig.completableTasks.filter(t => t !== taskName);
    } else {
      updatedConfig.retryableTasks = updatedConfig.retryableTasks.filter(t => t !== taskName);
    }
    
    onConfigChange(updatedConfig);
  };

  const addFieldMapping = () => {
    if (!selectedTaskForField || !newFieldName.trim() || !newFieldValue.trim()) return;

    const updatedConfig = { ...config };
    if (!updatedConfig.taskFieldMappings[selectedTaskForField]) {
      updatedConfig.taskFieldMappings[selectedTaskForField] = {};
    }
    
    updatedConfig.taskFieldMappings[selectedTaskForField][newFieldName.trim()] = newFieldValue.trim();
    onConfigChange(updatedConfig);
    
    setNewFieldName('');
    setNewFieldValue('');
  };

  const removeFieldMapping = (taskName: string, fieldName: string) => {
    const updatedConfig = { ...config };
    delete updatedConfig.taskFieldMappings[taskName][fieldName];
    
    if (Object.keys(updatedConfig.taskFieldMappings[taskName]).length === 0) {
      delete updatedConfig.taskFieldMappings[taskName];
    }
    
    onConfigChange(updatedConfig);
  };

  const resetToDefaults = () => {
    onConfigChange(defaultTaskConfig);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Task Configuration</h3>
            <p className="text-gray-600 mt-1">Manage task completion and retry rules</p>
          </div>
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('completable')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'completable'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Completable Tasks ({config.completableTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('retryable')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'retryable'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Retryable Tasks ({config.retryableTasks.length})
          </button>
        </nav>
      </div>

      <div className="p-6">
        {/* Completable Tasks Tab */}
        {activeTab === 'completable' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Tasks that can be completed automatically
              </h4>
              
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="Enter task name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => addTask('completable')}
                  disabled={!newTaskName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Task
                </button>
              </div>

              <div className="space-y-2">
                {config.completableTasks.map((taskName) => (
                  <div
                    key={taskName}
                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <span className="text-green-800 font-medium">{taskName}</span>
                    <button
                      onClick={() => removeTask(taskName, 'completable')}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Retryable Tasks Tab */}
        {activeTab === 'retryable' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Tasks that can be retried when failed
              </h4>
              
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="Enter task name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => addTask('retryable')}
                  disabled={!newTaskName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Task
                </button>
              </div>

              <div className="space-y-2">
                {config.retryableTasks.map((taskName) => (
                  <div
                    key={taskName}
                    className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <span className="text-yellow-800 font-medium">{taskName}</span>
                    <button
                      onClick={() => removeTask(taskName, 'retryable')}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Field Mappings Section */}
      <div className="border-t border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Task Field Mappings</h4>
        <p className="text-gray-600 mb-4">Define what data should be entered for mandatory fields in specific tasks</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            value={selectedTaskForField}
            onChange={(e) => setSelectedTaskForField(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select task</option>
            {[...config.completableTasks, ...config.retryableTasks].map((taskName) => (
              <option key={taskName} value={taskName}>
                {taskName}
              </option>
            ))}
          </select>
          
          <input
            type="text"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            placeholder="Field name"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={newFieldValue}
              onChange={(e) => setNewFieldValue(e.target.value)}
              placeholder="Field value"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addFieldMapping}
              disabled={!selectedTaskForField || !newFieldName.trim() || !newFieldValue.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(config.taskFieldMappings).map(([taskName, fields]) => (
            <div key={taskName} className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-900 mb-3">{taskName}</h5>
              <div className="space-y-2">
                {Object.entries(fields).map(([fieldName, fieldValue]) => (
                  <div
                    key={fieldName}
                    className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded"
                  >
                    <div className="flex-1">
                      <span className="font-medium text-blue-800">{fieldName}:</span>{' '}
                      <span className="text-blue-700">{String(fieldValue)}</span>
                    </div>
                    <button
                      onClick={() => removeFieldMapping(taskName, fieldName)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {Object.keys(config.taskFieldMappings).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No field mappings configured. Add mappings above to define mandatory field values for tasks.
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskConfigManager;
