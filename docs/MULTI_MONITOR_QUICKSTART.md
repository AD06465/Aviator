# AVIATOR Multi-Monitor Quick Start Guide

## Monitor Overview

AVIATOR now supports **three independent monitors** that can run simultaneously or separately:

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   ⚡ Swift  │ ──>│  📊 Flight   │──>│ 🚀 Autopilot│
│   Monitor   │    │  Deck Monitor│   │   Monitor   │
└─────────────┘    └──────────────┘   └─────────────┘
     FIRST              SECOND             FINAL
  (Upstream)        (Middle Layer)      (Downstream)
```

## Quick Start

### 1. Enter Order Information
Fill out the order form with:
- Order Number
- Environment (Test 1, Test 2, or Test 4)
- User credentials
- Other required fields

### 2. Choose Your Monitor(s)

#### Option A: Start with Swift (Recommended for New Orders)
1. Click **⚡ Swift Monitor** tab
2. Monitor will automatically:
   - Fetch Swift tasks
   - Complete ready tasks
   - Track order status
   - Stop when order reaches "Ordered" status

#### Option B: Start with FlightDeck (For In-Progress Orders)
1. Click **📊 FlightDeck Monitor** tab
2. Monitor will automatically:
   - Search for FlightDeck tasks
   - Complete configured tasks
   - Apply field mappings
   - Continue until all tasks done

#### Option C: Start with Autopilot (For Workflow Monitoring)
1. Click **🚀 Autopilot Monitor** tab
2. Monitor will:
   - Fetch Autopilot workflows
   - Display workflow hierarchy
   - Show running/completed/error workflows
   - Provide detailed error analysis

#### Option D: Run Multiple Monitors
1. Submit the order form (starts FlightDeck automation)
2. Open **⚡ Swift Monitor** in a new tab or window
3. Open **🚀 Autopilot Monitor** in another tab
4. Each monitor operates independently

## Monitor Features Comparison

| Feature | Swift Monitor | FlightDeck Monitor | Autopilot Monitor |
|---------|--------------|-------------------|-------------------|
| **Purpose** | Upstream task automation | Main task processing | Workflow monitoring |
| **Polling Interval** | 30 seconds | 45 seconds | 60 seconds |
| **Auto-Complete Tasks** | ✅ Yes (4 tasks) | ✅ Yes (configurable) | ❌ No (View only) |
| **Manual Interventions** | ⚠️ Credit approval | ⚠️ Field validations | ✅ None needed |
| **Completion Detection** | Status = "Ordered" | All tasks done | Workflow complete |
| **Real-time Updates** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Error Handling** | ✅ Detailed logs | ✅ Retry logic | ✅ Error details |

## Workflow Scenarios

### Scenario 1: Complete Order Lifecycle
```
1. Swift Monitor → Complete upstream tasks
2. Wait for "Ordered" status
3. FlightDeck Monitor → Process main tasks
4. Autopilot Monitor → Verify workflow execution
```

### Scenario 2: Mid-Stream Entry (Order Already in FlightDeck)
```
1. Skip Swift (already completed)
2. FlightDeck Monitor → Start here
3. Autopilot Monitor → Monitor progress
```

### Scenario 3: Troubleshooting Mode
```
1. Autopilot Monitor → Check for workflow errors
2. FlightDeck Monitor → Retry failed tasks
3. Swift Monitor → Verify upstream completion
```

## Monitor Controls

### Starting a Monitor
- Click on the respective tab
- Monitor activates automatically
- Status updates begin immediately

### Stopping a Monitor
- Switch to a different tab (pauses background processing)
- Click "Stop Processing" button (for FlightDeck)
- Close the browser tab (for emergency stop)

### Restarting a Monitor
- Click "Restart Processing" button
- Or switch back to the monitor's tab
- Processing resumes from current state

## Task Types by Monitor

### Swift Monitor Tasks
- ✅ Prepare Order Package
- ✅ Analyze/Adjust PSPs
- ✅ Customer Coordination
- ✅ Welcome Customer
- ⚠️ Wait For Credit Approval (Manual)

### FlightDeck Monitor Tasks
- Configured in Task Configuration tab
- Examples:
  - Design Task
  - Engineering Install
  - Order Verification
  - Completion tasks

### Autopilot Monitor Workflows
- Read-only monitoring
- No task completion
- Shows workflow hierarchy
- Displays job status and errors

## Configuration

### Task Configuration Tab (📝)
- Define completable tasks for FlightDeck
- Set field mappings
- Configure retry logic
- Manage conditional rules

### Data Backup Tab (💾)
- Export configuration
- Import saved settings
- Backup task data

### Advanced Config Tab (⚙️)
- Fine-tune processing rules
- Advanced field mappings
- Task sequencing

## Tips & Best Practices

### ✅ DO:
- Monitor the processing logs for errors
- Complete manual tasks promptly
- Use the correct monitor for your order stage
- Keep monitors running in separate tabs for parallel visibility

### ❌ DON'T:
- Close monitor tabs during active processing
- Submit the same order multiple times
- Ignore warning messages
- Mix environments for the same order

## Troubleshooting

### Swift Issues
**Problem**: No tasks found  
**Solution**: Verify order exists in Swift system, check environment selection

**Problem**: Tasks not completing  
**Solution**: Check processing log for errors, verify API connectivity

### FlightDeck Issues  
**Problem**: Tasks stuck in Ready status  
**Solution**: Review mandatory field requirements, check task configuration

**Problem**: Processing stopped unexpectedly  
**Solution**: Check for failed tasks, review error messages

### Autopilot Issues
**Problem**: No workflows found  
**Solution**: Verify order number, ensure workflows exist in Autopilot

**Problem**: Slow loading  
**Solution**: Expected behavior - Autopilot queries take 60+ seconds

## Keyboard Shortcuts

- **Tab Navigation**: Use mouse to click tabs
- **Ctrl+R**: Refresh current monitor view
- **Ctrl+W**: Close current tab (stops that monitor)

## Getting Help

1. **Check Processing Logs**: Each monitor has detailed logs
2. **Review Documentation**: 
   - SWIFT_MONITOR_IMPLEMENTATION.md
   - AUTOPILOT_IMPLEMENTATION_COMPLETE.md
   - Task configuration guides
3. **Common Issues**: Check TROUBLESHOOTING sections in each doc

## System Requirements

- Modern web browser (Chrome, Edge, Firefox)
- Network access to:
  - Swift API endpoints
  - FlightDeck API endpoints  
  - Autopilot API endpoints
- Valid user credentials
- Proper environment selection

---

**Quick Reference Card**

| Monitor | Icon | When to Use | Key Feature |
|---------|------|-------------|-------------|
| Swift | ⚡ | New orders, upstream processing | Auto-completes 4 task types |
| FlightDeck | 📊 | Main order processing | Configurable automation |
| Autopilot | 🚀 | Workflow monitoring, debugging | Real-time workflow view |

**Remember**: Each monitor is independent. You can run them simultaneously or individually based on your needs!

---

**Version**: 1.0.0  
**Last Updated**: March 13, 2026  
**Status**: ✅ Ready to Use
