# ✅ Receptionist Creation Verification Guide

## Current Status

Your code is **correctly implemented**. The receptionist creation flow:

1. ✅ Creates user in Firebase Authentication
2. ✅ Creates Firestore document with **same UID**
3. ✅ Sets role to **"receptionist"** (not "admin")
4. ✅ Logs out the new user
5. ✅ Allows receptionist to login
6. ✅ Redirects to receptionist dashboard

---

## 🔍 Why Role Might Show as "Admin"

If you saw `role: "admin"` in Firestore, it's because:

### Scenario 1: Created via Registration Page
- If you used `/register` page with email `izmashaikh7681@gmail.com`
- Registration automatically assigns admin role to that email
- **Solution:** Use a different email for receptionists

### Scenario 2: Old Document
- Previous test with wrong role still exists
- **Solution:** Delete and recreate

### Scenario 3: Browser Cache
- Firebase Console showing cached data
- **Solution:** Refresh the page

---

## 🎯 Correct Way to Create Receptionist

### Step 1: Login as Admin
```
URL: http://localhost:5173/login
Email: izmashaikh7681@gmail.com
Password: 123456
```

### Step 2: Navigate to Receptionists
- Click "Receptionists" in sidebar
- You should see the Manage Receptionists page

### Step 3: Add Receptionist
- Click "Add Receptionist" button
- Fill in form:
  - Name: `John Doe`
  - Email: `john@hotel.com` (NOT the admin email!)
  - Password: `password123`
- Click "Add Receptionist"

### Step 4: Verify in Console
Open browser console (F12) and look for:
```
Starting receptionist creation process...
Email: john@hotel.com
Name: John Doe
Creating user in Firebase Authentication...
User created in Authentication with UID: [some-uid]
Creating Firestore document with data: {
  email: "john@hotel.com",
  name: "John Doe",
  role: "receptionist",  ← Should be "receptionist"!
  createdAt: [timestamp],
  createdBy: [admin-uid]
}
Firestore document created successfully
Document ID: [same-uid]
Signing out newly created user...
Sign out complete
Receptionist creation complete!
```

### Step 5: Verify in Firebase Console

**Check Authentication:**
1. Go to Firebase Console
2. Authentication → Users
3. Find `john@hotel.com`
4. Copy the UID

**Check Firestore:**
1. Firestore Database → users collection
2. Find document with the UID
3. Click to open
4. Verify fields:
   ```
   email: "john@hotel.com"
   name: "John Doe"
   role: "receptionist"  ← MUST be "receptionist"
   createdAt: [timestamp]
   createdBy: [admin-uid]
   ```

---

## 🧪 Test Receptionist Login

### Step 1: Logout as Admin
- Click user menu → Sign Out

### Step 2: Login as Receptionist
```
URL: http://localhost:5173/login
Email: john@hotel.com
Password: password123
```

### Step 3: Verify Redirect
After login, you should:
- ✅ See URL: `/receptionist/dashboard`
- ✅ See title: "Receptionist Dashboard"
- ✅ See navigation: Dashboard, Bookings (only 2 items)
- ✅ See name in header: "John Doe"

### Step 4: Check Console Logs
```
Login attempt for: john@hotel.com
Attempting to sign in with email: john@hotel.com
Firebase Authentication successful, UID: [uid]
Firestore document exists: true
User data: {
  email: "john@hotel.com",
  name: "John Doe",
  role: "receptionist"  ← Should be "receptionist"
}
Auth state changed, user logged in: [uid]
User data loaded: {role: "receptionist", ...}
Redirecting to receptionist dashboard
```

---

## ⚠️ Common Mistakes

### Mistake 1: Using Admin Email
❌ **Wrong:**
```
Email: izmashaikh7681@gmail.com
```

✅ **Correct:**
```
Email: receptionist@hotel.com
Email: john@hotel.com
Email: any-other-email@domain.com
```

**Why:** The admin email is special and gets admin role automatically in registration.

### Mistake 2: Creating via Registration Page
❌ **Wrong:** Going to `/register` to create receptionist

✅ **Correct:** Admin creates receptionist via `/admin/receptionists`

**Why:** Registration page assigns customer role (or admin for special email).

### Mistake 3: Not Checking Firebase Console
❌ **Wrong:** Assuming it worked without verification

✅ **Correct:** Always verify in Firebase Console after creation

**Why:** Visual confirmation prevents issues later.

---

## 🔧 If Role is Wrong

### Quick Fix: Delete and Recreate

**Delete from Authentication:**
1. Firebase Console → Authentication → Users
2. Find the receptionist
3. Click three dots → Delete user

**Delete from Firestore:**
1. Firebase Console → Firestore → users
2. Find the document
3. Delete it

**Create Again:**
1. Login as admin
2. Go to Receptionists page
3. Add receptionist with correct details
4. Verify in Firebase Console

---

## 📊 Expected Data Structure

### In Firebase Authentication:
```
UID: abc123xyz456
Email: john@hotel.com
Provider: Email/Password
Created: [timestamp]
```

### In Firestore (users/abc123xyz456):
```json
{
  "email": "john@hotel.com",
  "name": "John Doe",
  "role": "receptionist",
  "createdAt": "2024-01-15T10:30:00Z",
  "createdBy": "admin-uid-here"
}
```

**Critical:** The document ID in Firestore MUST match the UID in Authentication!

---

## 🎯 Role Assignment Logic

The system assigns roles based on how the user is created:

| Creation Method | Email | Role Assigned |
|----------------|-------|---------------|
| Registration page | `izmashaikh7681@gmail.com` | `admin` |
| Registration page | Any other email | `customer` |
| Admin creates receptionist | Any email | `receptionist` |

**Code Reference:**
- Registration: `src/pages/Register.tsx` line 42
- Receptionist creation: `src/hooks/useReceptionists.ts` line 35

---

## ✅ Success Checklist

Before testing login, verify:

- [ ] Receptionist created via Admin panel (not registration)
- [ ] Email is NOT `izmashaikh7681@gmail.com`
- [ ] User exists in Firebase Authentication
- [ ] Document exists in Firestore users collection
- [ ] Document ID matches Authentication UID
- [ ] Document has `role: "receptionist"`
- [ ] Document has correct email and name
- [ ] Browser console shows no errors during creation

---

## 🚀 Quick Test Commands

### Test 1: Check Firebase Connection
```
Visit: http://localhost:5173/test-firebase
Click: "Run Tests"
Expected: All tests pass ✅
```

### Test 2: Check User Document
```
Visit: http://localhost:5173/check-user
Enter: UID from Firebase Console
Expected: Shows user data with role "receptionist"
```

### Test 3: Login Test
```
Visit: http://localhost:5173/login
Enter: Receptionist email and password
Expected: Redirect to /receptionist/dashboard
```

---

## 📝 Troubleshooting

### Issue: "User data not found"
**Cause:** Firestore document missing
**Fix:** Create document manually with correct UID

### Issue: "Invalid credentials"
**Cause:** Wrong password or user doesn't exist
**Fix:** Verify password, check Authentication

### Issue: Redirected to wrong dashboard
**Cause:** Role is wrong in Firestore
**Fix:** Update role field to "receptionist"

### Issue: Can't see Receptionists page
**Cause:** Not logged in as admin
**Fix:** Login with admin email

---

## 💡 Best Practices

1. **Always use unique emails** for each receptionist
2. **Never use admin email** for receptionists
3. **Verify in Firebase Console** after creation
4. **Test login immediately** after creation
5. **Keep browser console open** to see logs
6. **Use diagnostic tools** (`/test-firebase`, `/check-user`)

---

## 🎉 When Everything Works

You'll know it's working when:

1. ✅ Admin can create receptionist without errors
2. ✅ Firestore document has `role: "receptionist"`
3. ✅ Receptionist can login successfully
4. ✅ Receptionist sees their dashboard (not admin dashboard)
5. ✅ Receptionist can access Bookings page
6. ✅ Receptionist cannot access Receptionists or Rooms pages

---

## 📚 Related Documentation

- **Complete Testing Guide:** `TEST_RECEPTIONIST_FLOW.md`
- **Troubleshooting:** `FIX_RECEPTIONIST_LOGIN.md`
- **Firebase Setup:** `SIMPLIFIED_SETUP.md`
- **Quick Start:** `QUICKSTART.md`

---

## 🆘 Still Having Issues?

If you're still seeing `role: "admin"` after following this guide:

1. **Clear browser cache** and refresh Firebase Console
2. **Delete all test users** and start fresh
3. **Check the code** in `src/hooks/useReceptionists.ts` line 35
4. **Verify Firebase rules** allow writing to users collection
5. **Check browser console** for any error messages

The code is correct, so the issue is likely with existing data or testing method.

---

**Remember:** Receptionists MUST be created by admin through the Admin panel, not through the registration page!
