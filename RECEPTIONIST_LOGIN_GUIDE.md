# 👥 Receptionist Login Guide

## How It Works

When an admin creates a receptionist account, the system:
1. ✅ Creates user in Firebase Authentication
2. ✅ Creates user document in Firestore with role "receptionist"
3. ✅ Uses the same UID for both (ensures they match)
4. ⚠️ Logs out the admin (Firebase limitation)
5. ✅ Receptionist can now login with their credentials

---

## For Admins: Creating Receptionist Accounts

### Step 1: Login as Admin
```
Email: izmashaikh7681@gmail.com
Password: [your admin password]
```

### Step 2: Navigate to Receptionists
```
Admin Dashboard → Receptionists (in sidebar)
```

### Step 3: Add Receptionist
```
1. Click "Add Receptionist" button
2. Fill in:
   - Name: Receptionist's full name
   - Email: Their email address
   - Password: Their login password (min 6 characters)
3. Click "Add Receptionist"
```

### Step 4: You'll Be Logged Out
```
⚠️ Important: After creating a receptionist, you will be logged out.
This is a Firebase security feature.

What happens:
1. Receptionist account is created
2. You're automatically logged out
3. You'll be redirected to login page
4. Login again with your admin credentials
```

### Step 5: Verify Creation
```
1. Login again as admin
2. Go to Receptionists page
3. You should see the new receptionist in the list
```

---

## For Receptionists: First Login

### Step 1: Get Credentials
```
Your admin will provide:
- Email: [your email]
- Password: [your password]
```

### Step 2: Login
```
1. Go to: http://localhost:5173/login
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to: /receptionist/dashboard
```

### Step 3: Verify Access
```
You should see:
✅ Receptionist Dashboard
✅ Navigation: Dashboard, Bookings
✅ Your name in the header
✅ Role badge showing "receptionist"
```

---

## Receptionist Features

### What Receptionists Can Do
- ✅ View receptionist dashboard
- ✅ Create bookings
- ✅ Edit bookings
- ✅ Delete bookings
- ✅ View daily statistics
- ✅ View available rooms

### What Receptionists Cannot Do
- ❌ Create other receptionists
- ❌ Manage rooms
- ❌ Access admin features
- ❌ View admin dashboard
- ❌ Delete users

---

## Technical Details

### How Authentication Works

**When Admin Creates Receptionist:**
```typescript
1. createUserWithEmailAndPassword(email, password)
   → Creates user in Firebase Authentication
   
2. setDoc(doc(db, 'users', uid), {...})
   → Creates Firestore document with same UID
   → Sets role: 'receptionist'
   
3. signOut()
   → Logs out current user (admin)
   → This is required by Firebase
```

**When Receptionist Logs In:**
```typescript
1. signInWithEmailAndPassword(email, password)
   → Authenticates with Firebase
   
2. getDoc(doc(db, 'users', uid))
   → Fetches user document from Firestore
   → Gets role: 'receptionist'
   
3. Redirect to /receptionist/dashboard
   → Based on role from Firestore
```

### Why Admin Gets Logged Out

Firebase Authentication only allows one user to be logged in at a time in the same browser session. When you create a new user with `createUserWithEmailAndPassword`, Firebase automatically logs in that new user, which logs out the current user (admin).

**Solutions:**
1. ✅ **Current Implementation**: Sign out the new user immediately, admin logs back in
2. ⚠️ **Alternative**: Use Firebase Admin SDK on backend (more complex)
3. ⚠️ **Alternative**: Use Firebase Cloud Functions (requires setup)

---

## Troubleshooting

### Receptionist Can't Login

**Problem:** "Invalid credentials" error

**Solutions:**
1. **Verify email and password**
   - Check for typos
   - Email is case-sensitive
   - Password must match exactly

2. **Check Firebase Console**
   - Go to Authentication → Users
   - Verify receptionist email exists
   - Check if account is enabled

3. **Check Firestore**
   - Go to Firestore Database → users
   - Find document with receptionist's UID
   - Verify role is "receptionist"

### Receptionist Sees Wrong Dashboard

**Problem:** Redirected to wrong page after login

**Solutions:**
1. **Check Firestore role**
   - Document should have: `role: "receptionist"`
   - Not "admin" or "customer"

2. **Clear browser cache**
   - Ctrl+Shift+Delete
   - Clear cookies and cache
   - Try again

3. **Logout and login again**
   - Sometimes auth state gets cached

### Admin Can't Create Receptionist

**Problem:** Error when creating receptionist

**Common Errors:**

**"Email already in use"**
- Solution: Email is already registered
- Check Firebase Authentication → Users
- Delete existing user or use different email

**"Permission denied"**
- Solution: Firestore rules blocking write
- Check Firestore rules allow user creation
- Admin should have permission to create users

**"Weak password"**
- Solution: Password must be at least 6 characters
- Use stronger password

---

## Best Practices

### For Admins

1. **Use Strong Passwords**
   - Min 8 characters
   - Mix of letters, numbers, symbols
   - Don't use common passwords

2. **Keep Track of Credentials**
   - Write down receptionist credentials
   - Give them to the receptionist securely
   - Don't share via insecure channels

3. **Verify Creation**
   - After creating, login again
   - Check receptionist appears in list
   - Test receptionist login

### For Receptionists

1. **Change Password**
   - After first login, consider changing password
   - Use Firebase password reset if needed

2. **Keep Credentials Secure**
   - Don't share your password
   - Don't write it down in public places
   - Use password manager if possible

3. **Logout When Done**
   - Always logout after your shift
   - Especially on shared computers

---

## Password Management

### Receptionist Wants to Change Password

**Option 1: Firebase Password Reset**
1. Go to login page
2. Click "Forgot password" (if implemented)
3. Enter email
4. Follow reset link in email

**Option 2: Admin Creates New Account**
1. Admin deletes old receptionist
2. Admin creates new receptionist with new password
3. Receptionist logs in with new credentials

**Note:** Password updates for existing users require Firebase Admin SDK or password reset flow.

---

## Security Notes

### Why This Approach is Secure

1. **Firebase Authentication**
   - Industry-standard security
   - Passwords are hashed
   - Secure token-based auth

2. **Role-Based Access**
   - Roles stored in Firestore
   - Protected routes check roles
   - Can't access unauthorized pages

3. **Firestore Security Rules**
   - Server-side validation
   - Prevents unauthorized access
   - Even if client is compromised

### What's Protected

- ✅ Passwords are never stored in plain text
- ✅ Passwords are hashed by Firebase
- ✅ Auth tokens expire automatically
- ✅ Role-based access control
- ✅ Firestore rules enforce permissions

---

## Testing

### Test Receptionist Login

1. **Create Test Receptionist**
   ```
   Name: Test Receptionist
   Email: test-receptionist@hotel.com
   Password: test123456
   ```

2. **Logout as Admin**
   ```
   Click user menu → Sign Out
   ```

3. **Login as Receptionist**
   ```
   Email: test-receptionist@hotel.com
   Password: test123456
   ```

4. **Verify Access**
   ```
   ✅ Should see receptionist dashboard
   ✅ Should see "Bookings" in navigation
   ✅ Should NOT see "Receptionists" or "Rooms"
   ```

5. **Test Features**
   ```
   ✅ Can create bookings
   ✅ Can edit bookings
   ✅ Can view statistics
   ```

---

## Summary

### Key Points

1. ✅ **Admin creates receptionist** with email and password
2. ⚠️ **Admin gets logged out** after creation (Firebase limitation)
3. ✅ **Admin logs back in** with their credentials
4. ✅ **Receptionist can login** with provided credentials
5. ✅ **Receptionist sees their dashboard** with limited access

### Workflow

```
Admin → Create Receptionist → Logged Out → Login Again → Done
                                    ↓
                          Receptionist Can Login
```

---

**The system is now fully functional for both admin and receptionist logins! 🎉**
