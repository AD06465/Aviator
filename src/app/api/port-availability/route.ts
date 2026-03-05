import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const deviceName = searchParams.get('deviceName');
    const environment = searchParams.get('environment') || 'Test 1';
    const bandwidth = searchParams.get('bandwidth') || '1000';
    const portSpeed = searchParams.get('portSpeed') || '1000';
    const interfaceType = searchParams.get('interfaceType') || '';
    const user = searchParams.get('user') || 'sasi';

    if (!deviceName) {
      return NextResponse.json(
        { error: 'Device name is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Fetching port availability for device: ${deviceName} in ${environment}`);

    // Build environment-specific MESH API URL
    const meshApiBaseUrls: Record<string, string> = {
      'Test 1': 'https://usddclpnmesh02-test.corp.intranet:30003',
      'Test 2': 'https://usddclpnmesh03-test.corp.intranet:30003',
      'Test 4': 'https://usddclpnmesh01-test.corp.intranet:12081',
    };

    const baseUrl = meshApiBaseUrls[environment] || meshApiBaseUrls['Test 1'];
    const apiUrl = `${baseUrl}/query/run/cauchy/api/get-device-port-availability/devicePortAvailabilityApi`;

    // Build query parameters
    const params = new URLSearchParams({
      var__bandwidth: bandwidth,
      var__deviceName: deviceName,
      var__interfaceType: interfaceType,
      var__portSpeed: portSpeed,
      var__user: user,
    });

    const fullUrl = `${apiUrl}?${params.toString()}`;
    console.log(`📡 Calling MESH API: ${fullUrl}`);

    // Use native https module for better SSL control
    const result = await new Promise<string>((resolve, reject) => {
      const url = new URL(fullUrl);
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        rejectUnauthorized: false, // Ignore self-signed certificates
        timeout: 90000, // 90 second connection timeout
      };

      console.log(`🔗 Connecting to ${options.hostname}:${options.port}...`);

      const req = https.request(options, (res) => {
        console.log(`📡 Connected! Status: ${res.statusCode}`);
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
          console.log(`📥 Received ${chunk.length} bytes (total: ${data.length})`);
        });
        
        res.on('end', () => {
          console.log(`✅ Response complete: ${data.length} bytes`);
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 200)}`));
          }
        });
      });

      req.on('error', (error) => {
        console.error('❌ HTTPS request error:', error);
        reject(error);
      });

      req.on('timeout', () => {
        console.error('⏱️ Request timeout - no response after 90 seconds');
        req.destroy();
        reject(new Error('Request timeout after 90 seconds'));
      });

      req.end();
    });

    console.log(`📊 MESH API response received`);
    console.log(`📝 Response text length: ${result.length}`);
    
    if (!result || result.trim().length === 0) {
      console.warn(`⚠️ Empty response from MESH API`);
      return NextResponse.json(
        { error: 'Empty response from MESH API', ports: [] },
        { status: 200 }
      );
    }

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(result);
      console.log(`✅ Successfully fetched port availability for ${deviceName}`);
      console.log(`📦 Response data structure:`, JSON.stringify(data).substring(0, 500));
    } catch (parseError) {
      console.error(`❌ Failed to parse JSON response:`, parseError);
      console.error(`❌ Response text:`, result.substring(0, 500));
      return NextResponse.json(
        { error: 'Invalid JSON response from MESH API', rawResponse: result.substring(0, 500) },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error in port availability API:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch port availability', 
        details: error instanceof Error ? error.message : String(error),
        hint: 'Check if the MESH API URL is accessible from the server'
      },
      { status: 500 }
    );
  }
}
