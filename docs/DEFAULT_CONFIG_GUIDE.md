# Default AVIATOR Configuration

## Overview

The `default-aviator-config.json` file provides a ready-to-use configuration for new AVIATOR users. It includes pre-configured tasks, workflow names, product names, and conditional rules to help you get started quickly.

## What's Included

### ✅ Completable Tasks (9 tasks)
- Confirm/Schedule Activation
- Service Validate Field
- Service Validate - UNI (Tester)
- Service Validate Ethernet
- Send Completion Details
- Verify or Assign Appropriate Device
- LOA Designate Tid and Port
- LOA Verification
- BE Installation Scheduled Date: BE completion notice

### 🔄 Retryable Tasks (5 tasks)
- Get Details from MESH
- Create Uni in ASRI
- Activate UNI in ACT
- Update Uni in ASRI
- Activate Path in ACT

### 📋 Workflow Names (3 workflows)
- Monarch Onnet
- Monarch Offnet
- Colorless

### 📦 Product Names (6 products)
- DIA
- ELINE
- ELAN
- ELYNK
- IPVPN
- UNI

### ⚙️ Field Mappings
Pre-configured field mappings for common tasks including:
- Service validation fields
- Device and port assignment
- LOA designation fields
- Demarc location settings

### 🎯 Conditional Rules
Example conditional rules based on:
- **Workflow-based conditions**: Different field values for Colorless vs Monarch Onnet
- **Product-based conditions**: Different validation messages for ELINE vs UNI

## How to Use

### Method 1: Import via Backup Manager (Recommended)

1. Navigate to the **Backup** tab in AVIATOR
2. Scroll to the **Quick Start for New Users** section
3. Click **"Download Default Config"** to save the file to your computer
4. Click **"Import Default Config"** and select the downloaded file
5. The page will refresh automatically with all configurations loaded

### Method 2: Direct Import

1. Download the `default-aviator-config.json` file from the project root
2. Go to the **Backup** tab in AVIATOR
3. Click **"Import Backup File"**
4. Select the `default-aviator-config.json` file
5. Wait for the success message and page refresh

### Method 3: Manual Setup

If you prefer to customize before importing:

1. Open `default-aviator-config.json` in a text editor
2. Modify tasks, workflows, or field mappings as needed
3. Save your changes
4. Import the customized file using Method 1 or 2

## File Structure

```json
{
  "timestamp": "2026-03-02T00:00:00.000Z",
  "version": "1.0.0",
  "devices": [],
  "customAttributes": {
    "itentialWorkflows": [...],
    "productNames": [...]
  },
  "taskConfig": {
    "completableTasks": [...],
    "retryableTasks": [...],
    "taskFieldMappings": {...},
    "conditionalRules": {...},
    "taskSequencing": {}
  }
}
```

## Customization Tips

### Adding More Workflows

Edit the `customAttributes.itentialWorkflows` array:

```json
"itentialWorkflows": [
  "Monarch Onnet",
  "Monarch Offnet",
  "Colorless",
  "Your Custom Workflow"
]
```

### Adding More Product Names

Edit the `customAttributes.productNames` array:

```json
"productNames": [
  "DIA",
  "ELINE",
  "ELAN",
  "ELYNK",
  "IPVPN",
  "UNI",
  "Your Custom Product"
]
```

### Adding Custom Field Mappings

Add new tasks to `taskConfig.taskFieldMappings`:

```json
"Your Task Name": {
  "Field Name*": "Field Value",
  "Another Field": "{{customPlaceholder}}"
}
```

### Adding Conditional Rules

Add rules to `taskConfig.conditionalRules`:

```json
"Your Task Name": [
  {
    "id": "your-unique-id",
    "conditionType": "workflow",
    "conditionValue": "Monarch Onnet",
    "fields": [
      {
        "fieldName": "Field Name",
        "fieldValue": "Value for Onnet",
        "fieldType": "text"
      }
    ]
  }
]
```

## What Happens After Import

1. **Workflow Names**: Available in dropdown for order form
2. **Product Names**: Available in dropdown for order form
3. **Task Configurations**: Automatically applied to matching tasks
4. **Conditional Rules**: Evaluated based on workflow/product selection
5. **Field Mappings**: Auto-filled when tasks are processed

## Backup and Safety

- ✅ All changes are backed up automatically every 5 minutes
- ✅ You can export your customized configuration anytime
- ✅ Data is preserved in browser localStorage
- ✅ Import does not delete existing data - it merges/updates it

## Troubleshooting

### Import Failed
- Ensure the JSON file is valid (use a JSON validator)
- Check that the file structure matches the expected format
- Try clearing browser cache and retrying

### Missing Data After Import
- Check browser console for errors
- Verify the file contains the expected data
- Try refreshing the page

### Can't Find Default Config File
- The file is located in the project root: `/default-aviator-config.json`
- Access it via: `http://localhost:3000/default-aviator-config.json`
- Or download from the Backup Manager interface

## Advanced Usage

### Creating Custom Templates

1. Configure AVIATOR with your desired settings
2. Export the configuration from Backup Manager
3. Save as a template (e.g., `my-template.json`)
4. Share with team members for consistent setup

### Version Control

- Keep different config versions for different environments
- Name files descriptively: `config-test1.json`, `config-production.json`
- Store in version control (Git) for team collaboration

### Merging Configurations

The import process intelligently merges data:
- New tasks are added
- Existing tasks are updated
- Arrays (workflows, products) are replaced
- No data is deleted unless explicitly conflicting

## Support

For issues or questions:
- Check the main README.md
- Review the documentation in `/docs/`
- Enable console logging for debugging
- Verify data in browser localStorage

## Related Documentation

- [Data Backup Guide](docs/DATA_BACKUP_GUIDE.md)
- [Field Mapping Guide](docs/FIELD_MAPPING_GUIDE.md)
- [Conditional Rules Guide](docs/CONDITIONAL_RULES_GUIDE.md)
- [Quick Start Guide](docs/QUICKSTART.md)
