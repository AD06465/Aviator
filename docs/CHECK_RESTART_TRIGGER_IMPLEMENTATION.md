# Check Restart Trigger API - Implementation Guide

## Overview

The `IsChangesTriggerRestart` endpoint validates if order package changes would trigger a workflow restart **BEFORE** actually saving them. This prevents unexpected workflow restarts caused by PSP attribute changes.

## Problem Context

When updating order packages in Swift, certain changes can trigger a workflow restart:

- **PSP Properties**: `Hot Cut / Replacement`, `Overlapping Service?`, `Delivery_Region_Code`
- **Product hierarchy changes**: Adding/removing products
- **Attribute changes**: Certain product attributes marked with `RestartWorkflow: true`

Previously, we discoveredan issue where sending `productPackages: []` (empty array) caused Swift to recreate PSPs with default values, triggering unwanted workflow restarts.

## Solution Architecture

### 1. Pre-Validation Endpoint

**API Route:** `/api/swift/check-restart-trigger/[orderId]/route.ts`

**Purpose:** Validates changes BEFORE saving to detect restart triggers.

**Request:**
```typescript
POST /api/swift/check-restart-trigger/{orderId}
{
  "orderDetail": { /* full order detail object */ },
  "productPackages": [ /* array of PSP objects */ ],
  "environment": "Test 1"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "willTriggerRestart": false,
    "isRestartWorkflow": false,
    "restartTriggeringChanges": [],
    "pspChanges": []
  }
}
```

### 2. Client Function

**Location:** `src/lib/swiftApi.ts`

**Function:** `checkRestartTrigger()`

```typescript
const restartCheck = await swiftApiService.checkRestartTrigger(
  orderNumber,
  orderDetail,
  productPackages
);

if (restartCheck.success && restartCheck.data.willTriggerRestart) {
  console.warn('Changes would trigger restart!');
  console.warn('Triggering changes:', restartCheck.data.restartTriggeringChanges);
}
```

### 3. Integration in SwiftMonitor

**Location:** `src/components/SwiftMonitor.tsx`

The validation is automatically called BEFORE `updateOrderPackage()`:

```typescript
// STEP 1: Check if changes would trigger restart
const restartCheck = await swiftApiService.checkRestartTrigger(
  orderNumber,
  result.data.OrderDetail,
  result.data.ProductPackages || []
);

// STEP 2: Update order package (only if safe)
const updateResult = await swiftApiService.updateOrderPackage(...);
```

## Implementation Details

### Backend (API Route)

**File:** `src/app/api/swift/check-restart-trigger/[orderId]/route.ts`

```typescript
// Uses axios-ntlm for NTLM authentication (same as other Swift APIs)
const client = NtlmClient({
  username,
  password,
  domain,
  workstation
});

// POST to Swift's validation endpoint
const response = await client.post(
  `${baseUrl}/OrderPackage/Home/IsChangesTriggerRestart/`,
  {
    orderDetail,
    productPackages
  }
);
```

### Swift API Structure

**Endpoint:** `http://swiftenv1/OrderPackage/Home/IsChangesTriggerRestart/`

**Swift Response:**
```json
{
  "IsRestartWorkflow": false,
  "WorkflowRestartResponse": {
    "IsWorkflowRestarting": false,
    "WorkflowRestartOption": 0,
    "ProductServicePackageIds": null,
    "RestartTriggeringChanges": [
      "PSP 464259129: Hot Cut / Replacement changed from 'No' to 'Yes'",
      "PSP 464259129: Delivery_Region_Code changed from 'NA' to 'EU'"
    ],
    "PspChanges": [ /* detailed PSP change objects */ ]
  }
}
```

### Restart Detection Logic

The endpoint returns `willTriggerRestart: true` if:

1. **`IsRestartWorkflow === true`** (top-level flag)
2. **`WorkflowRestartResponse.IsWorkflowRestarting === true`**
3. **`RestartTriggeringChanges.length > 0`** (specific changes detected)

## Usage Examples

### Example 1: Safe Changes (No Restart)

```typescript
const result = await swiftApiService.checkRestartTrigger(
  "556181595",
  {
    TransactionId: 556181595,
    OrderType: "Install",
    SelectedOES: "AD06465"
  },
  [
    {
      ProductPackageId: 464259129,
      Properties: [
        { PropertyName: "Hot Cut / Replacement", PropertyValue: "No" },
        { PropertyName: "Overlapping Service?", PropertyValue: "No" }
      ]
    }
  ]
);

// Result:
// {
//   success: true,
//   data: {
//     willTriggerRestart: false,
//     restartTriggeringChanges: []
//   }
// }
```

### Example 2: Unsafe Changes (Would Restart)

```typescript
// Empty productPackages array causes Swift to recreate PSPs
const result = await swiftApiService.checkRestartTrigger(
  "556181595",
  orderDetail,
  [] // ❌ EMPTY ARRAY - will recreate PSPs with defaults!
);

// Result:
// {
//   success: true,
//   data: {
//     willTriggerRestart: true,
//     restartTriggeringChanges: [
//       "PSP 464259129 added as new direct OE install",
//       "Hot Cut / Replacement Value set as No",
//       "Overlapping Service? Value set as No"
//     ]
//   }
// }
```

## Testing

### Test Page

Access the test page at: `http://localhost:3000/test-check-restart-trigger.html`

**Features:**
- Pre-filled sample data
- Environment selector
- JSON validation
- Visual restart indicators
- Detailed response display

### Manual Testing Steps

1. **Get Order Data:**
   ```bash
   GET http://swiftenv1/OrderPackage/Home/InitializeOrderPackage/{orderId}
   ```

2. **Extract orderDetail and productPackages from response**

3. **Test Validation:**
   ```bash
   POST http://localhost:3000/api/swift/check-restart-trigger/{orderId}
   {
     "orderDetail": { /* from step 1 */ },
     "productPackages": [ /* from step 1 */ ],
     "environment": "Test 1"
   }
   ```

4. **Verify Response:**
   - `willTriggerRestart: false` = Safe to proceed
   - `willTriggerRestart: true` = Review changes before saving

### Test Scenarios

| Scenario | productPackages | Expected Result |
|----------|----------------|-----------------|
| **Preserve PSPs** | Full PSP array with Properties | ✅ No restart |
| **Empty Array** | `[]` | ⚠️ Restart triggered |
| **Missing Properties** | PSPs without Properties array | ⚠️ Restart triggered |
| **Changed Properties** | Modified Hot Cut value | ⚠️ Restart triggered |

## Best Practices

### 1. Always Validate Before Save

```typescript
// ✅ CORRECT: Check first
const restartCheck = await checkRestartTrigger(...);
if (!restartCheck.data.willTriggerRestart) {
  await updateOrderPackage(...);
}

// ❌ WRONG: Save without checking
await updateOrderPackage(...); // May trigger restart!
```

### 2. Preserve Existing PSPs

```typescript
// ✅ CORRECT: Pass existing PSPs
const updatePayload = {
  ...updateData,
  existingOrderData: orderPackageData // Contains ProductPackages array
};

// ❌ WRONG: Empty PSPs
const updatePayload = {
  ...updateData,
  productPackages: [] // Will recreate PSPs!
};
```

### 3. Handle Validation Errors

```typescript
const restartCheck = await checkRestartTrigger(...);

if (!restartCheck.success) {
  // Non-blocking - log warning and proceed
  console.warn('Could not validate restart trigger:', restartCheck.error);
} else if (restartCheck.data.willTriggerRestart) {
  // Blocking - abort or require confirmation
  throw new Error(`Cannot save - would trigger restart: ${restartCheck.data.restartTriggeringChanges}`);
}
```

### 4. Log Restart Triggers

```typescript
if (restartCheck.data.willTriggerRestart) {
  console.error('Restart triggers detected:');
  restartCheck.data.restartTriggeringChanges.forEach(change => {
    console.error(`  - ${change}`);
  });
}
```

## Troubleshooting

### Issue: Always Returns `willTriggerRestart: true`

**Cause:** Sending empty or incomplete PSP data

**Solution:**
```typescript
// Ensure full PSP structure is passed
const productPackages = orderData.ProductPackages || [];
if (productPackages.length === 0) {
  console.warn('No PSPs found - validation may be inaccurate');
}
```

### Issue: Validation Check Fails with 401

**Cause:** NTLM authentication failure

**Solution:**
```bash
# Verify credentials in .env.local
SWIFT_API_USERNAME=AD06465
SWIFT_API_PASSWORD=your_password
SWIFT_API_DOMAIN=CTL
SWIFT_API_WORKSTATION=IND-5CG9381KX0
```

### Issue: Different Results Between Validation and Actual Save

**Cause:** Timing issue or data mismatch

**Solution:**
```typescript
// Use same data for both validation and save
const orderData = await fetchOrderPackage(orderId);

// Step 1: Validate
const restartCheck = await checkRestartTrigger(
  orderId,
  orderData.OrderDetail,
  orderData.ProductPackages
);

// Step 2: Save (using same data)
if (!restartCheck.data.willTriggerRestart) {
  await updateOrderPackage(orderId, orderData, missingFields);
}
```

## Related Files

- **API Route:** `src/app/api/swift/check-restart-trigger/[orderId]/route.ts`
- **Client Library:** `src/lib/swiftApi.ts` (checkRestartTrigger function)
- **Integration:** `src/components/SwiftMonitor.tsx` (automated validation)
- **Test Page:** `public/test-check-restart-trigger.html`
- **Save Order API:** `src/app/api/swift/save-order-package/[orderId]/route.ts`

## Monitoring

### Log Messages

**Success (No Restart):**
```
[SwiftApi] Checking if changes would trigger workflow restart...
[SwiftApi] ✓ Changes will NOT trigger workflow restart
```

**Warning (Restart Detected):**
```
[SwiftApi] Checking if changes would trigger workflow restart...
[SwiftApi] ⚠️ Changes WOULD trigger workflow restart!
[SwiftApi] Triggering changes: ["PSP 464259129: Hot Cut / Replacement changed"]
```

### Metrics to Track

- **Validation Success Rate**: `restartCheck.success` %
- **Restart Prevention Count**: Times `willTriggerRestart: true` detected
- **False Positives**: Validation said safe but restart occurred
- **False Negatives**: Validation said unsafe but no restart occurred

## Summary

The `IsChangesTriggerRestart` API provides essential pre-save validation to prevent unexpected workflow restarts. By checking changes before saving, you can:

1. **Detect potential issues** before they occur
2. **Preserve PSP attributes** to avoid workflow disruptions  
3. **Log and monitor** restart triggers for debugging
4. **Automate safely** with confidence that changes won't cause restarts

**Key Takeaway:** Always call `checkRestartTrigger()` before `updateOrderPackage()` to ensure workflow stability.
