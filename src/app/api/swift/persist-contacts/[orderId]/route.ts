import { NextRequest, NextResponse } from 'next/server';
import { NtlmClient } from 'axios-ntlm';
import os from 'os';

const SWIFT_ENVIRONMENTS = {
  'Test 1': 'http://swiftenv1',
  'Test 2': 'http://swiftenv2',
  'Test 4': 'http://swiftenv4',
};

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const body = await request.json();
    const { contactId, glmAddressId } = body;

    // Only contactId is required, glmAddressId is optional (can be empty string or null)
    if (!contactId) {
      return NextResponse.json(
        { error: 'contactId is required' },
        { status: 400 }
      );
    }

    const env = request.nextUrl.searchParams.get('env') || 'Test 1';
    const baseUrl = SWIFT_ENVIRONMENTS[env as keyof typeof SWIFT_ENVIRONMENTS];

    if (!baseUrl) {
      return NextResponse.json(
        { error: 'Invalid environment' },
        { status: 400 }
      );
    }

    // Get Windows authentication credentials
    const username = os.userInfo().username;
    const password = process.env.SWIFT_API_PASSWORD;
    const domain = process.env.USERDOMAIN || 'CTL';

    if (!password) {
      return NextResponse.json(
        { error: 'SWIFT_API_PASSWORD not configured in .env.local' },
        { status: 500 }
      );
    }

    // Build the payload for PersistAssociations API
    // If glmAddressId is empty string, use null for EntityId2 and empty string for glmAddressId
    const entityId2 = glmAddressId || null;
    const glmAddressIdValue = glmAddressId || '';
    
    const payload = {
      contact: {
        ContactId: contactId
      },
      associations: [
        {
          Activity: "",
          Application: "",
          ContactId: contactId,
          EntityKey: {
            EntityId1: orderId,
            EntityId2: entityId2,
            Type: "OrderPackage"
          },
          Role: {
            RoleName: "Order Contact",
            RoleId: "ORDER_CON",
            Required: true,
            RoleSetSuffix: `${orderId}_`
          }
        },
        {
          Activity: "",
          Application: "",
          ContactId: contactId,
          EntityKey: {
            EntityId1: orderId,
            EntityId2: entityId2,
            Type: "OrderPackage"
          },
          Role: {
            RoleName: "Local Contact - Primary",
            RoleId: "LOCAL_BLD",
            Required: false,
            RoleSetSuffix: `${orderId}_`
          }
        },
        {
          Activity: "",
          Application: "",
          ContactId: contactId,
          EntityKey: {
            EntityId1: orderId,
            EntityId2: entityId2,
            Type: "OrderPackage"
          },
          Role: {
            RoleName: "Local Contact - Secondary",
            RoleId: "LOCAL_BLD2",
            Required: false,
            RoleSetSuffix: `${orderId}_`
          }
        }
      ],
      transactionId: orderId,
      glmAddressId: glmAddressIdValue
    };

    console.log(`[Persist Contacts] Associating contact ${contactId} to order ${orderId} with address ${glmAddressId}`);

    const url = `${baseUrl}/OrderPackage/Contacts/PersistAssociations`;
    const startTime = Date.now();

    try {
      console.log(`[Persist Contacts] Creating NTLM client for ${username}@${domain}`);
      
      // Use axios-ntlm for reliable NTLM authentication
      const ntlmClient = NtlmClient({
        username,
        password,
        domain,
        workstation: os.hostname(),
      });

      console.log(`[Persist Contacts] Sending POST to ${url}`);
      
      const response = await ntlmClient.post(url, payload, {
        timeout: 60000, // 60 second timeout
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const elapsed = Math.round((Date.now() - startTime) / 1000);
      console.log(`[Persist Contacts] Successfully associated contact ${contactId} to order ${orderId} in ${elapsed}s`);

      return NextResponse.json({
        success: true,
        data: response.data,
        message: 'Contact associations persisted successfully',
      });
    } catch (error: any) {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      console.error(`[Persist Contacts] API Error after ${elapsed}s:`, error.message);

      if (error.response) {
        console.error(`[Persist Contacts] HTTP ${error.response.status}:`, error.response.data);
        return NextResponse.json(
          { error: `API returned status ${error.response.status}`, body: error.response.data },
          { status: error.response.status }
        );
      }

      return NextResponse.json(
        { error: 'Failed to persist contact associations', details: error.message, code: error.code },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[Persist Contacts] Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
