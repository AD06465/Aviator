# Multi-Device/Port Manager Guide

## Overview

The Multi-Device/Port Manager allows you to configure multiple device/port pairs for handling duplicate tasks that require different devices and ports. This is especially useful for tasks like "LOA Designate Tid and Port" that may appear multiple times in the same order with different location requirements.

## Problem It Solves

### Before:
- **Single device/port**: `{{preferredDevice}}` and `{{preferredPort}}` could only hold ONE value
- **Duplicate tasks**: If you had 2 "LOA Designate Tid and Port" tasks, both would get the SAME device and port
- **Manual intervention**: You had to process each task manually with different values

### After:
- **Multiple pairs**: Configure 2, 3, or more device/port combinations
- **Sequential assignment**: 1st task instance gets 1st pair, 2nd gets 2nd pair, automatically
- **Parallel MESH calls**: Fetch ports for ALL selected devices at once
- **Numbered placeholders**: Use `{{preferredDevice1}}`, `{{preferredDevice2}}`, etc.

## How to Use

### Step 1: Select Multiple Devices

1. Navigate to the **Order Form**
2. Scroll to the **Multi-Device/Port Manager** section (purple/indigo gradient box)
3. Click to expand the manager
4. **Select devices** by clicking checkboxes:
   - ☑ LAB4COZWZG001
   - ☑ LAB4COZWZG002
   - ☑ LAB4COZW4M001

### Step 2: Fetch Ports (Parallel MESH Calls)

1. Click **"Fetch Ports for X Selected Device(s)"** button
2. System makes **parallel MESH API calls** for all selected devices
3. Wait for the fetch to complete (shows progress)
4. Status message displays success: `✅ Fetched ports for 3/3 device(s)`

### Step 3: Review Device/Port Pairs Table

The configured pairs table shows:

| # | Device           | Port                    | Use As                                           |
|---|------------------|-------------------------|--------------------------------------------------|
| 1 | LAB4COZWZG001    | GigabitEthernet0/0/23   | `{{preferredDevice1}}` & `{{preferredPort1}}`    |
| 2 | LAB4COZWZG002    | GigabitEthernet0/0/24   | `{{preferredDevice2}}` & `{{preferredPort2}}`    |
| 3 | LAB4COZW4M001    | GigabitEthernet0/0/25   | `{{preferredDevice3}}` & `{{preferredPort3}}`    |

### Step 4: Use Numbered Placeholders in Field Mappings

Go to **Task Config Table** and configure your field mappings:

#### Example: LOA Designate Tid and Port

```json
{
  "TID*": "{{preferredDevice1}}",
  "Port (eg: GigabitEthernet0/0/23)": "{{preferredPort1}}"
}
```

**Important:** If you have multiple instances of the same task, the system will automatically cycle through the pairs:
- **1st instance** → Uses `{{preferredDevice1}}` & `{{preferredPort1}}`
- **2nd instance** → Uses `{{preferredDevice2}}` & `{{preferredPort2}}`
- **3rd instance** → Uses `{{preferredDevice3}}` & `{{preferredPort3}}`

## Variable Naming Convention

### Numbered Placeholders:
- `{{preferredDevice1}}` → First device in the list
- `{{preferredDevice2}}` → Second device in the list
- `{{preferredDevice3}}` → Third device in the list
- `{{preferredPort1}}` → First port in the list
- `{{preferredPort2}}` → Second port in the list
- `{{preferredPort3}}` → Third port in the list

### Legacy Placeholders (Still Supported):
- `{{preferredDevice}}` → Uses the single device from DeviceManager
- `{{preferredPort}}` → Uses the single port from DeviceManager

## Task Processing Logic

When automation runs:

1. **1st "LOA Designate Tid and Port" task** appears:
   - System resolves `{{preferredDevice1}}` → `LAB4COZWZG001`
   - System resolves `{{preferredPort1}}` → `GigabitEthernet0/0/23`
   - Task is filled and completed

2. **2nd "LOA Designate Tid and Port" task** appears:
   - System resolves `{{preferredDevice2}}` → `LAB4COZWZG002`
   - System resolves `{{preferredPort2}}` → `GigabitEthernet0/0/24`
   - Task is filled and completed

3. **3rd "LOA Designate Tid and Port" task** appears:
   - System resolves `{{preferredDevice3}}` → `LAB4COZW4M001`
   - System resolves `{{preferredPort3}}` → `GigabitEthernet0/0/25`
   - Task is filled and completed

## Advanced Features

### Parallel MESH API Calls

The system makes simultaneous API calls to MESH for all selected devices:
- ✅ **Faster**: 3 devices in the time of 1
- ✅ **Real-time data**: Fresh port information from MESH
- ✅ **Error handling**: Individual device failures don't block others

### Port Information Captured

For each device/port pair, the system stores:
- **Device name**: e.g., `LAB4COZWZG001`
- **Port name**: e.g., `GigabitEthernet0/0/23`
- **Port SysId**: Internal MESH identifier
- **Port Class**: e.g., `Physical Port` or `Empty Slot`
- **Port Speed**: e.g., `10000 Mbps`

### New NID Detection

If MESH returns `New_NID` status:
- Port shows as **"New NID Required"**
- Clear indication that device installation is needed
- You can still configure the pair for future use

## Usage Examples

### Example 1: Two LOA Tasks (Different Locations)

**Scenario:** Order has 2 locations, needs 2 different devices

**Configuration:**
1. Select: `LAB4COZWZG001` and `LAB4COZWZG002`
2. Fetch ports → Gets ports for both
3. Field mapping uses:
   ```json
   {
     "TID*": "{{preferredDevice1}}",
     "Port": "{{preferredPort1}}"
   }
   ```

**Result:**
- 1st LOA task → `LAB4COZWZG001` with its port
- 2nd LOA task → `LAB4COZWZG002` with its port

### Example 2: Three Verify Device Tasks

**Scenario:** Order has 3 device verification tasks

**Configuration:**
1. Select 3 devices
2. Fetch ports
3. Field mapping:
   ```json
   {
     "Device: *": "{{preferredDevice1}}",
     "Port: *": "{{preferredPort1}}"
   }
   ```

**Result:**
- 1st task → Device 1 + Port 1
- 2nd task → Device 2 + Port 2
- 3rd task → Device 3 + Port 3

### Example 3: Mixed with Conditional Rules

You can use numbered placeholders in **Conditional Rules** too:

**Conditional Rule for Workflow "Colorless":**
```json
{
  "id": "rule-colorless-location1",
  "conditionType": "workflow",
  "conditionValue": "Colorless",
  "fields": [
    {
      "fieldName": "Device:",
      "fieldValue": "{{preferredDevice1}}",
      "fieldType": "text"
    },
    {
      "fieldName": "Port:",
      "fieldValue": "{{preferredPort1}}",
      "fieldType": "text"
    }
  ]
}
```

## Troubleshooting

### No Ports Fetched
- **Check MESH API URL**: Ensure your environment is configured correctly
- **Check device names**: Devices must exist in MESH
- **CORS issues**: Check browser console for errors
- **Port speed**: Verify port speed is detected or manually selected

### Wrong Port for Task
- **Check order**: Pairs are assigned sequentially (1st, 2nd, 3rd)
- **Verify numbering**: Ensure you're using the correct number (1, 2, 3)
- **Instance counting**: Tasks are processed one at a time, so 1st instance = 1st pair

### Empty Slot Warning
- If port shows "Empty Slot", it's a placeholder, not a physical port
- Enter the actual physical port manually
- Or select a different device

## Best Practices

1. **Fetch Before Automation**: Always fetch ports BEFORE clicking "Start Automation"
2. **Verify Pairs**: Check the table to ensure all ports are correct
3. **Use Sequential Numbers**: Start with 1, then 2, then 3 (don't skip)
4. **Document Configuration**: Export your config after setting up device/port pairs
5. **Test First**: Try with Test environment before production

## Related Features

- **DeviceManager**: For single device/port (legacy mode)
- **Task Config Table**: Where field mappings are configured
- **Conditional Rules**: Can use numbered placeholders
- **Task Sequencing**: Control order of duplicate task processing

## API Integration

### MESH API Format

The system calls:
```
http://sasi-test1.rke-odc-test.corp.intranet/inventory/v1/mesh/paths
  ?product=Ethernet
  &includeColorless=yes
  &aend=LAB4COZWZG001
  &portSpeed=10000
  &highBandwidth=Yes
  &numpaths=1
  &interface=Optical
  &productType=ELINE
```

### Response Processing

Extracts:
- `aendPort.name` → Port name
- `attributes.portSysId` → Port system ID
- `attributes.Class` → Port class
- `pathElement.type` → Detects "New_NID"

## FAQ

**Q: Can I mix numbered and regular placeholders?**  
A: Yes! Use `{{preferredDevice}}` for single device, and `{{preferredDevice1}}` for multi-device scenarios.

**Q: What happens if I have 5 tasks but only 3 pairs configured?**  
A: The first 3 tasks get the configured pairs. The 4th and 5th tasks will get empty values (automation may fail for those).

**Q: Can I manually edit the port after fetching?**  
A: Not directly in the manager. You can remove the pair and configure it in the regular field mapping instead.

**Q: Do the pairs persist after page refresh?**  
A: Currently no - you need to reconfigure after refresh. (Feature can be added to auto-backup)

**Q: Can I export/import the pairs?**  
A: Yes! Use the Backup Manager to export your entire configuration including device/port pairs.

## Summary

The Multi-Device/Port Manager provides:
- ✅ Multi-device selection
- ✅ Parallel MESH API calls
- ✅ Sequential assignment to duplicate tasks
- ✅ Numbered placeholder variables
- ✅ Real-time port fetching
- ✅ Visual feedback and status

This eliminates the need for manual intervention when handling duplicate tasks with different device/port requirements! 🚀
