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
  const [isExpanded, setIsExpanded] = useState(false);

  const exportConfig = () => {
    const config = {
      completableTasks: tasks.filter(t => t.isCompletable).map(t => t.taskName),
      retryableTasks: tasks.filter(t => t.isRetryable).map(t => t.taskName),
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
        const config = JSON.parse(e.target?.result as string);
        logger.info('Config imported', { component: 'TaskConfigTable' });
      } catch (err) {
        alert('Failed to import configuration');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center p-6">
        <h2 className="text-2xl font-bold">Task Configuration</h2>
        <div className="flex gap-2">
          <button
            onClick={exportConfig}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Export
          </button>
          <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
            Import
            <input
              type="file"
              accept=".json"
              onChange={importConfig}
              className="hidden"
            />
          </label>
        </div>
      </div>
      <div className="p-6">
        <p>Task configuration content will appear here</p>
      </div>
    </div>
  );
};

export default TaskConfigTable;
