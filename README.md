# Hotel Management System with Firebase

A modern hotel management system built with React, TypeScript, Firebase, and Tailwind CSS. Features separate admin and receptionist dashboards with full CRUD operations.

## Features

### Admin Features
- Dashboard with comprehensive statistics
- Manage receptionists (Create, Read, Update, Delete)
- Manage rooms (Create, Read, Update, Delete)
- Manage bookings (Create, Read, Update, Delete)
- View all system data

### Receptionist Features
- Dashboard with daily statistics
- Manage bookings (Create, Read, Update, Delete)
- View available rooms
- Check-in/Check-out management

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Firebase (Authentication, Firestore)
- **UI**: Tailwind CSS, Shadcn/ui components
- **State Management**: React Query
- **Routing**: React Router v6

## Project Structure

```
src/
├── config/
│   └── firebase.ts              # Firebase configuration
├── contexts/
│   └── FirebaseAuthContext.tsx  # Authentication context
├── hooks/
│   ├── useReceptionists.ts      # Receptionist CRUD operations
│   ├── useRooms.ts              # Room CRUD operations
│   ├── useBookings.ts           # Booking CRUD operations
│   ├── useAdminStats.ts         # Admin statistics
│   └── useReceptionistStats.ts  # Receptionist statistics
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── ManageReceptionists.tsx
│   │   ├── ManageRooms.tsx
│   │   └── (bookings shared)
│   ├── receptionist/
│   │   ├── ReceptionistDashboard.tsx
│   │   └── ManageBookings.tsx
│   └── Login.tsx
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── MobileNav.tsx
│   └── ui/                      # Shadcn components
└── types/
    └── firebase.ts              # TypeScript types
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

#### A. Firebase Console Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Your project ID: `hotel-system-70a44`

#### B. Enable Authentication

1. Navigate to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication

#### C. Create Firestore Database

1. Go to **Firestore Database** > **Create database**
2. Choose **production mode** or **test mode** (for development)
3. Select your preferred location

#### D. Set Firestore Security Rules

Go to **Firestore Database** > **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow update, delete: if request.auth != null && 
                            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /rooms/{roomId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && 
                            (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
                             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'receptionist');
      allow delete: if request.auth != null && 
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 3. Create Admin User

#### Step 1: Create Authentication User

1. Go to **Authentication** > **Users** > **Add user**
2. Email: `izmashaikh7681@gmail.com`
3. Password: `123456`
4. **Copy the generated UID** (you'll need this in the next step)

#### Step 2: Create Firestore User Document

1. Go to **Firestore Database**
2. Click **Start collection**
3. Collection ID: `users`
4. Document ID: **[Paste the UID from Step 1]**
5. Add these fields:
   - `email` (string): `izmashaikh7681@gmail.com`
   - `name` (string): `Admin User`
   - `role` (string): `admin`
   - `createdAt` (timestamp): [Click "Set to current time"]

### 4. Run the Application

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### 5. Login

Use the admin credentials:
- **Email**: `izmashaikh7681@gmail.com`
- **Password**: `123456`

## Usage Guide

### Admin Workflow

1. **Login** as admin
2. **Add Receptionists**: Navigate to "Receptionists" and create new receptionist accounts
3. **Add Rooms**: Navigate to "Rooms" and add hotel rooms with details
4. **View Bookings**: Monitor all bookings across the system
5. **Dashboard**: View comprehensive statistics

### Receptionist Workflow

1. **Login** with receptionist credentials (created by admin)
2. **Create Bookings**: Navigate to "Bookings" and create new reservations
3. **Manage Bookings**: Update booking status (pending → confirmed → checked-in → checked-out)
4. **Dashboard**: View daily check-ins and check-outs

## Firestore Collections

### users
```typescript
{
  id: string
  email: string
  name: string
  role: 'admin' | 'receptionist'
  createdAt: timestamp
  createdBy?: string
}
```

### rooms
```typescript
{
  id: string
  roomNumber: string
  type: string
  price: number
  status: 'available' | 'occupied' | 'maintenance'
  floor: number
  amenities: string[]
  createdAt: timestamp
  updatedAt: timestamp
}
```

### bookings
```typescript
{
  id: string
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

## Key Features

### CRUD Operations
- All entities (Receptionists, Rooms, Bookings) support full CRUD operations
- Real-time data updates using Firestore
- Automatic state reload after operations

### Role-Based Access Control
- Admin: Full access to all features
- Receptionist: Limited to booking management

### Responsive Design
- Desktop: Full sidebar navigation
- Mobile: Bottom navigation bar
- Optimized for all screen sizes

### State Management
- Custom hooks for data fetching and mutations
- Automatic refetch after CRUD operations
- Loading states and error handling

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Environment Variables

The Firebase configuration is already set in `src/config/firebase.ts`. No additional environment variables needed.

## Troubleshooting

### Authentication Issues
- Ensure Email/Password authentication is enabled in Firebase Console
- Verify the admin user exists in both Authentication and Firestore

### Permission Denied Errors
- Check Firestore security rules are properly configured
- Ensure the user document has the correct `role` field

### Data Not Loading
- Verify Firestore collections are created
- Check browser console for errors
- Ensure Firebase configuration is correct

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
