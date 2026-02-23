import React, { useState } from 'react';
import { autopilotWorkflowService } from '../lib/api';

interface WorkflowTreeProps {
  rootJobId: string;
}

interface TreeNode {
  _id: string;
  name: string;
  status: string;
  children?: TreeNode[];
  depth: number;
  errorDetails?: any[];
}

const WorkflowTree: React.FC<WorkflowTreeProps> = ({ rootJobId }) => {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  const fetchTree = async () => {
    setLoading(true);
    const jobTree = await autopilotWorkflowService.fetchWorkflowTree(rootJobId);
    if (jobTree) {
      // Attach task details for each node (all tasks)
      jobTree.errorDetails = await autopilotWorkflowService.extractTaskDetails(jobTree);
      if (jobTree.children) {
        for (const child of jobTree.children) {
          child.errorDetails = await autopilotWorkflowService.extractTaskDetails(child);
        }
      }
    }
    setTree(jobTree);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchTree();
    // eslint-disable-next-line
  }, [rootJobId]);

  const handleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<any | null>(null);

  const handleTaskClick = async (taskId: string) => {
    setSelectedTaskId(taskId);
    const details = await autopilotWorkflowService.fetchTaskDetails(taskId);
    setSelectedTaskDetails(details);
  };

  const renderNode = (node: TreeNode) => (
    <div className={`ml-${node.depth * 6} mb-4 border-l-4 border-blue-200 pl-4`}> {/* Indent by depth */}
      <div className="flex items-center space-x-2">
        <button
          className="text-blue-600 font-bold focus:outline-none"
          onClick={() => handleExpand(node._id)}
        >
          {node.children && node.children.length > 0 ? (
            expanded[node._id] ? '▼' : '▶'
          ) : '•'}
        </button>
        <span className={`font-semibold ${node.status === 'error' ? 'text-red-600' : 'text-gray-900'}`}>{node.name}</span>
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${node.status === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{node.status}</span>
      </div>
      {/* Task List for this job */}
      {node.errorDetails && node.errorDetails.length > 0 && (
        <div className="mt-2">
          <h5 className="text-sm font-semibold text-blue-800 mb-2">Tasks</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {node.errorDetails.map((task, idx) => (
              <button
                key={idx}
                className={`w-full text-left p-2 rounded border ${selectedTaskId === task.taskId ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'} hover:bg-blue-100 transition-all`}
                onClick={() => handleTaskClick(task.taskId)}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs text-gray-700">{task.taskId}</span>
                  <span className="font-semibold text-gray-900">{task.taskName}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${task.status === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{task.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Selected Task Details */}
      {selectedTaskId && selectedTaskDetails && (
        <div className="mt-4 bg-gray-50 border border-blue-200 rounded-lg p-4">
          <h5 className="text-sm font-semibold text-blue-900 mb-2">Task Details</h5>
          <div className="mb-2 text-xs text-gray-700">Incoming:<pre className="bg-gray-100 p-2 rounded">{JSON.stringify(selectedTaskDetails.variables?.incoming, null, 2)}</pre></div>
          {selectedTaskDetails.variables?.outgoing && (
            <div className="mb-2 text-xs text-gray-700">Outgoing:<pre className="bg-gray-100 p-2 rounded">{JSON.stringify(selectedTaskDetails.variables?.outgoing, null, 2)}</pre></div>
          )}
          {selectedTaskDetails.variables?.error && (
            <div className="mb-2 text-xs text-red-700">Error:<pre className="bg-red-100 p-2 rounded">{JSON.stringify(selectedTaskDetails.variables?.error, null, 2)}</pre></div>
          )}
        </div>
      )}
      {/* Children */}
      {expanded[node._id] && node.children && node.children.length > 0 && (
        <div className="mt-2">
          {node.children.map(child => renderNode(child))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-blue-900 mb-4">Workflow Hierarchy</h3>
      {loading ? (
        <div className="text-center py-8 text-blue-600">Loading workflow tree...</div>
      ) : tree ? (
        renderNode(tree)
      ) : (
        <div className="text-center py-8 text-gray-600">No workflow data found.</div>
      )}
    </div>
  );
};

export default WorkflowTree;
