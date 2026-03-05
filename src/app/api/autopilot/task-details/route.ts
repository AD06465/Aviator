import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

// Create an HTTPS agent that accepts self-signed certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// Server-side credentials
const AUTOPILOT_USERNAME = process.env.AUTOPILOT_USERNAME;
const AUTOPILOT_PASSWORD = process.env.AUTOPILOT_PASSWORD;

// Environment URL mapping
function getAutopilotBaseUrl(environment: string): string {
  const urlMap: Record<string, string> = {
    'Test 1': 'https://usddclvapapp011-test.corp.intranet:3443',
    'Test 2': 'https://usddclvapapp041-test2.corp.intranet:3443',
    'Test 4': 'https://orddclvapapp021-test4.corp.intranet:3443',
  };
  return urlMap[environment] || urlMap['Test 1'];
}

// Cache for authentication token
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Authenticate with Autopilot API
 */
async function authenticateAutopilot(environment: string): Promise<string | null> {
  // Check if we have a valid cached token
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  if (!AUTOPILOT_USERNAME || !AUTOPILOT_PASSWORD) {
    console.error('❌ Autopilot credentials not configured');
    return null;
  }

  const baseUrl = getAutopilotBaseUrl(environment);
  
  try {
    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          username: AUTOPILOT_USERNAME,
          password: AUTOPILOT_PASSWORD,
        }
      }),
      // @ts-ignore
      agent: httpsAgent,
    });

    if (!response.ok) {
      console.error('❌ Autopilot authentication failed:', response.statusText);
      return null;
    }

    // Get response as text (Autopilot returns token directly, not as JSON)
    const responseText = await response.text();
    
    // Use the token as-is (base64 format)
    if (responseText && responseText.length > 0) {
      cachedToken = responseText.trim();
      // Cache token for 55 minutes (tokens typically expire in 60 minutes)
      tokenExpiry = Date.now() + (55 * 60 * 1000);
      console.log('✅ Autopilot authenticated -', environment);
      return cachedToken;
    }

    console.error('❌ No token in response');
    return null;
  } catch (error) {
    console.error('❌ Authentication error:', error);
    return null;
  }
}

/**
 * POST /api/autopilot/task-details
 * Fetch task details using iteration ID (taskId parameter is the iteration ID)
 */
export async function POST(request: NextRequest) {
  try {
    const { environment, taskId } = await request.json();

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: 'Task/Iteration ID is required' },
        { status: 400 }
      );
    }

    // Use Basic authentication (username:password)
    if (!AUTOPILOT_USERNAME || !AUTOPILOT_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Autopilot credentials not configured' },
        { status: 401 }
      );
    }

    const baseUrl = getAutopilotBaseUrl(environment);
    const url = `${baseUrl}/operations-manager/tasks/${taskId}`;

    console.log(`🔍 Fetching task details by iteration ID: ${taskId}`);

    // Create Basic auth header: base64(username:password)
    const basicAuthToken = Buffer.from(`${AUTOPILOT_USERNAME}:${AUTOPILOT_PASSWORD}`).toString('base64');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${basicAuthToken}`,
        'Content-Type': 'application/json',
      },
      // @ts-ignore
      agent: httpsAgent,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Failed to fetch task details: ${response.status} ${errorText}`);
      return NextResponse.json(
        { success: false, error: `Failed to fetch task details: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Log what we received for debugging
    const taskData = data.data;
    console.log(`✅ Successfully fetched task details for iteration ${taskId}:`, {
      iterationId: taskData?._id,
      taskName: taskData?.name,
      status: taskData?.status,
      app: taskData?.app,
      hasVariables: !!taskData?.variables,
      hasIncoming: !!taskData?.variables?.incoming,
      hasOutgoing: !!taskData?.variables?.outgoing,
      hasError: !!taskData?.variables?.error,
      variablesKeys: taskData?.variables ? Object.keys(taskData.variables) : [],
      jobInfo: taskData?.job ? {
        jobId: taskData.job._id,
        taskId: taskData.job.task,
        name: taskData.job.name
      } : null
    });

    return NextResponse.json({
      success: true,
      data: data.data,
    });

  } catch (error) {
    console.error('❌ Error in task-details API:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
