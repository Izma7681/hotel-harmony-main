# Hotel Management System - Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Firebase Configuration
- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Authentication enabled (Email/Password)
- [ ] Firebase config added to `.env`
- [ ] Security rules configured

### 2. Initial Setup
- [ ] Admin user created in Firebase
- [ ] Receptionist users created (if needed)
- [ ] Navigate to `/admin/setup-rooms` and initialize 17 rooms

### 3. System Verification

#### Admin Panel:
- [ ] Dashboard loads with statistics
- [ ] Rooms page shows all 17 rooms
- [ ] Can create new booking
- [ ] Booking form shows only available rooms
- [ ] Bill calculation works (Base + 5% GST)
- [ ] Invoice generation works
- [ ] Reports page shows financial data
- [ ] Expenses can be added
- [ ] Customer search works

#### Receptionist Panel:
- [ ] Dashboard loads (view only)
- [ ] Rooms page loads (view only)
- [ ] Can create bookings
- [ ] Can generate invoices
- [ ] Cannot access Reports/Expenses

### 4. Automatic Features
- [ ] Room status changes to "Reserved" for future bookings
- [ ] Room status changes to "Occupied" on check-in
- [ ] Room status changes to "Available" on check-out
- [ ] Double booking prevention works
- [ ] Date conflict detection works
- [ ] Auto-refresh works (rooms page)

### 5. Billing & Invoices
- [ ] GST calculation (5%) works
- [ ] Advance payment deduction works
- [ ] Invoice displays correctly
- [ ] PDF download/print works
- [ ] Payment mode tracking works

### 6. Reports & Analytics
- [ ] Revenue calculations correct
- [ ] Income breakdown (GPay/Cash) works
- [ ] Expense tracking works
- [ ] Net profit calculation correct
- [ ] Occupancy rate calculation correct

### 7. Customer Management
- [ ] Phone number search works
- [ ] Complete stay history displays
- [ ] VIP badge shows for 5+ bookings
- [ ] Customer details accurate

## 🔧 Configuration Files

### Required Environment Variables (.env):
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📊 Database Collections

### Required Firestore Collections:
1. **users** - User accounts (admin, receptionist, customer)
2. **rooms** - 17 hotel rooms
3. **bookings** - All booking records
4. **expenses** - Expense tracking

### Collection Structure:

#### users
```javascript
{
  id: string,
  email: string,
  name: string,
  role: 'admin' | 'receptionist' | 'customer',
  createdAt: timestamp,
  createdBy: string (optional)
}
```

#### rooms
```javascript
{
  id: string,
  roomNumber: string,
  type: 'single' | 'double',
  price: number,
  status: 'available' | 'occupied' | 'reserved',
  floor: number,
  amenities: string[],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### bookings
```javascript
{
  id: string,
  roomId: string,
  roomNumber: string,
  customerName: string,
  secondPersonName: string (optional),
  customerEmail: string,
  customerPhone: string,
  aadharNumber: string,
  checkIn: timestamp,
  checkOut: timestamp,
  numberOfAdults: number,
  baseAmount: number,
  gstAmount: number,
  totalAmount: number,
  advancePayment: number,
  remainingAmount: number,
  paymentMode: 'gpay' | 'cash',
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled',
  createdBy: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### expenses
```javascript
{
  id: string,
  title: string,
  category: 'maintenance' | 'staff' | 'utility' | 'other',
  amount: number,
  description: string,
  notes: string (optional),
  date: timestamp,
  createdBy: string,
  createdAt: timestamp
}
```

## 🚀 Deployment Steps

### 1. Build the Application
```bash
npm run build
```

### 2. Deploy to Firebase Hosting (Optional)
```bash
firebase deploy
```

### 3. Post-Deployment
1. Login as admin
2. Navigate to `/admin/setup-rooms`
3. Click "Initialize 17 Rooms"
4. Verify all rooms are created
5. Create test booking
6. Verify room status changes
7. Generate test invoice
8. Check reports

## 🔐 Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
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
      allow create: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'receptionist']);
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Expenses collection
    match /expenses/{expenseId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 📱 Testing Scenarios

### Scenario 1: New Booking
1. Login as admin/receptionist
2. Go to Bookings → New Booking
3. Select dates (e.g., today to tomorrow)
4. Verify only available rooms show
5. Select a room
6. Fill customer details
7. Add advance payment
8. Submit booking
9. Verify room status changes to "Occupied" or "Reserved"

### Scenario 2: Check-in
1. Create booking for today
2. Go to "Check-in Ready" tab
3. Click "Check In"
4. Verify room status is "Occupied"

### Scenario 3: Check-out
1. Have an active booking
2. Go to "Check-out Ready" tab
3. Click "Check Out"
4. Verify room status is "Available"
5. Generate invoice

### Scenario 4: Double Booking Prevention
1. Create booking for Room 1 (Jan 1 - Jan 5)
2. Try to create another booking for Room 1 (Jan 3 - Jan 7)
3. Verify Room 1 doesn't appear in available rooms

### Scenario 5: Customer History
1. Create multiple bookings for same phone number
2. Go to Customers page
3. Search by phone number
4. Click on customer
5. Verify all bookings show in history

## 🐛 Common Issues & Solutions

### Issue: Rooms not showing
**Solution:** Run room initialization from `/admin/setup-rooms`

### Issue: Room status not updating
**Solution:** Check booking dates and status. Refresh the page.

### Issue: Cannot create booking
**Solution:** Verify dates don't overlap with existing bookings

### Issue: Invoice not generating
**Solution:** Ensure booking status is confirmed/checked-in/checked-out

### Issue: Receptionist can access admin features
**Solution:** Check ProtectedRoute configuration and user role in database

## 📊 Performance Optimization

- [ ] Enable Firestore indexes for queries
- [ ] Implement pagination for large booking lists
- [ ] Add caching for room status
- [ ] Optimize image loading
- [ ] Enable lazy loading for routes

## 🎯 Success Criteria

✅ System is ready when:
1. All 17 rooms are initialized
2. Admin can perform all operations
3. Receptionist has limited access
4. Room status updates automatically
5. Bookings prevent conflicts
6. Invoices generate correctly
7. Reports show accurate data
8. Customer history is searchable

---

**Deployment Date:** _____________
**Deployed By:** _____________
**Version:** 2.0
