# Device Management System - User Guide

## Overview
The AVIATOR Device Management System provides a comprehensive interface for managing network devices, validating their availability, and automatically fetching available ports from the MESH inventory system.

## Features

### 1. **Device Management Table**
- Add multiple devices to a managed list
- Track validation status for each device
- View last validation timestamp
- Remove devices from the list

### 2. **Device Validation**
- Validates devices against the NDS (Network Device Service) API
- Real-time validation status indicators:
  - ✓ Valid - Device is accessible and returning interface data
  - ✗ Invalid - Device validation failed
  - Not Validated - Device hasn't been validated yet
- Displays number of interfaces found on valid devices

### 3. **Automatic Port Discovery**
- Select port speed (1GBPS, 10GBPS, or 100GBPS)
- One-click port fetching from MESH inventory
- Automatically populates the first available port
- Shows detailed port information (Type, Status, Class, Port System ID)

## How to Use

### Adding a Device

1. Navigate to the **Device Management** section
2. Enter the device name (e.g., `LAB4COZWZG002`) in the input field
3. Click **Add Device** button or press Enter
4. The device appears in the table below with "Not Validated" status

**Note:** Duplicate devices are prevented automatically.

### Validating a Device

1. Select a device from the **Preferred Device** dropdown
2. Click the **Validate Device** button
3. Wait for validation to complete (usually 1-2 seconds)
4. Check the validation message:
   - ✅ Success: "Valid Device: [name] (X interfaces found)"
   - ❌ Error: Shows specific error message from NDS

#### Device Validation API

**Endpoint:** `http://rubicon-test01.idc1.level3.com:8080/nds.services/query/intDescriptions?tid={deviceName}`

**Valid Response Example:**
```json
{
   "q": "intDescriptions",
   "data": [
      "Interface                      Status         Protocol Description",
      "Gi0/0/0                        down           down     CO/KXFN/107284/LUMN...",
      "Gi0/0/1                        down           down     CO/KXFN/107550/LUMN..."
   ],
   "tid": "LAB4COZWZG002"
}
```

**Invalid Response Example:**
```json
{
   "error": {
      "type": "Unknown",
      "message": "LAB4COZWZG0 : No Driver for 'null'"
   }
}
```

### Fetching Available Ports

1. Select a validated device from the dropdown
2. Choose the appropriate **Port Speed**:
   - **1GBPS** → 1000 Mbps
   - **10GBPS** → 10000 Mbps
   - **100GBPS** → 100000 Mbps
3. Click **Fetch Available Ports** button
4. The system queries the MESH API and populates the port field
5. View detailed port information in the blue info box

#### Port Fetching API

**Endpoint:** `http://sasi-test1.rke-odc-test.corp.intranet/inventory/v1/mesh/paths`

**Parameters:**
- `product=Ethernet`
- `includeColorless=yes`
- `aend={deviceName}` (e.g., LAB4COZWZG002)
- `portSpeed={speed}` (e.g., 1000, 10000, 100000)
- `highBandwidth=Yes`
- `numpaths=1`
- `interface=Optical`
- `productType=ELINE`

**Port Extraction:**
The system automatically extracts the port name from the first `<aendPort>` element in the XML response:

```xml
<aendPort resourceType="Port">
  <name>GigabitEthernet0/0/21</name>
  <url>http://ontology.com/ind/asri#Port_36556404</url>
  <attributes>
    <attributes>
      <name>Class</name>
      <value>Physical</value>
    </attributes>
    <attributes>
      <name>portSysId</name>
      <value>36556404</value>
    </attributes>
  </attributes>
  <type>Access Interface</type>
  <status>In Service</status>
</aendPort>
```

**Result:** Port name `GigabitEthernet0/0/21` is automatically filled in the "Preferred Port" field.

### Manual Port Entry

You can also manually type or edit the port name in the **Preferred Port (Optional)** field:
- Format examples:
  - `GigabitEthernet0/0/21`
  - `TenGigabitEthernet0/0/26`
  - `HundredGigE0/4/0/3`

## Port Speed Mapping

| User Selection | API Parameter Value | Bandwidth |
|----------------|---------------------|-----------|
| 1GBPS          | portSpeed=1000      | 1 Gigabit/s |
| 10GBPS         | portSpeed=10000     | 10 Gigabit/s |
| 100GBPS        | portSpeed=100000    | 100 Gigabit/s |

## Status Indicators

### Validation Messages
- 🔍 **Validating device...** - Validation in progress
- ✅ **Valid Device: [name] (X interfaces found)** - Successful validation
- ❌ **Invalid Device: [error]** - Validation failed with reason
- ⚠️ **Device already exists in the list** - Duplicate prevention

### Port Fetching Messages
- 🔍 **Fetching ports...** - API call in progress
- ✅ **Found X available port(s)** - Ports successfully retrieved
- ❌ **No available ports found** - No matching ports for criteria
- ❌ **Failed to fetch ports: [error]** - API call failed
- ⚠️ **Please select a device first** - Validation reminder
- ⚠️ **Please select a port speed** - Missing required parameter

## Integration with Task Automation

The selected device and port are automatically used in task processing for:

1. **LOA Designate Tid and Port**
   - TID field: Uses preferred device
   - Port field: Uses preferred port

2. **Verify or Assign Appropriate Device**
   - Device field: Uses preferred device
   - Port field: Uses preferred port

3. **Mesh Fallout Tasks**
   - Automatic device assignment
   - Port recommendation based on order requirements

## Best Practices

### Device Naming
- Use standard device naming conventions (e.g., `LAB4COZWZG002`)
- Validate devices before using them in automation
- Keep device names consistent across orders

### Port Selection
- Always select the correct port speed matching your order requirements
- Validate device availability before fetching ports
- Review the fetched port details before proceeding
- Consider port status (In Service, Planned, etc.)

### Validation Workflow
1. Add devices to the list
2. Validate each device to ensure accessibility
3. Select the validated device
4. Choose appropriate port speed
5. Fetch available ports
6. Review and confirm port selection
7. Proceed with order automation

## Troubleshooting

### Device Validation Fails
- **Check device name spelling** - Ensure exact match
- **Verify network connectivity** - NDS API must be accessible
- **Check device status** - Device might be offline or decommissioned
- **Review error message** - Provides specific failure reason

### Port Fetching Returns No Results
- **Verify device validation** - Must be valid first
- **Check port speed** - Try different speed options
- **Review device capacity** - Device might not support requested speed
- **Check MESH inventory** - Ports might be fully allocated

### XML Parsing Errors
- **Network issues** - Check connectivity to MESH API
- **Invalid response** - API might be returning error page
- **Browser console** - Check for detailed error messages

## API Error Codes

| Error Type | Common Causes | Resolution |
|------------|---------------|------------|
| Network Error | API unreachable | Check VPN/network connectivity |
| Unknown Driver | Invalid device name | Verify device name and try again |
| No Data | Device has no interfaces | Device might be misconfigured |
| Timeout | Slow network/API | Retry after a few moments |
| XML Parse Error | Invalid response | Check API endpoint status |

## Security Notes

- All API calls are made client-side from your browser
- No credentials are stored or transmitted
- Device validation uses read-only NDS query endpoint
- MESH API access requires appropriate network access

## Future Enhancements

Planned features for upcoming releases:
- Device availability caching
- Port reservation integration
- Bulk device validation
- Port utilization metrics
- Historical validation logs
- Device favorite/pinning
- Custom port filters

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**System:** AVIATOR - FlightDeck Task Automation
