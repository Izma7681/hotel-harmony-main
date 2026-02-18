# 🔧 Troubleshooting Guide

## Registration Errors

### Error: "Registration failed. Please try again."

This is a generic error. Check the browser console (F12) for specific error details.

---

## Common Issues & Solutions

### 1. Firebase Authentication Not Enabled

**Symptoms:**
- Registration fails immediately
- Console shows: `auth/operation-not-allowed`

**Solution:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `hotel-system-70a44`
3. Click **Authentication** in left sidebar
4. Click **Sign-in method** tab
5. Find **Email/Password** in the list
6. Click on it
7. Toggle **Enable** switch to ON
8. Click **Save**

**Verify:** The Email/Password row should show "Enabled" status

---

### 2. Firestore Database Not Created

**Symptoms:**
- User created in Authentication but registration still fails
- Console shows: `firestore/unavailable` or `firestore/not-found`

**Solution:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `hotel-system-70a44`
3. Click **Firestore Database** in left sidebar
4. Click **Create database** button
5. Select **Start in test mode** (for development)
6. Click **Next**
7. Choose your location (closest to you)
8. Click **Enable**
9. Wait for database creation (30-60 seconds)

**Verify:** You should see an empty Firestore Database with "Start collection" button

---

### 3. Firestore Security Rules Blocking Writes

**Symptoms:**
- User created in Authentication
- Registration fails when creating Firestore document
- Console shows: `permission-denied` or `PERMISSION_DENIED`

**Solution:**

#### Option A: Test Mode (Quick Fix)
1. Go to **Firestore Database** → **Rules**
2. Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```
3. Click **Publish**

#### Option B: Production Rules (Recommended)
1. Go to **Firestore Database** → **Rules**
2. Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update, delete: if request.auth != null && 
                            (request.auth.uid == userId || 
                             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    match /rooms/{roomId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```
3. Click **Publish**

**Verify:** Try registering again

---

### 4. Email Already in Use

**Symptoms:**
- Error message: "Email already in use"
- Console shows: `auth/email-already-in-use`

**Solution:**

#### Option A: Login Instead
- The account already exists
- Go to login page and use existing credentials

#### Option B: Delete Existing Account
1. Go to **Firebase Console** → **Authentication** → **Users**
2. Find the user with that email
3. Click the three dots menu
4. Click **Delete user**
5. Confirm deletion
6. Also delete from **Firestore Database** → **users** collection
7. Try registering again

---

### 5. Network Error

**Symptoms:**
- Error message: "Network error"
- Console shows: `auth/network-request-failed`

**Solution:**
1. Check your internet connection
2. Check if Firebase is accessible (try opening firebase.google.com)
3. Check browser console for CORS errors
4. Try disabling browser extensions
5. Try a different browser
6. Check firewall/antivirus settings

---

### 6. Invalid API Key

**Symptoms:**
- Registration fails immediately
- Console shows: `auth/invalid-api-key`

**Solution:**
1. Check `src/config/firebase.ts`
2. Verify the `apiKey` matches your Firebase project
3. Get correct API key from Firebase Console:
   - Project Settings → General → Web API Key
4. Update the config file
5. Restart the development server

---

### 7. Project Not Found

**Symptoms:**
- Console shows: `auth/project-not-found`

**Solution:**
1. Verify project ID in `src/config/firebase.ts`
2. Should be: `hotel-system-70a44`
3. Check Firebase Console to confirm project exists
4. Make sure you're using the correct Firebase project

---

## Step-by-Step Verification

### Check 1: Firebase Console Access
```
✓ Can you access https://console.firebase.google.com/?
✓ Can you see project "hotel-system-70a44"?
✓ Can you click on the project?
```

### Check 2: Authentication Setup
```
✓ Go to Authentication section
✓ Is "Get started" button visible? (If yes, click it)
✓ Go to "Sign-in method" tab
✓ Is "Email/Password" enabled?
```

### Check 3: Firestore Setup
```
✓ Go to Firestore Database section
✓ Is "Create database" button visible? (If yes, click it)
✓ Can you see the database interface?
✓ Are there any collections visible?
```

### Check 4: Browser Console
```
✓ Open browser console (F12)
✓ Go to Console tab
✓ Try registering
✓ Look for red error messages
✓ Note the error code (e.g., auth/operation-not-allowed)
```

---

## Testing Registration

### Test with Console Logging

1. Open browser console (F12)
2. Go to Console tab
3. Try registering
4. You should see:
   ```
   Starting registration process...
   User created in Authentication: [UID]
   Assigning role: admin (or customer)
   User document created in Firestore
   ```

5. If you see an error, note the error code and message

### Verify in Firebase Console

After successful registration:

1. **Check Authentication:**
   - Go to Authentication → Users
   - Should see the new user email

2. **Check Firestore:**
   - Go to Firestore Database
   - Should see "users" collection
   - Should see a document with the user's UID
   - Document should have: email, name, role, createdAt

---

## Quick Fixes

### Reset Everything

If nothing works, try this:

1. **Delete User from Authentication:**
   - Firebase Console → Authentication → Users
   - Delete the user

2. **Delete User from Firestore:**
   - Firebase Console → Firestore Database → users
   - Delete the document

3. **Clear Browser Data:**
   - Clear cache and cookies
   - Or use incognito/private mode

4. **Restart Dev Server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

5. **Try Again:**
   - Go to registration page
   - Register with fresh data

---

## Still Having Issues?

### Collect Information

1. **Error Message:** (from toast notification)
2. **Console Error:** (from browser console)
3. **Error Code:** (e.g., auth/operation-not-allowed)
4. **Firebase Setup:**
   - Is Authentication enabled?
   - Is Firestore created?
   - What are the security rules?

### Check These Files

1. **src/config/firebase.ts** - Firebase configuration
2. **src/pages/Register.tsx** - Registration logic
3. **Browser Console** - Error messages

### Common Mistakes

- ❌ Forgot to enable Email/Password authentication
- ❌ Forgot to create Firestore database
- ❌ Using wrong Firebase project
- ❌ Firestore rules blocking writes
- ❌ Network/firewall blocking Firebase
- ❌ Browser extensions interfering

---

## Success Checklist

After fixing issues, verify:

- [ ] Can access Firebase Console
- [ ] Authentication is enabled (Email/Password)
- [ ] Firestore database is created
- [ ] Security rules allow writes
- [ ] Can register new user
- [ ] User appears in Authentication
- [ ] User document appears in Firestore
- [ ] Can login with new credentials
- [ ] Redirected to correct dashboard

---

## Contact Support

If you've tried everything and still have issues:

1. Check the error code in browser console
2. Search for the error code online
3. Check Firebase documentation
4. Check GitHub issues for similar problems

---

**Most registration issues are due to Firebase Authentication not being enabled or Firestore not being created. Double-check these first!**
