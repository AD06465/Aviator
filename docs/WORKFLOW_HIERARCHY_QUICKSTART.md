# Workflow Hierarchy Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- AVIATOR application running (`npm run dev`)
- Autopilot credentials configured
- Connected to corporate VPN
- Valid order number with workflows

## 📖 Step-by-Step Usage

### Step 1: Access Autopilot Monitor
1. Open AVIATOR in your browser (http://localhost:3000)
2. Enter your order details in the Order Form
3. Navigate to the **"Autopilot Monitor"** tab

### Step 2: Switch to Hierarchy View
1. Look for the **View Mode** toggle section
2. Click **"🌳 Hierarchy View"** button
3. The button will highlight in blue when selected

### Step 3: Select Root Workflow
1. A dropdown will appear: **"Select Root Workflow"**
2. Choose a workflow from the list
   - Usually select the main/parent workflow
   - For example: "MON_TestTag_Task_Completion_Handler"
3. The hierarchy will automatically build

### Step 4: Explore the Tree
**Expand/Collapse Workflows:**
- Click **▶** to expand a workflow and see its children
- Click **▼** to collapse a workflow

**Visual Indicators:**
- **Border Colors**: Show hierarchy depth (Blue → Purple → Indigo → Gray)
- **Status Badges**: Show workflow state (Complete/Error/Running/etc.)
- **Eye Button (👁️)**: Shows number of tasks in the workflow

### Step 5: View Tasks
1. Click the **👁️ [N] Tasks** button on any workflow
2. A task list will expand below the workflow
3. Each task shows:
   - Task name
   - Task ID
   - Status badge

### Step 6: Inspect Task Details
1. Click any **task** in the task list
2. A modal will open showing:
   - **Task ID**: Unique identifier
   - **Status**: Current task state
   - **Incoming Data**: Input parameters
   - **Outgoing Data**: Output results (if available)
   - **Error Data**: Error information (if task failed)
3. Click **Close** to return to the hierarchy

## 💡 Pro Tips

### Finding Errors
1. Look for **red status badges** in the tree
2. Expand red workflows to find failed children
3. Click 👁️ to see which specific task failed
4. Click the failed task to view error details

### Understanding Workflow Flow
```
Parent Workflow
├── Step 1: Data Preparation
│   ├── Child: Get UNI from ASRI
│   └── Child: Get Device from ASRI
├── Step 2: Validation
│   └── Child: Validate Data
└── Step 3: Complete Order
```

### Example Workflow Structure
```
MON_TestTag_Task_Completion_Handler (Root)
└─▶ Get_ResourcesByFilter_ASRI_NL (Child Level 1)
    └─▶ Get_ResourcesByFilter_ASRI_AL (Child Level 2)
```

## 🎯 Common Use Cases

### Debugging a Failed Workflow
1. Switch to Hierarchy View
2. Select the failed workflow as root
3. Expand to find which child failed
4. Click 👁️ on the failed child
5. Click the error task
6. Review error data and incoming parameters

### Understanding Dependencies
1. Select main workflow as root
2. Expand all levels
3. Observe the execution flow
4. Note which workflows depend on others

### Checking Task Data
1. Find the workflow containing the task
2. Click 👁️ to show tasks
3. Click the task you want to inspect
4. Review incoming/outgoing data

## 📊 Understanding the Display

### Color Codes

**Status Colors:**
- 🟢 **Green**: Complete
- 🔴 **Red**: Error
- 🔵 **Blue**: Running
- 🟡 **Yellow**: Incomplete
- 🟠 **Orange**: Paused
- ⚫ **Gray**: Canceled

**Hierarchy Depth:**
- **Blue Border**: Root level (depth 0)
- **Purple Border**: First child level (depth 1)
- **Indigo Border**: Second child level (depth 2)
- **Gray Border**: Deeper levels (depth 3+)

### Workflow Card Layout
```
┌─────────────────────────────────────────────┐
│ ▶ Workflow Name              [Status] 👁️ 15 │
│   Description text here...                   │
└─────────────────────────────────────────────┘
   └── Child workflows appear here when expanded
```

### Task Modal Layout
```
┌─────────────────────────────────────────────┐
│ Task Details                            ×   │
│ Task Name                                   │
├─────────────────────────────────────────────┤
│ Task ID: abc-123                            │
│ Status: [error]                             │
│                                             │
│ Incoming Data:                              │
│ { "param1": "value1" }                      │
│                                             │
│ Error Data:                                 │
│ { "code": 404, "message": "Not found" }     │
│                                             │
│                              [Close]        │
└─────────────────────────────────────────────┘
```

## 🔄 Switching Between Views

**List View:**
- Traditional table of workflows
- Grouped by status (Running, Complete, Error, etc.)
- Good for quick overview

**Hierarchy View:**
- Tree structure showing relationships
- Good for understanding dependencies
- Better for debugging complex workflows

**To Switch:**
1. Click the desired view button
2. Data is preserved between switches
3. Can switch back and forth freely

## ⚙️ Configuration

### Workflow Selection
- Dropdown shows all workflows for the order
- Select any workflow as the root
- Different roots show different perspectives
- Try selecting child workflows to see their subtrees

### Auto-Refresh
- Hierarchy view does NOT auto-refresh
- Click refresh button to update data
- Switch to List View for auto-refresh functionality

## ❗ Troubleshooting

### "No workflow data found"
- Ensure workflows exist for the order
- Check that data fetched successfully in List View
- Verify VPN connection

### "Failed to load workflow hierarchy"
- Check console for error details
- Verify Autopilot credentials
- Click "Retry" button
- Try switching environments

### "Please select a root workflow"
- Make sure you've selected a workflow from dropdown
- If dropdown is empty, no workflows were fetched
- Return to List View and refresh

### Tasks not showing
- Click the 👁️ button to expand task list
- Some workflows may have no tasks
- Check if workflow completed successfully

### Modal not opening
- Ensure you clicked on a task (not the workflow)
- Tasks are only shown when 👁️ is clicked first
- Try clicking a different task

## 📞 Support

For issues or questions:
1. Check console logs (F12 → Console)
2. Verify credentials are configured
3. Ensure VPN connection is active
4. Try refreshing the data

## 🎓 Learning Path

**Beginner:**
1. Start with simple workflows (1-2 levels deep)
2. Practice expanding/collapsing
3. View a few task details

**Intermediate:**
4. Explore complex hierarchies (3+ levels)
5. Compare incoming vs outgoing data
6. Identify error patterns

**Advanced:**
7. Trace data flow through multiple workflows
8. Debug complex dependency chains
9. Understand workflow orchestration

---

**Happy Debugging!** 🎉

For detailed implementation information, see [WORKFLOW_HIERARCHY_IMPLEMENTATION.md](./WORKFLOW_HIERARCHY_IMPLEMENTATION.md)
