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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      {/* Header - Compact */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-blue-600">🚀</span>
          Enhanced Task Automation
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Auto-processes Ready/Assigned/Created tasks with smart field detection
        </p>
      </div>

      {/* Processing Status - Compact */}
      {processingStatus && processingStatus.isProcessing && (
        <div className="mb-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300 rounded-md p-3">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-blue-900 truncate">
                {processingStatus.currentTask}
              </div>
              <div className="text-xs text-blue-700">
                {processingStatus.completedTasks}/{processingStatus.totalTasks} completed
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Statistics - Compact Grid */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="bg-green-50 rounded-md p-2 text-center border border-green-200">
          <div className="text-xl font-bold text-green-600">
            {categorizedTasks.completableTasks.length}
          </div>
          <div className="text-[10px] text-gray-600 leading-tight">Auto-Ready</div>
        </div>
        <div className="bg-gray-50 rounded-md p-2 text-center border border-gray-200">
          <div className="text-xl font-bold text-gray-600">
            {categorizedTasks.nonCompletableTasks.length}
          </div>
          <div className="text-[10px] text-gray-600 leading-tight">Other</div>
        </div>
        <div className="bg-blue-50 rounded-md p-2 text-center border border-blue-200">
          <div className="text-xl font-bold text-blue-600">
            {categorizedTasks.totalTasks}
          </div>
          <div className="text-[10px] text-gray-600 leading-tight">Total</div>
        </div>
        <div className="bg-purple-50 rounded-md p-2 text-center border border-purple-200">
          <div className="text-xl font-bold text-purple-600">
            {processingStatus?.completedTasks || 0}
          </div>
          <div className="text-[10px] text-gray-600 leading-tight">Done</div>
        </div>
      </div>

      {/* Status Breakdown - Compact Badges */}
      <div className="mb-3">
        <h4 className="text-xs font-semibold text-gray-700 mb-1.5">Status Breakdown</h4>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(categorizedTasks.statusCounts).map(([status, count]) => (
            <span
              key={status}
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(status)}`}
            >
              {status.toUpperCase()}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* Completable Tasks List - Compact */}
      {categorizedTasks.completableTasks.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
            Auto-Completable ({categorizedTasks.completableTasks.length})
          </h4>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {categorizedTasks.completableTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gradient-to-r from-green-50 to-green-100 rounded border border-green-200 hover:shadow-sm transition-shadow">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs text-gray-900 truncate">{task.TASK_NAME}</div>
                  <div className="text-[10px] text-gray-500">ID: {task.ID}</div>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ml-2 ${getStatusColor(task.TASK_STATUS)}`}>
                  {task.TASK_STATUS}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhancement Features - Compact */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-md p-2.5 border border-gray-200">
        <h4 className="text-xs font-semibold text-gray-800 mb-1.5 flex items-center gap-1">
          <span>🎯</span> Features
        </h4>
        <div className="grid grid-cols-1 gap-1 text-[10px] text-gray-600">
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 flex-shrink-0"></span>
            <span className="leading-tight">Universal task completion (Ready/Assigned/Created)</span>
          </div>
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 flex-shrink-0"></span>
            <span className="leading-tight">Auto mandatory field detection from API</span>
          </div>
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5 flex-shrink-0"></span>
            <span className="leading-tight">Interactive prompts for missing fields</span>
          </div>
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5 flex-shrink-0"></span>
            <span className="leading-tight">Smart field mapping with config fallback</span>
          </div>
        </div>
      </div>
    </div>
  );
};
