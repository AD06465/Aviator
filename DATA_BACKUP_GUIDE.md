# 💾 AVIATOR Data Backup & Persistence System

## Overview

AVIATOR now includes a comprehensive data backup and persistence system that ensures your configuration data is **never lost** across browser sessions, code changes, or unexpected closures.

## 🔒 What Data is Protected?

The backup system automatically protects:

1. **Device Configurations**
   - All device names and descriptions
   - Custom devices you've added
   - Device selections and preferences

2. **Task Configuration**
   - Completable tasks list
   - Retryable tasks list
   - Mandatory field mappings
   - Dropdown field configurations
   - All custom task rules

3. **Field Mappings**
   - Text field values
   - Dropdown field selections
   - Dynamic placeholders ({{preferredDevice}}, etc.)

## ✨ Key Features

### 1. **Automatic Backups**
- Creates backups every 5 minutes automatically
- Runs in the background without interrupting your work
- Can be enabled/disabled anytime

### 2. **Manual Backups**
- Create instant backup snapshots
- Download backup files to your computer
- Keep multiple backup versions for safety

### 3. **Import/Export**
- Export backups as JSON files
- Import backups from saved files
- Share configurations between environments

### 4. **Data Integrity Verification**
- Check data health anytime
- Detect corruption early
- Validate backup completeness

### 5. **One-Click Restore**
- Restore from latest backup instantly
- Recover from accidental changes
- Roll back to previous configurations

## 📖 How to Use

### Accessing the Backup Manager

1. Open AVIATOR application
2. Click on the **💾 Data Backup** tab
3. The Backup Manager interface will appear

### Creating a Manual Backup

```
1. Go to Data Backup tab
2. Click "💾 Create Backup Now"
3. Confirmation message appears
4. Backup is saved in browser localStorage
```

### Downloading a Backup File

```
1. Go to Data Backup tab
2. Click "📥 Download Backup File"
3. JSON file downloads to your computer
4. File name: aviator-backup-YYYY-MM-DD-HH-MM-SS.json
```

### Importing a Backup

```
1. Go to Data Backup tab
2. Click "📤 Import Backup File"
3. Select your backup JSON file
4. Data is restored and page refreshes
```

### Restoring from Latest Backup

```
1. Go to Data Backup tab
2. Click "⚡ Restore from Backup"
3. Confirm the restoration
4. Page refreshes with restored data
```

### Enabling/Disabling Auto-Backup

```
1. Go to Data Backup tab
2. Click "▶️ Enable Auto-Backup" or "⏸️ Disable Auto-Backup"
3. Auto-backup status updates immediately
```

### Verifying Data Integrity

```
1. Go to Data Backup tab
2. Click "🔍 Verify Data Integrity"
3. System checks all data
4. Reports any issues found
```

## 🔧 Technical Details

### Storage Locations

All data is stored in browser localStorage with these keys:

- `aviator_devices` - Device configurations
- `aviator-task-config` - Task configurations
- `aviator_backup_data` - Latest backup snapshot
- `aviator_backup_metadata` - Backup statistics

### Backup File Format

Backup files are JSON format:

```json
{
  "timestamp": "2026-02-09T12:00:00.000Z",
  "version": "1.0.0",
  "devices": [...],
  "taskConfig": {...}
}
```

### Auto-Backup Frequency

- **Interval**: Every 5 minutes
- **Trigger**: Automatic when enabled
- **Storage**: Browser localStorage
- **Size**: Minimal (typically < 100KB)

## 🛡️ Data Persistence Guarantees

### ✅ Data Persists Across:

- Browser refreshes
- Tab closures
- Code updates/deployments
- System restarts
- Application rebuilds

### ✅ Data Survives:

- Hot module replacement (HMR)
- Development server restarts
- Production deployments
- Component re-renders

### ❌ Data Will Be Lost If:

- Browser cache is cleared manually
- localStorage is cleared by user
- Browser private/incognito mode is closed
- **Solution**: Export backup files regularly!

## 📋 Best Practices

### 1. Regular File Backups
```
✅ DO: Export backup files weekly
✅ DO: Store backup files in safe location
✅ DO: Keep multiple backup versions
```

### 2. Before Major Changes
```
✅ DO: Create manual backup before bulk edits
✅ DO: Export backup file before testing
✅ DO: Verify data integrity after changes
```

### 3. Sharing Configurations
```
✅ DO: Export config for team members
✅ DO: Import tested configurations
✅ DO: Document custom configurations
```

### 4. Auto-Backup Management
```
✅ DO: Keep auto-backup enabled
✅ DO: Monitor last backup time
✅ DO: Check backup count regularly
```

## 🔄 Backup Recovery Scenarios

### Scenario 1: Accidental Task Deletion
```
1. Go to Data Backup tab
2. Click "Restore from Backup"
3. Confirm restoration
4. Deleted tasks restored
```

### Scenario 2: Browser Cache Cleared
```
1. Go to Data Backup tab
2. Click "Import Backup File"
3. Select most recent backup
4. All data restored
```

### Scenario 3: Moving to New Computer
```
1. On old computer: Export backup file
2. Transfer file to new computer
3. On new computer: Open AVIATOR
4. Import backup file
5. All configurations transferred
```

### Scenario 4: Testing New Configuration
```
1. Create backup before testing
2. Make experimental changes
3. If issues occur, restore backup
4. Original config restored
```

## 📊 Monitoring Backup Health

The Backup Manager displays:

- **Total Backups**: Number of backups created
- **Last Backup Time**: When last backup was created
- **Auto-Backup Status**: Enabled or Disabled
- **Data Integrity**: Health check results

## 🚨 Troubleshooting

### Issue: Auto-backup not working

**Solution:**
1. Check if auto-backup is enabled
2. Verify backup metadata shows recent time
3. Open browser console for errors
4. Try manual backup to test system

### Issue: Cannot import backup file

**Solution:**
1. Verify file is valid JSON
2. Check file wasn't corrupted
3. Ensure file is AVIATOR backup format
4. Try creating new backup first

### Issue: Data lost after refresh

**Solution:**
1. Check if browser is in private mode
2. Verify localStorage is enabled
3. Import backup file if available
4. Check browser storage settings

### Issue: Backup file too large

**Solution:**
1. Normal size is < 100KB
2. Large size indicates many tasks
3. Consider splitting configurations
4. Clean up unused tasks

## 💡 Tips & Tricks

### Backup File Naming
```
Default: aviator-backup-2026-02-09-14-30-45.json
Custom: aviator-backup-prod-config-v1.json
```

### Scheduled Backups
```
Auto-backup runs every 5 minutes
Manual backups: Before major changes
File exports: Weekly or before deployments
```

### Version Control
```
Keep dated backup files:
- aviator-backup-2026-02-01.json
- aviator-backup-2026-02-08.json
- aviator-backup-2026-02-15.json
```

### Team Collaboration
```
1. Export your configuration
2. Share file via email/network
3. Team imports configuration
4. Everyone has same setup
```

## 🔐 Security Considerations

- Backup files contain configuration data only
- No sensitive credentials stored
- Files can be safely shared within team
- Store backup files securely
- Don't commit backups to public repos

## 📞 Support

If you encounter issues with the backup system:

1. Check this documentation
2. Verify backup metadata
3. Try manual backup creation
4. Check browser console for errors
5. Contact system administrator

## 🎯 Summary

The AVIATOR Data Backup System provides:

✅ **Automatic Protection**: Every 5 minutes
✅ **Manual Control**: Create backups anytime
✅ **File Export**: Download backup files
✅ **Easy Restore**: One-click recovery
✅ **Data Integrity**: Health verification
✅ **Zero Data Loss**: Across sessions

Your configurations are safe! 🛡️
