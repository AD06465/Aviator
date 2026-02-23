/**
 * Config Context
 * Centralized state management for task configuration
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { TaskManagementConfig } from '@/types';
import { defaultTaskConfig } from '@/lib/taskConfig';
import { logger } from '@/services/logging';

interface ConfigContextValue {
  taskConfig: TaskManagementConfig;
  setTaskConfig: (config: TaskManagementConfig) => void;
  updateTaskConfig: (updates: Partial<TaskManagementConfig>) => void;
  resetTaskConfig: () => void;
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [taskConfig, setTaskConfigState] = useState<TaskManagementConfig>(defaultTaskConfig);

  // Load saved config on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aviator-task-config');
      if (saved) {
        const config = JSON.parse(saved);
        setTaskConfigState(config);
        logger.info('Task configuration loaded from storage', { 
          component: 'ConfigContext' 
        });
      }
    } catch (error) {
      logger.error('Failed to load saved config', { 
        component: 'ConfigContext' 
      }, error as Error);
    }
  }, []);

  const setTaskConfig = useCallback((config: TaskManagementConfig) => {
    setTaskConfigState(config);
    try {
      // Preserve conditionalRules and taskSequencing when saving
      const saved = localStorage.getItem('aviator-task-config');
      let existingRules = {};
      let existingTaskSequencing = {};
      if (saved) {
        const existing = JSON.parse(saved);
        existingRules = existing.conditionalRules || {};
        existingTaskSequencing = existing.taskSequencing || {};
      }
      
      const configToSave = {
        ...config,
        conditionalRules: config.conditionalRules || existingRules,
        taskSequencing: config.taskSequencing || existingTaskSequencing
      };
      
      localStorage.setItem('aviator-task-config', JSON.stringify(configToSave));
      logger.info('Task configuration updated', { 
        component: 'ConfigContext',
        completableTasks: config.completableTasks.length,
        retryableTasks: config.retryableTasks.length,
        hasConditionalRules: !!configToSave.conditionalRules && Object.keys(configToSave.conditionalRules).length > 0
      });
    } catch (error) {
      logger.error('Failed to save config', { 
        component: 'ConfigContext' 
      }, error as Error);
    }
  }, []);

  const updateTaskConfig = useCallback((updates: Partial<TaskManagementConfig>) => {
    setTaskConfigState(prev => {
      const updated = { ...prev, ...updates };
      try {
        // Preserve conditionalRules and taskSequencing when doing partial updates
        const saved = localStorage.getItem('aviator-task-config');
        let existingRules = {};
        let existingTaskSequencing = {};
        if (saved) {
          const existing = JSON.parse(saved);
          existingRules = existing.conditionalRules || {};
          existingTaskSequencing = existing.taskSequencing || {};
        }
        
        const configToSave = {
          ...updated,
          conditionalRules: updated.conditionalRules || existingRules,
          taskSequencing: updated.taskSequencing || existingTaskSequencing
        };
        
        localStorage.setItem('aviator-task-config', JSON.stringify(configToSave));
        logger.debug('Task configuration partially updated', { 
          component: 'ConfigContext',
          updates: Object.keys(updates),
          hasConditionalRules: !!configToSave.conditionalRules && Object.keys(configToSave.conditionalRules).length > 0
        });
      } catch (error) {
        logger.error('Failed to save partial config update', { 
          component: 'ConfigContext' 
        }, error as Error);
      }
      return updated;
    });
  }, []);

  const resetTaskConfig = useCallback(() => {
    setTaskConfigState(defaultTaskConfig);
    try {
      localStorage.removeItem('aviator-task-config');
      logger.info('Task configuration reset to defaults', { 
        component: 'ConfigContext' 
      });
    } catch (error) {
      logger.error('Failed to reset config', { 
        component: 'ConfigContext' 
      }, error as Error);
    }
  }, []);

  const value: ConfigContextValue = {
    taskConfig,
    setTaskConfig,
    updateTaskConfig,
    resetTaskConfig,
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};

export const useConfigContext = (): ConfigContextValue => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfigContext must be used within a ConfigProvider');
  }
  return context;
};
