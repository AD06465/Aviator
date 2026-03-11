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
    'Test 2': 'https://usddclvapapp021-test.corp.intranet:3443',
    'Test 4': 'https://usddclvapapp041-test.corp.intranet:3443',
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
 * POST /api/autopilot/workflow-details
 * Fetch detailed workflow information including child jobs and tasks
 */
export async function POST(request: NextRequest) {
  try {
    const { environment, jobId } = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
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
    // Don't use include parameter - we need all data including tasks to find child jobs
    const url = `${baseUrl}/operations-manager/jobs/${jobId}`;

    console.log(`🔍 Fetching workflow details: ${url}`);

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
      console.error(`❌ Failed to fetch workflow details: ${response.status} ${errorText}`);
      return NextResponse.json(
        { success: false, error: `Failed to fetch workflow details: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Log what we received for debugging
    const jobData = data.data;
    const taskCount = jobData?.tasks ? Object.keys(jobData.tasks).length : 0;
    let childJobCount = 0;
    if (jobData?.tasks) {
      Object.values(jobData.tasks).forEach((task: any) => {
        if (task.childJobs && Array.isArray(task.childJobs)) {
          childJobCount += task.childJobs.length;
        }
      });
    }
    
    console.log(`✅ Successfully fetched workflow details for ${jobId}:`, {
      name: jobData?.name,
      status: jobData?.status,
      taskCount,
      childJobCount,
      hasChildJobs: childJobCount > 0
    });

    return NextResponse.json({
      success: true,
      data: data.data,
    });

  } catch (error) {
    console.error('❌ Error in workflow-details API:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
