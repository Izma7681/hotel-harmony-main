# 🔥 Firebase Setup - Visual Step-by-Step Guide

## Step 1: Access Firebase Console

1. Open your browser and go to: **https://console.firebase.google.com/**
2. Sign in with your Google account
3. You should see your project: **hotel-system-70a44**

---

## Step 2: Enable Email/Password Authentication

### 2.1 Navigate to Authentication
```
Firebase Console
  └── Select "hotel-system-70a44" project
      └── Click "Authentication" in left sidebar
          └── Click "Get started" (if first time)
```

### 2.2 Enable Email/Password
```
Authentication page
  └── Click "Sign-in method" tab
      └── Find "Email/Password" in the list
          └── Click on it
              └── Toggle "Enable" switch to ON
                  └── Click "Save"
```

**✅ Checkpoint**: You should see "Email/Password" with status "Enabled"

---

## Step 3: Create Firestore Database

### 3.1 Navigate to Firestore
```
Firebase Console
  └── Click "Firestore Database" in left sidebar
      └── Click "Create database"
```

### 3.2 Choose Mode
```
Create database dialog
  └── Select "Start in test mode" (for development)
      └── Click "Next"
```

### 3.3 Choose Location
```
Location selection
  └── Choose closest location (e.g., "us-central")
      └── Click "Enable"
```

**⏱️ Wait**: Database creation takes 30-60 seconds

**✅ Checkpoint**: You should see an empty Firestore Database

---

## Step 4: Create Admin User in Authentication

### 4.1 Go to Authentication Users
```
Firebase Console
  └── Click "Authentication" in left sidebar
      └── Click "Users" tab
          └── Click "Add user" button
```

### 4.2 Enter Admin Credentials
```
Add user dialog
  ├── Email: izmashaikh7681@gmail.com
  ├── Password: 123456
  └── Click "Add user"
```

### 4.3 Copy the UID
```
Users list
  └── Find the user you just created
      └── Look at the "User UID" column
          └── Click the copy icon next to the UID
              └── SAVE THIS UID - you'll need it in the next step!
```

**Example UID**: `xYz123AbC456DeF789GhI012JkL345`

**✅ Checkpoint**: User appears in the list with email `izmashaikh7681@gmail.com`

---

## Step 5: Create Admin User Document in Firestore

### 5.1 Navigate to Firestore Data
```
Firebase Console
  └── Click "Firestore Database" in left sidebar
      └── Click "Data" tab (should be selected by default)
```

### 5.2 Create Users Collection
```
Firestore Database page
  └── Click "Start collection" button
      └── Collection ID: users
          └── Click "Next"
```

### 5.3 Create Admin Document
```
Add document dialog
  ├── Document ID: [PASTE THE UID YOU COPIED]
  │   Example: xYz123AbC456DeF789GhI012JkL345
  │
  └── Add fields (click "Add field" for each):
      │
      ├── Field 1:
      │   ├── Field: email
      │   ├── Type: string
      │   └── Value: izmashaikh7681@gmail.com
      │
      ├── Field 2:
      │   ├── Field: name
      │   ├── Type: string
      │   └── Value: Admin User
      │
      ├── Field 3:
      │   ├── Field: role
      │   ├── Type: string
      │   └── Value: admin
      │
      └── Field 4:
          ├── Field: createdAt
          ├── Type: timestamp
          └── Value: [Click "Set to current time"]
```

### 5.4 Save the Document
```
Click "Save" button
```

**✅ Checkpoint**: You should see the document in Firestore with all fields

---

## Step 6: Verify Your Setup

### 6.1 Check Authentication
```
Authentication → Users
  └── Should show: izmashaikh7681@gmail.com
```

### 6.2 Check Firestore
```
Firestore Database → Data → users collection
  └── Should show: 1 document with admin role
```

### 6.3 Visual Verification
```
Your Firestore should look like this:

📁 users (collection)
  └── 📄 xYz123AbC456DeF789GhI012JkL345 (document)
      ├── email: "izmashaikh7681@gmail.com"
      ├── name: "Admin User"
      ├── role: "admin"
      └── createdAt: February 18, 2026 at 10:30:00 AM UTC
```

---

## Step 7: Run the Application

### 7.1 Install Dependencies (if not done)
```bash
npm install
```

### 7.2 Start Development Server
```bash
npm run dev
```

### 7.3 Open Browser
```
URL: http://localhost:5173
```

---

## Step 8: Login

### 8.1 Enter Credentials
```
Login Page
  ├── Email: izmashaikh7681@gmail.com
  ├── Password: 123456
  └── Click "Sign In"
```

### 8.2 Success!
```
You should be redirected to: /admin/dashboard
```

---

## 🎉 You're Done!

### What You Can Do Now:

#### 1. Add a Receptionist
```
Admin Dashboard
  └── Click "Receptionists" in sidebar
      └── Click "Add Receptionist" button
          ├── Name: John Doe
          ├── Email: john@hotel.com
          ├── Password: password123
          └── Click "Add Receptionist"
```

#### 2. Add a Room
```
Admin Dashboard
  └── Click "Rooms" in sidebar
      └── Click "Add Room" button
          ├── Room Number: 101
          ├── Type: Single
          ├── Price: 100
          ├── Floor: 1
          ├── Status: Available
          ├── Amenities: WiFi, TV, AC
          └── Click "Add Room"
```

#### 3. Create a Booking
```
Admin Dashboard
  └── Click "Bookings" in sidebar
      └── Click "New Booking" button
          ├── Room: Select from dropdown
          ├── Guest Name: Jane Smith
          ├── Guest Email: jane@email.com
          ├── Guest Phone: +1234567890
          ├── Check-in: Select date
          ├── Check-out: Select date
          ├── Status: Confirmed
          └── Click "Create Booking"
```

---

## 🔍 Troubleshooting

### Problem: Can't login
**Solution**:
1. Check that both Authentication user AND Firestore document exist
2. Verify the UID matches in both places
3. Make sure the role field is set to "admin"

### Problem: "Permission denied" error
**Solution**:
1. Make sure you selected "Test mode" when creating Firestore
2. If you selected "Production mode", update the security rules (see README.md)

### Problem: Data not showing
**Solution**:
1. Open browser console (F12)
2. Look for error messages
3. Verify Firebase config in `src/config/firebase.ts`

### Problem: "Firebase not initialized"
**Solution**:
1. Make sure you ran `npm install`
2. Check that `firebase` package is in `package.json`
3. Restart the development server

---

## 📸 Visual Reference

### Firebase Console Layout
```
┌─────────────────────────────────────────────────────┐
│ Firebase Console                                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐  ┌──────────────────────────────┐│
│  │              │  │                               ││
│  │  Sidebar     │  │  Main Content Area            ││
│  │              │  │                               ││
│  │ • Project    │  │  [Your selected page content] ││
│  │ • Auth       │  │                               ││
│  │ • Firestore  │  │                               ││
│  │ • Storage    │  │                               ││
│  │ • Functions  │  │                               ││
│  │              │  │                               ││
│  └──────────────┘  └──────────────────────────────┘│
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Firestore Data Structure
```
📦 Firestore Database
 │
 ├── 📁 users (collection)
 │   └── 📄 [UID] (document)
 │       ├── email: string
 │       ├── name: string
 │       ├── role: string
 │       └── createdAt: timestamp
 │
 ├── 📁 rooms (collection)
 │   └── 📄 [auto-generated] (document)
 │       ├── roomNumber: string
 │       ├── type: string
 │       ├── price: number
 │       ├── status: string
 │       ├── floor: number
 │       ├── amenities: array
 │       ├── createdAt: timestamp
 │       └── updatedAt: timestamp
 │
 └── 📁 bookings (collection)
     └── 📄 [auto-generated] (document)
         ├── roomId: string
         ├── roomNumber: string
         ├── guestName: string
         ├── guestEmail: string
         ├── guestPhone: string
         ├── checkIn: timestamp
         ├── checkOut: timestamp
         ├── totalAmount: number
         ├── status: string
         ├── createdBy: string
         ├── createdAt: timestamp
         └── updatedAt: timestamp
```

---

## ✅ Final Checklist

Before you start using the system, make sure:

- [ ] Firebase project exists (hotel-system-70a44)
- [ ] Email/Password authentication is enabled
- [ ] Firestore database is created
- [ ] Admin user exists in Authentication
- [ ] Admin user document exists in Firestore with correct UID
- [ ] Role field is set to "admin"
- [ ] npm install completed successfully
- [ ] npm run dev starts without errors
- [ ] Can login with admin credentials
- [ ] Redirected to /admin/dashboard after login

---

**🎊 Congratulations! Your hotel management system is ready to use!**
