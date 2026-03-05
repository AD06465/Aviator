import React, { useState, useEffect, useCallback } from 'react';
import ErrorDetailModal from './ErrorDetailModal';
import WorkflowTree from './WorkflowTree';
import { autopilotWorkflowService } from '@/lib/api';
import { AutopilotWorkflow } from '@/types';
import {
  fetchAutopilotWorkflows,
  groupWorkflowsByStatus,
  buildAutopilotWorkflowUrl,
  formatWorkflowTime,
  calculateWorkflowDuration,
} from '@/lib/autopilotApi';
import { AUTOPILOT_ENVIRONMENTS, AUTOPILOT_REFRESH_INTERVAL } from '@/core/constants/autopilot';
import LoadingSpinner from './LoadingSpinner';

interface AutopilotMonitorProps {
  orderNumber: string;
  environment: string;
  isActive?: boolean; // Control auto-refresh based on tab visibility
}

type WorkflowStatus = 'running' | 'complete' | 'canceled' | 'paused' | 'error';
type ViewMode = 'list' | 'hierarchy';

// Authentic Pronghorn Operations Manager color scheme
const statusColors: Record<WorkflowStatus, string> = {
  running: 'text-[#007BFF]',
  complete: 'text-[#28A745]',
  canceled: 'text-[#6C757D]',
  paused: 'text-[#FFC107]',
  error: 'text-[#DC3545]',
};

const AutopilotMonitor = ({ orderNumber, environment, isActive = true }: AutopilotMonitorProps) => {
  const [workflows, setWorkflows] = useState<AutopilotWorkflow[]>([]);
  const [groupedWorkflows, setGroupedWorkflows] = useState<Record<string, AutopilotWorkflow[]>>({});
  const [activeTab, setActiveTab] = useState<WorkflowStatus>('running');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedWorkflowForHierarchy, setSelectedWorkflowForHierarchy] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  
  // Pagination state - track current page for each status
  const [currentPages, setCurrentPages] = useState<Record<WorkflowStatus, number>>({
    running: 1,
    complete: 1,
    canceled: 1,
    paused: 1,
    error: 1,
  });
  const WORKFLOWS_PER_PAGE = 100;
  
  // Column widths state (resizable columns)
  const [columnWidths, setColumnWidths] = useState({
    status: 100,
    name: 300,
    progress: 200,
    started: 180,
    duration: 120,
    id: 180
  });
  const [resizing, setResizing] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  // Get current environment config
  const currentEnv = AUTOPILOT_ENVIRONMENTS.find((env) => env.name === environment);

  // Error detail modal state
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [selectedErrorWorkflow, setSelectedErrorWorkflow] = useState<AutopilotWorkflow | null>(null);
  const [errorTaskDetails, setErrorTaskDetails] = useState<any[]>([]);
  const [errorTaskLoading, setErrorTaskLoading] = useState(false);
  // Fetch job/task/iteration details for error workflow when modal opens
  useEffect(() => {
    const fetchErrorDetails = async () => {
      if (selectedErrorWorkflow && errorModalOpen) {
        setErrorTaskLoading(true);
        try {
          // Fetch job details (with tasks/iterations/errors)
          const job = await autopilotWorkflowService.fetchJobDetails(selectedErrorWorkflow._id);
          if (job) {
            // Extract all error task details (with error status or error variable)
            const allTaskDetails = await autopilotWorkflowService.extractTaskDetails(job);
            const errorTasks = allTaskDetails.filter((t: any) => t.status === 'error' || t.error);
            setErrorTaskDetails(errorTasks);
          } else {
            setErrorTaskDetails([]);
          }
        } catch (e) {
          setErrorTaskDetails([]);
        } finally {
          setErrorTaskLoading(false);
        }
      } else {
        setErrorTaskDetails([]);
      }
    };
    fetchErrorDetails();
  }, [selectedErrorWorkflow, errorModalOpen]);

  // Handle column resize
  // Parse workflow name from description
  const parseWorkflowName = (workflow: AutopilotWorkflow): string => {
    // If name is not generic, use it
    if (workflow.name && !workflow.name.includes('POM_GPOM_GetLatestTaskDetails')) {
      return workflow.name;
    }
    
    // Parse description for workflow type
    const description = typeof workflow.description === 'string' 
      ? workflow.description 
      : '';
    
    if (!description) return workflow.name || 'Unnamed Workflow';
    
    // Pattern: AP-556172356-464251366-MON-2-0-352933489-1-OFFNET-v0
    // Extract workflow type from description
    const patterns = [
      { regex: /-MON-.*-ONNET/, name: 'Monarch Onnet' },
      { regex: /-MON-.*-OFFNET/, name: 'Monarch Offnet' },
      { regex: /-COLORLESS/, name: 'Colorless' },
      { regex: /ONNET/, name: 'Onnet Order' },
      { regex: /OFFNET/, name: 'Offnet Order' },
      { regex: /GetLatestTaskDetails/, name: 'Task Status Check' },
    ];
    
    for (const pattern of patterns) {
      if (pattern.regex.test(description)) {
        return pattern.name;
      }
    }
    
    return workflow.name || 'Workflow';
  };

  const handleMouseDown = (column: string, e: React.MouseEvent) => {
    setResizing(column);
    setStartX(e.clientX);
    setStartWidth(columnWidths[column as keyof typeof columnWidths]);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizing) return;
    
    const diff = e.clientX - startX;
    const newWidth = Math.max(80, startWidth + diff); // Minimum 80px
    
    setColumnWidths(prev => ({
      ...prev,
      [resizing]: newWidth
    }));
  }, [resizing, startX, startWidth]);

  const handleMouseUp = useCallback(() => {
    setResizing(null);
  }, []);

  useEffect(() => {
    if (resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [resizing, handleMouseMove, handleMouseUp]);

  // Fetch workflows via secure backend API
  const fetchWorkflows = useCallback(async () => {
    if (!currentEnv || !orderNumber) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For list view: fetch ALL workflows (parent + children)
      // For hierarchy view: fetch only PARENT workflows for dropdown selection
      const includeChildren = viewMode === 'list';
      const data = await fetchAutopilotWorkflows(environment, orderNumber, includeChildren);
      console.log(`🔍 Setting workflows in state (${viewMode} mode, includeChildren=${includeChildren}):`, {
        workflowCount: data.length,
        firstWorkflow: data[0] ? {
          id: data[0]._id,
          name: data[0].name,
          status: data[0].status
        } : null
      });
      
      setWorkflows(data);
      const grouped = groupWorkflowsByStatus(data);
      console.log('📊 Grouped workflows:', {
        running: grouped.running?.length || 0,
        complete: grouped.complete?.length || 0,
        canceled: grouped.canceled?.length || 0,
        paused: grouped.paused?.length || 0,
        error: grouped.error?.length || 0
      });
      
      // Check if any workflows contain the order number
      const orderRelatedWorkflows = data.filter((w: any) => {
        const descStr = typeof w.description === 'string' ? w.description : JSON.stringify(w.description || '');
        const nameStr = w.name || '';
        return descStr.includes(orderNumber) || nameStr.includes(orderNumber);
      });
      
      if (orderRelatedWorkflows.length > 0 && orderRelatedWorkflows.length < data.length) {
        console.warn(`⚠️ API returned ${data.length} workflows but only ${orderRelatedWorkflows.length} contain order ${orderNumber}`);
        setError(`Note: Showing all ${data.length} workflows. The Autopilot API may not filter by order number. Order-specific workflows (if any): ${orderRelatedWorkflows.length}`);
      } else if (orderRelatedWorkflows.length === 0 && data.length > 0) {
        console.warn(`⚠️ None of the ${data.length} workflows contain order number ${orderNumber} in name or description`);
        setError(`Warning: Autopilot returned ${data.length} workflows but none appear related to order ${orderNumber}. The API 'orderNo' parameter may not be working.`);
      }
      
      setGroupedWorkflows(grouped);
      setLastRefresh(new Date());
    } catch (err) {
      setError(`Failed to fetch workflows: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [currentEnv, orderNumber, environment, viewMode]);

  // Initial fetch
  useEffect(() => {
    if (orderNumber) {
      fetchWorkflows();
    }
  }, [orderNumber, fetchWorkflows]);

  // Set up auto-refresh (only when active)
  useEffect(() => {
    if (!orderNumber || !isActive) {
      return;
    }

    const interval = setInterval(() => {
      console.log('Auto-refreshing Autopilot workflows...');
      fetchWorkflows();
    }, AUTOPILOT_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [orderNumber, isActive, fetchWorkflows]);

  // Helper functions and constants
  const renderWorkflowRow = (workflow: AutopilotWorkflow) => {
    const workflowUrl = buildAutopilotWorkflowUrl(currentEnv!.baseUrl, workflow._id);
    const duration = calculateWorkflowDuration(workflow.metrics?.start_time, workflow.metrics?.end_time);
    const progress = workflow.metrics?.progress !== undefined ? Math.round(workflow.metrics.progress * 100) : null;
    
    // Safely handle description - it might be an object
    const description = typeof workflow.description === 'string' 
      ? workflow.description 
      : workflow.description && typeof workflow.description === 'object'
      ? JSON.stringify(workflow.description)
      : '';

    // Highlight error workflows in red and make row clickable for error detail
    const isError = workflow.status === 'error' || (workflow.error && workflow.error.length > 0);
    return (
      <tr
        key={workflow._id}
        className={`border-b border-[#DDDDDD] hover:bg-[#F8F9FA] transition-colors ${isError ? 'bg-[#F8D7DA] cursor-pointer' : ''}`}
        onClick={() => {
          if (isError) {
            setSelectedErrorWorkflow(workflow);
            setErrorModalOpen(true);
          }
        }}
        title={isError ? 'View error details' : ''}
      >
        {/* Status - Text-based like Pronghorn */}
        <td className="px-5 py-4" style={{ width: columnWidths.status }}>
          <span
            className={`font-medium text-sm ${
              isError ? 'text-[#DC3545]' : (statusColors[workflow.status as WorkflowStatus] || 'text-[#6C757D]')
            }`}
          >
            {workflow.status}
            {isError && (
              <span className="ml-2 text-xs bg-[#DC3545] text-white px-2 py-0.5 rounded">Error</span>
            )}
          </span>
        </td>

        {/* Workflow Name */}
        <td className="px-5 py-4" style={{ width: columnWidths.name }}>
          <a
            href={workflowUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#007BFF] hover:text-[#0056b3] hover:underline font-normal font-medium"
          >
            {parseWorkflowName(workflow)}
          </a>
          {description && (
            <p className="text-xs text-[#6C757D] mt-1 truncate" title={description}>{description}</p>
          )}
        </td>

        {/* Progress */}
        <td className="px-5 py-4" style={{ width: columnWidths.progress }}>
          {progress !== null ? (
            <div className="flex items-center gap-2">
              <div className="w-full bg-[#E9ECEF] rounded h-2">
                <div
                  className="bg-[#007BFF] h-2 rounded transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-[#333333] whitespace-nowrap min-w-[40px] text-right">{progress}%</span>
            </div>
          ) : (
            <span className="text-xs text-[#A9C6C9]">—</span>
          )}
        </td>

        {/* Start Time */}
        <td className="px-5 py-4 text-sm text-[#333333]" style={{ width: columnWidths.started }}>
          {workflow.metrics?.start_time ? formatWorkflowTime(workflow.metrics.start_time) : '—'}
        </td>

        {/* Duration */}
        <td className="px-5 py-4 text-sm text-[#333333] whitespace-nowrap" style={{ width: columnWidths.duration }}>
          {duration}
        </td>

        {/* ID */}
        <td className="px-5 py-4 text-xs text-[#6C757D] font-mono" style={{ width: columnWidths.id }}>
          <span className="block overflow-hidden text-ellipsis" title={workflow._id}>
            {workflow._id}
          </span>
        </td>
      </tr>
    );
  };

  const tabs: Array<{ status: WorkflowStatus; label: string }> = [
    { status: 'running', label: 'Running' },
    { status: 'complete', label: 'Complete' },
    { status: 'canceled', label: 'Canceled' },
    { status: 'paused', label: 'Paused' },
    { status: 'error', label: 'Error' },
  ];

  // Pagination helper functions
  const getCurrentPageWorkflows = (status: WorkflowStatus): AutopilotWorkflow[] => {
    const statusWorkflows = groupedWorkflows[status] || [];
    const currentPage = currentPages[status];
    const startIndex = (currentPage - 1) * WORKFLOWS_PER_PAGE;
    const endIndex = startIndex + WORKFLOWS_PER_PAGE;
    return statusWorkflows.slice(startIndex, endIndex);
  };

  const getTotalPages = (status: WorkflowStatus): number => {
    const statusWorkflows = groupedWorkflows[status] || [];
    return Math.ceil(statusWorkflows.length / WORKFLOWS_PER_PAGE);
  };

  const handlePageChange = (status: WorkflowStatus, newPage: number) => {
    setCurrentPages(prev => ({
      ...prev,
      [status]: newPage,
    }));
  };

  const handlePrevPage = () => {
    const currentPage = currentPages[activeTab];
    if (currentPage > 1) {
      handlePageChange(activeTab, currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const currentPage = currentPages[activeTab];
    const totalPages = getTotalPages(activeTab);
    if (currentPage < totalPages) {
      handlePageChange(activeTab, currentPage + 1);
    }
  };

  // Reset to page 1 when changing tabs
  const handleTabChange = (status: WorkflowStatus) => {
    setActiveTab(status);
    // Don't reset page - preserve user's position
  };

  // Early returns for invalid states
  if (!orderNumber) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">Please enter an Order Number to view Autopilot workflows.</p>
      </div>
    );
  }

  if (!currentEnv) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800">Invalid environment selected. Please select a valid environment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh info - Pronghorn style */}
      <div className="flex items-center justify-between bg-white border border-[#DDDDDD] rounded p-5 shadow-sm">
        <div>
          <h2 className="text-2xl font-normal text-[#242444] mb-1">Operations Manager</h2>
          <p className="text-sm text-[#6C757D]">
            Order: <span className="font-medium text-[#333333]">{orderNumber}</span> | Environment:{' '}
            <span className="font-medium text-[#333333]">{environment}</span>
          </p>
        </div>
        <div className="text-right">
          <button
            onClick={fetchWorkflows}
            disabled={loading}
            className="bg-[#007BFF] text-white px-5 py-2.5 rounded hover:bg-[#0056b3] transition-colors disabled:bg-[#6C757D] disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Refresh</span>
              </>
            )}
          </button>
          {lastRefresh && (
            <p className="text-xs text-[#6C757D] mt-1.5">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-[#F8D7DA] border border-[#F5C6CB] rounded p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-[#DC3545] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-[#DC3545] font-medium">Connection Error</p>
              <p className="text-[#721c24] text-sm mt-1">{error}</p>
              {error.includes('VPN') && (
                <p className="text-[#721c24] text-xs mt-2">💡 Tip: Make sure you're connected to the corporate VPN</p>
              )}
            </div>
            <button
              onClick={fetchWorkflows}
              className="text-[#DC3545] hover:text-[#721c24] text-sm font-medium underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="bg-white border border-[#DDDDDD] rounded p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-[#242444]">View:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded transition-all ${
                viewMode === 'list'
                  ? 'bg-[#007BFF] text-white shadow-sm'
                  : 'bg-[#F8F9FA] text-[#6C757D] hover:bg-[#E9ECEF]'
              }`}
            >
              📋 List View
            </button>
            <button
              onClick={() => setViewMode('hierarchy')}
              className={`px-4 py-2 rounded transition-all ${
                viewMode === 'hierarchy'
                  ? 'bg-[#007BFF] text-white shadow-sm'
                  : 'bg-[#F8F9FA] text-[#6C757D] hover:bg-[#E9ECEF]'
              }`}
            >
              🌳 Hierarchy View
            </button>
          </div>
          {viewMode === 'hierarchy' && workflows.length > 0 && (
            <div className="ml-auto">
              <label className="text-sm text-[#6C757D] mr-2">Select Root Workflow:</label>
              <select
                value={selectedWorkflowForHierarchy || ''}
                onChange={(e) => setSelectedWorkflowForHierarchy(e.target.value)}
                className="border border-[#DDDDDD] rounded px-3 py-2 text-sm"
              >
                <option value="">-- Select a workflow --</option>
                {workflows.map((wf) => (
                  <option key={wf._id} value={wf._id}>
                    {wf.name} ({wf.status})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Hierarchy View */}
      {viewMode === 'hierarchy' && selectedWorkflowForHierarchy ? (
        <WorkflowTree
          rootJobId={selectedWorkflowForHierarchy}
          environment={environment}
          orderNumber={orderNumber}
        />
      ) : viewMode === 'hierarchy' ? (
        <div className="bg-white border border-[#DDDDDD] rounded p-12 text-center shadow-sm">
          <p className="text-[#6C757D] text-lg">Please select a root workflow from the dropdown above to view its hierarchy</p>
        </div>
      ) : null}

      {/* List View - Tabs and Table */}
      {viewMode === 'list' && (
        <>
          {/* Tabs - Clean professional design */}
          <div className="bg-white border-b-2 border-[#DDDDDD]">
            <div className="grid grid-cols-5">
              {tabs.map(({ status, label }) => {
            const count = groupedWorkflows[status]?.length || 0;
            const isActive = activeTab === status;
            
            // Clean status colors
            const statusColors: Record<WorkflowStatus, { active: string; text: string }> = {
              running: { active: 'border-[#007BFF]', text: 'text-[#007BFF]' },
              complete: { active: 'border-[#28A745]', text: 'text-[#28A745]' },
              canceled: { active: 'border-[#6C757D]', text: 'text-[#6C757D]' },
              paused: { active: 'border-[#FFC107]', text: 'text-[#FFC107]' },
              error: { active: 'border-[#DC3545]', text: 'text-[#DC3545]' },
            };
            
            const colors = statusColors[status];
            
            return (
              <button
                key={status}
                onClick={() => handleTabChange(status)}
                className={`
                  px-4 py-3 border-b-3 transition-all duration-200
                  ${isActive 
                    ? `${colors.active} ${colors.text} bg-[#F8F9FA] font-semibold` 
                    : 'border-transparent text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#333333] font-medium'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm uppercase tracking-wide">
                    {label}
                  </span>
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-bold
                    ${isActive 
                      ? `${colors.text} bg-white` 
                      : 'bg-[#E9ECEF] text-[#6C757D]'
                    }
                  `}>
                    {count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Workflows table - Pronghorn minimalist style */}
      <div className="min-h-[400px] bg-white border border-[#DDDDDD] rounded shadow-sm overflow-hidden">
        {loading && workflows.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        ) : groupedWorkflows[activeTab]?.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="bg-[#F8F9FA] border-b border-[#DDDDDD]">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#242444] uppercase tracking-wide relative group" style={{ width: columnWidths.status }}>
                      Status
                      <div
                        className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-[#007BFF] group-hover:bg-[#007BFF]/30"
                        onMouseDown={(e) => handleMouseDown('status', e)}
                      />
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#242444] uppercase tracking-wide relative group" style={{ width: columnWidths.name }}>
                      Workflow Name
                      <div
                        className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-[#007BFF] group-hover:bg-[#007BFF]/30"
                        onMouseDown={(e) => handleMouseDown('name', e)}
                      />
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#242444] uppercase tracking-wide relative group" style={{ width: columnWidths.progress }}>
                      Progress
                      <div
                        className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-[#007BFF] group-hover:bg-[#007BFF]/30"
                        onMouseDown={(e) => handleMouseDown('progress', e)}
                      />
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#242444] uppercase tracking-wide relative group" style={{ width: columnWidths.started }}>
                      Started
                      <div
                        className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-[#007BFF] group-hover:bg-[#007BFF]/30"
                        onMouseDown={(e) => handleMouseDown('started', e)}
                      />
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#242444] uppercase tracking-wide relative group" style={{ width: columnWidths.duration }}>
                      Duration
                      <div
                        className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-[#007BFF] group-hover:bg-[#007BFF]/30"
                        onMouseDown={(e) => handleMouseDown('duration', e)}
                      />
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#242444] uppercase tracking-wide relative" style={{ width: columnWidths.id }}>
                      ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {getCurrentPageWorkflows(activeTab).map(renderWorkflowRow)}
                </tbody>
              </table>
            </div>
            
            {/* Pagination controls */}
            {getTotalPages(activeTab) > 1 && (
              <div className="border-t border-[#DDDDDD] bg-[#F8F9FA] px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-[#6C757D]">
                    Showing {((currentPages[activeTab] - 1) * WORKFLOWS_PER_PAGE) + 1} - {Math.min(currentPages[activeTab] * WORKFLOWS_PER_PAGE, groupedWorkflows[activeTab].length)} of {groupedWorkflows[activeTab].length} workflows
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPages[activeTab] === 1}
                      className="px-4 py-2 bg-white border border-[#DDDDDD] rounded text-[#333333] hover:bg-[#E9ECEF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      title="Previous page"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="text-sm font-medium">Previous</span>
                    </button>
                    
                    <div className="text-sm text-[#333333] font-medium px-4">
                      Page {currentPages[activeTab]} of {getTotalPages(activeTab)}
                    </div>
                    
                    <button
                      onClick={handleNextPage}
                      disabled={currentPages[activeTab] === getTotalPages(activeTab)}
                      className="px-4 py-2 bg-white border border-[#DDDDDD] rounded text-[#333333] hover:bg-[#E9ECEF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      title="Next page"
                    >
                      <span className="text-sm font-medium">Next</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-[#F8F9FA] border-t border-[#DDDDDD] p-12 text-center">
            <p className="text-[#6C757D]">No {activeTab} workflows found for this order.</p>
          </div>
        )}
      </div>

      {/* Summary stats - Pronghorn color scheme */}
      <div className="bg-white border border-[#DDDDDD] rounded p-5 shadow-sm">
        <h3 className="font-medium text-[#242444] mb-4 text-base">Workflow Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {tabs.map(({ status, label }) => {
            const count = groupedWorkflows[status]?.length || 0;
            const statusColorMap: Record<WorkflowStatus, string> = {
              running: 'bg-[#D9ECFF] border-[#007BFF]',
              complete: 'bg-[#D4EDDA] border-[#28A745]',
              canceled: 'bg-[#E2E3E5] border-[#6C757D]',
              paused: 'bg-[#FFF3CD] border-[#FFC107]',
              error: 'bg-[#F8D7DA] border-[#DC3545]',
            };
            return (
              <div key={status} className={`rounded border-l-4 p-3 ${statusColorMap[status]} bg-opacity-40`}>
                <p className={`text-3xl font-light ${statusColors[status]}`}>{count}</p>
                <p className="text-sm text-[#333333] mt-1">{label}</p>
              </div>
            );
          })}
        </div>
      </div>
        </>
      )}

      {/* Error Detail Modal - Available in both views */}
      <ErrorDetailModal
        open={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        workflowName={selectedErrorWorkflow?.name || ''}
        errorDetails={
          errorTaskDetails.length > 0
            ? errorTaskDetails.map(t => ({
                task: t.taskName || t.taskId,
                message: t.error || t.status,
                timestamp: Date.now(),
                incoming: t.incoming,
                outgoing: t.outgoing,
                error: t.error,
                status: t.status,
              }))
            : (selectedErrorWorkflow?.error || [])
        }
        loading={errorTaskLoading}
      />
    </div>
  );
};

export default AutopilotMonitor;
