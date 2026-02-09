# 🚀 Quick Start: Conditional Rules Configuration

## Your Specific Use Case

### Task: "Verify or Assign Appropriate Device"

---

## ✅ Configuration Steps

### Step 1: Open Rules Manager
```
1. Go to "📝 Task Configuration" tab
2. Find "Verify or Assign Appropriate Device"
3. Click "🔀 Rules" button
```

---

### Step 2: Add Monarch Onnet Rule

**Condition:**
- Type: `Workflow Type`
- Value: `Monarch Onnet`

**Fields to Add:**

**Field 1:**
```
Type: 📋 Dropdown
Field Name: Fallout Action
Label: Enter Port Data
Value: Enter Port Data
```

**Field 2:**
```
Type: 📝 Text
Field Name: Device
Value: {{preferredDevice}}
```

**Field 3:**
```
Type: 📝 Text
Field Name: Port
Value: {{preferredPort}}
```

Click: **✓ Save Conditional Rule**

---

### Step 3: Add Colorless Rule

**Condition:**
- Type: `Workflow Type`
- Value: `Colorless`

**Fields to Add:**

**Field 1:**
```
Type: 📋 Dropdown
Field Name: Fallout Action
Label: Create Cap Jeop
Value: Create Cap Jeop
```

Click: **✓ Save Conditional Rule**

---

## 🎯 How It Works

### When Workflow = "Monarch Onnet"
```
✓ Fallout Action → "Enter Port Data" 
✓ Device → LAB4COZWZG001 (your selected device)
✓ Port → TenGigabitEthernet0/0/1 (your selected port)
```

### When Workflow = "Colorless"
```
✓ Fallout Action → "Create Cap Jeop"
```

---

## 📝 Copy-Paste Values

For quick configuration, copy these exact values:

**Monarch Onnet - Fallout Action Field:**
```
Fallout Action
```

**Monarch Onnet - Device Field:**
```
Device
```

**Monarch Onnet - Port Field:**
```
Port
```

**Colorless - Fallout Action Field:**
```
Fallout Action
```

---

## ✨ Benefits

✅ No code changes needed  
✅ Easy to modify in UI  
✅ Works immediately  
✅ Backed up automatically  
✅ Can test different workflows  

---

## 🔍 Verification

After configuration, test it:

1. Select **Monarch Onnet** workflow
2. Choose device and port
3. Start automation
4. Check task - should use **"Enter Port Data"**

Then:

1. Select **Colorless** workflow  
2. Start automation
3. Check task - should use **"Create Cap Jeop"**

---

## 📞 Need Help?

- See full guide: `CONDITIONAL_RULES_GUIDE.md`
- Check examples in UI
- Rules are saved automatically
- Export/import for backup

**Done!** 🎉
