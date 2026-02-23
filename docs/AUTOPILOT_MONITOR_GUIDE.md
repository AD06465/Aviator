# Autopilot Monitor - Implementation Guide

## Overview

The Autopilot Monitor is a new module integrated into the AVIATOR application that provides real-time monitoring of Autopilot workflows. It displays workflows categorized by status (Running, Complete, Canceled, Paused, Error) and automatically refreshes every 15 seconds.

## Features

### 1. **Real-time Workflow Monitoring**
- Fetches workflows from Autopilot Operations Manager API
- Auto-refreshes every 15 seconds
- Displays workflows grouped by status

### 2. **Status-based Tabs**
- **Running**: Shows actively executing workflows
- **Complete**: Displays successfully completed workflows
- **Canceled**: Lists manually canceled workflows
- **Paused**: Shows workflows that are paused
- **Error**: Displays workflows with errors

### 3. **Workflow Details**
Each workflow card displays:
- Workflow name (clickable link to Autopilot)
- Workflow ID
- Status badge
- Description
- Start time
- End time (if completed)
- Duration
- Progress bar (for running workflows)
- Error details (if applicable)

### 4. **Environment Support**
Supports multiple Autopilot environments:
- Test 1: `usddclvapapp011-test.corp.intranet:3443`
- Test 2: `usddclvapapp021-test.corp.intranet:3443`
- Test 4: `usddclvapapp041-test.corp.intranet:3443`

## Architecture

### Components

#### **AutopilotMonitor.tsx**
Main component that:
- Manages workflow state
- Handles authentication
- Renders status tabs and workflow cards
- Implements auto-refresh logic

### Services

#### **autopilotApi.ts**
API service layer providing:
- `loginToAutopilot()` - Authenticates with Autopilot
- `fetchAutopilotWorkflows()` - Retrieves workflows for an order
- `groupWorkflowsByStatus()` - Organizes workflows by status
- `buildAutopilotWorkflowUrl()` - Generates workflow URLs
- `formatWorkflowTime()` - Formats timestamps
- `calculateWorkflowDuration()` - Calculates workflow duration

### Types

#### **AutopilotWorkflow**
```typescript
interface AutopilotWorkflow {
  _id: string;
  name: string;
  type: string;
  status: 'complete' | 'running' | 'canceled' | 'paused' | 'error';
  description: string;
  created: string;
  last_updated: string;
  metrics?: {
    start_time?: number;
    end_time?: number;
    progress?: number;
    user?: string;
  };
  error?: Array<{
    task: string;
    message: string | object;
    timestamp: number;
  }>;
}
```

## API Integration

### Authentication
```typescript
POST {baseUrl}/login
Body: {
  "user": {
    "username": "USERNAME",
    "password": "PASSWORD"
  }
}
```

### Fetch Workflows
```typescript
GET {baseUrl}/operations-manager/jobs
Params:
  - exclude: transitions,variables,tasks
  - limit: 100
  - order: -1
  - skip: 0
  - sort: metrics.start_time
  - contains[description]: "{orderNumber}"
  - equals[type]: automation
```

## Security Considerations

### Credential Management
Currently, credentials are expected to be stored as environment variables:
- `AUTOPILOT_USERNAME` (server-side only, not exposed to browser)
- `AUTOPILOT_PASSWORD` (server-side only, not exposed to browser)

**⚠️ Important**: This is a temporary solution. For production:
1. Use a secure credential vault (e.g., Azure Key Vault, AWS Secrets Manager)
2. Implement server-side authentication
3. Use OAuth or JWT tokens
4. Never commit credentials to version control

### Recommended Improvements
1. **Server-side Authentication**: Move authentication to a backend API route
2. **Token Management**: Store tokens securely (HTTP-only cookies)
3. **Session Management**: Implement proper session handling
4. **Credential Rotation**: Support automatic credential rotation

## Usage

### 1. Enter Order Details
- Fill in the Order Form with:
  - Order Number
  - Environment (Test 1, Test 2, or Test 4)
  - Other required fields

### 2. Access Autopilot Monitor
- Click on the "🚀 Autopilot Monitor" tab
- The tab appears after submitting an order

### 3. View Workflows
- Browse workflows by status using the tabs
- Click on workflow names to open them in Autopilot
- View detailed metrics and progress

### 4. Manual Refresh
- Click the "Refresh" button to manually update workflows
- Auto-refresh runs every 15 seconds

## Configuration

### Refresh Interval
Defined in `src/core/constants/autopilot.ts`:
```typescript
export const AUTOPILOT_REFRESH_INTERVAL = 15000; // 15 seconds
```

### Environments
Configured in `src/core/constants/autopilot.ts`:
```typescript
export const AUTOPILOT_ENVIRONMENTS: AutopilotEnvironment[] = [
  {
    name: 'Test 1',
    baseUrl: 'https://usddclvapapp011-test.corp.intranet:3443',
    loginUrl: 'https://usddclvapapp011-test.corp.intranet:3443/login',
  },
  // ... more environments
];
```

## Troubleshooting

### Authentication Errors
**Issue**: "Authentication failed" error
**Solution**: 
1. Verify credentials are set in environment variables
2. Check network connectivity to Autopilot servers
3. Verify environment URLs are correct

### No Workflows Found
**Issue**: Empty workflow list
**Solution**:
1. Verify order number is correct
2. Check if workflows exist in Autopilot for this order
3. Ensure description field contains the order number

### Network Errors
**Issue**: Failed to fetch workflows
**Solution**:
1. Check VPN connection
2. Verify firewall rules allow access to Autopilot servers
3. Check browser console for detailed error messages

## Future Enhancements

1. **Workflow Filtering**: Add search and filter capabilities
2. **Detailed View**: Modal with full workflow details
3. **Workflow Actions**: Pause, resume, or cancel workflows
4. **Export**: Export workflow data to CSV/JSON
5. **Notifications**: Alert on workflow status changes
6. **History**: View historical workflow executions
7. **Analytics**: Dashboard with workflow statistics
8. **Logs**: Real-time workflow log streaming

## Separation from FlightDeck

The Autopilot Monitor is built as a **completely separate module** that:
- Has its own API service layer (`autopilotApi.ts`)
- Uses separate types and interfaces
- Has independent state management
- Does not interfere with FlightDeck task processing
- Can be used independently of FlightDeck monitoring

## Development Notes

### Adding New Environments
1. Add to `AUTOPILOT_ENVIRONMENTS` in `autopilot.ts`
2. Test authentication and API access
3. Update documentation

### Modifying Workflow Display
1. Edit `AutopilotMonitor.tsx` component
2. Update `renderWorkflowCard()` function
3. Adjust styling in status color constants

### Extending API Functionality
1. Add new functions to `autopilotApi.ts`
2. Update types in `types/index.ts`
3. Test with actual API responses

## Testing Checklist

- [ ] Authentication succeeds with valid credentials
- [ ] Workflows load for valid order numbers
- [ ] Status tabs show correct workflow counts
- [ ] Auto-refresh updates workflow data
- [ ] Workflow links open correct Autopilot pages
- [ ] Progress bars display correctly for running workflows
- [ ] Error messages display properly
- [ ] Manual refresh button works
- [ ] Environment switching works correctly
- [ ] Component cleans up on unmount

## Files Modified/Created

### New Files
- `src/components/AutopilotMonitor.tsx`
- `src/lib/autopilotApi.ts`
- `src/core/constants/autopilot.ts`
- `AUTOPILOT_MONITOR_GUIDE.md`

### Modified Files
- `src/types/index.ts` - Added Autopilot types
- `src/core/constants/index.ts` - Export autopilot constants
- `src/app/page.tsx` - Integrated Autopilot Monitor tab

## Support

For issues or questions:
1. Check browser console for detailed error messages
2. Verify environment configuration
3. Test API endpoints with Postman/curl
4. Review authentication flow
