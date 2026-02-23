'use client';

import React, { useState } from 'react';
import { TaskManagementConfig, TaskSequencingRule } from '../types';

interface TaskSequencingManagerProps {
  config: TaskManagementConfig;
  onConfigChange: (config: TaskManagementConfig) => void;
}

export const TaskSequencingManager: React.FC<TaskSequencingManagerProps> = ({
  config,
  onConfigChange,
}) => {

  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [tempRule, setTempRule] = useState<TaskSequencingRule>({});
  const [tempDependency, setTempDependency] = useState<string>('');

  // Get fresh data from config prop on every render
  const allTaskNames = Array.from(new Set([
    ...(config.completableTasks || []),
    ...(config.retryableTasks || []),
  ])).sort();

  const sequencing = config.taskSequencing || {};
  const sequencingKeys = Object.keys(sequencing);
  
  console.log('🔍 TaskSequencingManager render:', 
    'Keys:', sequencingKeys, 
    'Count:', sequencingKeys.length,
    'Data:', JSON.stringify(sequencing, null, 2)
  );

  const handleAddRule = (taskName: string) => {
    setEditingTask(taskName);
    setTempRule(sequencing[taskName] || {});
    setTempDependency('');
  };

  const handleSaveRule = () => {
    if (!editingTask) return;

    const updatedSequencing = {
      ...sequencing,
      [editingTask]: {
        ...tempRule,
        dependsOn: tempRule.dependsOn || [],
      },
    };

    // Remove empty rules
    if (
      !updatedSequencing[editingTask].priority &&
      (!updatedSequencing[editingTask].dependsOn || updatedSequencing[editingTask].dependsOn!.length === 0) &&
      !updatedSequencing[editingTask].waitForCompletion &&
      !updatedSequencing[editingTask].delayAfter
    ) {
      delete updatedSequencing[editingTask];
    }

    console.log('💾 Saving sequencing rule for:', editingTask);
    console.log('   Rule:', JSON.stringify(updatedSequencing[editingTask], null, 2));
    console.log('   All Rules:', JSON.stringify(updatedSequencing, null, 2));

    onConfigChange({
      ...config,
      taskSequencing: updatedSequencing,
    });

    setEditingTask(null);
    setTempRule({});
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setTempRule({});
    setTempDependency('');
  };

  const handleRemoveRule = (taskName: string) => {
    const updatedSequencing = { ...sequencing };
    delete updatedSequencing[taskName];
    onConfigChange({
      ...config,
      taskSequencing: updatedSequencing,
    });
  };

  const handleAddDependency = () => {
    if (!tempDependency || !editingTask) return;
    
    const currentDeps = tempRule.dependsOn || [];
    if (!currentDeps.includes(tempDependency) && tempDependency !== editingTask) {
      setTempRule({
        ...tempRule,
        dependsOn: [...currentDeps, tempDependency],
      });
      setTempDependency('');
    }
  };

  const handleRemoveDependency = (dep: string) => {
    const currentDeps = tempRule.dependsOn || [];
    setTempRule({
      ...tempRule,
      dependsOn: currentDeps.filter(d => d !== dep),
    });
  };

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h3 className="font-semibold text-blue-900 mb-2">How Task Sequencing Works:</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li><strong>Priority:</strong> Lower number = higher priority (1 is highest)</li>
          <li><strong>Dependencies:</strong> Task will wait for specified tasks to complete first</li>
          <li><strong>Wait for Completion:</strong> Block all other tasks until this one finishes</li>
          <li><strong>Delay After:</strong> Add cooldown period (in seconds) after task completes</li>
        </ul>
      </div>

          {/* Current Rules Table */}
          {Object.keys(sequencing).length > 0 && (
            <div className="overflow-x-auto">
              <h3 className="font-semibold text-gray-800 mb-3">Active Sequencing Rules</h3>
              <table className="min-w-full bg-white border border-gray-200 rounded">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Task Name</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Priority</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Dependencies</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Wait</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Delay (s)</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(sequencing).map(([taskName, rule]) => (
                    <tr key={taskName} className="border-t border-gray-200">
                      <td className="px-4 py-2 text-sm text-gray-800">{taskName}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {rule.priority !== undefined ? rule.priority : '-'}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {rule.dependsOn && rule.dependsOn.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {rule.dependsOn.map(dep => (
                              <span key={dep} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                {dep}
                              </span>
                            ))}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {rule.waitForCompletion ? (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Yes</span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {rule.delayAfter || '-'}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <button
                          onClick={() => handleAddRule(taskName)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemoveRule(taskName)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add/Edit Rule Form */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              {editingTask ? `Edit Rule: ${editingTask}` : 'Add New Sequencing Rule'}
            </h3>
            
            {!editingTask ? (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Select Task:</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value=""
                  onChange={(e) => handleAddRule(e.target.value)}
                >
                  <option value="">-- Choose a task --</option>
                  {allTaskNames.map(taskName => (
                    <option key={taskName} value={taskName}>
                      {taskName}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-4 bg-gray-50 p-4 rounded">
                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority (optional):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    placeholder="1 = highest priority"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={tempRule.priority || ''}
                    onChange={(e) =>
                      setTempRule({
                        ...tempRule,
                        priority: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                  />
                </div>

                {/* Dependencies */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dependencies (tasks that must complete first):
                  </label>
                  <div className="flex gap-2 mb-2">
                    <select
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={tempDependency}
                      onChange={(e) => setTempDependency(e.target.value)}
                    >
                      <option value="">-- Select dependency --</option>
                      {allTaskNames
                        .filter(t => t !== editingTask && !(tempRule.dependsOn || []).includes(t))
                        .map(taskName => (
                          <option key={taskName} value={taskName}>
                            {taskName}
                          </option>
                        ))}
                    </select>
                    <button
                      onClick={handleAddDependency}
                      disabled={!tempDependency}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    >
                      Add
                    </button>
                  </div>
                  {tempRule.dependsOn && tempRule.dependsOn.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tempRule.dependsOn.map(dep => (
                        <span
                          key={dep}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {dep}
                          <button
                            onClick={() => handleRemoveDependency(dep)}
                            className="text-purple-600 hover:text-purple-800 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Wait for Completion */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="waitForCompletion"
                    checked={tempRule.waitForCompletion || false}
                    onChange={(e) =>
                      setTempRule({
                        ...tempRule,
                        waitForCompletion: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="waitForCompletion" className="text-sm font-medium text-gray-700">
                    Wait for this task to complete before processing others (blocking)
                  </label>
                </div>

                {/* Delay After */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delay after completion (seconds):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="3600"
                    placeholder="0 = no delay"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={tempRule.delayAfter || ''}
                    onChange={(e) =>
                      setTempRule({
                        ...tempRule,
                        delayAfter: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleSaveRule}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                  >
                    Save Rule
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
    </div>
  );
};
