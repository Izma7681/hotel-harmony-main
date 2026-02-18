# Firebase Setup Instructions

## 1. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Your project is already configured with ID: `hotel-system-70a44`

## 2. Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication

## 3. Create Firestore Database

1. Go to **Firestore Database** > **Create database**
2. Start in **production mode** or **test mode** (for development)
3. Choose your preferred location

## 4. Firestore Security Rules

Add these rules in **Firestore Database** > **Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow update, delete: if request.auth != null && 
                            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Rooms collection
    match /rooms/{roomId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && 
                            (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
                             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'receptionist');
      allow delete: if request.auth != null && 
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Expenses collection
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null && 
                          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 5. Create Admin User

### Option A: Using Firebase Console
1. Go to **Authentication** > **Users** > **Add user**
2. Email: `izmashaikh7681@gmail.com`
3. Password: `123456`
4. Copy the generated UID

### Option B: Using Firebase CLI
```bash
firebase auth:import users.json
```

## 6. Add Admin User Document to Firestore

1. Go to **Firestore Database** > **Start collection**
2. Collection ID: `users`
3. Document ID: [Use the UID from step 5]
4. Add fields:
   - `email` (string): `izmashaikh7681@gmail.com`
   - `name` (string): `Admin User`
   - `role` (string): `admin`
   - `createdAt` (timestamp): [Current date/time]

## 7. Run the Application

```bash
npm install
npm run dev
```

## 8. Login

Use the admin credentials:
- Email: `izmashaikh7681@gmail.com`
- Password: `123456`

## Collections Structure

### users
```
{
  id: string (auto-generated)
  email: string
  name: string
  role: 'admin' | 'receptionist'
  createdAt: timestamp
  createdBy: string (optional)
}
```

### rooms
```
{
  id: string (auto-generated)
  roomNumber: string
  type: string
  price: number
  status: 'available' | 'occupied' | 'maintenance'
  floor: number
  amenities: array
  createdAt: timestamp
  updatedAt: timestamp
}
```

### bookings
```
{
  id: string (auto-generated)
  roomId: string
  roomNumber: string
  guestName: string
  guestEmail: string
  guestPhone: string
  checkIn: timestamp
  checkOut: timestamp
  totalAmount: number
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled'
  createdBy: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

### expenses
```
{
  id: string (auto-generated)
  category: string
  amount: number
  description: string
  date: timestamp
  createdBy: string
  createdAt: timestamp
}
```
