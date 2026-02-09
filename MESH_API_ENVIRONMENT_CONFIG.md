# 🌐 AVIATOR Environment-Specific API Configuration

## Overview

AVIATOR now dynamically switches both FlightDeck API and MESH API URLs based on the selected environment.

---

## 🔗 API URLs by Environment

### **Test 1 Environment**

**FlightDeck API:**
```
https://workmate-svc-test1.rke-odc-test.corp.intranet
```

**FlightDeck UI:**
```
https://flightdeck-ui-test1.rke-odc-test.corp.intrane/#/auth/login
```

**MESH API Base URL:**
```
http://sasi-test1.rke-odc-test.corp.intranet
```

**MESH API Full Endpoint Example:**
```
http://sasi-test1.rke-odc-test.corp.intranet/inventory/v1/mesh/paths?product=Ethernet&includeColorless=yes&aend={DEVICE}&portSpeed={SPEED}&highBandwidth=Yes&numpaths=1&interface=Optical&productType=ELINE
```

---

### **Test 2 Environment**

**FlightDeck API:**
```
https://workmate-svc-test4.rke-odc-test.corp.intranet
```

**FlightDeck UI:**
```
https://flightdeck-ui-test4.rke-odc-test.corp.intranet/#/auth/login
```

**MESH API Base URL:**
```
http://sasi-test4.rke-odc-test.corp.intranet
```

**MESH API Full Endpoint Example:**
```
http://sasi-test4.rke-odc-test.corp.intranet/inventory/v1/mesh/paths?product=Ethernet&includeColorless=yes&aend={DEVICE}&portSpeed={SPEED}&highBandwidth=Yes&numpaths=1&interface=Optical&productType=ELINE
```

---

### **Test 4 Environment**

**FlightDeck API:**
```
https://workmate-svc-test2.rke-odc-test.corp.intranet
```

**FlightDeck UI:**
```
https://flightdeck-ui-test2.rke-odc-test.corp.intranet/#/auth/login
```

**MESH API Base URL:**
```
http://sasi-test2.rke-odc-test.corp.intranet
```

**MESH API Full Endpoint Example:**
```
http://sasi-test2.rke-odc-test.corp.intranet/inventory/v1/mesh/paths?product=Ethernet&includeColorless=yes&aend={DEVICE}&portSpeed={SPEED}&highBandwidth=Yes&numpaths=1&interface=Optical&productType=ELINE
```

---

## 📝 Environment Mapping Summary

| Environment | FlightDeck API Server | MESH API Server |
|-------------|----------------------|-----------------|
| **Test 1**  | workmate-svc-**test1** | sasi-**test1** |
| **Test 2**  | workmate-svc-**test4** | sasi-**test4** |
| **Test 4**  | workmate-svc-**test2** | sasi-**test2** |

---

## 🔄 How It Works

### 1. **Environment Selection**
When you select an environment in the Order Form, AVIATOR:
- Updates FlightDeck API base URL
- Updates MESH API base URL
- All subsequent API calls use the correct environment

### 2. **API Calls**
Both APIs automatically switch based on environment:

**Example for Test 1:**
```javascript
FlightDeck API → https://workmate-svc-test1.rke-odc-test.corp.intranet/...
MESH API      → http://sasi-test1.rke-odc-test.corp.intranet/...
```

**Example for Test 2:**
```javascript
FlightDeck API → https://workmate-svc-test4.rke-odc-test.corp.intranet/...
MESH API      → http://sasi-test4.rke-odc-test.corp.intranet/...
```

**Example for Test 4:**
```javascript
FlightDeck API → https://workmate-svc-test2.rke-odc-test.corp.intranet/...
MESH API      → http://sasi-test2.rke-odc-test.corp.intranet/...
```

---

## 🛠️ Technical Implementation

### Updated Files:
1. **`src/types/index.ts`** - Added `meshApiUrl` to Environment interface
2. **`src/lib/api.ts`** - Updated FlightDeckApiService with MESH URLs
3. **`src/components/DeviceManager.tsx`** - Dynamic MESH API URL based on environment

### Code Changes:

**Environment Interface:**
```typescript
export interface Environment {
  name: string;
  apiUrl: string;           // FlightDeck API
  flightdeckUrl: string;    // FlightDeck UI
  meshApiUrl: string;       // MESH API (NEW)
}
```

**API Service Configuration:**
```typescript
getEnvironments(): Environment[] {
  return [
    {
      name: 'Test 1',
      apiUrl: 'https://workmate-svc-test1.rke-odc-test.corp.intranet',
      flightdeckUrl: 'https://flightdeck-ui-test1.rke-odc-test.corp.intrane/#/auth/login',
      meshApiUrl: 'http://sasi-test1.rke-odc-test.corp.intranet',
    },
    // ... other environments
  ];
}
```

**Dynamic MESH API Usage:**
```typescript
const meshUrl = `${this.currentEnvironment.meshApiUrl}/inventory/v1/mesh/paths?...`;
```

---

## ✅ Verification

### How to Test:

1. **Select Test 1 Environment**
   - Open browser console
   - Click "Fetch Ports" in Device Manager
   - Should see: `http://sasi-test1.rke-odc-test.corp.intranet/inventory/v1/mesh/paths...`

2. **Select Test 2 Environment**
   - Switch environment in Order Form
   - Click "Fetch Ports" in Device Manager
   - Should see: `http://sasi-test4.rke-odc-test.corp.intranet/inventory/v1/mesh/paths...`

3. **Select Test 4 Environment**
   - Switch environment in Order Form
   - Click "Fetch Ports" in Device Manager
   - Should see: `http://sasi-test2.rke-odc-test.corp.intranet/inventory/v1/mesh/paths...`

### Console Logs:
When fetching ports, you'll see:
```
🌍 Current environment: Test 2
🔗 MESH Base URL: http://sasi-test4.rke-odc-test.corp.intranet
🔍 Fetching ports from: http://sasi-test4.rke-odc-test.corp.intranet/inventory/v1/mesh/paths?...
```

---

## 🎯 Benefits

✅ **Environment Isolation**: Each test environment uses its own MESH API server
✅ **Automatic Switching**: No manual URL changes needed
✅ **Consistent Pattern**: Matches FlightDeck API environment handling
✅ **Easy Debugging**: Console logs show which environment is active
✅ **Scalable**: Easy to add more environments in the future

---

## 📋 Quick Reference

### MESH API Endpoint Pattern:
```
{BASE_URL}/inventory/v1/mesh/paths?
  product=Ethernet&
  includeColorless=yes&
  aend={DEVICE_NAME}&
  portSpeed={PORT_SPEED}&
  highBandwidth=Yes&
  numpaths=1&
  interface=Optical&
  productType=ELINE
```

### Parameters:
- **product**: Always "Ethernet"
- **includeColorless**: Always "yes"
- **aend**: Device name (e.g., "LAB4COZWZG001")
- **portSpeed**: Port speed in Mbps (1000, 10000, 100000)
- **highBandwidth**: Always "Yes"
- **numpaths**: Always "1"
- **interface**: Always "Optical"
- **productType**: Always "ELINE"

---

## 🔍 Troubleshooting

### Issue: Wrong MESH API URL used

**Check:**
1. Verify environment is correctly selected in Order Form
2. Check console logs for "Current environment" message
3. Confirm MESH Base URL matches expected environment

**Solution:**
- Re-select the environment in the Order Form
- The API URLs will automatically update

### Issue: MESH API returns 404

**Possible Causes:**
- Environment-specific MESH server might be down
- Different path structure in that environment

**Solution:**
- Verify the MESH server is accessible for that environment
- Check if the path `/inventory/v1/mesh/paths` is correct for that environment

---

## 🎉 Summary

AVIATOR now fully supports environment-specific MESH API URLs! The system automatically routes MESH API calls to the correct server based on your selected environment, ensuring proper isolation and testing across Test 1, Test 2, and Test 4 environments.
