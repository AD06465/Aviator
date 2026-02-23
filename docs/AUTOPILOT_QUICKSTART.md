# Autopilot Monitor - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
1. Valid Autopilot credentials (username and password)
2. Access to Autopilot environments (Test 1, Test 2, or Test 4)
3. AVIATOR application running

### Setup Steps

#### 1. Configure Credentials

**Option A: Environment Variables (Temporary Solution)**
Create a `.env.local` file in the root directory:
```bash
# Server-side only (never exposed to browser)
AUTOPILOT_USERNAME=your_username
AUTOPILOT_PASSWORD=your_password
```

**⚠️ Security Warning**: This method exposes credentials in the browser. For production:
- Use server-side authentication
- Implement a secure credential vault
- Use OAuth/JWT tokens

**Option B: Manual Entry (Recommended for Development)**
Currently, credentials must be configured as environment variables. Future versions will support:
- Interactive login prompt
- Secure credential storage
- SSO integration

#### 2. Start the Application
```bash
npm run dev
```

#### 3. Use Autopilot Monitor

1. **Submit an Order**
   - Fill in the Order Form
   - Enter Order Number (e.g., `556171336`)
   - Select Environment (Test 1, Test 2, or Test 4)
   - Click "Start Automation"

2. **Access Autopilot Monitor**
   - Click the "🚀 Autopilot Monitor" tab
   - Authentication happens automatically
   - Wait for workflows to load

3. **Navigate Workflows**
   - Use status tabs: Running, Complete, Canceled, Paused, Error
   - Click workflow names to open in Autopilot
   - View progress bars for running workflows
   - Monitor auto-refresh (every 15 seconds)

## 📊 Understanding the Interface

### Status Tabs
- **🔵 Running**: Workflows currently executing (shows progress)
- **🟢 Complete**: Successfully finished workflows
- **⚪ Canceled**: Manually stopped workflows
- **🟡 Paused**: Workflows on hold
- **🔴 Error**: Failed workflows with error details

### Workflow Cards
Each card displays:
- **Name**: Clickable link to Autopilot workflow
- **Status Badge**: Current workflow state
- **ID**: Unique workflow identifier
- **Description**: Contains order and job information
- **Timestamps**: Start/end times
- **Duration**: Time elapsed or total runtime
- **Progress**: Visual progress bar (running workflows)
- **Errors**: Error messages if applicable

### Summary Panel
Bottom panel shows counts for each status category.

## 🔧 Configuration

### Environment URLs
Configured in `src/core/constants/autopilot.ts`:
- **Test 1**: `usddclvapapp011-test.corp.intranet:3443`
- **Test 2**: `usddclvapapp021-test.corp.intranet:3443`
- **Test 4**: `usddclvapapp041-test.corp.intranet:3443`

### Refresh Interval
Default: 15 seconds
Can be modified in `.env.local`:
```bash
NEXT_PUBLIC_AUTOPILOT_REFRESH_INTERVAL=15000
```

## 🎯 Common Use Cases

### 1. Monitor Active Workflows
- Submit order in AVIATOR
- Switch to Autopilot Monitor tab
- Watch "Running" tab for active workflows
- Track progress in real-time

### 2. Investigate Errors
- Go to "Error" tab
- View error messages in red boxes
- Click workflow name to debug in Autopilot
- Check error timestamps

### 3. Verify Completion
- Check "Complete" tab
- Review workflow durations
- Confirm all expected workflows ran
- Export data if needed (future feature)

### 4. Compare Environments
- Run same order in different environments
- Switch environments in Order Form
- Compare workflow execution patterns
- Identify environment-specific issues

## 🛠️ Troubleshooting

### Problem: "Authentication Error"
**Symptoms**: Red error banner, can't load workflows
**Solutions**:
1. Verify credentials in `.env.local`
2. Check VPN connection
3. Confirm Autopilot server access
4. Click "Retry Authentication"

### Problem: "No Workflows Found"
**Symptoms**: Empty tabs, no workflow cards
**Possible Causes**:
1. Order number doesn't exist in Autopilot
2. No workflows match order number
3. Wrong environment selected
4. Workflows not started yet

**Solutions**:
1. Verify order number is correct
2. Check order in Autopilot manually
3. Wait for workflows to start
4. Try manual refresh

### Problem: Workflows Not Updating
**Symptoms**: Stale data, refresh not working
**Solutions**:
1. Check browser console for errors
2. Verify network connectivity
3. Click manual refresh button
4. Reload page to reset state

### Problem: "Failed to Fetch Workflows"
**Symptoms**: Error message, empty workflow list
**Solutions**:
1. Check internet/VPN connection
2. Verify Autopilot server is accessible
3. Check browser console for details
4. Retry after network issues resolved

## 📝 Best Practices

### Security
1. ✅ Never commit credentials to version control
2. ✅ Use environment variables for sensitive data
3. ✅ Implement server-side authentication for production
4. ✅ Rotate credentials regularly
5. ❌ Don't share credentials in documentation
6. ❌ Don't hardcode passwords in code

### Performance
1. ✅ Use default 15-second refresh interval
2. ✅ Close tab when not actively monitoring
3. ✅ Limit number of concurrent sessions
4. ❌ Don't set refresh interval too low (< 5 seconds)

### Workflow Management
1. ✅ Use descriptive order numbers
2. ✅ Monitor workflows immediately after submission
3. ✅ Check error tab regularly
4. ✅ Document workflow patterns
5. ✅ Report persistent issues

## 🔄 Workflow Lifecycle

```
Submit Order → Authentication → Fetch Workflows → Display by Status
                     ↓                                    ↓
              [15 sec delay]  ← ← ← ← ← ← ← Auto-refresh
```

## 📚 Related Documentation
- [Full Implementation Guide](./AUTOPILOT_MONITOR_GUIDE.md)
- [API Documentation](./AUTOPILOT_API.md) (to be created)
- [Security Guidelines](./SECURITY.md) (to be created)

## 🆘 Getting Help
1. Check browser console (F12) for detailed errors
2. Review [Troubleshooting](#-troubleshooting) section
3. Test API endpoints manually with curl/Postman
4. Check Autopilot server status
5. Contact system administrator for access issues

## 🎓 Tips & Tricks

### Keyboard Shortcuts
- **Refresh Data**: Click refresh button or reload page
- **Switch Tabs**: Click tab names or use arrow keys (if focused)

### Visual Indicators
- 🔵 Blue badge = Running
- 🟢 Green badge = Complete
- 🔴 Red badge = Error
- 🟡 Yellow badge = Paused
- ⚪ Gray badge = Canceled

### Performance Tips
- Keep only one Autopilot Monitor tab open
- Close tab when not actively monitoring
- Use manual refresh for specific checks
- Review workflow counts in summary panel

## ✨ What's Next?
Future enhancements planned:
- [ ] Interactive login modal
- [ ] Workflow search and filtering
- [ ] Detailed workflow view modal
- [ ] Export to CSV/JSON
- [ ] Real-time notifications
- [ ] Workflow comparison tools
- [ ] Historical data analysis
- [ ] Custom refresh intervals per user
- [ ] Workflow actions (pause/resume/cancel)

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: Production Ready
