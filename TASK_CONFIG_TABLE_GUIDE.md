# Task Configuration Table - User Guide

## Overview

The **Task Configuration Table** is a user-friendly interface for managing task automation rules and mandatory field mappings. This replaces manual configuration editing with an intuitive table-based UI.

## Features

### ✨ Core Capabilities

1. **View All Tasks** - See all configured tasks in one table
2. **Add New Tasks** - Create new task configurations easily
3. **Edit Fields** - Modify mandatory fields and values inline
4. **Delete Tasks** - Remove tasks you no longer need
5. **Export/Import** - Share configurations between environments
6. **Search** - Quickly find tasks by name
7. **Statistics** - See overview of completable, retryable tasks

## How to Access

1. Navigate to AVIATOR homepage
2. Submit an order to activate the interface
3. Click the **"📝 Task Config Table"** tab

## Interface Overview

### Main Table Columns

| Column | Description |
|--------|-------------|
| **Task Name** | Name of the task (e.g., "Service Validate Field") |
| **Completable** | ✓ if task can be auto-completed |
| **Retryable** | ✓ if task can be auto-retried |
| **Mandatory Fields** | Field name = value pairs |
| **Actions** | Edit or Delete buttons |

### Statistics Dashboard

- **Total Tasks** - All configured tasks
- **Completable Tasks** - Tasks that auto-complete
- **Retryable Tasks** - Tasks that auto-retry
- **Total Fields** - All configured field mappings

## Adding a New Task

### Step 1: Click "Add New Task"

Click the blue **"➕ Add New Task"** button in the top-right corner.

### Step 2: Fill Task Details

1. **Task Name** (Required)
   - Enter the exact task name from FlightDeck
   - Example: `Service Validate Field`

2. **Automation Options**
   - ☑ **Auto-Completable**: Task will be completed automatically
   - ☑ **Auto-Retryable**: Task will retry on failure

### Step 3: Add Mandatory Fields

1. Enter **Field Name** (e.g., `Demarc_Information`)
2. Enter **Default Value** (e.g., `Test`)
3. Click **"Add Field"** button
4. Repeat for all fields

### Step 4: Save Task

Click **"Add Task"** to save your configuration.

## Field Value Placeholders

Use these special placeholders for dynamic values:

| Placeholder | Description | Example Use |
|-------------|-------------|-------------|
| `{{preferredDevice}}` | User's selected device | `TID` field |
| `{{preferredPort}}` | User's entered port | `Port` field |
| `{{workflowBasedValue}}` | Changes based on workflow | `Fallout Action` field |

### Example Field Mapping

**Task**: LOA Designate Tid and Port

| Field Name | Field Value |
|------------|-------------|
| `TID` | `{{preferredDevice}}` |
| `Port (eg: GigabitEthernet0/0/23)` | `{{preferredPort}}` |
| `Demarc Location` | `TEST` |

## Editing Tasks

### Edit Mode

1. Click the **"✏️ Edit"** button for a task
2. Field inputs become editable
3. Add new fields using the inputs at the bottom
4. Delete fields with the **✕** button
5. Click **"✓ Done"** to save changes

### Quick Checkbox Updates

- Toggle **Completable** or **Retryable** directly in the table
- Changes save automatically

## Deleting Tasks

1. Click the **"🗑️"** button for a task
2. Confirm deletion in the popup
3. Task is removed permanently

## Export Configuration

### Why Export?

- Backup your configuration
- Share with team members
- Move between environments

### How to Export

1. Click **"📥 Export Config"** button
2. JSON file downloads automatically
3. File name: `aviator-config-YYYY-MM-DD.json`

## Import Configuration

### Why Import?

- Restore from backup
- Use shared team configuration
- Clone from another environment

### How to Import

1. Click **"📤 Import Config"** button
2. Select your JSON file
3. Configuration loads immediately
4. All tasks are replaced with imported data

## Search and Filter

Use the search box to find specific tasks:

```
🔍 Search tasks...
```

- Type any part of the task name
- Results filter in real-time
- Case-insensitive search

## Real-World Examples

### Example 1: Service Validation Task

**Task Name**: `Service Validate - UNI (Tester)`

| Configuration | Value |
|---------------|-------|
| Completable | ✓ Yes |
| Retryable | ✗ No |

**Fields**:
- `Demarc_Information` = `Test`

### Example 2: Device Assignment Task

**Task Name**: `Verify or Assign Appropriate Device`

| Configuration | Value |
|---------------|-------|
| Completable | ✓ Yes |
| Retryable | ✗ No |

**Fields**:
- `Fallout Action` = `{{workflowBasedValue}}`
- `Device` = `{{preferredDevice}}`
- `Port` = `{{preferredPort}}`

### Example 3: Engineering Solution

**Task Name**: `Perform Engineering Solution`

| Configuration | Value |
|---------------|-------|
| Completable | ✓ Yes |
| Retryable | ✗ No |

**Fields**:
- `buildTypes` = `Simple`
- `dedicatedOptions` = `Shared`
- `ospRemarks` = `Automated completion via AVIATOR`
- `surveyCategory` = `ISP`
- `procurementRequestType` = `Procurement Financial Request Materials`
- `implementationTeam` = `Standard Implementation Team`
- `buildingAccessQty` = `1`

## Integration with Automation

### How It Works

1. **You configure** tasks in the table
2. **System saves** to local storage
3. **Automation reads** configuration
4. **Tasks process** using your field values

### When Changes Apply

- Configuration changes apply **immediately**
- Active processing uses **current config**
- No restart needed

## Best Practices

### ✅ Do's

- ✅ Use exact task names from FlightDeck
- ✅ Test with one task before bulk adding
- ✅ Export configuration regularly as backup
- ✅ Use placeholders for dynamic values
- ✅ Document field purposes for team

### ❌ Don'ts

- ❌ Don't use typos in task names
- ❌ Don't hard-code values that should be dynamic
- ❌ Don't delete tasks without team agreement
- ❌ Don't forget to export before major changes

## Troubleshooting

### Task Not Auto-Completing

**Problem**: Task shows in monitor but doesn't complete

**Solutions**:
1. Check if **Completable** checkbox is enabled
2. Verify task name matches FlightDeck exactly
3. Ensure all mandatory fields are configured
4. Check field values are correct

### Field Values Not Applying

**Problem**: Fields show wrong values

**Solutions**:
1. Check placeholder syntax: `{{preferredDevice}}`
2. Verify field names match FlightDeck
3. Test with static value first
4. Check browser console for errors

### Configuration Lost

**Problem**: Settings disappeared after refresh

**Solutions**:
1. Check if cookies/local storage is enabled
2. Re-import from backup
3. Check browser privacy settings
4. Try different browser

### Import Not Working

**Problem**: Import file won't load

**Solutions**:
1. Verify file is valid JSON
2. Check file wasn't corrupted
3. Ensure file came from AVIATOR export
4. Try opening file in text editor to verify

## Advanced Tips

### Workflow-Based Values

Use `{{workflowBasedValue}}` for fields that change based on workflow type:

**For "Fallout Action" field**:
- Monarch workflows → `Enter Port data`
- Colorless workflows → `Create Cap Jeop`

### Multiple Field Sets

Same task can have different fields for different scenarios:
1. Create separate task entries if needed
2. Use descriptive task names
3. Enable/disable as needed

### Team Collaboration

**Sharing Configuration**:
1. Export your config
2. Share JSON file with team
3. Team imports to their browser
4. Everyone uses same rules

## Quick Reference

### Keyboard Shortcuts (In Edit Mode)

- **Tab** - Move to next field
- **Enter** - Add field (when in add inputs)
- **Escape** - Cancel edit mode

### Common Field Names

- `Demarc_Information`
- `TID`
- `Port`
- `Demarc Location`
- `Fallout Action`
- `Device`
- `Comments`
- `buildTypes`
- `dedicatedOptions`
- `ospRemarks`

### Common Field Values

- `Test` / `TEST`
- `{{preferredDevice}}`
- `{{preferredPort}}`
- `{{workflowBasedValue}}`
- `Automated completion via AVIATOR`
- `Simple` / `Shared`

## Support

### Getting Help

1. Check this guide first
2. Review Quick Guide in the interface
3. Check browser console for errors
4. Export config and share with support

### Reporting Issues

Include:
- Task name causing issues
- Field configuration
- Error messages
- Exported configuration file
- Screenshots

---

**Remember**: The table automatically syncs with the automation system. Changes apply immediately to new task processing!
