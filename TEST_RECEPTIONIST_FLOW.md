# ✅ Test Receptionist Creation & Login Flow

## Complete Testing Guide

This guide will help you verify that receptionist creation and login works correctly.

---

## 🧪 Test Scenario

1. Admin creates a receptionist
2. Receptionist data is stored in Firebase
3. Receptionist can login
4. Receptionist is redirected to their dashboard

---

## 📋 Pre-Test Checklist

Before starting, ensure:

- [ ] Firebase Authentication is enabled
- [ ] Firestore database is created
- [ ] Admin account exists and can login
- [ ] Browser console is open (F12) to see logs

---

## 🎯 Test Steps

### Step 1: Login as Admin

1. **Go to login page:**
   ```
   http://localhost:5173/login
   ```

2. **Enter admin credentials:**
   - Email: `izmashaikh7681@gmail.com`
   - Password: `123456` (or your admin password)

3. **Click "Sign In"**

4. **Verify:**
   - ✅ Redirected to `/admin/dashboard`
   - ✅ See "Admin Dashboard" title
   - ✅ See navigation: Dashboard, Receptionists, Rooms, Bookings

---

### Step 2: Create Receptionist

1. **Navigate to Receptionists:**
   - Click "Receptionists" in sidebar

2. **Click "Add Receptionist" button**

3. **Fill in the form:**
   - Name: `Test Receptionist`
   - Email: `test-receptionist@hotel.com`
   - Password: `test123456`

4. **Click "Add Receptionist"**

5. **Watch browser console for logs:**
   ```
   Starting receptionist creation process...
   Email: test-receptionist@hotel.com
   Name: Test Receptionist
   Creating user in Firebase Authentication...
   User created in Authentication with UID: [UID]
   Creating Firestore document with data: {...}
   Firestore document created successfully
   Document ID: [UID]
   Signing out newly created user...
   Sign out complete
   Receptionist creation complete!
   ```

6. **Verify:**
   - ✅ See success toast: "Receptionist added!"
   - ✅ You'll be logged out
   - ✅ Redirected to login page

---

### Step 3: Verify in Firebase Console

1. **Check Authentication:**
   - Go to Firebase Console → Authentication → Users
   - ✅ Should see: `test-receptionist@hotel.com`
   - ✅ Copy the UID for next step

2. **Check Firestore:**
   - Go to Firebase Console → Firestore Database → users
   - ✅ Should see document with the UID
   - ✅ Click on the document
   - ✅ Verify fields:
     ```
     email: "test-receptionist@hotel.com"
     name: "Test Receptionist"
     role: "receptionist"  ← MUST be "receptionist"!
     createdAt: [timestamp]
     createdBy: [admin UID]
     ```

**⚠️ IMPORTANT:** If role is NOT "receptionist", delete the document and user, then try again.

---

### Step 4: Login as Admin Again

1. **Login with admin credentials:**
   - Email: `izmashaikh7681@gmail.com`
   - Password: `123456`

2. **Go to Receptionists page**

3. **Verify:**
   - ✅ See "Test Receptionist" in the list
   - ✅ Email shows: `test-receptionist@hotel.com`

---

### Step 5: Test Receptionist Login

1. **Logout as admin:**
   - Click user menu → Sign Out

2. **Go to login page:**
   ```
   http://localhost:5173/login
   ```

3. **Enter receptionist credentials:**
   - Email: `test-receptionist@hotel.com`
   - Password: `test123456`

4. **Click "Sign In"**

5. **Watch browser console for logs:**
   ```
   Login attempt for: test-receptionist@hotel.com
   Attempting to sign in with email: test-receptionist@hotel.com
   Firebase Authentication successful, UID: [UID]
   Firestore document exists: true
   User data: {email: "...", name: "...", role: "receptionist"}
   Auth state changed, user logged in: [UID]
   User data loaded: {role: "receptionist", ...}
   Redirecting to receptionist dashboard
   ```

6. **Verify:**
   - ✅ See success toast: "Login successful"
   - ✅ Redirected to `/receptionist/dashboard`
   - ✅ See "Receptionist Dashboard" title
   - ✅ See navigation: Dashboard, Bookings (only 2 items)
   - ✅ See name in header: "Test Receptionist"
   - ✅ See role badge: "receptionist"

---

## ✅ Success Criteria

All of these must be true:

### Firebase Console
- [x] User exists in Authentication
- [x] Document exists in Firestore users collection
- [x] Document ID matches Authentication UID
- [x] Document has `role: "receptionist"`
- [x] Document has correct email and name

### Browser Console
- [x] No errors during creation
- [x] Logs show "Receptionist creation complete!"
- [x] No errors during login
- [x] Logs show "Redirecting to receptionist dashboard"

### User Interface
- [x] Receptionist appears in admin's list
- [x] Receptionist can login
- [x] Redirected to `/receptionist/dashboard`
- [x] See receptionist navigation (not admin navigation)
- [x] Can access Bookings page
- [x] Cannot access Receptionists or Rooms pages

---

## 🔍 Troubleshooting

### Issue 1: Role is "admin" instead of "receptionist"

**Cause:** Email matches admin email pattern

**Solution:**
- Use different email (not `izmashaikh7681@gmail.com`)
- Check registration logic doesn't override role

### Issue 2: "User data not found" error

**Cause:** Firestore document wasn't created

**Solution:**
1. Check browser console for errors during creation
2. Manually create Firestore document:
   - Get UID from Authentication
   - Create document in Firestore with that UID
   - Set role to "receptionist"

### Issue 3: "Invalid credentials" error

**Cause:** Wrong password or user doesn't exist

**Solution:**
- Verify password is correct
- Check user exists in Authentication
- Check Firestore document exists

### Issue 4: Redirected to wrong dashboard

**Cause:** Role is wrong in Firestore

**Solution:**
- Check Firestore document
- Verify `role: "receptionist"`
- If wrong, update the document

---

## 🧹 Cleanup After Testing

To remove test receptionist:

1. **Delete from Authentication:**
   - Firebase Console → Authentication → Users
   - Find `test-receptionist@hotel.com`
   - Click three dots → Delete user

2. **Delete from Firestore:**
   - Firebase Console → Firestore → users
   - Find document with receptionist's UID
   - Delete document

---

## 📊 Expected Console Output

### During Creation:
```
Starting receptionist creation process...
Email: test-receptionist@hotel.com
Name: Test Receptionist
Creating user in Firebase Authentication...
User created in Authentication with UID: abc123xyz456
Creating Firestore document with data: {
  email: "test-receptionist@hotel.com",
  name: "Test Receptionist",
  role: "receptionist",
  createdAt: [Date],
  createdBy: "admin-uid"
}
Firestore document created successfully
Document ID: abc123xyz456
Signing out newly created user...
Sign out complete
Receptionist creation complete!
```

### During Login:
```
Login attempt for: test-receptionist@hotel.com
Attempting to sign in with email: test-receptionist@hotel.com
Firebase Authentication successful, UID: abc123xyz456
Firestore document exists: true
User data: {
  email: "test-receptionist@hotel.com",
  name: "Test Receptionist",
  role: "receptionist",
  createdAt: [Date]
}
Auth state changed, user logged in: abc123xyz456
User data loaded: {role: "receptionist", ...}
Redirecting to receptionist dashboard
```

---

## 🎯 Quick Verification Commands

### Check if user exists in Firestore:
```
Visit: http://localhost:5173/check-user
Enter UID from Firebase Console
```

### Test Firebase connection:
```
Visit: http://localhost:5173/test-firebase
Click "Run Tests"
```

---

## ✨ Summary

If all steps pass:
- ✅ Receptionist creation works
- ✅ Data is stored correctly in Firebase
- ✅ Receptionist can login
- ✅ Automatic redirect to correct dashboard
- ✅ Role-based access control works

**The system is working correctly! 🎉**

---

## 📝 Notes

- Admin gets logged out after creating receptionist (Firebase limitation)
- This is normal and expected behavior
- Admin just needs to login again
- Receptionist can then login with their credentials
- Each role sees only their authorized pages

---

**Follow this guide step-by-step to ensure everything works correctly!**
