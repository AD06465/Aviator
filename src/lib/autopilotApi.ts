import { AutopilotWorkflow, AutopilotWorkflowsResponse } from '@/types';

/**
 * Fetch workflows from Autopilot via secure backend API
 * This keeps credentials server-side and never exposes them to the browser
 */
export async function fetchAutopilotWorkflows(
  environment: string,
  orderNumber: string,
  includeChildren: boolean = true
): Promise<AutopilotWorkflow[]> {
  try {
    console.log(`🚀 Starting Autopilot API call - Order: ${orderNumber}, Env: ${environment}`);
    
    const response = await fetch('/api/autopilot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        environment,
        orderNumber,
        includeChildren,
      }),
    });

    console.log(`📡 Autopilot API response received - Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('❌ Backend API request failed:', errorData.error);
      throw new Error(errorData.error || 'Failed to fetch workflows');
    }

    const data = await response.json();
    console.log(`📦 Autopilot API response data:`, {
      success: data.success,
      workflowCount: data.workflows?.length || 0,
      workflows: data.workflows
    });
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch workflows');
    }
    
    console.log(`✅ Successfully fetched ${data.workflows?.length || 0} workflows from Autopilot`);
    return data.workflows || [];
  } catch (error) {
    console.error('❌ Error fetching Autopilot workflows:', error);
    throw error;
  }
}

/**
 * Get workflows grouped by status
 */
export function groupWorkflowsByStatus(workflows: AutopilotWorkflow[]): Record<string, AutopilotWorkflow[]> {
  const grouped: Record<string, AutopilotWorkflow[]> = {
    running: [],
    complete: [],
    canceled: [],
    paused: [],
    error: [],
  };

  workflows.forEach((workflow) => {
    const status = workflow.status.toLowerCase();
    if (grouped[status]) {
      grouped[status].push(workflow);
    } else {
      // If status is not in our predefined list, add to error or create new category
      grouped[status] = grouped[status] || [];
      grouped[status].push(workflow);
    }
  });

  return grouped;
}

/**
 * Build the Autopilot workflow URL for a given workflow ID
 */
export function buildAutopilotWorkflowUrl(baseUrl: string, workflowId: string): string {
  return `${baseUrl}/operations-manager/#/jobs/${workflowId}`;
}

/**
 * Format timestamp to readable date/time
 */
export function formatWorkflowTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

/**
 * Calculate workflow duration
 */
export function calculateWorkflowDuration(startTime?: number, endTime?: number): string {
  if (!startTime) return 'N/A';
  
  const end = endTime || Date.now();
  const duration = end - startTime;
  
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Fetch detailed workflow information including child jobs and tasks
 */
export async function fetchWorkflowDetails(
  environment: string,
  jobId: string
): Promise<any> {
  try {
    console.log(`🔍 Fetching workflow details for job: ${jobId}`);
    
    const response = await fetch('/api/autopilot/workflow-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        environment,
        jobId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || 'Failed to fetch workflow details');
    }

    const data = await response.json();
    console.log(`✅ Fetched workflow details for ${jobId}:`, data);
    return data;
  } catch (error) {
    console.error(`❌ Error fetching workflow details for ${jobId}:`, error);
    throw error;
  }
}

/**
 * Fetch task details including incoming/outgoing/error data
 */
export async function fetchTaskDetails(
  environment: string,
  taskId: string
): Promise<any> {
  try {
    console.log(`🔍 Fetching task details for: ${taskId}`);
    
    const response = await fetch('/api/autopilot/task-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        environment,
        taskId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || 'Failed to fetch task details');
    }

    const data = await response.json();
    console.log(`✅ Fetched task details for ${taskId}:`, data);
    return data;
  } catch (error) {
    console.error(`❌ Error fetching task details for ${taskId}:`, error);
    throw error;
  }
}

/**
 * Build workflow hierarchy tree recursively
 */
export async function buildWorkflowHierarchy(
  environment: string,
  rootJobId: string,
  maxDepth: number = 10
): Promise<any> {
  const visited = new Set<string>();
  
  async function buildNode(jobId: string, depth: number = 0): Promise<any> {
    // Prevent infinite recursion and circular dependencies
    if (depth >= maxDepth || visited.has(jobId)) {
      return null;
    }
    
    visited.add(jobId);
    
    try {
      const workflowDetails = await fetchWorkflowDetails(environment, jobId);
      
      if (!workflowDetails || !workflowDetails.data) {
        return null;
      }
      
      const { data } = workflowDetails;
      
      // Extract child jobs from tasks
      const childJobs: Array<{ _id: string; name: string; iteration: number }> = [];
      
      if (data.tasks) {
        Object.values(data.tasks).forEach((task: any) => {
          if (task.childJobs && Array.isArray(task.childJobs)) {
            childJobs.push(...task.childJobs);
          }
        });
      }
      
      console.log(`📊 Job ${jobId} (${data.name}): Found ${childJobs.length} child jobs at depth ${depth}`, 
        childJobs.map(c => ({ id: c._id, name: c.name }))
      );
      
      // Build child nodes recursively
      const children = await Promise.all(
        childJobs.map(child => buildNode(child._id, depth + 1))
      );
      
      return {
        _id: data._id,
        name: data.name,
        status: data.status,
        description: data.description,
        tasks: data.tasks,
        childJobs,
        children: children.filter(Boolean),
        metrics: data.metrics,
      };
    } catch (error) {
      console.error(`Error building node for ${jobId}:`, error);
      return null;
    }
  }
  
  return buildNode(rootJobId);
}
