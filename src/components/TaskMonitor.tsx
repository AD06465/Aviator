import React, { useState } from 'react';
import { Task, ProcessingStatus, OrderForm, TaskFailureDetails } from '../types';
import { formatTaskStatus, getStatusColor } from '../lib/taskConfig';
import { flightDeckApiService } from '../lib/api';
import { format } from 'date-fns';

interface TaskMonitorProps {
  tasks: Task[];
  processingStatus: ProcessingStatus | null;
  isSearchingTasks?: boolean;
  searchError?: string | null;
  lastSearchTime?: Date | null;
  currentOrder?: OrderForm | null;
}

const TaskMonitor: React.FC<TaskMonitorProps> = ({ 
  tasks, 
  processingStatus,
  isSearchingTasks = false,
  searchError = null,
  lastSearchTime = null,
  currentOrder = null
}) => {
  const [expandedFailedTasks, setExpandedFailedTasks] = useState<Set<number>>(new Set());
  const [failureDetails, setFailureDetails] = useState<Map<number, TaskFailureDetails>>(new Map());
  const [loadingFailureDetails, setLoadingFailureDetails] = useState<Set<number>>(new Set());

  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(b.CREATED_DTTM).getTime() - new Date(a.CREATED_DTTM).getTime()
  );

  // Calculate actual completion statistics
  const getTaskStatistics = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.TASK_STATUS.toLowerCase() === 'completed').length;
    const aviatorCompletedTasks = processingStatus?.completedTasks || 0;
    const failedTasks = tasks.filter(t => t.TASK_STATUS.toLowerCase() === 'failed').length;
    const readyTasks = tasks.filter(t => ['ready', 'assigned', 'created'].includes(t.TASK_STATUS.toLowerCase())).length;
    
    return {
      totalTasks,
      completedTasks,
      aviatorCompletedTasks,
      failedTasks,
      readyTasks,
      completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };

  const taskStats = getTaskStatistics();

  // Check for order completion
  const isOrderCompleted = () => {
    const activationCompleteTask = tasks.find(t => t.TASK_NAME === 'Activation Complete');
    return activationCompleteTask && activationCompleteTask.TASK_STATUS.toLowerCase() === 'completed';
  };

  const getProgressPercentage = () => {
    return taskStats.completionPercentage;
  };

  const fetchFailureDetails = async (taskId: number) => {
    if (failureDetails.has(taskId)) {
      // Toggle expansion if details already loaded
      const newExpanded = new Set(expandedFailedTasks);
      if (newExpanded.has(taskId)) {
        newExpanded.delete(taskId);
      } else {
        newExpanded.add(taskId);
      }
      setExpandedFailedTasks(newExpanded);
      return;
    }

    // Load failure details
    setLoadingFailureDetails(prev => new Set(prev).add(taskId));
    
    try {
      const result = await flightDeckApiService.getTaskDetails(taskId);
      
      if (result.success && result.data) {
        const taskDetails = result.data;
        const details: TaskFailureDetails = {};
        
        // Extract relevant failure information
        if (taskDetails.taskInstParamRequestList) {
          for (const param of taskDetails.taskInstParamRequestList) {
            switch (param.name) {
              case 'errorMessage':
                details.errorMessage = param.value;
                break;
              case 'requestPayload':
                details.requestPayload = param.value;
                break;
              case 'responsePayload':
                details.responsePayload = param.value;
                break;
              case 'statusCode':
                details.statusCode = param.value;
                break;
              case 'retryMethodType':
                details.retryMethodType = param.value;
                break;
              case 'retryRequestURL':
                details.retryRequestURL = param.value;
                break;
              case 'retryRequestHeader':
                details.retryRequestHeader = param.value;
                break;
            }
          }
        }
        
        // Add status message from main task details
        if (taskDetails.statusDetails?.statusMessage) {
          details.statusMessage = taskDetails.statusDetails.statusMessage;
        }
        
        setFailureDetails(prev => new Map(prev).set(taskId, details));
        setExpandedFailedTasks(prev => new Set(prev).add(taskId));
      }
    } catch (error) {
      console.error('Failed to fetch failure details:', error);
    } finally {
      setLoadingFailureDetails(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const formatJsonPayload = (jsonString: string): string => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonString;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Order Completion Message */}
      {isOrderCompleted() && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">🎉 Order Completed Successfully!</h3>
              <p className="text-green-100 mt-1">
                Activation Complete task finished. Your order has been fully processed and activation events have been sent to upstream systems.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Task Monitor</h3>
            <p className="text-gray-600 mt-1">Real-time task processing status</p>
          </div>
          
          <div className="flex items-center space-x-6">
            {processingStatus && processingStatus.isProcessing && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-sm font-medium">Processing...</span>
              </div>
            )}
            
            {/* Overall Progress */}
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {taskStats.completedTasks}/{taskStats.totalTasks}
              </div>
              <div className="text-sm text-gray-500">Total Tasks Completed</div>
            </div>

            {/* AVIATOR Completed Tasks */}
            {taskStats.aviatorCompletedTasks > 0 && (
              <div className="text-right">
                <div className="text-xl font-bold text-blue-600">
                  {taskStats.aviatorCompletedTasks}
                </div>
                <div className="text-xs text-blue-500">By AVIATOR</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        {taskStats.totalTasks > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Overall Progress</span>
              <span className={`${!isOrderCompleted() && taskStats.completionPercentage > 0 ? 'progress-animate' : ''}`}>
                {taskStats.completionPercentage}% ({taskStats.completedTasks}/{taskStats.totalTasks})
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden relative shadow-inner">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ease-out relative ${
                  isOrderCompleted() 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/50'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30'
                }`}
                style={{ width: `${taskStats.completionPercentage}%` }}
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white via-transparent opacity-20 animate-pulse"></div>
                
                {/* Moving highlight for active progress */}
                {!isOrderCompleted() && taskStats.completionPercentage > 0 && taskStats.completionPercentage < 100 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-30 animate-[shimmer_2s_ease-in-out_infinite]"></div>
                )}
                
                {/* Completion celebration effect */}
                {isOrderCompleted() && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-[celebrate_3s_ease-in-out_infinite]"></div>
                )}
              </div>
            </div>
            
            {/* Task Statistics Summary */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Completed: {taskStats.completedTasks}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>By AVIATOR: {taskStats.aviatorCompletedTasks}</span>
                </span>
                {taskStats.failedTasks > 0 && (
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Failed: {taskStats.failedTasks}</span>
                  </span>
                )}
                {taskStats.readyTasks > 0 && (
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Ready: {taskStats.readyTasks}</span>
                  </span>
                )}
              </div>
              {isOrderCompleted() && (
                <span className="text-green-600 font-medium">✅ Order Complete</span>
              )}
            </div>
          </div>
        )}
        
        {/* Current Task */}
        {processingStatus?.currentTask && !isOrderCompleted() && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700">
                Currently Processing: {processingStatus.currentTask}
              </span>
            </div>
          </div>
        )}

        {/* Order Completion Summary */}
        {isOrderCompleted() && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-green-800 mb-2">Order Processing Complete</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p>✅ All critical tasks have been completed successfully</p>
                  <p>✅ Service activation has been processed and confirmed</p>
                  <p>✅ Activation events have been sent to upstream systems</p>
                  <p>✅ Order is now closed in FlightDeck and Autopilot</p>
                </div>
                {taskStats.aviatorCompletedTasks > 0 && (
                  <div className="mt-3 p-2 bg-white bg-opacity-50 rounded border border-green-300">
                    <p className="text-sm text-green-800">
                      <strong>AVIATOR Contribution:</strong> Automated completion of {taskStats.aviatorCompletedTasks} task{taskStats.aviatorCompletedTasks !== 1 ? 's' : ''}, 
                      saving significant manual effort and reducing processing time.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="p-6">
        {/* Loading State */}
        {isSearchingTasks ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Searching for Tasks...</h4>
            <p className="text-gray-500">
              {currentOrder ? `Searching tasks for order: ${currentOrder.orderNumber}` : 'Please wait while we search for tasks'}
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-blue-600">
              <div className="animate-pulse">🔍</div>
              <span>Querying FlightDeck API...</span>
            </div>
          </div>
        ) : 
        /* Error State */
        searchError ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-red-900 mb-2">No Tasks Found</h4>
            <p className="text-red-600 mb-4">{searchError}</p>
            {currentOrder && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left max-w-md mx-auto">
                <h5 className="font-medium text-red-800 mb-2">Search Details:</h5>
                <div className="text-sm text-red-700 space-y-1">
                  <div><strong>Order:</strong> {currentOrder.orderNumber}</div>
                  <div><strong>Environment:</strong> {currentOrder.environment}</div>
                  <div><strong>User:</strong> {currentOrder.userName}</div>
                  {lastSearchTime && (
                    <div><strong>Last Search:</strong> {format(lastSearchTime, 'MMM dd, yyyy HH:mm:ss')}</div>
                  )}
                </div>
              </div>
            )}
            <div className="mt-6 text-sm text-gray-600">
              <p className="mb-2"><strong>Common reasons for no tasks:</strong></p>
              <ul className="text-left max-w-md mx-auto space-y-1">
                <li>• Order doesn't exist in the selected environment</li>
                <li>• Order hasn't been processed yet</li>
                <li>• Order has no system tasks</li>
                <li>• Different environment or user permissions</li>
              </ul>
            </div>
          </div>
        ) : 
        /* Empty State - No Order Configured */
        tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Ready to Monitor Tasks</h4>
            <p className="text-gray-500">Configure and submit an order above to start monitoring FlightDeck tasks</p>
            <div className="mt-4 text-sm text-blue-600">
              ✨ AVIATOR will automatically search for tasks and display them here
            </div>
          </div>
        ) : (
          /* Task List */
          <div className="space-y-4">
            {/* Search Status Banner */}
            {lastSearchTime && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-green-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Found {tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-green-600">
                    Last updated: {format(lastSearchTime, 'HH:mm:ss')}
                  </div>
                </div>
              </div>
            )}
            
            {sortedTasks.map((task, index) => (
              <React.Fragment key={task.ID}>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white hover:bg-gray-50">
                  {/* Compact Task Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                        {index + 1}
                      </div>
                      <h4 className="text-base font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                        {task.TASK_NAME}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      {task.AGE && (
                        <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded">
                          {task.AGE}
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(task.TASK_STATUS)}`}>
                        {formatTaskStatus(task.TASK_STATUS)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Compact Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
                    <div className="bg-blue-50 rounded px-2 py-1">
                      <div className="text-blue-600 font-semibold">Task ID</div>
                      <div className="font-mono text-blue-800 truncate">{task.ID}</div>
                    </div>
                    <div className="bg-green-50 rounded px-2 py-1">
                      <div className="text-green-600 font-semibold">Instance</div>
                      <div className="font-mono text-green-800 truncate">{task.TASK_INSTANCE_ID}</div>
                    </div>
                    <div className="bg-purple-50 rounded px-2 py-1">
                      <div className="text-purple-600 font-semibold">Order ID</div>
                      <div className="font-mono text-purple-800 truncate">{task.ORDER_ID}</div>
                    </div>
                    <div className="bg-gray-50 rounded px-2 py-1">
                      <div className="text-gray-600 font-semibold">Created</div>
                      <div className="font-mono text-gray-800">{format(new Date(task.CREATED_DTTM), 'MMM dd, HH:mm')}</div>
                    </div>
                  </div>
                  
                  {/* Compact Additional Info */}
                  <div className="space-y-2">
                    {task.ASSIGNED_WORKGROUP && (
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                        <span className="text-gray-600 font-semibold">Workgroup:</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-mono">
                          {task.ASSIGNED_WORKGROUP}
                        </span>
                      </div>
                    )}
                    
                    {task.DESCRIPTION && (
                      <div className="flex items-start space-x-2 text-xs">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></span>
                        <div>
                          <span className="text-gray-600 font-semibold">Description: </span>
                          <span className="text-gray-800">{task.DESCRIPTION}</span>
                        </div>
                      </div>
                    )}
                    
                    {task.STATUS_MESSAGE && (
                      <div className="flex items-start space-x-2 text-xs">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></span>
                        <div>
                          <span className="text-gray-600 font-semibold">Status: </span>
                          <span className="text-gray-800">{task.STATUS_MESSAGE}</span>
                        </div>
                      </div>
                    )}
                    
                    {task.MODIFIED_DTTM !== task.CREATED_DTTM && (
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span>Modified: {format(new Date(task.MODIFIED_DTTM), 'MMM dd, HH:mm')}</span>
                      </div>
                    )}
                    
                    {/* Failed Task Show More Info Button */}
                    {task.TASK_STATUS.toLowerCase() === 'failed' && (
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        <button
                          onClick={() => fetchFailureDetails(task.ID)}
                          disabled={loadingFailureDetails.has(task.ID)}
                          className="flex items-center space-x-2 text-xs bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg border border-red-200 transition-colors disabled:opacity-50"
                        >
                          {loadingFailureDetails.has(task.ID) ? (
                            <>
                              <div className="animate-spin h-3 w-3 border border-red-400 border-t-transparent rounded-full"></div>
                              <span>Loading...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d={expandedFailedTasks.has(task.ID) ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
                              </svg>
                              <span>
                                {expandedFailedTasks.has(task.ID) ? 'Hide Details' : 'Show Failure Details'}
                              </span>
                            </>
                          )}
                        </button>
                        
                        {/* Expanded Failure Details */}
                        {expandedFailedTasks.has(task.ID) && failureDetails.has(task.ID) && (
                          <div className="mt-3 bg-red-50 rounded-lg p-4 border border-red-200">
                            <h5 className="text-sm font-semibold text-red-800 mb-3 flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Failure Analysis
                            </h5>
                            
                            {(() => {
                              const details = failureDetails.get(task.ID)!;
                              return (
                                <div className="space-y-3">
                                  {/* Error Message */}
                                  {details.errorMessage && (
                                    <div className="bg-white rounded-md p-3 border-l-4 border-red-400">
                                      <div className="text-xs font-semibold text-red-700 mb-1">Error Message</div>
                                      <div className="text-xs text-red-800 font-mono bg-red-100 p-2 rounded">
                                        {details.errorMessage}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Status Information */}
                                  {(details.statusCode || details.statusMessage) && (
                                    <div className="bg-white rounded-md p-3 border-l-4 border-orange-400">
                                      <div className="text-xs font-semibold text-orange-700 mb-1">Status Information</div>
                                      <div className="text-xs space-y-1">
                                        {details.statusCode && (
                                          <div><span className="font-semibold">Code:</span> {details.statusCode}</div>
                                        )}
                                        {details.statusMessage && (
                                          <div><span className="font-semibold">Message:</span> {details.statusMessage}</div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Request Payload */}
                                  {details.requestPayload && (
                                    <div className="bg-white rounded-md p-3 border-l-4 border-blue-400">
                                      <div className="text-xs font-semibold text-blue-700 mb-1">Request Payload</div>
                                      <pre className="text-xs text-blue-800 font-mono bg-blue-50 p-2 rounded overflow-x-auto">
                                        {formatJsonPayload(details.requestPayload)}
                                      </pre>
                                    </div>
                                  )}
                                  
                                  {/* Response Payload */}
                                  {details.responsePayload && (
                                    <div className="bg-white rounded-md p-3 border-l-4 border-purple-400">
                                      <div className="text-xs font-semibold text-purple-700 mb-1">Response Payload</div>
                                      <pre className="text-xs text-purple-800 font-mono bg-purple-50 p-2 rounded overflow-x-auto">
                                        {formatJsonPayload(details.responsePayload)}
                                      </pre>
                                    </div>
                                  )}
                                  
                                  {/* Retry Information */}
                                  {(details.retryMethodType || details.retryRequestURL) && (
                                    <div className="bg-white rounded-md p-3 border-l-4 border-green-400">
                                      <div className="text-xs font-semibold text-green-700 mb-1">Retry Information</div>
                                      <div className="text-xs space-y-1">
                                        {details.retryMethodType && (
                                          <div><span className="font-semibold">Method:</span> {details.retryMethodType}</div>
                                        )}
                                        {details.retryRequestURL && (
                                          <div><span className="font-semibold">URL:</span> <code className="bg-green-100 px-1 rounded">{details.retryRequestURL}</code></div>
                                        )}
                                        {details.retryRequestHeader && (
                                          <div>
                                            <span className="font-semibold">Headers:</span>
                                            <pre className="text-xs font-mono bg-green-50 p-2 rounded mt-1 overflow-x-auto">
                                              {formatJsonPayload(details.retryRequestHeader)}
                                            </pre>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Task Separator */}
                {index < sortedTasks.length - 1 && (
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <div className="bg-white px-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
      
      {/* Failed Tasks Section */}
      {processingStatus?.failedTasks && processingStatus.failedTasks.length > 0 && (
        <div className="border-t border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-red-700 mb-4">Failed Tasks Requiring Attention</h4>
          <div className="space-y-3">
            {processingStatus.failedTasks.map((task) => (
              <div
                key={task.ID}
                className="border border-red-200 rounded-lg p-4 bg-red-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-red-800">{task.TASK_NAME}</h5>
                    <p className="text-sm text-red-600">ID: {task.ID}</p>
                    {task.STATUS_MESSAGE && (
                      <p className="text-sm text-red-600 mt-1">{task.STATUS_MESSAGE}</p>
                    )}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                    Failed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Last Update */}
      {processingStatus?.lastUpdate && (
        <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
          <div className="text-sm text-gray-500 text-center">
            Last updated: {format(processingStatus.lastUpdate, 'MMM dd, yyyy HH:mm:ss')}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskMonitor;
