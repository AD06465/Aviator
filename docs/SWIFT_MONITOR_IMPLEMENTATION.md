# Swift Monitor Implementation Guide

## Overview

The Swift Monitor module has been successfully integrated into the AVIATOR application. Swift is the **first step** in the order processing workflow, coming before FlightDeck and Autopilot.

**Order Processing Flow:**
```
Swift → [Future System] → FlightDeck → Autopilot
```

## Features Implemented

### 1. **Automated Task Processing**
- Monitors Swift tasks every 30 seconds
- Automatically completes tasks when they reach "Ready" status
- Supports the following task types:
  - ✅ **Prepare Order Package**
  - ✅ **Analyze/Adjust PSPs**
  - ✅ **Customer Coordination**
  - ✅ **Welcome Customer**
  - ⚠️ **Wait For Credit Approval** (Manual - requires user action)

### 2. **Order Status Monitoring**
- Fetches complete product package details
- Displays order information including:
  - Business Order ID
  - Transaction ID
  - Order Status
  - Product List
- Automatically stops processing when order status reaches "Ordered"

### 3. **Real-time UI Updates**
- Task statistics dashboard
- Live processing log with color-coded messages
- Detailed task list with status indicators
- Order completion notifications

## How to Use

### Starting Swift Monitor

1. **Enter Order Details** in the Order Form:
   - Order Number (e.g., `556174677`)
   - Select Environment (Test 1, Test 2, or Test 4)
   - Other required fields

2. **Navigate to Swift Monitor Tab**:
   - After submitting the order, click on the **⚡ Swift Monitor** tab
   - The monitor will automatically start processing

3. **Monitor Progress**:
   - View task status in real-time
   - Check the processing log for detailed activity
   - Monitor order details and completion status

### Independent Monitor Operation

Each monitor (Swift, FlightDeck, Autopilot) operates independently:

- **Swift Monitor**: Start by switching to the ⚡ Swift Monitor tab
- **FlightDeck Monitor**: Switch to the 📊 FlightDeck Monitor tab
- **Autopilot Monitor**: Switch to the 🚀 Autopilot Monitor tab

You can switch between monitors at any time. Each monitor will continue its background processing based on its tab visibility.

## API Endpoints

### Swift Task API
Fetches all tasks for a specific order:
```
GET http://swiftservicesenv{X}:9003/Swift/v1/WorkCenter/tasks/transaction/{orderId}
```

### Complete Task API
Completes a specific task:
```
PUT http://swiftservicesenv{X}:9003/Swift/v1/WorkCenter/task/{taskId}/completeWithAction
```

### Product Package API
Gets order details and status:
```
GET http://swiftservicesenv{X}.corp.global.level3.com:9000/Customer/v3/Ordering/transaction/{orderId}/productPackage
```

Where `{X}` can be: `1`, `2`, or `4` based on the selected environment.

## Task Processing Logic

### Automatic Completion
Tasks with the following display names are automatically completed when they reach "Ready" status:
- Prepare Order Package
- Analyze/Adjust PSPs
- Customer Coordination
- Welcome Customer

### Manual Completion Required
Tasks that require manual intervention:
- **Wait For Credit Approval** - User will see a warning message to complete this manually

### Process Termination
The Swift monitor automatically stops when:
- Order status reaches "Ordered"
- User switches to a different tab
- User manually stops the processing

## Processing Log Indicators

The processing log uses color-coded messages:

- 🔵 **Blue (Info)**: General information and status updates
- 🟢 **Green (Success)**: Task completions and successful operations
- 🟡 **Yellow (Warning)**: Manual action required
- 🔴 **Red (Error)**: Failures and error conditions

## Architecture

### Files Created/Modified

**New Files:**
1. `src/lib/swiftApi.ts` - Swift API service layer
2. `src/components/SwiftMonitor.tsx` - Swift monitor UI component
3. `docs/SWIFT_MONITOR_IMPLEMENTATION.md` - This documentation

**Modified Files:**
1. `src/types/index.ts` - Added Swift-specific type definitions
2. `src/app/page.tsx` - Integrated Swift monitor tab

### Type Definitions

Key TypeScript interfaces:
- `SwiftTask` - Represents a Swift task with all metadata
- `SwiftProductPackage` - Order/product package details
- `SwiftEnvironment` - Environment configuration
- `SwiftTaskAttribute` - Task attribute metadata

## Refresh Intervals

- **Swift Task Polling**: 30 seconds
- **FlightDeck Task Polling**: 45 seconds  
- **Autopilot Workflow Polling**: 60 seconds

Each system has optimized polling intervals based on its typical task completion times.

## Error Handling

The Swift monitor includes comprehensive error handling:

1. **API Failures**: Displays error messages in the UI and log
2. **Network Issues**: Retries on next polling interval
3. **Task Completion Errors**: Logged with detailed error information
4. **Missing Order Data**: Graceful degradation with informative messages

## Best Practices

1. **Monitor Selection**: Start with Swift for orders that require upstream processing
2. **Tab Management**: Keep the Swift monitor tab active for continuous processing
3. **Log Monitoring**: Review the processing log for any warnings or errors
4. **Manual Tasks**: Promptly complete any tasks marked for manual intervention
5. **Order Completion**: Wait for "Ordered" status before considering the order complete

## Future Enhancements

As mentioned, there will be an additional system between Swift and FlightDeck in the future:

```
Swift → [Future System] → FlightDeck → Autopilot
```

The architecture is designed to easily accommodate this addition without breaking existing functionality.

## Troubleshooting

### No Tasks Found
- Verify the order number is correct
- Ensure the correct environment is selected
- Check that tasks exist in Swift for this order

### Tasks Not Completing
- Check the processing log for error messages
- Verify network connectivity to Swift APIs
- Ensure the task is in "Ready" status

### Order Status Not Updating
- The product package API may be experiencing delays
- Check that the order has progressed in Swift
- Review the processing log for API errors

## Technical Details

### Polling Strategy
The Swift monitor uses an intelligent polling strategy:
- Initial fetch on monitor activation
- Continuous 30-second interval polling when active
- Automatic pause when tab is not visible
- Resume polling when tab becomes active again

### State Management
- React hooks for component state
- Automatic cleanup on component unmount
- Prevents memory leaks with proper interval management

### Performance Optimization
- Only one active polling interval per monitor
- Tab visibility detection to reduce unnecessary API calls
- Efficient state updates to minimize re-renders

## Support

For issues or questions about the Swift Monitor implementation, refer to:
- This documentation
- Processing logs in the UI
- Type definitions in `src/types/index.ts`
- API service implementation in `src/lib/swiftApi.ts`

---

**Version**: 1.0.0  
**Last Updated**: March 13, 2026  
**Status**: ✅ Production Ready
