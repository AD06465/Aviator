import React, { useState } from 'react';
import { buildWorkflowHierarchy, fetchTaskDetails } from '../lib/autopilotApi';

interface WorkflowTreeProps {
  rootJobId: string;
  environment: string;
  orderNumber?: string;
}

interface TreeNode {
  _id: string;
  name: string;
  status: string;
  description?: string;
  tasks?: any;
  childJobs?: Array<{ _id: string; name: string; iteration: number }>;
  children?: TreeNode[];
  metrics?: any;
}

interface TaskDetail {
  taskId: string;
  taskName: string;
  status: string;
  variables?: {
    incoming?: any;
    outgoing?: any;
    error?: any;
  };
}

const WorkflowTree: React.FC<WorkflowTreeProps> = ({ rootJobId, environment, orderNumber }) => {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTasks, setShowTasks] = useState<{ [id: string]: boolean }>({});
  const [selectedTask, setSelectedTask] = useState<{ workflowId: string; taskId: string } | null>(null);
  const [taskDetails, setTaskDetails] = useState<TaskDetail | null>(null);
  const [loadingTask, setLoadingTask] = useState(false);

  const fetchTree = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`🌳 Building workflow hierarchy for job: ${rootJobId}`);
      const hierarchy = await buildWorkflowHierarchy(environment, rootJobId);
      setTree(hierarchy);
      // Auto-expand root node
      setExpanded({ [rootJobId]: true });
      console.log('✅ Workflow hierarchy built successfully');
    } catch (err) {
      console.error('❌ Error building workflow hierarchy:', err);
      setError(err instanceof Error ? err.message : 'Failed to load workflow hierarchy');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (rootJobId) {
      fetchTree();
    }
    // eslint-disable-next-line
  }, [rootJobId, environment]);

  const handleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleTasks = (id: string) => {
    setShowTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTaskClick = async (workflowId: string, taskId: string, taskName: string, taskStatus: string, iterationId?: string) => {
    if (!iterationId) {
      console.warn('No iteration ID available for task:', taskName);
      setTaskDetails(null);
      return;
    }
    
    setSelectedTask({ workflowId, taskId });
    setLoadingTask(true);
    try {
      // Use iteration ID to fetch task details
      const details = await fetchTaskDetails(environment, iterationId);
      console.log('📋 Task details received:', {
        taskId,
        iterationId,
        fullResponse: details,
        data: details?.data,
        variables: details?.data?.variables,
        hasIncoming: !!details?.data?.variables?.incoming,
        hasOutgoing: !!details?.data?.variables?.outgoing,
        hasError: !!details?.data?.variables?.error
      });
      
      setTaskDetails({
        taskId: iterationId,
        taskName,
        status: taskStatus,
        variables: details?.data?.variables,
      });
    } catch (err) {
      console.error('Error fetching task details:', err);
      setTaskDetails(null);
    } finally {
      setLoadingTask(false);
    }
  };

  const getStatusColor = (status: string): string => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'complete') return 'bg-green-100 text-green-700 border-green-300';
    if (statusLower === 'error') return 'bg-red-100 text-red-700 border-red-300';
    if (statusLower === 'running') return 'bg-blue-100 text-blue-700 border-blue-300';
    if (statusLower === 'incomplete') return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    if (statusLower === 'paused') return 'bg-orange-100 text-orange-700 border-orange-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const hasTasks = node.tasks && Object.keys(node.tasks).length > 0;
    const isExpanded = expanded[node._id];
    const isShowingTasks = showTasks[node._id];
    
    // Extract tasks array with iteration IDs
    const tasksArray: Array<{id: string, name: string, status: string, summary?: string, iterationId?: string}> = [];
    if (node.tasks) {
      Object.entries(node.tasks).forEach(([taskId, taskData]: [string, any]) => {
        if (taskData.taskId && taskData.name) {
          // Get the latest iteration ID (tasks can have multiple iterations)
          let iterationId = null;
          if (taskData.iterations && Array.isArray(taskData.iterations) && taskData.iterations.length > 0) {
            // Use the last iteration (most recent)
            iterationId = taskData.iterations[taskData.iterations.length - 1];
          }
          
          // Debug: Log task structure to help identify iteration location
          if (!iterationId) {
            console.log('⚠️ No iteration found for task:', {
              taskId: taskData.taskId,
              name: taskData.name,
              hasIterations: !!taskData.iterations,
              iterationsType: typeof taskData.iterations,
              iterationsLength: Array.isArray(taskData.iterations) ? taskData.iterations.length : 'not array',
              taskDataKeys: Object.keys(taskData),
              fullTaskData: taskData
            });
          }
          
          tasksArray.push({
            id: taskData.taskId,
            name: taskData.name,
            status: taskData.status || 'unknown',
            summary: taskData.summary,
            iterationId: iterationId,
          });
        }
      });
    }

    return (
      <div key={node._id} className="mb-3">
        <div 
          className={`border-l-4 pl-4 ${
            depth === 0 ? 'border-blue-500' : 
            depth === 1 ? 'border-purple-400' :
            depth === 2 ? 'border-indigo-400' :
            'border-gray-400'
          }`}
          style={{ marginLeft: `${depth * 20}px` }}
        >
          {/* Workflow Node Header */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
            {/* Expand/Collapse Button */}
            {hasChildren && (
              <button
                className="text-blue-600 font-bold focus:outline-none hover:text-blue-800 transition-colors"
                onClick={() => handleExpand(node._id)}
                title={isExpanded ? 'Collapse' : 'Expand children'}
              >
                {isExpanded ? '▼' : '▶'}
              </button>
            )}
            {!hasChildren && <span className="w-5 text-center text-gray-400">•</span>}
            
            {/* Workflow Name */}
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{node.name}</div>
              {node.description && (
                <div className="text-xs text-gray-500 mt-1">{node.description}</div>
              )}
            </div>
            
            {/* Status Badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(node.status)}`}>
              {node.status}
            </span>
            
            {/* View Tasks Button (Eye Icon) */}
            {hasTasks && (
              <button
                onClick={() => handleToggleTasks(node._id)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
                title="View tasks"
              >
                👁️ {tasksArray.length} Tasks
              </button>
            )}
          </div>

          {/* Tasks List */}
          {hasTasks && isShowingTasks && (
            <div className="mt-2 ml-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h5 className="text-sm font-semibold text-gray-700 mb-3">
                Tasks for {node.name} ({tasksArray.length})
              </h5>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {tasksArray.map((task) => {
                  const isSelected = selectedTask?.taskId === task.id && selectedTask?.workflowId === node._id;
                  
                  return (
                    <button
                      key={task.id}
                      className={`w-full text-left p-3 rounded border transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-200 bg-white hover:bg-gray-100'
                      }`}
                      onClick={() => handleTaskClick(node._id, task.id, task.name, task.status, task.iterationId)}
                      disabled={!task.iterationId}
                      title={!task.iterationId ? 'No iteration data available' : 'Click to view task details'}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{task.name}</div>
                          {task.summary && (
                            <div className="text-xs text-gray-500 mt-1 truncate">{task.summary}</div>
                          )}
                          <div className="text-xs text-gray-400 font-mono mt-1">{task.id}</div>
                          {task.iterationId && (
                            <div className="text-xs text-blue-500 font-mono mt-1">Iteration: {task.iterationId.substring(0, 8)}...</div>
                          )}
                          {!task.iterationId && (
                            <div className="text-xs text-red-500 mt-1">No iteration available</div>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Child Workflows */}
          {hasChildren && isExpanded && (
            <div className="mt-3">
              {node.children!.map(child => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-blue-900 mb-2">Workflow Hierarchy</h3>
        {orderNumber && (
          <p className="text-sm text-gray-600">Order: {orderNumber}</p>
        )}
        <p className="text-sm text-gray-600">Root Job ID: {rootJobId}</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-blue-600 font-medium">Building workflow hierarchy...</div>
          <div className="text-sm text-gray-500 mt-2">This may take a moment for complex workflows</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 font-semibold mb-2">Failed to load workflow hierarchy</div>
          <div className="text-sm text-red-500">{error}</div>
          <button
            onClick={fetchTree}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : tree ? (
        <div className="space-y-4">
          {renderNode(tree, 0)}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No workflow data found.
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold">Task Details</h4>
                {taskDetails && (
                  <p className="text-sm text-blue-100 mt-1">{taskDetails.taskName}</p>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedTask(null);
                  setTaskDetails(null);
                }}
                className="text-white hover:text-gray-200 text-2xl font-bold transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingTask ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <div className="text-blue-600 font-medium">Loading task details...</div>
                </div>
              ) : taskDetails ? (
                <div className="space-y-6">
                  {/* Task Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Task ID</label>
                      <div className="font-mono text-sm text-gray-800 mt-1">{taskDetails.taskId}</div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                      <div className="mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${getStatusColor(taskDetails.status)}`}>
                          {taskDetails.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Incoming Data */}
                  {taskDetails.variables?.incoming && (
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Incoming Data</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                          {JSON.stringify(taskDetails.variables.incoming, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Outgoing Data */}
                  {taskDetails.variables?.outgoing && (
                    <div>
                      <label className="text-sm font-semibold text-green-700 mb-2 block">Outgoing Data</label>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-xs text-green-800 whitespace-pre-wrap">
                          {JSON.stringify(taskDetails.variables.outgoing, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Error Data */}
                  {taskDetails.variables?.error && (
                    <div>
                      <label className="text-sm font-semibold text-red-700 mb-2 block">Error Data</label>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-xs text-red-800 whitespace-pre-wrap">
                          {JSON.stringify(taskDetails.variables.error, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Debug: Show all variables if no incoming/outgoing/error */}
                  {taskDetails.variables && !taskDetails.variables.incoming && !taskDetails.variables.outgoing && !taskDetails.variables.error && (
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">All Variables (Debug)</label>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                          {JSON.stringify(taskDetails.variables, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Debug: No variables at all */}
                  {!taskDetails.variables && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                      <p className="text-sm text-yellow-700">No variables data available for this task</p>
                      <p className="text-xs text-yellow-600 mt-2">Check console for full task details</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No task details available
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setSelectedTask(null);
                  setTaskDetails(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowTree;

