'use client';

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import OrderForm from '../components/OrderForm';
import TaskMonitor from '../components/TaskMonitor';
import TaskConfigManager from '../components/TaskConfigManager';
import TaskConfigTable from '../components/TaskConfigTable';
import BackupManager from '../components/BackupManager';
import AutopilotMonitor from '../components/AutopilotMonitor';
import Toast from '../components/Toast';
import { OrderForm as OrderFormType, Task, TaskManagementConfig, ProcessingStatus } from '../types';
import { defaultTaskConfig } from '../lib/taskConfig';
import TaskProcessor from '../lib/taskProcessor';
import { flightDeckApiService } from '../lib/api';
import { usePreventSleep } from '../lib/usePreventSleep';

export default function HomePage() {
  const [currentOrder, setCurrentOrder] = useState<OrderFormType | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskConfig, setTaskConfig] = useState<TaskManagementConfig>(defaultTaskConfig);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null);
  const [taskProcessor, setTaskProcessor] = useState<TaskProcessor | null>(null);
  const [activeTab, setActiveTab] = useState<'monitor' | 'config' | 'table' | 'backup' | 'autopilot'>('table');
  const [isSearchingTasks, setIsSearchingTasks] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [lastSearchTime, setLastSearchTime] = useState<Date | null>(null);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error' | 'info' | 'warning'; isVisible: boolean} | null>(null);
  const [monitoringIntervalId, setMonitoringIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Prevent browser/system sleep during automation
  const isAutomationActive = processingStatus?.isProcessing || false;
  const { isActive: isSleepPrevented } = usePreventSleep(isAutomationActive);

  useEffect(() => {
    // Initialize task processor
    const processor = new TaskProcessor((status) => {
      setProcessingStatus(status);
    });
    setTaskProcessor(processor);

    return () => {
      processor.stopProcessing();
    };
  }, []);

  const handleOrderSubmit = async (orderForm: OrderFormType) => {
    console.log('Order submitted:', orderForm);
    setCurrentOrder(orderForm);
    setSearchError(null);
    
    if (taskProcessor) {
      try {
        // Switch to monitor tab when automation starts
        setActiveTab('monitor');
        
        // Start monitoring tasks (includes initial search with loading state)
        await startTaskMonitoring(orderForm);
        
        // Start automated processing
        await taskProcessor.startProcessing(orderForm, taskConfig);
      } catch (error) {
        console.error('Error starting task processing:', error);
        setSearchError('Failed to start task monitoring. Please try again.');
      }
    }
  };

  const startTaskMonitoring = async (orderForm: OrderFormType) => {
    console.log('Starting task monitoring for order:', orderForm.orderNumber);
    setIsSearchingTasks(true);
    setSearchError(null);
    
    // Show search start toast
    setToast({
      message: `Searching for tasks in ${orderForm.environment} for order ${orderForm.orderNumber}...`,
      type: 'info',
      isVisible: true
    });
    
    try {
      // Set up API service
      flightDeckApiService.setEnvironment(orderForm.environment);
      flightDeckApiService.setUserName(orderForm.userName);

      // Initial task search
      console.log('Performing initial task search...');
      const searchResult = await flightDeckApiService.searchTasks(orderForm.orderNumber);
      
      if (searchResult.success && searchResult.data) {
        console.log('Tasks found:', searchResult.data.taskResults.length);
        setTasks(searchResult.data.taskResults);
        setSearchError(null);
        setLastSearchTime(new Date());
        
        // Show success toast
        setToast({
          message: `Found ${searchResult.data.taskResults.length} task${searchResult.data.taskResults.length !== 1 ? 's' : ''} for order ${orderForm.orderNumber}`,
          type: 'success',
          isVisible: true
        });
      } else {
        console.log('No tasks found or API error:', searchResult.error);
        setTasks([]);
        if (searchResult.error) {
          setSearchError(searchResult.error);
        } else {
          setSearchError('No tasks found for this order. The order may not exist or may not have any tasks yet.');
        }
        
        // Show warning toast
        setToast({
          message: `No tasks found for order ${orderForm.orderNumber}`,
          type: 'warning',
          isVisible: true
        });
      }
    } catch (error) {
      console.error('Error during initial task search:', error);
      setTasks([]);
      setSearchError('Failed to search for tasks. Please check your network connection and try again.');
      
      // Show error toast
      setToast({
        message: 'Failed to search for tasks. Please check your connection.',
        type: 'error',
        isVisible: true
      });
    } finally {
      setIsSearchingTasks(false);
    }

    // Set up periodic task monitoring (separate from processing)
    // Only monitor FlightDeck when on monitor or table tabs
    const monitoringInterval = setInterval(async () => {
      // Skip if on autopilot tab to reduce server load
      if (activeTab === 'autopilot' || activeTab === 'config' || activeTab === 'backup') {
        console.log('Skipping FlightDeck monitoring - not on active tab');
        return;
      }
      
      try {
        console.log('Performing periodic task search...');
        const result = await flightDeckApiService.searchTasks(orderForm.orderNumber);
        if (result.success && result.data) {
          const newTaskCount = result.data.taskResults.length;
          const oldTaskCount = tasks.length;
          
          setTasks(result.data.taskResults);
          setSearchError(null);
          setLastSearchTime(new Date());
          
          // Show toast only if task count changed significantly
          if (newTaskCount > oldTaskCount) {
            setToast({
              message: `Found ${newTaskCount - oldTaskCount} new task${newTaskCount - oldTaskCount !== 1 ? 's' : ''}`,
              type: 'success',
              isVisible: true
            });
          }
        } else if (!result.success && result.error) {
          console.log('Periodic search error:', result.error);
          // Don't show errors for periodic searches unless there are no tasks yet
          if (tasks.length === 0) {
            setSearchError(result.error);
          }
        }
      } catch (error) {
        console.error('Error during periodic task monitoring:', error);
        // Don't show errors for periodic searches unless there are no tasks yet
        if (tasks.length === 0) {
          setSearchError('Failed to monitor tasks. Please check your connection.');
        }
      }
    }, 45000); // Monitor every 45 seconds (reduced frequency)

    // Store the interval ID for cleanup
    setMonitoringIntervalId(monitoringInterval);
  };

  const handleStopProcessing = () => {
    if (taskProcessor) {
      taskProcessor.stopProcessing();
      setProcessingStatus(null);
    }
    
    // Clear the monitoring interval to stop background API calls
    if (monitoringIntervalId) {
      clearInterval(monitoringIntervalId);
      setMonitoringIntervalId(null);
      console.log('Monitoring interval cleared - background API calls stopped');
    }
  };

  const handleConfigChange = (newConfig: TaskManagementConfig) => {
    setTaskConfig(newConfig);
    
    // Read existing config and preserve conditionalRules and taskSequencing
    const saved = localStorage.getItem('aviator-task-config');
    let existingConditionalRules = {};
    let existingTaskSequencing = {};
    
    if (saved) {
      try {
        const existing = JSON.parse(saved);
        existingConditionalRules = existing.conditionalRules || {};
        existingTaskSequencing = existing.taskSequencing || {};
      } catch (e) {
        console.error('Error parsing existing config:', e);
      }
    }
    
    // Merge: preserve conditionalRules and taskSequencing from localStorage
    const configToSave = {
      ...newConfig,
      conditionalRules: newConfig.conditionalRules || existingConditionalRules,
      taskSequencing: newConfig.taskSequencing || existingTaskSequencing,
    };
    
    // Save merged config to localStorage for persistence
    console.log('🌐 page.tsx saving config. taskSequencing keys:', Object.keys(configToSave.taskSequencing || {}));
    localStorage.setItem('aviator-task-config', JSON.stringify(configToSave));
  };

  // Load saved config on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aviator-task-config');
      if (saved) {
        const config = JSON.parse(saved);
        console.log('📦 page.tsx: Loading config from localStorage');
        console.log('   taskSequencing keys:', Object.keys(config.taskSequencing || {}));
        console.log('   taskSequencing:', JSON.stringify(config.taskSequencing, null, 2));
        setTaskConfig(config);
      }
    } catch (error) {
      console.error('Error loading saved config:', error);
    }
  }, []);

  // Cleanup monitoring interval on unmount
  useEffect(() => {
    return () => {
      if (monitoringIntervalId) {
        clearInterval(monitoringIntervalId);
        console.log('Component unmounting - monitoring interval cleared');
      }
    };
  }, [monitoringIntervalId]);

  const isProcessing = processingStatus?.isProcessing || isSearchingTasks || false;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Smart Order Closure
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enterprise-grade FlightDeck task automation system. Streamline your workflow
            processing with intelligent task completion and monitoring.
          </p>
        </div>

        {/* Sleep Prevention Status Banner */}
        {isSleepPrevented && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-center">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="ml-2 text-sm font-medium text-green-800">
                Sleep prevention active - automation will continue running without interruption
              </p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {processingStatus && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-semibold text-gray-900">{processingStatus.totalTasks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-semibold text-gray-900">{processingStatus.completedTasks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-2xl font-semibold text-gray-900">{processingStatus.failedTasks.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    processingStatus.isProcessing ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {processingStatus.isProcessing ? (
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {processingStatus.isProcessing ? 'Processing' : 'Idle'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Form */}
        <OrderForm onSubmit={handleOrderSubmit} isProcessing={isProcessing} />

        {/* Control Buttons */}
        {currentOrder && (
          <div className="flex justify-center space-x-4">
            {isProcessing ? (
              <button
                onClick={handleStopProcessing}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Stop Processing
              </button>
            ) : (
              <button
                onClick={() => handleOrderSubmit(currentOrder)}
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Restart Processing
              </button>
            )}
          </div>
        )}

        {/* Tabs - Always visible */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('table')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'table'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📝 Task Configuration
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'backup'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              💾 Data Backup
            </button>
            {(tasks.length > 0 || processingStatus) && (
              <button
                onClick={() => setActiveTab('monitor')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'monitor'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 FlightDeck Monitor
              </button>
            )}
            {currentOrder && (
              <button
                onClick={() => setActiveTab('autopilot')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'autopilot'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🚀 Autopilot Monitor
              </button>
            )}
            {(tasks.length > 0 || processingStatus) && (
              <button
                onClick={() => setActiveTab('config')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'config'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ⚙️ Advanced Config
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'monitor' && (
          <TaskMonitor 
            tasks={tasks} 
            processingStatus={processingStatus}
            isSearchingTasks={isSearchingTasks}
            searchError={searchError}
            lastSearchTime={lastSearchTime}
            currentOrder={currentOrder}
          />
        )}

        {activeTab === 'autopilot' && currentOrder && (
          <AutopilotMonitor 
            orderNumber={currentOrder.orderNumber}
            environment={currentOrder.environment}
            isActive={activeTab === 'autopilot'}
          />
        )}

        {activeTab === 'table' && (
          <TaskConfigTable onConfigChange={(taskConfigs) => {
            // Convert task configs back to TaskManagementConfig format
            const config: TaskManagementConfig = {
              ...taskConfig, // Preserve existing config (including taskSequencing)
              completableTasks: taskConfigs.filter(t => t.isCompletable).map(t => t.taskName),
              retryableTasks: taskConfigs.filter(t => t.isRetryable).map(t => t.taskName),
              taskFieldMappings: taskConfigs.reduce((acc, task) => {
                if (task.fields.length > 0) {
                  acc[task.taskName] = task.fields.reduce((fieldAcc, field) => {
                    // Store the full field object for dropdown support
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
            };
            handleConfigChange(config);
          }} />
        )}

        {activeTab === 'backup' && (
          <BackupManager />
        )}

        {activeTab === 'config' && (
          <TaskConfigManager config={taskConfig} onConfigChange={handleConfigChange} />
        )}
      </div>
      
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast(null)}
          duration={5000}
        />
      )}
    </Layout>
  );
}
