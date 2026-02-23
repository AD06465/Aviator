# 🔀 AVIATOR Conditional Rules System

## Overview

The Conditional Rules System allows you to configure different field values based on dynamic conditions like Workflow Type or Order Type - **all through the UI**, no hardcoding required!

---

## 🎯 Use Case Example

### Your Requirement:

**For "Verify or Assign Appropriate Device" task:**

**IF** Workflow = "Monarch Onnet"  
**THEN**:
- Set dropdown "Fallout Action" = "Enter Port Data"  
- Set "Device" = {{preferredDevice}}  
- Set "Port" = {{preferredPort}}

**IF** Workflow = "Colorless"  
**THEN**:
- Set dropdown "Fallout Action" = "Create Cap Jeop"

---

## ✨ How to Configure (Step-by-Step)

### 1. **Open Task Configuration**
```
1. Go to "📝 Task Configuration" tab
2. Find "Verify or Assign Appropriate Device" task
3. Click "🔀 Rules" button
```

### 2. **Add Rule for Monarch Onnet**

**Step 2.1:** Select Condition Type
```
Condition Type: [Workflow Type ▼]
Condition Value: "Monarch Onnet"
```

**Step 2.2:** Add Fields for this condition
```
Field 1:
  Type: 📋 Dropdown
  Field Name: "Fallout Action"
  Label: "Enter Port Data"
  Value: "Enter Port Data"

Field 2:
  Type: 📝 Text
  Field Name: "Device"
  Value: "{{preferredDevice}}"

Field 3:
  Type: 📝 Text
  Field Name: "Port"
  Value: "{{preferredPort}}"
```

**Step 2.3:** Click "✓ Save Conditional Rule"

### 3. **Add Rule for Colorless**

**Step 3.1:** Click "🔀 Rules" again to add another rule
```
Condition Type: [Workflow Type ▼]
Condition Value: "Colorless"
```

**Step 3.2:** Add Fields
```
Field 1:
  Type: 📋 Dropdown
  Field Name: "Fallout Action"
  Label: "Create Cap Jeop"
  Value: "Create Cap Jeop"
```

**Step 3.3:** Click "✓ Save Conditional Rule"

---

## 🔧 Features

### Condition Types

| Type | Description | Example |
|------|-------------|---------|
| **Workflow Type** | Based on Itential Workflow | "Monarch Onnet", "Colorless" |
| **Order Type** | Based on order category | "New Install", "Modification" |
| **Custom** | Any custom condition | Your custom logic |

### Field Types in Rules

| Type | Use For | Example |
|------|---------|---------|
| **📝 Text** | Static values or placeholders | {{preferredDevice}}, "Building 1" |
| **📋 Dropdown** | Selecting from dropdown options | "Enter Port Data", "Create Cap Jeop" |

### Supported Placeholders

All placeholders work in conditional rules:
- `{{preferredDevice}}` - Device from DeviceManager
- `{{preferredPort}}` - Port from DeviceManager  
- `{{workflowBasedValue}}` - Workflow-specific value
- Any custom placeholder you define

---

## 📊 UI Walkthrough

### Task Configuration Table with Rules Button

```
┌─────────────────────────────────────────────────────────────┐
│ Task Name                    │ Fields  │ Actions            │
├─────────────────────────────────────────────────────────────┤
│ Verify or Assign Device     │ 2 fields│ [✏️ Edit] [🔀 Rules] [🗑️] │
└─────────────────────────────────────────────────────────────┘
```

### Conditional Rules Panel (Click 🔀 Rules)

```
┌─────────────────────────────────────────────────────────────┐
│ 🔀 Conditional Rules for "Verify or Assign Appropriate Device"│
│                                                         [✕ Close]│
├─────────────────────────────────────────────────────────────┤
│ EXISTING RULES:                                              │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ WORKFLOW                                   [🗑️ Delete]│   │
│ │ When: Monarch Onnet                                  │   │
│ │                                                      │   │
│ │ Apply these fields:                                  │   │
│ │ 📋 Fallout Action = Enter Port Data                 │   │
│ │ 📝 Device = {{preferredDevice}}                      │   │
│ │ 📝 Port = {{preferredPort}}                          │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ WORKFLOW                                   [🗑️ Delete]│   │
│ │ When: Colorless                                      │   │
│ │                                                      │   │
│ │ Apply these fields:                                  │   │
│ │ 📋 Fallout Action = Create Cap Jeop                 │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ ➕ ADD NEW CONDITIONAL RULE:                                │
│                                                              │
│ [Workflow Type ▼] [Monarch Onnet________________]          │
│                                                              │
│ Fields to apply when condition is met:                      │
│                                                              │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ [📋 Dropdown ▼] [Field name______________]          │    │
│ │ [Label____________] [Value_____________]            │    │
│ │ [➕ Add Field to Rule]                              │    │
│ └─────────────────────────────────────────────────────┘    │
│                                                              │
│ [✓ Save Conditional Rule]                                   │
│                                                              │
│ 💡 Example:                                                 │
│ • Condition: Workflow = "Monarch Onnet"                     │
│ • Then: Set "Fallout Action" = "Enter Port Data"           │
│ • And: Set "Device" = {{preferredDevice}}                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 How It Works at Runtime

### 1. **Task Processing Starts**
```
Task: "Verify or Assign Appropriate Device"
Workflow: "Monarch Onnet"
```

### 2. **System Checks Conditional Rules**
```
✓ Found rule: Workflow = "Monarch Onnet"
✓ Apply fields from this rule:
  - Fallout Action → "Enter Port Data"
  - Device → {{preferredDevice}} → "LAB4COZWZG001"
  - Port → {{preferredPort}} → "TenGigabitEthernet0/0/1"
```

### 3. **Task is Completed with Correct Values**
```
Field "Fallout Action" set to "Enter Port Data"
Field "Device" set to "LAB4COZWZG001"
Field "Port" set to "TenGigabitEthernet0/0/1"
```

---

## 💡 Configuration Examples

### Example 1: Workflow-Based Field Selection

**Task:** Service Validate Field  
**Rule 1:**
```yaml
Condition:
  Type: Workflow Type
  Value: "Monarch Onnet"
  
Fields:
  - Name: "vendorName"
    Type: Dropdown
    Label: "CenturyLink"
    Value: "CENTURYLINK COMMUNICATIONS LLC"
```

**Rule 2:**
```yaml
Condition:
  Type: Workflow Type
  Value: "Colorless"
  
Fields:
  - Name: "vendorName"
    Type: Dropdown
    Label: "Amazon AWS"
    Value: "AMAZON WEB SERVICES INC"
```

### Example 2: Order Type-Based Configuration

**Task:** Engineering Solution  
**Rule:**
```yaml
Condition:
  Type: Order Type
  Value: "New Install"
  
Fields:
  - Name: "buildType"
    Type: Text
    Value: "New Construction"
  - Name: "teamAssignment"
    Type: Dropdown
    Label: "Installation Team A"
    Value: "TEAM_A"
```

### Example 3: Multiple Conditions for Same Task

**Task:** Network Build Form  
**Rule 1:** Monarch Onnet → Standard Config  
**Rule 2:** Colorless → Colorless Config  
**Rule 3:** Special Order → Custom Config

---

## 🎨 Visual Indicators

### In Task Table

Tasks with conditional rules show a count:
```
┌─────────────────────────────────┐
│ Verify or Assign Device   (2 rules) │
└─────────────────────────────────┘
```

### Rule Status Colors

- **🟣 Purple** = Conditional Rules section
- **🟢 Green** = Add field/rule buttons
- **🔴 Red** = Delete buttons
- **🔵 Blue** = Information/Help

---

## 📋 Best Practices

### 1. **Start with Default Fields**
```
Default Fields: Always applied
Conditional Rules: Applied when condition matches
```

### 2. **Use Descriptive Condition Values**
```
✅ Good: "Monarch Onnet"
✅ Good: "Colorless Off-Net"
❌ Bad: "Type1"
❌ Bad: "Config_A"
```

### 3. **Test Each Rule**
```
1. Create rule
2. Run automation with that workflow
3. Verify fields are applied correctly
4. Document working configurations
```

### 4. **Organize Related Rules**
```
Keep all rules for a task together
Document which workflows need which rules
Review rules periodically
```

---

## 🚀 Advantages Over Hardcoding

### ❌ Old Way (Hardcoded):

```typescript
if (workflow === "Monarch Onnet") {
  fields["Fallout Action"] = "Enter Port Data";
  fields["Device"] = preferredDevice;
  // Need to modify code and redeploy
}
```

### ✅ New Way (UI Configuration):

```
1. Open Task Config
2. Click "🔀 Rules"
3. Add/Edit/Delete rules
4. Changes take effect immediately
5. No code changes needed!
```

### Benefits:

✅ **No Code Changes**: Configure through UI  
✅ **Immediate Effect**: Changes apply instantly  
✅ **Easy Testing**: Test different scenarios quickly  
✅ **User Friendly**: Non-developers can configure  
✅ **Documented**: Rules visible in UI  
✅ **Backed Up**: Saved with other configurations  
✅ **Exportable**: Share rules between environments  

---

## 📦 Data Storage

Conditional rules are stored in localStorage:

```json
{
  "conditionalRules": {
    "Verify or Assign Appropriate Device": [
      {
        "id": "rule-1707501234567",
        "conditionType": "workflow",
        "conditionValue": "Monarch Onnet",
        "fields": [
          {
            "fieldName": "Fallout Action",
            "fieldValue": "Enter Port Data",
            "fieldType": "dropdown",
            "dropdownValue": "Enter Port Data"
          },
          {
            "fieldName": "Device",
            "fieldValue": "{{preferredDevice}}",
            "fieldType": "text"
          }
        ]
      }
    ]
  }
}
```

---

## 🔍 Troubleshooting

### Issue: Rule not applying

**Check:**
1. Workflow name matches exactly (case-sensitive)
2. Rule is saved (check existing rules section)
3. Fields are configured correctly
4. Task name is correct

**Solution:**
- Edit rule and verify condition value
- Check console logs during task processing
- Verify field names match task form

### Issue: Wrong fields applied

**Check:**
1. Multiple rules might be conflicting
2. Field names must match exactly
3. Dropdown values must be valid options

**Solution:**
- Review all rules for the task
- Test one rule at a time
- Verify field names in FlightDeck

### Issue: Placeholder not resolving

**Check:**
1. Placeholder format: {{preferredDevice}}
2. Device/Port is selected in DeviceManager
3. Placeholder is supported

**Solution:**
- Use exact placeholder syntax
- Ensure device is selected before automation
- Check available placeholders list

---

## 🎉 Summary

The Conditional Rules System provides a **powerful, flexible, and user-friendly** way to handle workflow-specific logic without touching code. Configure once, use everywhere, and easily adjust as requirements change!

### Quick Start:

1. ✅ Go to Task Configuration tab
2. ✅ Click "🔀 Rules" on any task
3. ✅ Add condition and fields
4. ✅ Save and test!

**No coding required!** 🚀
