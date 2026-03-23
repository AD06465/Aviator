# GCA Credit Approval Automation - Implementation Complete ✅

## Overview
Swift Monitor now automatically handles **"Wait For Credit Approval"** tasks by integrating with the GCA (Global Credit Auth) system. When this task becomes Ready, the system automatically approves the credit check in GCA, allowing the Swift task to complete automatically.

## How It Works

### Automated Flow
When Swift Monitor encounters a **"Wait For Credit Approval"** task in Ready status:

1. **Search GCA** 
   - Searches for the order in GCA using the Swift order ID
   - Validates the order exists and extracts the GCA Order ID

2. **Get Order Details**
   - Retrieves detailed order information from GCA
   - Extracts Customer ID and CSRF token required for approval

3. **Approve Credit**
   - Submits credit approval to GCA automatically
   - Sets order credit result to "Approved"
   - Uses proper session management and anti-forgery tokens

4. **Swift Auto-Completion**
   - Swift's internal polling detects the GCA approval
   - Swift automatically completes the task (no manual completion needed)
   - Order workflow continues automatically

### Important Note
**AVIATOR only approves the credit in GCA** - it does NOT manually complete the Swift task. Swift has its own polling mechanism that checks GCA status and automatically completes the "Wait For Credit Approval" task when it detects the approval.

### What Gets Approved
The automation sets the following in GCA:
- **Order Credit Result**: `Approved` (value: 2)
- **Order Credit State**: `Credit Analyst Action Needed` (value: 3)
- **Credit Hold Reason**: `Past Due Balance` (value: 5)
- **Credit Hold Action**: `No Action Needed` (value: 0)
- **Comment**: "Automated approval via AVIATOR"

## Technical Implementation

### New Service: `gcaService.ts`
Location: [src/services/gcaService.ts](../src/services/gcaService.ts)

**Key Methods:**
```typescript
// Search for order in GCA
searchOrder(orderId, environment): GCAOrderSearchResult

// Get order details with CSRF token
getOrderDetails(gcaOrderId, swiftOrderId, environment): GCAOrderDetails

// Approve credit check
approveCredit(customerId, requestId, orderId, token, environment): GCAApprovalResult

// Complete full approval flow
completeCreditApproval(orderId, environment): GCAApprovalResult
```

### API Endpoints
Three new API routes handle GCA integration:

1. **Search Order**
   - Route: `/api/gca/search-order/[orderId]`
   - File: [src/app/api/gca/search-order/[orderId]/route.ts](../src/app/api/gca/search-order/[orderId]/route.ts)
   - Returns: GCA Order ID, credit state, credit result

2. **Order Details**
   - Route: `/api/gca/order-details/[gcaOrderId]`
   - File: [src/app/api/gca/order-details/[gcaOrderId]/route.ts](../src/app/api/gca/order-details/[gcaOrderId]/route.ts)
   - Returns: Customer ID, CSRF token, order information

3. **Approve Credit**
   - Route: `/api/gca/approve-credit`
   - File: [src/app/api/gca/approve-credit/route.ts](../src/app/api/gca/approve-credit/route.ts)
   - Method: POST
   - Handles: Session establishment, cookie management, form submission

### Updated Components

**Swift Monitor** ([src/components/SwiftMonitor.tsx](../src/components/SwiftMonitor.tsx)):
- Added GCA service import
- Special handling for "Wait For Credit Approval" task
- Detailed logging of GCA approval process
- Error handling with fallback to manual completion

**Swift API Service** ([src/lib/swiftApi.ts](../src/lib/swiftApi.ts)):
- Moved "Wait For Credit Approval" from manual to completable tasks
- Now automatically processed like other tasks

## GCA Environment Configuration

The system supports three Swift environments with corresponding GCA URLs:

| Swift Environment | GCA URL |
|-------------------|---------|
| Test 1 | `http://billingenv1.corp.intranet` |
| Test 2 | `http://billingenv2.corp.intranet` |
| Test 4 | `http://billingenv4.corp.intranet` |

Environment is automatically matched to Swift Monitor selection.

## Monitoring & Logging

### Success Logs
When credit approval succeeds:
```
🏦 Processing credit approval in GCA for task: "Wait For Credit Approval"
📋 Step 1: Searching for order 556169321 in GCA...
✅ GCA Credit Approval completed: Credit approved successfully
⏳ Swift will automatically complete the task when it detects the approval
```

After Swift's polling detects the approval:
```
✅ Task completed: Wait For Credit Approval (auto-completed by Swift)
```

### Error Handling
If GCA approval fails:
```
❌ GCA Credit Approval failed: <error message>
⚠️ Task "Wait For Credit Approval" requires manual completion in GCA
```

The task remains in Ready status and requires manual intervention in GCA web interface.

## Security & Authentication

### NTLM Authentication
- Uses Windows integrated authentication (NTLM)
- Credentials from `SWIFT_API_PASSWORD` environment variable
- Same authentication as other Swift API calls

### Anti-Forgery Protection
GCA requires both:
1. **Anti-forgery cookie** (obtained by visiting the order page)
2. **CSRF token** (extracted from the HTML form)

The approve API handles this by:
1. First GET order page → establishes session, gets cookie
2. Extract fresh CSRF token from HTML
3. POST approval with matching cookie + token

### Session Management
Each approval creates a new session:
- GET establishes session and cookie
- Cookie and token must match (same session)
- POST uses both for successful submission

## Testing

### Test Page
A test page is available for manual testing:
- URL: `http://localhost:3000/test-gca-api.html`
- Tests all three API calls in sequence
- Displays extracted data and results
- Button 3: "Test Complete Flow" runs full automation

### Manual Testing Steps
1. Find an order with "Wait For Credit Approval" task
2. Start Swift Monitor for that order
3. Monitor logs for GCA approval process
4. Verify task completes automatically
5. Check GCA web interface to confirm approval

## Error Scenarios

### Order Not Found in GCA
```
❌ GCA Credit Approval failed: GCA Search Failed: Order not found in GCA
```
**Resolution**: Order may not have been submitted to GCA yet, or wrong order ID.

### Missing Customer Data
```
❌ GCA Credit Approval failed: GCA Details Failed: Missing required data
```
**Resolution**: Order exists but missing customer information in GCA.

### Anti-Forgery Token Mismatch
```
❌ GCA Approve API returned error: The anti-forgery cookie token and form field token do not match
```
**Resolution**: Session issue - retry will create fresh session.

### Network Errors
```
❌ Error processing credit approval: Network error
```
**Resolution**: Check GCA server connectivity and VPN connection.

## Future Enhancements

### Potential Improvements
1. **Status Polling**: Poll GCA periodically to check if credit was manually approved
2. **Conditional Approval**: Different approval rules based on order value/customer
3. **Approval Queue**: Batch process multiple credit approvals
4. **Notification**: Email/Slack notification when manual approval needed
5. **Audit Trail**: Log all GCA approvals for compliance

### Configuration Options
Consider adding:
- Toggle to enable/disable GCA automation
- Customizable approval reasons and actions
- Retry logic for transient failures
- Timeout configuration for GCA API calls

## Troubleshooting

### GCA Automation Not Working
1. Check Swift Monitor logs for error messages
2. Verify SWIFT_API_PASSWORD is configured
3. Test GCA connectivity manually
4. Check if order exists in GCA web interface
5. Verify user has permission to approve in GCA

### Task Not Completing After GCA Approval
1. Verify GCA approval was successful (check GCA web interface)
2. Check if Swift task state is still "Ready"
3. Manually refresh Swift Monitor
4. Check Swift API logs for task completion errors

### Session/Cookie Issues
1. Clear browser cache (affects API calls)
2. Restart Next.js dev server
3. Check if GCA session has expired
4. Verify NTLM authentication is working

## Success Criteria ✅

The feature is working correctly when:
- ✅ "Wait For Credit Approval" task appears in Ready status
- ✅ AVIATOR approves credit in GCA automatically
- ✅ GCA logs show successful approval flow
- ✅ Swift's polling detects approval and auto-completes the task
- ✅ Task moves to Completed status
- ✅ Order workflow continues to next task
- ✅ No manual intervention required

**Note:** AVIATOR approves in GCA, then Swift auto-completes the task when it detects the approval.

## Credits
Implementation Date: March 18, 2026
Automated Task: Wait For Credit Approval
Integration: Swift Monitor ↔ GCA System
