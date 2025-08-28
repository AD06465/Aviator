import React from 'react';
import { Task } from '@/types';

interface TaskStatusDisplayProps {
  tasks: Task[];
  processingStatus?: {
    isProcessing: boolean;
    currentTask?: string;
    totalTasks: number;
    completedTasks: number;
    failedTasks: Task[];
  };
}

export const TaskStatusDisplay: React.FC<TaskStatusDisplayProps> = ({ 
  tasks, 
  processingStatus 
}) => {
  // Categorize tasks by status and type
  const categorizedTasks = React.useMemo(() => {
    const completableStatuses = ['ready', 'assigned', 'created'];
    
    const completableTasks = tasks.filter(task => 
      completableStatuses.includes(task.TASK_STATUS.toLowerCase())
    );
    
    const nonCompletableTasks = tasks.filter(task => 
      !completableStatuses.includes(task.TASK_STATUS.toLowerCase())
    );
    
    const statusCounts = tasks.reduce((acc, task) => {
      const status = task.TASK_STATUS.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      completableTasks,
      nonCompletableTasks,
      statusCounts,
      totalTasks: tasks.length
    };
  }, [tasks]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'created': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'in progress': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Enhanced Task Automation Status
        </h3>
        <div className="text-sm text-gray-600">
          🚀 Now processes <strong>ANY</strong> task in Ready/Assigned/Created status with automatic mandatory field detection
        </div>
      </div>

      {/* Processing Status */}
      {processingStatus && processingStatus.isProcessing && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <div>
              <div className="font-medium text-blue-900">Processing Tasks</div>
              <div className="text-sm text-blue-700">
                Current: {processingStatus.currentTask}
              </div>
              <div className="text-sm text-blue-600">
                Progress: {processingStatus.completedTasks}/{processingStatus.totalTasks}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {categorizedTasks.completableTasks.length}
          </div>
          <div className="text-sm text-gray-500">Auto-Completable</div>
          <div className="text-xs text-gray-400">Ready/Assigned/Created</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">
            {categorizedTasks.nonCompletableTasks.length}
          </div>
          <div className="text-sm text-gray-500">Other Status</div>
          <div className="text-xs text-gray-400">In Progress/Completed/etc</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {categorizedTasks.totalTasks}
          </div>
          <div className="text-sm text-gray-500">Total Tasks</div>
          <div className="text-xs text-gray-400">All statuses</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {processingStatus?.completedTasks || 0}
          </div>
          <div className="text-sm text-gray-500">Completed</div>
          <div className="text-xs text-gray-400">This session</div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Task Status Breakdown</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categorizedTasks.statusCounts).map(([status, count]) => (
            <span
              key={status}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}
            >
              {status.toUpperCase()}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* Completable Tasks List */}
      {categorizedTasks.completableTasks.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Auto-Completable Tasks ({categorizedTasks.completableTasks.length})
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {categorizedTasks.completableTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded border">
                <div>
                  <div className="font-medium text-sm">{task.TASK_NAME}</div>
                  <div className="text-xs text-gray-500">ID: {task.ID}</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.TASK_STATUS)}`}>
                  {task.TASK_STATUS}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhancement Features */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">🎯 Enhanced Features</h4>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Universal task completion for Ready/Assigned/Created status
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Automatic mandatory field detection from API metadata
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Interactive user prompts for missing required fields
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
            Smart field mapping with configuration fallback
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Enhanced logging and task categorization
          </div>
        </div>
      </div>
    </div>
  );
};
