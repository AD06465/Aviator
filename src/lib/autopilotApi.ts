import { AutopilotWorkflow, AutopilotWorkflowsResponse } from '@/types';

/**
 * Fetch workflows from Autopilot via secure backend API
 * This keeps credentials server-side and never exposes them to the browser
 */
export async function fetchAutopilotWorkflows(
  environment: string,
  orderNumber: string
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
