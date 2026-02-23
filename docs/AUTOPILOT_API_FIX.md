# Autopilot Monitor API Fix

## Summary
Updated the Autopilot Monitor to use the correct API endpoint that matches the original requirement. The previous implementation was using `orderNo` parameter which the API recently stopped supporting. The correct parameter is `contains[description]`.

## Changes Made

### 1. Backend API Endpoint Updated
**File**: `src/app/api/autopilot/route.ts`

**Old URL**:
```typescript
const workflowUrl = `${baseUrl}/operations-manager/jobs?status=running&status=complete&status=canceled&status=paused&status=error&orderNo=${orderNumber}`;
```

**New URL (Correct)**:
```typescript
const workflowUrl = `${baseUrl}/operations-manager/jobs?exclude=transitions,variables,tasks&limit=100&order=-1&skip=0&sort=metrics.start_time&contains[description]="${orderNumber}"`;
```

### 2. Features Already Implemented

The AutopilotMonitor component already has all required features:

#### ✅ Tabbed Interface
- 5 tabs: Running, Complete, Canceled, Paused, Error
- Tab counts show number of workflows in each status
- Clean Pronghorn Operations Manager aesthetic

#### ✅ Clickable Workflow Names
Workflow names are hyperlinks that open in new tab:
```typescript
<a href={workflowUrl} target="_blank" rel="noopener noreferrer">
  {workflow.name}
</a>
```

URL format: `{environmentBaseUrl}/operations-manager/#/jobs/{workflow._id}`

**Examples**:
- Test 1: `https://usddclvapapp011-test.corp.intranet:3443/operations-manager/#/jobs/76ce3c099df0483a8f99f03c`
- Test 2: `https://usddclvapapp021-test.corp.intranet:3443/operations-manager/#/jobs/76ce3c099df0483a8f99f03c`
- Test 4: `https://usddclvapapp041-test.corp.intranet:3443/operations-manager/#/jobs/76ce3c099df0483a8f99f03c`

#### ✅ Auto-refresh
- Polls API every 15 seconds (configurable in `src/core/constants/autopilot.ts`)
- Only refreshes when tab is active (performance optimization)

#### ✅ Data Extraction
From API response, the system extracts:
- `_id` - Workflow ID
- `name` - Workflow name (displayed as clickable link)
- `status` - Running/Complete/Canceled/Paused/Error
- `description` - Order details
- `metrics.progress` - Completion percentage (0-1)
- `metrics.start_time` - Workflow start timestamp
- `metrics.end_time` - Workflow end timestamp
- `metrics.user` - User who triggered workflow

#### ✅ Progress Display
- Visual progress bar (0-100%)
- Percentage text display
- Color: Pronghorn blue (#007BFF)

#### ✅ Time Formatting
- Start time: "Feb 19, 09:04 AM"
- Duration: Smart formatting (e.g., "2m 5s", "1h 23m", "5s")
- Handles running workflows (calculates duration from start to now)

#### ✅ Resizable Columns
- Drag column borders to adjust widths
- Hover shows blue indicator
- Minimum column width: 80px

## API Response Structure

The Autopilot API returns data in this format:

```json
{
  "message": "Successfully retrieved items",
  "data": [
    {
      "_id": "76ce3c099df0483a8f99f03c",
      "name": "CM_Search_FD_Task",
      "status": "complete",
      "description": "AP-CNB-CO-556171336-352930665",
      "metrics": {
        "start_time": 1771491858029,
        "end_time": 1771491861298,
        "progress": 1,
        "user": "6966525aa4c07c9c2583e117"
      }
    }
  ],
  "metadata": {
    "total": 109,
    "limit": 100
  }
}
```

## Environment Configuration

**Environments**:
```typescript
{
  name: 'Test 1',
  baseUrl: 'https://usddclvapapp011-test.corp.intranet:3443'
},
{
  name: 'Test 2',
  baseUrl: 'https://usddclvapapp021-test.corp.intranet:3443'
},
{
  name: 'Test 4',
  baseUrl: 'https://usddclvapapp041-test.corp.intranet:3443'
}
```

## Authentication

### Secure Credential Storage
Credentials are stored as environment variables and **never** exposed to the browser:

```bash
# Run this to set up credentials (Windows):
setup-autopilot-credentials.bat

# Or manually set:
$env:AUTOPILOT_USERNAME="your_username"
$env:AUTOPILOT_PASSWORD="your_password"
```

### Login Flow
1. Backend authenticates with Autopilot `/login` endpoint
2. Receives base64 token
3. Token cached for 30 minutes (server-side only)
4. All subsequent requests use `Authorization: Basic {token}` header
5. Frontend never sees credentials

**Login Payload**:
```json
{
  "user": {
    "username": "USERNAME",
    "password": "PASSWORD"
  }
}
```

## Testing the Fix

1. **Set up credentials** (if not done):
   ```powershell
   .\setup-autopilot-credentials.bat
   ```

2. **Start the development server**:
   ```powershell
   npm run dev
   ```

3. **Navigate to Autopilot Monitor tab**

4. **Select environment** (Test 1, Test 2, or Test 4)

5. **Enter order number** (e.g., `556171336`)

6. **Click "Start Monitor"**

7. **Verify workflows appear** in appropriate status tabs

8. **Click workflow name** to open in Autopilot (new tab)

## Expected Behavior

✅ **Workflows Load**: Should see workflows related to the order number
✅ **Tabs Populate**: Workflows grouped by status (Running, Complete, etc.)
✅ **Auto-refresh**: Data updates every 15 seconds
✅ **Clickable Links**: Workflow names open Autopilot in new tab
✅ **Progress Bars**: Visual indication of workflow completion
✅ **Time Display**: Formatted start times and durations

## Troubleshooting

### No Workflows Appear
- **Check VPN connection** - Autopilot requires corporate VPN
- **Verify credentials** - Run `setup-autopilot-credentials.bat`
- **Check order number** - Must exist in Autopilot
- **View browser console** - Look for 🔍 log messages

### Authentication Errors
- **401 Unauthorized**: Wrong username/password
- **Solution**: Reset credentials with `setup-autopilot-credentials.bat`

### Network Errors
- **Cannot reach server**: VPN not connected
- **ENOTFOUND**: DNS resolution failed (check VPN)

### API Returns Empty Array
- Order number may not have workflows
- Try a different order number with known active workflows
- Check if description contains the order number

## Files Modified

1. **Backend API** - `src/app/api/autopilot/route.ts`
   - Changed URL to use `contains[description]` parameter
   
2. **Frontend** - `src/components/AutopilotMonitor.tsx` 
   - Already had all required features ✅

3. **Constants** - `src/core/constants/autopilot.ts`
   - Environment configurations
   - Refresh interval (15000ms)

## Future Enhancements

### Credential Management
Consider implementing:
- Azure Key Vault integration
- OAuth 2.0 authentication
- SSO integration
- Per-user credentials (instead of shared service account)

### Performance
- Implement request debouncing
- Add caching layer (Redis)
- Pagination for large workflow lists
- Virtual scrolling for > 100 workflows

### Features
- Export workflows to CSV/Excel
- Workflow search/filter
- Sort by any column
- Workflow comparison
- Historical data tracking
- Notification/alerts for status changes
