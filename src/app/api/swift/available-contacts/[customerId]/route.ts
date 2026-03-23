import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { NtlmClient } from 'axios-ntlm';
import os from 'os';

interface AvailableContactsParams {
  params: {
    customerId: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: AvailableContactsParams
) {
  try {
    const { customerId } = params;
    
    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get environment from query parameter (test1, test2, test4)
    const { searchParams } = new URL(request.url);
    const environment = searchParams.get('environment') || 'test1';
    
    // Map environment to Swift server
    const envMap: Record<string, string> = {
      'test1': 'swiftenv1',
      'Test 1': 'swiftenv1',
      'test2': 'swiftenv2',
      'Test 2': 'swiftenv2',
      'test4': 'swiftenv4',
      'Test 4': 'swiftenv4',
    };

    const baseHost = envMap[environment] || 'swiftenv1';
    const url = `http://${baseHost}/OrderPackage/Contacts/LoadAvailableContacts?customerId=${customerId}`;

    // Get Windows credentials
    const password = process.env.SWIFT_API_PASSWORD;
    if (!password) {
      throw new Error('SWIFT_API_PASSWORD not configured');
    }

    const userInfo = os.userInfo();
    const username = userInfo.username;
    const domain = process.env.USERDOMAIN || 'CTL';
    const workstation = os.hostname();

    console.log(`[Available Contacts API] Fetching for customer ${customerId} from ${baseHost}`);
    console.log(`[Available Contacts API] URL: ${url}`);
    console.log(`[Available Contacts API] Auth: ${username}@${domain} on ${workstation}`);

    // Make NTLM authenticated request using axios-ntlm
    const startTime = Date.now();
    console.log('[Available Contacts API] 🔐 Starting NTLM authentication with axios-ntlm...');
    
    const ntlmClient = NtlmClient({
      username,
      password,
      domain,
      workstation,
    });

    try {
      const response = await ntlmClient.get(url, {
        timeout: 120000, // 120 second timeout
      });
      
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      console.log(`[Available Contacts API] ✓ NTLM auth successful after ${elapsed}s - HTTP ${response.status}`);

      if (response.status !== 200) {
        console.error(`[Available Contacts API] ❌ HTTP ${response.status}`, response.data);
        return NextResponse.json(
          { error: `HTTP ${response.status}`, body: response.data },
          { status: response.status }
        );
      }

      const data = response.data;
      const totalContacts = Array.isArray(data) ? data.length : 0;
      console.log(`[Available Contacts API] ✓ Received ${totalContacts} contacts for customer ${customerId} in ${elapsed}s`);
      
      // Find first valid contact (must have name, email AND phone)
      let firstValidContact = null;
      let firstContactId = null;
      let processedCount = 0;
      
      if (Array.isArray(data)) {
        for (const contact of data) {
          processedCount++;
          
          // Check if contact has name
          if (!contact.NameFirstLast || contact.NameFirstLast.trim() === '') {
            continue;
          }
          
          // Check if contact has valid contact methods
          if (contact.ContactMethods && Array.isArray(contact.ContactMethods) && contact.ContactMethods.length > 0) {
            // Must have BOTH email AND phone
            const hasEmail = contact.ContactMethods.some((method: any) => 
              method.MethodType === 'EMAIL' && method.Value && method.Value.trim() !== ''
            );
            
            const hasPhone = contact.ContactMethods.some((method: any) => 
              method.MethodType === 'E164_PHONE' && method.Value && method.Value.trim() !== ''
            );
            
            // Contact is valid only if it has name, email, AND phone
            if (hasEmail && hasPhone && contact.ContactId) {
              firstValidContact = contact;
              firstContactId = contact.ContactId;
              
              // Extract email and phone for logging
              const email = contact.ContactMethods.find((m: any) => m.MethodType === 'EMAIL')?.Value;
              const phone = contact.ContactMethods.find((m: any) => m.MethodType === 'E164_PHONE')?.Value;
              
              console.log(`[Available Contacts API] ✓ Found valid contact: ${contact.NameFirstLast} (ID: ${firstContactId})`);
              console.log(`[Available Contacts API]    Email: ${email}, Phone: ${phone}, Checked: ${processedCount} contacts`);
              break;
            }
          }
        }
      }
      
      // Return optimized response with first valid contact + metadata
      const result = {
        firstContactId,
        firstValidContact,
        totalCount: totalContacts,
        processedCount,
        // Optionally include a limited set of contacts for UI selection (first 50 valid ones)
        contacts: data.slice(0, 50), // Reduce payload - send only first 50 for dropdown
      };
      
      if (!firstContactId) {
        console.warn(`[Available Contacts API] ⚠️ No valid contact found among ${totalContacts} contacts`);
      }
      
      return NextResponse.json(result);
    } catch (error: any) {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      console.error(`[Available Contacts API] ❌ Error after ${elapsed}s:`, error.message);
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return NextResponse.json(
          { error: 'Request timeout - Swift server not responding', timeout: 120000, elapsed: elapsed * 1000 },
          { status: 504 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'NTLM authentication failed', 
          details: error.message,
          code: error.code,
          elapsed: elapsed * 1000,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[Available Contacts API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
