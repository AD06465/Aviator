# CORS Issue - Troubleshooting Guide

## Problem

When running AVIATOR on `localhost:3000`, device validation and port fetching may fail with **empty responses** even though the URLs work fine when opened directly in your browser.

### Why This Happens

This is a **CORS (Cross-Origin Resource Sharing)** security restriction enforced by modern browsers:

- **Direct Browser Navigation**: ✅ Works - No CORS check
- **JavaScript Fetch from localhost:3000**: ❌ Blocked - CORS policy prevents it

The NDS and MESH services don't send CORS headers allowing `localhost:3000` to access them, so the browser blocks the response content (even though the server responds with HTTP 200).

## Quick Fixes

### Option 1: Browser Extension (Recommended for Testing)

Install a CORS-bypassing browser extension:

**For Chrome/Edge:**
1. Go to Chrome Web Store
2. Search for "CORS Unblock" or "Allow CORS: Access-Control-Allow-Origin"
3. Install the extension
4. Enable it (icon in toolbar)
5. Refresh AVIATOR page
6. Device validation should now work

**Popular Extensions:**
- [CORS Unblock](https://chrome.google.com/webstore/detail/cors-unblock/)
- [Allow CORS: Access-Control-Allow-Origin](https://chrome.google.com/webstore/detail/allow-cors-access-control/)
- [Moesif Origin & CORS Changer](https://chrome.google.com/webstore/detail/moesif-origin-cors-changer/)

**⚠️ Security Note:** Remember to disable these extensions when not testing, as they reduce browser security.

### Option 2: Manual Device/Port Entry

You can skip validation entirely:

1. **Add Device**: Type device name (e.g., `LAB4COZWZG001`) and click "Add Device"
2. **Skip Validation**: Select device from dropdown without clicking "Validate"
3. **Manual Port Entry**: Type port name manually (e.g., `GigabitEthernet0/0/21`)
4. **Proceed**: Start automation - the device/port will be used as-is

### Option 3: Verify in Browser First

Before adding a device, verify it manually:

1. Open in new browser tab:
   ```
   http://rubicon-test01.idc1.level3.com:8080/nds.services/query/intDescriptions?tid=LAB4COZWZG001
   ```

2. If you see JSON response with interface data → Device is valid
   ```json
   {
     "q": "intDescriptions",
     "data": ["Interface  Status  Protocol Description", ...],
     "tid": "LAB4COZWZG001"
   }
   ```

3. Copy the device name and add it to AVIATOR without validation

4. For ports, open MESH URL in browser:
   ```
   http://sasi-test1.rke-odc-test.corp.intranet/inventory/v1/mesh/paths?product=Ethernet&includeColorless=yes&aend=LAB4COZWZG001&portSpeed=1000&highBandwidth=Yes&numpaths=1&interface=Optical&productType=ELINE
   ```

5. Search for `<aendPort>` → `<name>` in XML response
6. Copy port name and paste manually in AVIATOR

## Technical Details

### What's Happening

1. **Your App**: `http://localhost:3000` (Origin A)
2. **NDS API**: `http://rubicon-test01.idc1.level3.com:8080` (Origin B)
3. **Browser Security**: "Origin A cannot read responses from Origin B without CORS headers"

### Fetch Request

```javascript
const response = await fetch('http://rubicon-test01.idc1.level3.com:8080/nds.services/query/...');
// Browser: "Does Origin B allow Origin A to read this response?"
// NDS Server: No CORS headers sent
// Browser: "Blocked! Empty response returned to JavaScript"
```

### Console Errors You Might See

```
Access to fetch at 'http://rubicon-test01...' from origin 'http://localhost:3000' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present 
on the requested resource.
```

OR

```
Failed to fetch
TypeError: Failed to fetch
```

### What AVIATOR Now Does

The updated code now:

1. **Detects empty responses** and identifies them as CORS issues
2. **Shows helpful error messages** with workarounds
3. **Logs detailed info** to browser console for debugging
4. **Allows manual entry** - you can skip validation entirely
5. **Displays CORS warning banner** at the top with quick fixes

## Updated Error Messages

### Device Validation
```
❌ CORS Blocked: NDS service returned empty response. This is likely a CORS issue - 
the server is responding but the browser is blocking the content. Try: 
1) Use browser CORS extension, 2) Access the app from same domain as NDS, 
or 3) Add device manually and proceed.
```

OR

```
❌ CORS Error: Cannot access NDS service from browser. The service at rubicon-test01 
doesn't allow cross-origin requests. Workarounds: 
1) Install "CORS Unblock" browser extension, 2) Use device name without validation, 
or 3) Open in new tab: http://rubicon-test01...
```

### Port Fetching
```
❌ CORS Blocked: MESH API returned empty response. Try: 
1) Use CORS browser extension, 2) Access from same domain, or 3) Enter port manually.
```

## Checking Browser Console

Open Developer Tools (F12) and check Console for:

```javascript
🔍 Validating device via NDS: http://rubicon-test01...
📡 NDS Response status: 200
📡 NDS Response headers: Headers { ... }
📦 NDS Response text length: 0  ← CORS blocked if 0!
```

If you see `length: 0` with `status: 200`, that confirms CORS blocking.

## Long-term Solutions (For Production)

For a production deployment, consider:

1. **Backend Proxy**: Create a Node.js/Express backend that proxies NDS/MESH requests
   - Frontend calls `localhost:3000/api/validate-device`
   - Backend calls NDS service (no CORS restriction server-to-server)
   - Backend returns response to frontend

2. **Same-Origin Deployment**: Deploy AVIATOR on same domain as NDS/MESH services
   - Example: `http://rubicon-test01.idc1.level3.com/aviator/`
   - No cross-origin requests = No CORS issues

3. **Configure CORS on NDS/MESH**: Ask infrastructure team to add CORS headers
   ```http
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: GET, OPTIONS
   ```

## Testing Checklist

After applying a fix, verify:

- [ ] Add device: `LAB4COZWZG001`
- [ ] Click "Validate Device"
- [ ] See success message: `✅ Valid Device: LAB4COZWZG001 (X interfaces found)`
- [ ] Select port speed: `1GBPS`
- [ ] Click "Fetch Available Ports"
- [ ] See port auto-fill: `GigabitEthernet0/0/21` (or similar)
- [ ] Check console - no CORS errors

## Summary

**The Issue:** Browser CORS policy blocks responses from NDS/MESH when called from localhost  
**Quick Fix:** Install CORS browser extension  
**Alternative:** Add devices manually without validation  
**Long-term:** Backend proxy or same-domain deployment

---

**Note:** The AVIATOR application now includes a yellow warning banner at the top of the Device Manager section explaining this issue and providing workarounds.
