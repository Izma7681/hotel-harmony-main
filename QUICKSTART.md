# Quick Start Guide

## 🚀 Get Started in 3 Minutes (Simplified!)

### Step 1: Install Dependencies (1 min)
```bash
npm install
```

### Step 2: Firebase Setup (1 min)

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Your Project**: `hotel-system-70a44` (already configured)

#### Enable Authentication
- Go to **Authentication** → **Sign-in method**
- Enable **Email/Password**

#### Create Firestore Database
- Go to **Firestore Database** → **Create database**
- Choose **Test mode** (for quick setup)
- Click **Next** → **Enable**

**That's it for Firebase! No manual user creation needed!**

### Step 3: Run & Register (1 min)

#### Run the App
```bash
npm run dev
```

#### Create Admin Account
1. Open: http://localhost:5173/register
2. Register with:
   - Name: Your Name
   - Email: `izmashaikh7681@gmail.com`
   - Password: `123456` (or your choice)
3. Click "Create Account"
4. Login with same credentials

## ✅ You're Done!

The admin account is automatically created with full privileges!

### What You Can Do Now:

**As Admin:**
1. Add receptionists (Receptionists page)
2. Add rooms (Rooms page)
3. Create bookings (Bookings page)
4. View statistics (Dashboard)

**Test Receptionist Access:**
1. Create a receptionist account from admin panel
2. Logout
3. Login with receptionist credentials
4. Manage bookings

## 📝 Firestore Security Rules (Optional - for production)

If you chose "Test mode", your rules will expire in 30 days. For production, update rules:

**Firestore Database** → **Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
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

## 🎯 Key Features

- ✅ Separate Admin & Receptionist dashboards
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Real-time data updates
- ✅ Automatic state reload
- ✅ Role-based access control
- ✅ Responsive design (mobile & desktop)

## 🆘 Need Help?

**Can't login?**
- Make sure you created both the Auth user AND Firestore document
- Check that the UID matches in both places
- Verify the role is set to "admin"

**Permission denied?**
- Use "Test mode" for Firestore (easier for development)
- Check that Authentication is enabled

**Data not showing?**
- Open browser console (F12) to see errors
- Verify Firebase config in `src/config/firebase.ts`

## 📱 Demo Credentials

**Admin:**
- Email: `izmashaikh7681@gmail.com`
- Password: `123456`

**Receptionist:**
- Create from admin panel after logging in

---

**That's it! You're ready to manage your hotel! 🏨**
