# AVIATOR - Quick Start Guide (Post-Improvements)

## 🚀 Getting Started

### 1. Installation

Simply run the batch file:
```bash
launch-aviator.bat
```

This will:
- ✅ Check Node.js and npm
- ✅ Install all dependencies (including new testing libraries)
- ✅ Launch the development server

### 2. First Time Setup

1. Copy environment file:
```bash
copy .env.example .env.local
```

2. Configure your settings in `.env.local` (optional)

3. Launch application:
```bash
npm run dev
```

## 📁 New Project Structure

```
AVIATOR/
├── src/
│   ├── features/           # ⭐ NEW: Feature-based organization
│   │   ├── orders/         # Order management
│   │   ├── tasks/          # Task processing
│   │   └── config/         # Configuration
│   ├── core/               # ⭐ NEW: Core functionality
│   │   ├── constants/      # Centralized constants
│   │   ├── config/         # App configuration
│   │   └── providers/      # Context providers
│   ├── services/           # ⭐ NEW: Application services
│   │   ├── logging/        # Centralized logging
│   │   └── api/            # API services
│   ├── shared/             # ⭐ NEW: Shared components & utils
│   ├── components/         # ✓ Existing components (still work)
│   ├── lib/                # ✓ Existing libraries (still work)
│   └── types/              # ✓ Type definitions
├── backend/                # ⭐ NEW: Optional backend API
└── tests/                  # ⭐ NEW: Test infrastructure
```

## 🎯 What Changed & Why

### ✅ All Existing Functionality Still Works!

**Important**: Your existing code continues to work. The improvements are **additive**.

### What's New:

1. **Better Organization** 📦
   - Code organized by features instead of file types
   - Easier to find and maintain code

2. **State Management** 🔄
   - No more props drilling
   - Use React Contexts for global state

3. **Professional Logging** 📊
   - Structured logging with levels
   - Easy debugging and monitoring

4. **Error Handling** 🛡️
   - App won't crash on errors
   - User-friendly error messages

5. **Testing Ready** ✅
   - Unit tests with Vitest
   - Component tests with Testing Library
   - Run: `npm test`

6. **Backend Ready** 🖥️
   - Optional backend for heavy processing
   - Job queue support
   - Database integration ready

## 🔧 Using New Features

### 1. Using Contexts (No More Props Drilling)

**Before**:
```typescript
function ParentComponent() {
  const [tasks, setTasks] = useState([]);
  return <ChildComponent tasks={tasks} setTasks={setTasks} />;
}

function ChildComponent({ tasks, setTasks }: Props) {
  // Use tasks
}
```

**After**:
```typescript
import { useTaskContext } from '@/features/tasks/context/TaskContext';

function ChildComponent() {
  const { tasks, setTasks } = useTaskContext();
  // Use tasks - no props needed!
}
```

### 2. Using Logger

**Before**:
```typescript
console.log('Task completed:', taskId);
```

**After**:
```typescript
import { logger } from '@/services/logging';

logger.info('Task completed', { 
  taskId,
  orderId,
  duration: 1234
});

// View logs in browser console:
// logger.getLogs()
// logger.downloadLogs()
```

### 3. Using Constants

**Before**:
```typescript
if (task.status === 'ready') { }  // Magic string
```

**After**:
```typescript
import { TASK_STATUSES } from '@/core/constants';

if (task.status === TASK_STATUSES.READY) { }  // Type-safe!
```

### 4. Error Boundaries (Automatic)

Already enabled! If any component crashes, users see a friendly error page instead of blank screen.

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Watch mode (re-run on changes)
npm run test:watch

# Coverage report
npm run test:coverage

# Visual UI
npm run test:ui
```

## 📝 Adding New Task Types (Simplified)

### Step 1: Add to Constants
```typescript
// src/core/constants/tasks.ts
export const TASK_NAMES = {
  // existing tasks...
  MY_NEW_TASK: 'My New Task Name',
} as const;

export const DEFAULT_COMPLETABLE_TASKS = [
  // existing...
  TASK_NAMES.MY_NEW_TASK,
] as const;
```

### Step 2: Add Field Mappings (if needed)
```typescript
// src/lib/taskConfig.ts
taskFieldMappings: {
  'My New Task Name': {
    'fieldName': 'value',
  },
}
```

### Step 3: Done! 🎉

The system will automatically:
- Process the task
- Apply field mappings
- Handle retries
- Log everything

## 🐛 Debugging

### View Logs in Browser Console

```javascript
// Open browser console (F12)
import { logger } from '@/services/logging';

// View all logs
logger.getLogs()

// Filter by level
logger.getLogs(LogLevel.ERROR)

// Download logs
logger.downloadLogs()

// Change log level
logger.setLogLevel(LogLevel.DEBUG)
```

### Check Task Context State

```javascript
// In any component with DevTools
const { tasks, processingStatus } = useTaskContext();
console.log('Current tasks:', tasks);
console.log('Processing:', processingStatus);
```

## 🔄 Migrating Existing Code (Optional)

You don't have to migrate everything immediately. Here's how to gradually adopt new patterns:

### Option 1: Keep Using Old Way ✅
```typescript
// This still works fine!
import { flightDeckApiService } from '../lib/api';
```

### Option 2: Use New Imports 🆕
```typescript
// Cleaner, but optional
import { flightDeckApiService } from '@/services/api';
```

### Option 3: Use Contexts 🚀
```typescript
// Best practice, but no rush
import { useTaskContext } from '@/features/tasks/context/TaskContext';
```

## 📚 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed architecture guide
- **[README.md](README.md)** - Original project documentation
- **[backend/README.md](backend/README.md)** - Backend API documentation

## 🎓 Learning Resources

### For Team Members New to:

**React Context**:
- [React Context API](https://react.dev/learn/passing-data-deeply-with-context)

**Testing**:
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)

**TypeScript**:
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

## 🚨 Common Issues

### Issue: Import errors after update
**Solution**: Run `npm install` to get new dependencies

### Issue: TypeScript errors
**Solution**: The project uses strict mode. This catches more bugs! Fix the type errors.

### Issue: Tests failing
**Solution**: Run `npm install` first. Tests need new dependencies.

### Issue: Old code not working
**Solution**: All old code should work. If not, check import paths use `@/` prefix.

## ⚙️ Configuration

### App Settings
Edit `.env.local`:
```bash
NEXT_PUBLIC_LOG_LEVEL=1          # 0=DEBUG, 1=INFO, 2=WARN
NEXT_PUBLIC_FEATURE_AUTO_RETRY=true
NEXT_PUBLIC_DEFAULT_ENVIRONMENT=Test 1
```

### Task Configuration
Use the Task Configuration tab in the UI (automatically saved).

## 🎯 Next Steps

1. ✅ Run `launch-aviator.bat`
2. ✅ Explore the new structure
3. ✅ Try using contexts in new components
4. ✅ Add tests for critical features
5. ✅ Enable advanced logging
6. ⏳ Consider backend for heavy processing
7. ⏳ Set up CI/CD pipeline

## 💡 Tips

1. **Use the logger**: It's much better than console.log
2. **Write tests**: They save time in the long run
3. **Use contexts**: No more props drilling
4. **Check ARCHITECTURE.md**: Detailed technical info
5. **Start small**: Gradually adopt new patterns

## 🆘 Need Help?

1. Check [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
2. Look at example test files in `src/test/`
3. Check browser console for logger output
4. Download logs with `logger.downloadLogs()`

## Summary

**The Good News**: 
- ✅ Everything still works
- ✅ New features are optional
- ✅ Better organized
- ✅ Production-ready
- ✅ Easy to extend

**The Better News**:
- 🚀 Adding new tasks is now easier
- 🔍 Debugging is simpler with logging
- 🛡️ App is more stable with error boundaries
- ✅ Tests ensure quality
- 📈 Ready for growth

**Just run `launch-aviator.bat` and you're good to go!** 🎉
