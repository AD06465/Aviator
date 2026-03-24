/**
 * Swift IsChangesTriggerRestart API
 * Validates if order changes would trigger a workflow restart BEFORE saving
 * Call this BEFORE SaveOrderPackage to detect potential restart triggers
 */

import { NextRequest, NextResponse } from 'next/server';
import { NtlmClient } from 'axios-ntlm';
import os from 'os';

const SWIFT_ENVIRONMENTS = {
  'Test 1': 'http://swiftenv1.corp.global.level3.com',
  'Test 2': 'http://swiftenv2.corp.global.level3.com',
  'Test 4': 'http://swiftenv4.corp.global.level3.com',
};

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;
    const body = await request.json();
    const { 
      orderDetail,
      productPackages,
      environment = 'Test 1'
    } = body;

    if (!orderDetail || !productPackages) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: orderDetail and productPackages'
      }, { status: 400 });
    }

    // Get environment-specific base URL
    const baseUrl = SWIFT_ENVIRONMENTS[environment as keyof typeof SWIFT_ENVIRONMENTS];
    
    if (!baseUrl) {
      return NextResponse.json({
        success: false,
        error: `Invalid environment: ${environment}`,
      }, { status: 400 });
    }

    const url = `${baseUrl}/OrderPackage/Home/IsChangesTriggerRestart/`;

    // Get Windows credentials
    const username = process.env.SWIFT_API_USERNAME || os.userInfo().username;
    const password = process.env.SWIFT_API_PASSWORD;
    const domain = process.env.SWIFT_API_DOMAIN || 'CTL';
    const workstation = process.env.SWIFT_API_WORKSTATION || os.hostname();

    if (!password) {
      return NextResponse.json({
        success: false,
        error: 'SWIFT_API_PASSWORD not configured',
      }, { status: 500 });
    }

    // Build the validation payload
    const payload = {
      orderDetail,
      productPackages
    };

    console.log(`[Swift CheckRestartTrigger] Validating order ${orderId} changes...`);
    console.log(`[Swift CheckRestartTrigger] Environment: ${environment}`);
    console.log(`[Swift CheckRestartTrigger] ProductPackages count: ${productPackages.length}`);

    // Create NTLM client
    const client = NtlmClient({
      username,
      password,
      domain,
      workstation
    });

    // Make NTLM POST request
    const response = await client.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 130000 // 130 second timeout
    });

    if (response.status === 200) {
      const result = response.data;

      console.log(`[Swift CheckRestartTrigger] Validation complete`);
      console.log(`[Swift CheckRestartTrigger] IsRestartWorkflow: ${result.IsRestartWorkflow}`);
      
      if (result.WorkflowRestartResponse?.IsWorkflowRestarting) {
        console. warn(`[Swift CheckRestartTrigger] ⚠️ RESTART WOULD BE TRIGGERED!`);
        console.warn(`[Swift CheckRestartTrigger] Triggering changes:`, result.WorkflowRestartResponse.RestartTriggeringChanges);
      }

      return NextResponse.json({
        success: true,
        data: {
          isRestartWorkflow: result.IsRestartWorkflow,
          workflowRestartResponse: result.WorkflowRestartResponse,
          willTriggerRestart: result.IsRestartWorkflow || result.WorkflowRestartResponse?.IsWorkflowRestarting,
          restartTriggeringChanges: result.WorkflowRestartResponse?.RestartTriggeringChanges || [],
          pspChanges: result.WorkflowRestartResponse?.PspChanges || []
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Swift API returned non-200 status',
        statusCode: response.status,
        responseBody: response.data
      }, { status: response.status || 500 });
    }

  } catch (error: any) {
    console.error('[Swift CheckRestartTrigger] Error:', error);
    
    // Handle axios-ntlm specific errors
    if (error.response) {
      return NextResponse.json({
        success: false,
        error: 'Swift API request failed',
        statusCode: error.response.status,
        details: error.response.data
      }, { status: error.response.status });
    }

    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error occurred'
    }, { status: 500 });
  }
}
