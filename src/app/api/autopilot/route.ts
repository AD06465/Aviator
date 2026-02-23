import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

// Create an HTTPS agent that accepts self-signed certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// Server-side credentials (never exposed to browser)
const AUTOPILOT_USERNAME = process.env.AUTOPILOT_USERNAME;
const AUTOPILOT_PASSWORD = process.env.AUTOPILOT_PASSWORD;

// Cache for authentication token (in-memory, per server instance)
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Authenticate with Autopilot API (server-side only)
 */
async function authenticateAutopilot(environment: string): Promise<string | null> {
  // Check if we have a valid cached token
  if (cachedToken && Date.now() < tokenExpiry) {
    console.log('Using cached Autopilot token');
    return cachedToken;
  }

  if (!AUTOPILOT_USERNAME || !AUTOPILOT_PASSWORD) {
    console.error('❌ Autopilot credentials not configured in environment variables');
    console.error('   AUTOPILOT_USERNAME:', AUTOPILOT_USERNAME ? '✓ Set' : '✗ Missing');
    console.error('   AUTOPILOT_PASSWORD:', AUTOPILOT_PASSWORD ? '✓ Set' : '✗ Missing');
    console.error('   Please run: setup-autopilot-credentials.bat');
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
      // @ts-ignore - Node.js fetch supports agent
      agent: httpsAgent,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      console.error('❌ Autopilot authentication failed:', response.statusText);
      return null;
    }

    // Get response as text first (Autopilot returns token directly, not as JSON)
    const responseText = await response.text();
    
    // Use the token as-is (base64 format)
    if (responseText && responseText.length > 0) {
      cachedToken = responseText.trim();
      // Cache token for 30 minutes
      tokenExpiry = Date.now() + (30 * 60 * 1000);
      console.log('✅ Autopilot authenticated -', environment);
      return cachedToken;
    }

    console.error('❌ No token in response');
    return null;
  } catch (error) {
    console.error('❌ Error during Autopilot authentication:', error);
    return null;
  }
}

/**
 * Get Autopilot base URL for environment
 */
function getAutopilotBaseUrl(environment: string): string {
  const envMap: Record<string, string> = {
    'Test 1': 'https://usddclvapapp011-test.corp.intranet:3443',
    'Test 2': 'https://usddclvapapp021-test.corp.intranet:3443',
    'Test 4': 'https://usddclvapapp041-test.corp.intranet:3443',
  };
  return envMap[environment] || envMap['Test 1'];
}

/**
 * API Route Handler - Proxy for Autopilot API calls
 * Keeps credentials secure on server-side
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { environment, orderNumber } = body;

    if (!environment || !orderNumber) {
      return NextResponse.json(
        { error: 'Missing required parameters: environment and orderNumber' },
        { status: 400 }
      );
    }

    // Authenticate (server-side only)
    const token = await authenticateAutopilot(environment);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Failed to authenticate with Autopilot API' },
        { status: 401 }
      );
    }

    // Fetch workflows using Basic authentication (username:password)
    const baseUrl = getAutopilotBaseUrl(environment);
    // Updated URL with contains[description] parameter as per original requirement
    const workflowUrl = `${baseUrl}/operations-manager/jobs?exclude=transitions,variables,tasks&limit=100&order=-1&skip=0&sort=metrics.start_time&contains[description]="${orderNumber}"`;
    
    console.log('🔍 Fetching workflows from Autopilot:', {
      environment,
      orderNumber,
      url: workflowUrl
    });
    
    // Create Basic auth header: base64(username:password)
    const username = process.env.AUTOPILOT_USERNAME;
    const password = process.env.AUTOPILOT_PASSWORD;
    const basicAuthToken = Buffer.from(`${username}:${password}`).toString('base64');
    
    const response = await fetch(workflowUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${basicAuthToken}`,
        'Content-Type': 'application/json',
      },
      // @ts-ignore - Node.js fetch supports agent
      agent: httpsAgent,
    });

    if (!response.ok) {
      // Try to get error details from response body
      const errorText = await response.text();
      console.error(`Autopilot workflow fetch failed (${response.status}):`, errorText.substring(0, 100));
      return NextResponse.json(
        { error: 'Failed to fetch workflows from Autopilot API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Autopilot API wraps workflows in data.data
    const workflows = data.data || data.workflows || [];
    
    console.log('📊 Autopilot API response:', {
      requestedOrderNumber: orderNumber,
      responseKeys: Object.keys(data),
      message: data.message,
      workflowCount: Array.isArray(workflows) ? workflows.length : 0,
      hasData: !!data.data,
      dataType: Array.isArray(data.data) ? 'array' : typeof data.data,
      firstWorkflow: workflows[0] ? {
        id: workflows[0]._id,
        name: workflows[0].name,
        status: workflows[0].status,
        description: workflows[0].description
      } : null,
      // Check if workflows have order number information
      allWorkflowDescriptions: workflows.slice(0, 3).map((w: any) => ({
        name: w.name,
        description: typeof w.description === 'object' ? JSON.stringify(w.description) : w.description
      }))
    });
    
    // Return workflow data (without exposing credentials)
    return NextResponse.json({
      success: true,
      workflows: workflows,
      environment,
      orderNumber,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = (error as any)?.cause?.code;
    
    // Log different levels based on error type
    if (errorCode === 'ENOTFOUND' || errorCode === 'ECONNRESET' || errorCode === 'UND_ERR_CONNECT_TIMEOUT') {
      console.warn('⚠️  Autopilot API network error:', errorCode, '-', errorMessage.substring(0, 100));
    } else {
      console.error('❌ Autopilot API error:', error);
    }
    
    return NextResponse.json(
      { 
        error: errorCode === 'ENOTFOUND' 
          ? 'Cannot reach Autopilot server. Check VPN connection.'
          : errorCode === 'ECONNRESET'
          ? 'Connection lost to Autopilot server. Please retry.'
          : 'Failed to connect to Autopilot API'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { status: 200 });
}
