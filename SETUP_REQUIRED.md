# 🚨 Important: First Time Setup Required

## TypeScript Errors? Don't Panic! 👍

If you see TypeScript errors for:
- `vitest/config`
- `@testing-library/react`
- `express`
- `winston`

**This is NORMAL** ✅ - These are new dependencies that need to be installed.

## Quick Fix (30 seconds)

### Option 1: Use the Batch File (Easiest)
```bash
launch-aviator.bat
```
This automatically installs everything!

### Option 2: Manual Install
```bash
npm install
```

## What Happens During Install

The install will add these new packages:
- **Testing**: `vitest`, `@testing-library/react`, `jsdom`
- **Backend** (optional): `express`, `winston`, `cors`

## After Install

✅ All TypeScript errors will disappear  
✅ Application will work perfectly  
✅ Tests will be runnable  
✅ Everything will be green  

## Already Installed?

If you've already run the install and still see errors:
1. Close and reopen VS Code
2. Run: `npm install` again
3. Restart TypeScript server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

## Don't Want Testing/Backend?

**Frontend works without them!** The errors are only in:
- `src/test/` - Test files (won't affect your app)
- `backend/` - Optional backend (separate project)

Your main application in `src/app/`, `src/components/`, and `src/lib/` works perfectly!

---

**TL;DR**: Run `launch-aviator.bat` and everything will work! 🚀
