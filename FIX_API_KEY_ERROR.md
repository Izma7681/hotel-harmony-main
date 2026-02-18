# 🔴 FIX: API Key Error

## Error You're Seeing

```
Error: auth/api-key-not-valid.-please-pass-a-valid-api-key
```

## ⚡ Quick Fix (2 minutes)

### Step 1: Open Firebase Console
```
1. Go to: https://console.firebase.google.com/
2. Click on project: hotel-system-70a44
```

### Step 2: Get Your Config
```
1. Click gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. You'll see a code snippet with firebaseConfig
```

### Step 3: Copy the Config
Look for this section and copy everything inside `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "AIza....",           // ← Copy this
  authDomain: "...",             // ← Copy this
  projectId: "...",              // ← Copy this
  storageBucket: "...",          // ← Copy this
  messagingSenderId: "...",      // ← Copy this
  appId: "...",                  // ← Copy this
  measurementId: "..."           // ← Copy this
};
```

### Step 4: Update Your File

Open `src/config/firebase.ts` and replace the config:

**Before:**
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyD6yZq7hZ_eftIAzD9tRDkgR65yoQrhN-g",  // ← Wrong key
  // ... rest of config
};
```

**After:**
```typescript
const firebaseConfig = {
  apiKey: "YOUR-ACTUAL-KEY-FROM-FIREBASE-CONSOLE",  // ← Correct key
  authDomain: "hotel-system-70a44.firebaseapp.com",
  projectId: "hotel-system-70a44",
  storageBucket: "hotel-system-70a44.firebasestorage.app",
  messagingSenderId: "364905636210",
  appId: "YOUR-ACTUAL-APP-ID",
  measurementId: "YOUR-ACTUAL-MEASUREMENT-ID"
};
```

### Step 5: Restart Server
```bash
# Stop the server (Ctrl+C in terminal)
npm run dev
```

### Step 6: Test
```
1. Go to: http://localhost:5173/register
2. Try registering again
3. Should work now! ✅
```

---

## 🎯 Visual Guide

### Where to Find Config in Firebase Console

```
Firebase Console
  └── Click gear icon (⚙️)
      └── Project settings
          └── Scroll down
              └── "Your apps" section
                  └── Web app (</> icon)
                      └── "SDK setup and configuration"
                          └── Config radio button
                              └── Copy the firebaseConfig object
```

---

## 📸 What You're Looking For

In Firebase Console, you'll see:

```javascript
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6yZq7hZ_eftIAzD9tRDkgR65yoQrhN-g",
  authDomain: "hotel-system-70a44.firebaseapp.com",
  projectId: "hotel-system-70a44",
  storageBucket: "hotel-system-70a44.firebasestorage.app",
  messagingSenderId: "364905636210",
  appId: "1:364905636210:web:bd6ec98ab7ce3f9d563deb",
  measurementId: "G-DWRX6E6T2I"
};
```

**Copy this entire object!**

---

## ⚠️ Common Mistakes

1. ❌ Copying only part of the config
2. ❌ Not restarting the dev server
3. ❌ Using config from wrong project
4. ❌ Typos when copying manually

**Solution:** Copy-paste the entire config from Firebase Console

---

## 🧪 Verify It Works

After updating:

1. **Check Console** (F12)
   - Should see: "Starting registration process..."
   - Should NOT see: "api-key-not-valid"

2. **Test Registration**
   - Go to `/register`
   - Fill in form
   - Click "Create Account"
   - Should succeed ✅

3. **Use Test Page**
   - Go to `/test-firebase`
   - Click "Run Tests"
   - All should be green ✅

---

## 🎉 Success!

After fixing the API key:
- ✅ Registration works
- ✅ Login works
- ✅ No more API key errors
- ✅ Can create admin account

---

## 💡 Why This Happened

The API key in the code was either:
1. A placeholder/example key
2. From a different Firebase project
3. Typed incorrectly
4. Outdated

**Solution:** Always get the config directly from your Firebase Console!

---

## 🔒 Security Note

The API key is safe to include in client-side code. Firebase uses:
- API key for project identification
- Security rules for access control
- Authentication for user verification

So it's okay to have the API key in your code!

---

**Fix the API key and your registration will work perfectly! 🚀**
