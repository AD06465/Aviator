/**
 * Task Context
 * Centralized state management for tasks
 */

'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Task, ProcessingStatus } from '@/types';
import { logger } from '@/services/logging';

interface TaskContextValue {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  updateTask: (taskId: number, updates: Partial<Task>) => void;
  processingStatus: ProcessingStatus | null;
  setProcessingStatus: (status: ProcessingStatus | null) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  searchError: string | null;
  setSearchError: (error: string | null) => void;
  lastSearchTime: Date | null;
  setLastSearchTime: (time: Date | null) => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [lastSearchTime, setLastSearchTime] = useState<Date | null>(null);

  const setTasks = useCallback((newTasks: Task[]) => {
    setTasksState(newTasks);
    logger.debug('Tasks updated', { 
      component: 'TaskContext',
      taskCount: newTasks.length 
    });
  }, []);

  const updateTask = useCallback((taskId: number, updates: Partial<Task>) => {
    setTasksState(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.ID === taskId ? { ...task, ...updates } : task
      );
      logger.debug('Task updated', { 
        component: 'TaskContext',
        taskId,
        updates: Object.keys(updates)
      });
      return updatedTasks;
    });
  }, []);

  const value: TaskContextValue = {
    tasks,
    setTasks,
    updateTask,
    processingStatus,
    setProcessingStatus,
    isSearching,
    setIsSearching,
    searchError,
    setSearchError,
    lastSearchTime,
    setLastSearchTime,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = (): TaskContextValue => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
