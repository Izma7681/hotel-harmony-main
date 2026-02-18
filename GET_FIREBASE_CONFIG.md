# 🔑 How to Get Your Firebase Configuration

## The Error

You're seeing: `auth/api-key-not-valid.-please-pass-a-valid-api-key`

This means the API key in `src/config/firebase.ts` is incorrect.

---

## ✅ Solution: Get Correct Firebase Config

### Step 1: Go to Firebase Console

1. Open: https://console.firebase.google.com/
2. Select your project: **hotel-system-70a44**

### Step 2: Get Web App Configuration

1. Click the **gear icon** (⚙️) next to "Project Overview"
2. Click **Project settings**
3. Scroll down to **Your apps** section
4. Look for the **Web app** (</> icon)
5. If you don't see a web app, click **Add app** → **Web** (</>) → Register app

### Step 3: Copy Configuration

You'll see something like this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR-ACTUAL-API-KEY",
  authDomain: "hotel-system-70a44.firebaseapp.com",
  projectId: "hotel-system-70a44",
  storageBucket: "hotel-system-70a44.firebasestorage.app",
  messagingSenderId: "364905636210",
  appId: "1:364905636210:web:YOUR-APP-ID",
  measurementId: "G-YOUR-MEASUREMENT-ID"
};
```

### Step 4: Update Your Config File

1. Open `src/config/firebase.ts`
2. Replace the entire `firebaseConfig` object with your copied config
3. Save the file
4. Restart the dev server:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

---

## 📝 Example: What Your File Should Look Like

**File: `src/config/firebase.ts`**

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR-ACTUAL-API-KEY-FROM-FIREBASE-CONSOLE",
  authDomain: "hotel-system-70a44.firebaseapp.com",
  projectId: "hotel-system-70a44",
  storageBucket: "hotel-system-70a44.firebasestorage.app",
  messagingSenderId: "364905636210",
  appId: "YOUR-ACTUAL-APP-ID-FROM-FIREBASE-CONSOLE",
  measurementId: "YOUR-ACTUAL-MEASUREMENT-ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

---

## 🎯 Quick Fix

If you can't access Firebase Console right now, try this temporary fix:

1. Go to Firebase Console
2. Project Settings → General
3. Scroll to "Your apps"
4. Copy the config
5. Paste into `src/config/firebase.ts`

---

## ⚠️ Important Notes

1. **Never share your API key publicly** (it's okay for client-side apps, but keep it in your repo)
2. **The API key must match your Firebase project**
3. **After updating, restart the dev server**
4. **Clear browser cache if issues persist**

---

## 🧪 Test After Fixing

1. Restart dev server: `npm run dev`
2. Visit: `http://localhost:5173/test-firebase`
3. Click "Run Tests"
4. All tests should pass ✅

---

## 🆘 Still Having Issues?

If you still see the API key error after updating:

1. **Double-check** you copied the entire config correctly
2. **Verify** you're using the right Firebase project
3. **Restart** the development server
4. **Clear** browser cache (Ctrl+Shift+Delete)
5. **Try** incognito/private mode

---

## ✅ Success Indicators

After fixing, you should:
- ✅ No API key errors in console
- ✅ Can register new users
- ✅ Can login successfully
- ✅ Test page shows all green checkmarks

---

**The API key error is the #1 cause of registration failures. Get the correct config from Firebase Console and you'll be good to go!**
