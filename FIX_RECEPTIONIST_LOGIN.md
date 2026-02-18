# 🔧 Fix: Receptionist Can't Login

## The Problem

After creating a receptionist, they can't login and see "Invalid credentials" error.

---

## 🔍 Diagnose the Issue

### Step 1: Check Browser Console

1. Open browser console (F12)
2. Go to Console tab
3. Try logging in as receptionist
4. Look for error messages

**What to look for:**
- `Firebase Authentication successful` - Auth worked
- `Firestore document exists: false` - Document missing!
- `User document not found` - This is the problem

### Step 2: Use Diagnostic Tools

Visit these pages to diagnose:

**Test Firebase Connection:**
```
http://localhost:5173/test-firebase
```

**Check User Document:**
```
http://localhost:5173/check-user
```
- Get UID from Firebase Console → Authentication
- Paste UID to check if Firestore document exists

---

## 🎯 Common Causes & Solutions

### Cause 1: Firestore Document Not Created

**Symptoms:**
- Console shows: "User document not found"
- User exists in Authentication but not Firestore

**Solution:**
Manually create the Firestore document:

1. **Get the UID:**
   - Firebase Console → Authentication → Users
   - Find receptionist's email
   - Copy their UID

2. **Create Firestore Document:**
   - Firebase Console → Firestore Database
   - Go to `users` collection
   - Click "Add document"
   - Document ID: [Paste the UID]
   - Add fields:
     ```
     email: receptionist@email.com (string)
     name: Receptionist Name (string)
     role: receptionist (string)
     createdAt: [Click "Set to current time"] (timestamp)
     ```
   - Click "Save"

3. **Try Login Again:**
   - Should work now! ✅

---

### Cause 2: Wrong Password

**Symptoms:**
- Console shows: "auth/invalid-credential" or "auth/wrong-password"
- Firestore document exists

**Solution:**
1. **Verify Password:**
   - Make sure you're using the exact password you set
   - Passwords are case-sensitive
   - Check for extra spaces

2. **Reset Password:**
   - Delete receptionist from Firebase Console
   - Create again with new password
   - Or use Firebase password reset

---

### Cause 3: UID Mismatch

**Symptoms:**
- User exists in both Authentication and Firestore
- But still can't login

**Solution:**
1. **Check UID Match:**
   - Firebase Console → Authentication → Get UID
   - Firebase Console → Firestore → users → Check document ID
   - They MUST be the same!

2. **Fix Mismatch:**
   - Delete wrong Firestore document
   - Create new one with correct UID (from Authentication)

---

## ✅ Step-by-Step Fix

### Fix Method 1: Recreate Receptionist

1. **Delete from Authentication:**
   - Firebase Console → Authentication → Users
   - Find receptionist
   - Click three dots → Delete user

2. **Delete from Firestore:**
   - Firebase Console → Firestore → users
   - Find receptionist document
   - Delete it

3. **Create Again:**
   - Login as admin
   - Go to Receptionists page
   - Add receptionist again
   - Use same or different credentials

4. **Verify:**
   - Check Authentication (user exists)
   - Check Firestore (document exists with same UID)
   - Try login

---

### Fix Method 2: Manual Firestore Document

If receptionist exists in Authentication but not Firestore:

1. **Get UID from Authentication:**
   ```
   Firebase Console → Authentication → Users
   Find: receptionist@email.com
   Copy: UID (e.g., abc123xyz456)
   ```

2. **Create Firestore Document:**
   ```
   Firebase Console → Firestore Database → users collection
   Click: "Add document"
   Document ID: abc123xyz456 (paste UID)
   
   Fields:
   - email: receptionist@email.com
   - name: Receptionist Name
   - role: receptionist
   - createdAt: [current timestamp]
   ```

3. **Save and Test:**
   - Click "Save"
   - Try logging in
   - Should work! ✅

---

## 🧪 Verify the Fix

### Check 1: Firebase Console

**Authentication:**
```
✓ User exists with receptionist email
✓ UID is visible
```

**Firestore:**
```
✓ Document exists in users collection
✓ Document ID matches UID from Authentication
✓ Has field: role = "receptionist"
✓ Has field: email = receptionist's email
```

### Check 2: Diagnostic Page

Visit: `http://localhost:5173/check-user`

1. Get UID from Firebase Console
2. Paste into diagnostic page
3. Click "Check User"
4. Should show: "User Found!" ✅

### Check 3: Login Test

1. Go to login page
2. Enter receptionist email
3. Enter receptionist password
4. Click "Sign In"
5. Should redirect to `/receptionist/dashboard` ✅

---

## 📊 Debugging Checklist

Before trying to login, verify:

- [ ] Receptionist exists in Firebase Authentication
- [ ] Receptionist document exists in Firestore users collection
- [ ] Document ID in Firestore matches UID in Authentication
- [ ] Document has `role: "receptionist"`
- [ ] Document has correct email
- [ ] You're using the correct password
- [ ] No typos in email or password
- [ ] Browser console shows no errors

---

## 🔍 Advanced Debugging

### Check Firestore Rules

If you see "permission-denied" errors:

1. Go to Firestore Database → Rules
2. Make sure rules allow reading users:
   ```javascript
   match /users/{userId} {
     allow read: if request.auth != null;
   }
   ```

### Check Network

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try logging in
4. Look for failed requests
5. Check response messages

### Check Auth State

Add this to browser console after login attempt:
```javascript
firebase.auth().currentUser
```

Should show user object if authenticated.

---

## 💡 Prevention

To avoid this issue in the future:

1. **Always verify after creating:**
   - Check Authentication
   - Check Firestore
   - Test login immediately

2. **Use diagnostic tools:**
   - Run `/test-firebase` before creating users
   - Use `/check-user` after creating users

3. **Keep credentials:**
   - Write down email and password
   - Test immediately after creation

---

## 🆘 Still Not Working?

### Collect Information

1. **UID from Authentication:**
   - Firebase Console → Authentication → Users
   - Copy UID

2. **Check Firestore:**
   - Firebase Console → Firestore → users
   - Does document with this UID exist?

3. **Browser Console Errors:**
   - Open console (F12)
   - Try login
   - Copy error messages

4. **Test with Diagnostic:**
   - Visit `/check-user`
   - Enter UID
   - What does it show?

### Common Error Messages

**"User data not found in database"**
- Solution: Create Firestore document manually

**"auth/invalid-credential"**
- Solution: Check password, might be wrong

**"auth/user-not-found"**
- Solution: User doesn't exist in Authentication

**"permission-denied"**
- Solution: Check Firestore security rules

---

## ✅ Success Indicators

After fixing, you should see:

1. **In Firebase Console:**
   - ✅ User in Authentication
   - ✅ Document in Firestore with matching UID
   - ✅ Role field = "receptionist"

2. **In Browser Console:**
   - ✅ "Firebase Authentication successful"
   - ✅ "Firestore document exists: true"
   - ✅ "User data: {role: 'receptionist', ...}"

3. **After Login:**
   - ✅ Redirected to `/receptionist/dashboard`
   - ✅ See receptionist navigation
   - ✅ Can access bookings

---

## 📝 Quick Reference

### Get UID
```
Firebase Console → Authentication → Users → [Find user] → Copy UID
```

### Check Firestore Document
```
Firebase Console → Firestore → users → [Find document with UID]
```

### Create Firestore Document
```
Firestore → users → Add document
ID: [UID from Authentication]
Fields: email, name, role, createdAt
```

### Test Login
```
1. Open browser console (F12)
2. Go to login page
3. Enter credentials
4. Watch console for errors
```

---

**Most login issues are caused by missing or mismatched Firestore documents. Check Firebase Console first!**
