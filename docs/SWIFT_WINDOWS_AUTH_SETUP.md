# Windows Authentication Setup for Swift APIs

## ✅ Setup Complete!The Windows authentication proxy is now configured and ready to use.

## 📝 How to Configure Your Password:

### **Step 1: Create `.env.local` file**
1. In the root of your project (`C:\Users\ad06465\AVIATOR`), create a file named `.env.local`
2. Or copy the example: `copy .env.local.example .env.local`

### **Step 2: Add Your Windows Password**
Open `.env.local` and add this line:
```
SWIFT_API_PASSWORD=your_actual_windows_password
```

Replace `your_actual_windows_password` with your real Windows password.

### **Step 3: Restart the Development Server**
1. Stop the current server (Ctrl+C in the PowerShell terminal)
2. Restart it: `npm run dev`

## 🧪 Test the Endpoint:

Once configured, test it in your browser:
```
http://localhost:3000/api/swift/test/orderpackage/556179137?env=Test%201
```

### **Expected Results:**

**✅ SUCCESS (if password is correct):**
```json
{
  "success": true,
  "status": 200,
  "data": { ...order package data... },
  "message": "Windows authentication successful!",
  "auth": "CTL\\AD06465"
}
```

**❌ NO PASSWORD CONFIGURED:**
```json
{
  "success": false,
  "error": "Configuration Required",
  "help": {
    "step1": "Create a file named .env.local in the project root",
    "step2": "Add this line: SWIFT_API_PASSWORD=your_windows_password",
    "step3": "Restart the development server"
  }
}
```

**❌ WRONG PASSWORD (401):**
```json
{
  "success": false,
  "status": 401,
  "error": "HTTP 401",
  "help": "Check if password is correct in .env.local"
}
```

## 🔒 Security Notes:

- `.env.local` is automatically ignored by Git (listed in `.gitignore`)
- Your password is stored locally and never committed to the repository
- The password is used server-side only (Next.js API routes)
- Detects your username (`AD06465`) and domain (`CTL`) automatically

## 🚀 Using With Other Windows-Authenticated APIs:

This same setup will work for all Windows-authenticated endpoints. Just create new proxy routes following the same pattern.

## 📊 Auto-Detected Credentials:

- **Domain**: `CTL` (from `$env:USERDOMAIN`)
- **Username**: `AD06465` (from current user)
- **Password**: From `.env.local` file
- **Workstation**: Auto-detected hostname

## 🐛 Troubleshooting:

### If you see 401 Unauthorized:
1. **Check password is correct** in `.env.local`
2. **Verify domain matches**: Should be `CTL` not `CORP`
3. **Restart the server** after changing `.env.local`
4. **Check terminal logs** for detailed error messages

### If environmentvariable isn't read:
- Make sure file is named exactly `.env.local` (not `.env.local.txt`)
- File must be in project root (`C:\Users\ad06465\AVIATOR\.env.local`)
- Restart development server after creating the file

Ready to test! 🎯
