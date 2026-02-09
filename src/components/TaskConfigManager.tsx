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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">Task Field Mappings ✨ Smart & Dynamic</h4>
            <p className="text-gray-600 mt-1">Define values for task fields - system automatically uses only fields present in each task</p>
          </div>
        </div>
        
        {/* Enhanced Feature Explanation */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6">
          <h5 className="font-semibold text-purple-800 mb-2">🎯 How It Works: Smart Field Mapping</h5>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <strong>Add ALL possible fields</strong> for a task type - the system will intelligently check which fields 
              are actually present in each task and <strong>only use the matching ones</strong>.
            </p>
            <div className="bg-white border border-purple-200 rounded p-3 mt-2">
              <p className="font-semibold text-purple-700 mb-2">📝 Example Scenario:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Configure for "Provision Service":</p>
                  <div className="space-y-1 ml-2">
                    <div>• <code className="bg-gray-100 px-1 rounded">ECN Device</code> → LAB4COZWZG001</div>
                    <div>• <code className="bg-gray-100 px-1 rounded">ECN Port</code> → Gi0/0/16</div>
                    <div>• <code className="bg-gray-100 px-1 rounded">Device Mount Type</code> → Front Mount</div>
                    <div>• <code className="bg-gray-100 px-1 rounded">Auto Select Port</code> → No</div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">✅ System Behavior:</p>
                  <div className="space-y-1 ml-2 text-green-700">
                    <div>→ <strong>Order A</strong>: Has "ECN Device" + "ECN Port" → Uses both</div>
                    <div>→ <strong>Order B</strong>: Has only "Auto Select Port" → Uses only that</div>
                    <div>→ <strong>Order C</strong>: Has all 4 fields → Uses all</div>
                  </div>
                  <p className="text-purple-600 mt-2 italic">⚡ No need to create separate configs!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Label Support Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
          <h5 className="font-semibold text-green-800 mb-2">🎉 Flexible Input: Field Names OR Labels</h5>
          <p className="text-sm text-gray-700 mb-3">
            You can use <strong>either</strong> technical field names OR user-friendly labels from FlightDeck UI. 
            The system automatically resolves both!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white border border-green-200 rounded p-3">
              <h6 className="font-semibold text-green-700 mb-2">✅ Both formats work:</h6>
              <div className="space-y-1">
                <div><code className="bg-gray-100 px-1 rounded">autoselectECNPort</code> → <span className="text-blue-600">No</span></div>
                <div><code className="bg-gray-100 px-1 rounded">Auto Select ECN Port</code> → <span className="text-blue-600">No</span></div>
                <div className="text-purple-600 italic mt-1">→ Both map to the same field!</div>
              </div>
            </div>
            <div className="bg-white border border-blue-200 rounded p-3">
              <h6 className="font-semibold text-blue-700 mb-2">🎯 More examples:</h6>
              <div className="space-y-1">
                <div><code className="bg-gray-100 px-1 rounded">ECN Device</code> → <span className="text-blue-600">Router-X1</span></div>
                <div><code className="bg-gray-100 px-1 rounded">Device Mount Type</code> → <span className="text-blue-600">Front Mount</span></div>
                <div><code className="bg-gray-100 px-1 rounded">deviceMountType</code> → <span className="text-blue-600">Front Mount</span></div>
              </div>
            </div>
          </div>
        </div>
        
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
            placeholder="Field name OR label (e.g., 'ECN Device' or 'ecnDevice')"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <input
            type="text"
            value={newFieldValue}
            onChange={(e) => setNewFieldValue(e.target.value)}
            placeholder="Field value (or use {{preferredDevice}}, {{preferredPort}})"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Add Field Button and Quick Tips */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={addFieldMapping}
            disabled={!selectedTaskForField || !newFieldName.trim() || !newFieldValue.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-medium"
          >
            Add Field Mapping
          </button>
          
          {/* Quick tip for dynamic placeholders */}
          <div className="flex-1 bg-blue-50 border border-blue-200 rounded p-3 text-xs text-gray-700">
            <p className="font-semibold text-blue-800 mb-1">💡 Pro Tips:</p>
            <div className="ml-2 space-y-0.5">
              <div>• Use <code className="bg-white px-1 rounded">{'{{preferredDevice}}'}</code> to insert device from Device Manager</div>
              <div>• Use <code className="bg-white px-1 rounded">{'{{preferredPort}}'}</code> to insert port from Device Manager</div>
              <div>• <strong>Add all possible fields</strong> - system only uses fields that exist in each task</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(config.taskFieldMappings).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No field mappings configured yet.</p>
              <p className="text-sm mt-2">Add field mappings above to configure default values for task fields.</p>
            </div>
          ) : (
            Object.entries(config.taskFieldMappings).map(([taskName, fields]) => (
              <div key={taskName} className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3">{taskName}</h5>
                <div className="space-y-2">
                  {Object.entries(fields).map(([fieldName, fieldValue]) => (
                    <div
                      key={fieldName}
                      className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-blue-800">{fieldName}</span>
                          <span className="text-gray-500">→</span>
                          <span className="text-blue-700 font-medium">{String(fieldValue)}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ⚡ System checks if this field exists in the task before applying - unused fields are ignored
                        </div>
                      </div>
                      <button
                        onClick={() => removeFieldMapping(taskName, fieldName)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Remove field mapping"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
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
