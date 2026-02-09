# 📋 Field Mapping Configuration Guide

## 🎯 **Field Name vs Label Explanation**

When configuring task field mappings in AVIATOR, it's crucial to understand the difference between field **"name"** and field **"label"**:

### **📝 Field Structure Example**
```json
{
  "name": "autoselectECNPort",           // ← Use THIS for mapping
  "type": "select",
  "jsonDescriptorObject": {
    "label": "Auto Select ECN Port",     // ← Display name only
    "editable": true,
    "required": false,
    "optionsList": ["Yes", "No"]
  }
}
```

## ✅ **CORRECT: Use Field "name" for Mapping**

**For Task Configuration, ALWAYS use the `name` field:**

| Field Name (Use This) | Field Label (Display Only) |
|----------------------|---------------------------|
| `autoselectECNPort` | "Auto Select ECN Port" |
| `ecnDevice` | "ECN Device" |
| `ecnPortOther` | "ECNPort Other" |
| `deviceMountType` | "Device Mount Type" |
| `rackSize` | "Rack Size" |
| `deviceCLLIARM` | "Device CLLI ARM" |

## 🔧 **How to Configure Field Mappings**

### **1. In AVIATOR UI:**
```
Task Configuration > Field Mappings

Task: [Network Build Form ▼]
Field Name: autoselectECNPort          ← Field "name"
Field Value: No                        ← Your desired value
```

### **2. Resulting Configuration:**
```json
{
  "taskFieldMappings": {
    "Network Build Form": {
      "autoselectECNPort": "No",         ← Field "name" as key
      "deviceMountType": "Front Mount",
      "rackSize": "42U"
    }
  }
}
```

## 📊 **Finding Available Field Names**

### **Method 1: Console Logs (Recommended)**
When AVIATOR processes a task, it logs available field names:

```
🔧 Available field names for task configuration mapping (Network Build Form):
┌─────────┬──────────────────────┬─────────────────────────┬─────────┬──────────┬──────────┐
│ (index) │        name          │         label           │  type   │ editable │ required │
├─────────┼──────────────────────┼─────────────────────────┼─────────┼──────────┼──────────┤
│    0    │ "autoselectECNPort"  │ "Auto Select ECN Port"  │ "select"│   true   │  false   │
│    1    │ "ecnDevice"          │ "ECN Device"            │ "textBox"│  false   │  false   │
│    2    │ "ecnPortOther"       │ "ECNPort Other"         │ "textBox"│  false   │  false   │
│    3    │ "deviceMountType"    │ "Device Mount Type"     │ "select"│   true   │  false   │
└─────────┴──────────────────────┴─────────────────────────┴─────────┴──────────┴──────────┘
💡 Use field "name" values (not "label") when configuring task field mappings in AVIATOR settings.
```

### **Method 2: Task Parameter Analysis**
When a task popup appears, check console for field analysis:

```
📋 All editable fields to display: 
- Auto Select ECN Port (dropdown, required: false)  → USE: autoselectECNPort
- ECN Device (text, required: false)                → USE: ecnDevice  
- Device Mount Type (dropdown, required: false)     → USE: deviceMountType
```

### **Method 3: API Response Inspection**
Check the `taskInstParamRequestList` in task details for complete field information.

## ⚠️ **Common Mistakes to Avoid**

### **❌ WRONG: Using Label**
```json
{
  "taskFieldMappings": {
    "Network Build Form": {
      "Auto Select ECN Port": "No",      // ❌ This won't work!
      "ECN Device": "Router-X1"          // ❌ This won't work!
    }
  }
}
```

### **✅ CORRECT: Using Name**
```json
{
  "taskFieldMappings": {
    "Network Build Form": {
      "autoselectECNPort": "No",         // ✅ Correct field name
      "ecnDevice": "Router-X1"           // ✅ Correct field name
    }
  }
}
```

## 🎨 **UI Enhancements Made**

### **Enhanced Task Configuration Interface:**
1. **Clear Placeholder**: "Field name (e.g., autoselectECNPort)"
2. **Helpful Guidance**: Blue info box explaining name vs label
3. **Visual Field Display**: Monospace font for field names in mappings
4. **Console Logging**: Automatic field name reference table

### **Visual Example:**
```
Field Name: [autoselectECNPort                    ]
            
💡 Use the field "name" not "label"
• Name: autoselectECNPort (for mapping)
• Label: "Auto Select ECN Port" (for display only)  
📋 Check console logs or task parameters to find the correct field name
```

## 🔍 **Why This Matters**

### **Technical Reason:**
The `getTaskFieldValue()` function looks up mappings using the field `name`:

```typescript
export const getTaskFieldValue = (
  taskName: string,
  fieldName: string,           // ← Must match field "name"
  config: TaskManagementConfig,
  orderForm: any
): string => {
  const mapping = config.taskFieldMappings[taskName];
  if (mapping[fieldName]) {    // ← Direct field name lookup
    return mapping[fieldName];
  }
  return '';
}
```

### **User Experience:**
- **Field Name**: Unique identifier used by the system for processing
- **Field Label**: Human-readable display text shown in the UI
- **Mapping Key**: Must use the field name for proper functionality

## 📋 **Quick Reference Examples**

| Task Field Label | Field Name to Use | Example Value |
|-----------------|-------------------|---------------|
| Auto Select ECN Port | `autoselectECNPort` | "No" |
| ECN Device | `ecnDevice` | "Router-X1" |
| ECNPort Other | `ecnPortOther` | "GE-0/0/1" |
| Device Mount Type | `deviceMountType` | "Front Mount" |
| Rack Size | `rackSize` | "42U" |
| Device CLLI ARM | `deviceCLLIARM` | "DNVFCOQE76W" |
| Backboard Size | `backboardSize` | "Standard" |
| Device Mount Status | `deviceMountStatus` | "Available" |

## 🚀 **Best Practices**

1. **Always check console logs** for available field names before configuring mappings
2. **Use exact field names** (case-sensitive) from the task parameters
3. **Test your mappings** by running tasks and verifying field values are applied
4. **Document your mappings** for team reference
5. **Use the enhanced UI guidance** for field name reference

---

**Remember: Field mappings use the technical field `name`, not the user-friendly `label`!** 🎯
