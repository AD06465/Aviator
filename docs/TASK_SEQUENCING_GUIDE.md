# Task Sequencing & Dependencies Guide

## 🎯 Overview

Task Sequencing allows you to control the **order** and **dependencies** of task processing in AVIATOR. This ensures tasks complete in the right sequence, even when multiple tasks are ready simultaneously.

---

## 🚀 Key Features

### 1. **Priority-Based Ordering**
- Assign numeric priorities to tasks (1 = highest priority)
- Lower number = processed first
- Tasks without priority use default ordering

### 2. **Task Dependencies**
- Define which tasks must complete before others can start
- Example: "Complete Task B only after Task A finishes"
- Multiple dependencies supported

### 3. **Blocking/Wait Flags**
- Mark critical tasks to pause all other processing
- Useful for gates/checkpoints in workflows
- Processing resumes once blocking task completes

### 4. **Completion Delays**
- Add cooldown periods after specific tasks
- Useful for API rate limiting or system settling time
- Specified in seconds

---

## 📋 Configuration Format

Add a `taskSequencing` section to your config JSON:

```json
{
  "completableTasks": [...],
  "retryableTasks": [...],
  "taskFieldMappings": {...},
  "conditionalRules": {...},
  "taskSequencing": {
    "BE Installation Scheduled Date: BE completion notice": {
      "priority": 1,
      "waitForCompletion": true,
      "delayAfter": 60
    },
    "Confirm/Schedule Activation": {
      "priority": 2,
      "dependsOn": ["BE Installation Scheduled Date: BE completion notice"]
    },
    "Service Validate - UNI (Tester)": {
      "priority": 3,
      "dependsOn": ["Confirm/Schedule Activation"],
      "delayAfter": 30
    }
  }
}
```

---

## 🔧 Configuration Properties

### `priority` (optional)
- **Type:** Number (1-999)
- **Default:** 999 (lowest priority)
- **Description:** Determines processing order. Lower = higher priority.
- **Example:** 
  ```json
  "priority": 1  // Highest priority
  "priority": 10 // Lower priority
  ```

### `dependsOn` (optional)
- **Type:** Array of task names
- **Default:** Empty (no dependencies)
- **Description:** Task will only process after ALL listed tasks complete.
- **Example:**
  ```json
  "dependsOn": [
    "Get Details from MESH",
    "Create Uni in ASRI"
  ]
  ```

### `waitForCompletion` (optional)
- **Type:** Boolean
- **Default:** false
- **Description:** Blocks ALL other task processing until this task completes.
- **Use Case:** Critical checkpoint tasks, approvals, gates
- **Example:**
  ```json
  "waitForCompletion": true  // Block everything else
  ```

### `delayAfter` (optional)
- **Type:** Number (seconds)
- **Default:** 0 (no delay)
- **Description:** Pause processing for N seconds after this task completes.
- **Use Case:** API rate limits, system settling, external validations
- **Example:**
  ```json
  "delayAfter": 60  // Wait 1 minute after completion
  ```

---

## 💡 Common Use Cases

### **Use Case 1: Simple Priority Ordering**

Complete critical validation tasks before others:

```json
"taskSequencing": {
  "Service Validate Field": {
    "priority": 1
  },
  "Service Validate - UNI (Tester)": {
    "priority": 2
  },
  "Service Validate Ethernet": {
    "priority": 3
  }
}
```

**Result:** Tasks complete in order 1 → 2 → 3

---

### **Use Case 2: Sequential Dependencies**

Create a chain where each task depends on the previous:

```json
"taskSequencing": {
  "Get Details from MESH": {
    "priority": 1
  },
  "Create Uni in ASRI": {
    "priority": 2,
    "dependsOn": ["Get Details from MESH"]
  },
  "Activate UNI in ACT": {
    "priority": 3,
    "dependsOn": ["Create Uni in ASRI"]
  }
}
```

**Result:** Linear execution: MESH → ASRI → ACT

---

### **Use Case 3: Critical Checkpoint (Blocking)**

Wait for BE Installation before proceeding:

```json
"taskSequencing": {
  "BE Installation Scheduled Date: BE completion notice": {
    "priority": 1,
    "waitForCompletion": true,
    "delayAfter": 120
  },
  "Confirm/Schedule Activation": {
    "priority": 2,
    "dependsOn": ["BE Installation Scheduled Date: BE completion notice"]
  }
}
```

**Result:** 
1. BE Installation starts
2. All other tasks pause (waitForCompletion)
3. After BE Installation completes, wait 120 seconds
4. Resume processing with Confirm/Schedule Activation

---

### **Use Case 4: Parallel Processing with Gate**

Process multiple validations in parallel, then wait for activation:

```json
"taskSequencing": {
  "Service Validate Field": {
    "priority": 1
  },
  "Service Validate - UNI (Tester)": {
    "priority": 1
  },
  "Service Validate Ethernet": {
    "priority": 1
  },
  "Confirm/Schedule Activation": {
    "priority": 2,
    "dependsOn": [
      "Service Validate Field",
      "Service Validate - UNI (Tester)",
      "Service Validate Ethernet"
    ],
    "waitForCompletion": true
  }
}
```

**Result:**
1. All 3 validations process simultaneously (same priority)
2. After ALL validations complete → Confirm/Schedule Activation
3. All other tasks pause until activation finishes

---

## 📊 Processing Logic

AVIATOR processes tasks using this flow:

```
1. Fetch all tasks from FlightDeck
   ↓
2. Filter tasks by status (Ready/Assigned/Created)
   ↓
3. Check if waiting for blocking task → Skip if still waiting
   ↓
4. Filter tasks where dependencies are met
   ↓
5. Sort remaining tasks by priority (ascending)
   ↓
6. Process tasks in order:
   ├─ Complete task
   ├─ Check if blocking → Pause if needed
   └─ Apply delay → Wait if configured
   ↓
7. Repeat every polling interval
```

---

## ⚠️ Important Notes

### **Circular Dependencies**
❌ Don't create circular dependencies:
```json
"Task A": {
  "dependsOn": ["Task B"]
},
"Task B": {
  "dependsOn": ["Task A"]  // ❌ Circular! Both will never run
}
```

### **Priority Ties**
When multiple tasks have the same priority:
- Tasks process in FlightDeck API order
- For deterministic ordering, use unique priorities

### **Blocking Task Strategy**
Use `waitForCompletion` sparingly:
- Pauses ALL processing
- Only for critical checkpoints
- Can slow overall throughput

### **Dependency Chain Length**
Keep dependency chains reasonable:
- ✅ 2-4 levels: Good
- ⚠️ 5-7 levels: Caution
- ❌ 8+ levels: Refactor workflow

---

## 🎨 UI Features

The Task Sequencing Manager provides:

1. **Visual Rule Editor**
   - Dropdown task selection
   - Number inputs for priority/delay
   - Checkbox for wait flag
   - Multi-select for dependencies

2. **Active Rules Table**
   - See all configured rules at a glance
   - Edit or remove existing rules
   - Color-coded tags for dependencies

3. **Inline Help**
   - Tooltip explanations
   - Usage examples
   - Best practice hints

---

## 🧪 Testing Your Configuration

### **Test Strategy:**

1. **Start Simple**
   ```json
   "Task A": { "priority": 1 },
   "Task B": { "priority": 2 }
   ```

2. **Add Dependencies**
   ```json
   "Task B": {
     "priority": 2,
     "dependsOn": ["Task A"]
   }
   ```

3. **Test Blocking (Optional)**
   ```json
   "Task A": {
     "priority": 1,
     "waitForCompletion": true
   }
   ```

4. **Add Delays (If Needed)**
   ```json
   "Task A": {
     "priority": 1,
     "delayAfter": 30
   }
   ```

### **Monitor Console Logs:**

Look for these indicators:
```
✅ Task dependencies met
⏸️ Task waiting for dependencies: [Task A, Task B]
⏸️ Blocking task "X" requires waiting
⏳ Waiting 60 seconds after "X" completion
```

---

## 📝 Example: Complete Monarch Workflow

```json
{
  "taskSequencing": {
    "Get Details from MESH": {
      "priority": 1
    },
    "Create Uni in ASRI": {
      "priority": 2,
      "dependsOn": ["Get Details from MESH"],
      "delayAfter": 15
    },
    "Verify or Assign Appropriate Device": {
      "priority": 3,
      "dependsOn": ["Create Uni in ASRI"]
    },
    "LOA Designate Tid and Port": {
      "priority": 4,
      "dependsOn": ["Verify or Assign Appropriate Device"]
    },
    "Service Validate - UNI (Tester)": {
      "priority": 5,
      "dependsOn": ["LOA Designate Tid and Port"]
    },
    "BE Installation Scheduled Date: BE completion notice": {
      "priority": 6,
      "dependsOn": ["Service Validate - UNI (Tester)"],
      "waitForCompletion": true,
      "delayAfter": 120
    },
    "Confirm/Schedule Activation": {
      "priority": 7,
      "dependsOn": ["BE Installation Scheduled Date: BE completion notice"]
    },
    "Send Completion Details": {
      "priority": 8,
      "dependsOn": ["Confirm/Schedule Activation"]
    }
  }
}
```

**Execution Flow:**
1. MESH → 2. ASRI (+15s) → 3. Device → 4. LOA → 5. Validate → 
6. BE Installation (BLOCKS, +120s) → 7. Activation → 8. Completion

---

## 🚀 Quick Start

1. **Open Task Configuration Tab**
2. **Expand "Task Sequencing & Dependencies"**
3. **Click on a task** to add rules
4. **Set priority** (optional)
5. **Add dependencies** (optional)
6. **Enable blocking** (optional)
7. **Set delay** (optional)
8. **Save Rule**
9. **Start processing** and monitor console logs

---

## 🆘 Troubleshooting

### **Task Not Processing**
- Check if dependencies are met (console shows waiting message)
- Verify task is in completableTasks list
- Ensure no circular dependencies

### **Tasks Process in Wrong Order**
- Check priority values (lower = first)
- Ensure priorities are unique for strict ordering
- Verify dependencies are correctly spelled

### **Processing Stuck**
- Check for blocking tasks that haven't completed
- Verify dependent tasks exist and can complete
- Review console for "waiting for" messages

---

## 📚 Related Documentation

- [Task Configuration Table Guide](./TASK_CONFIG_TABLE_GUIDE.md)
- [Conditional Rules Guide](./CONDITIONAL_RULES_GUIDE.md)
- [Field Mapping Guide](./FIELD_MAPPING_GUIDE.md)

---

**Need Help?** Check console logs for detailed sequencing information! 🔍
