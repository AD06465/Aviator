# Swift Monitor Network Fix

## Problem

The Swift Monitor was encountering network errors when trying to access internal Swift API endpoints directly from the browser:

```
Swift API Error: AxiosError - Network Error
```

**Root Cause:**
- The browser cannot directly access internal corporate API endpoints due to:
  1. CORS (Cross-Origin Resource Sharing) restrictions
  2. Internal network hostnames not resolvable from client browser
  3. Corporate firewall/network policies

## Solution

Implemented a **Next.js API proxy layer** to route Swift API calls through the backend server instead of making direct browser requests.

### Architecture Change

**Before (Direct Browser Calls):**
```
Browser -> Swift API (http://swiftservicesenv1:9003) ❌ BLOCKED
```

**After (Proxied Through Backend):**
```
Browser -> Next.js API Route -> Swift API ✅ SUCCESS
```

## Implementation Details

### 1. Updated Swift API Client (`src/lib/swiftApi.ts`)

Changed all API calls to use relative URLs that hit Next.js API routes:

```typescript
// OLD: Direct internal URL
const url = `${this.currentEnvironment.taskApiUrl}/tasks/transaction/${orderId}`;

// NEW: Proxied through API route
const url = `/api/swift/tasks/${orderId}?env=${this.currentEnvironment.name}`;
```

### 2. Created Next.js API Routes

**Three proxy endpoints created:**

#### `/api/swift/tasks/[orderId]/route.ts`
- **Purpose:** Fetch Swift tasks for an order
- **Method:** GET
- **Example:** `/api/swift/tasks/556174677?env=Test 1`
- **Proxies to:** `http://swiftservicesenv1:9003/Swift/v1/WorkCenter/tasks/transaction/556174677`

#### `/api/swift/task/[taskId]/complete/route.ts`
- **Purpose:** Complete a Swift task
- **Method:** PUT
- **Example:** `/api/swift/task/123456/complete?env=Test 1`
- **Proxies to:** `http://swiftservicesenv1:9003/Swift/v1/WorkCenter/task/123456/completeWithAction`

#### `/api/swift/order/[orderId]/productPackage/route.ts`
- **Purpose:** Fetch product package details
- **Method:** GET
- **Example:** `/api/swift/order/556174677/productPackage?env=Test 1`
- **Proxies to:** `http://swiftservicesenv1.corp.global.level3.com:9000/Customer/v3/Ordering/transaction/556174677/productPackage`

### 3. Environment Support

All API routes support environment selection via query parameter:
- `env=Test 1` -> `swiftservicesenv1`
- `env=Test 2` -> `swiftservicesenv2`
- `env=Test 4` -> `swiftservicesenv4`

## Benefits

1. **Security:** API calls go through controlled backend routes
2. **Network Compatibility:** Backend server can access internal APIs
3. **Error Handling:** Centralized error handling and logging
4. **CORS Compliance:** No cross-origin issues
5. **Consistency:** Matches existing FlightDeck/Autopilot architecture pattern

## Testing

After this fix, the Swift Monitor should successfully:
1. ✅ Fetch product package details (order status, transaction ID)
2. ✅ Retrieve Swift tasks with status "Ready"
3. ✅ Auto-complete configured task types
4. ✅ Poll every 30 seconds without network errors
5. ✅ Stop automatically when order status becomes "Ordered"

## Troubleshooting

### If Swift Monitor still shows errors:

1. **Check backend server is running:**
   ```bash
   npm run dev
   ```

2. **Verify API routes in browser DevTools:**
   - Network tab should show calls to `/api/swift/*`
   - Should return 200 OK status

3. **Check backend/server logs:**
   - Look for `[Swift Proxy]` log messages
   - Verify actual Swift API responses

4. **Verify internal server connectivity:**
   - Ensure `swiftservicesenv1` hostname resolves on your machine
   - Test with: `ping swiftservicesenv1`

5. **Environment configuration:**
   - Verify correct environment selected in UI
   - Check Swift API URLs match your network setup

## Related Files

- `src/lib/swiftApi.ts` - Swift API client service
- `src/components/SwiftMonitor.tsx` - Swift Monitor UI component
- `src/app/api/swift/tasks/[orderId]/route.ts` - Tasks proxy
- `src/app/api/swift/task/[taskId]/complete/route.ts` - Complete task proxy
- `src/app/api/swift/order/[orderId]/productPackage/route.ts` - Product package proxy

## Next Steps

The Swift Monitor should now be fully functional. Test by:
1. Navigate to the Swift tab (⚡)
2. Enter order number: `556174677`
3. Click "Start Swift Monitor"
4. Observe task processing logs
5. Verify no network errors in browser console
