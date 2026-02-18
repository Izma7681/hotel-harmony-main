# 🚀 Quick Start Guide - Hotel Management System

## 📋 Prerequisites

- Node.js installed
- Firebase account
- Admin credentials

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Firebase
1. Create `.env` file in root directory
2. Add your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Initialize System
1. **Login** with admin credentials
2. **Navigate** to `/admin/setup-rooms`
3. **Click** "Initialize 17 Rooms"
4. **Wait** for success message

### Step 5: Start Using!
✅ System is ready! You can now:
- View all 17 rooms
- Create bookings
- Generate invoices
- Track expenses
- View reports

## 🎯 First Booking

1. Go to **Bookings** → Click **"New Booking"**
2. Select **Check-in** and **Check-out** dates
3. Choose an **available room**
4. Fill **customer details**:
   - Name
   - Email
   - Phone (unique identifier)
   - Aadhar number
5. Enter **payment details**:
   - Payment mode (GPay/Cash)
   - Advance payment (optional)
6. Click **"Create Booking"**

✅ Room status will automatically update!

## 📊 View Dashboard

Navigate to **Dashboard** to see:
- Total/Occupied/Available rooms
- Today's check-ins/check-outs
- Revenue statistics
- Recent bookings

## 💰 Generate Invoice

1. Go to **Billing**
2. Find the booking
3. Click **"Invoice"**
4. Click **"Download PDF"** to print

## 👥 Add Receptionist

1. Go to **Receptionists**
2. Click **"Add Receptionist"**
3. Fill details and submit
4. Share credentials with receptionist

## 🔐 Login Credentials

### Admin
- Email: (your admin email)
- Password: (your admin password)

### Receptionist
- Created by admin
- Limited access (no reports/expenses)

## 📱 Navigation

### Admin Menu:
1. Dashboard
2. Rooms
3. Bookings
4. Billing
5. Reports
6. Expenses
7. Customers
8. Receptionists

### Receptionist Menu:
1. Dashboard (View Only)
2. View Rooms (View Only)
3. Bookings (Create & View)
4. Billing (Generate Only)

## 🎨 Room Status Colors

- 🟢 **Green** = Available (can be booked)
- 🔴 **Red** = Occupied (guest checked in)
- 🟡 **Yellow** = Reserved (future booking)

## 💡 Pro Tips

### Automatic Features:
- ✅ Room status updates automatically
- ✅ No manual status editing needed
- ✅ Double booking prevented
- ✅ GST calculated automatically (5%)
- ✅ Dashboard refreshes in real-time

### Best Practices:
1. **Always use phone number** for customer identification
2. **Take advance payment** to secure bookings
3. **Check-in guests** on arrival day
4. **Check-out guests** on departure day
5. **Generate invoice** before check-out

### Search Features:
- **Customers**: Search by phone, name, or email
- **Billing**: Search by customer name, room, or phone
- **Bookings**: Filter by status (All/Check-in/Check-out)

## 🔄 Daily Workflow

### Morning:
1. Check **"Check-in Ready"** tab
2. Prepare rooms for arriving guests
3. Check-in guests as they arrive

### Evening:
1. Check **"Check-out Ready"** tab
2. Generate invoices for departing guests
3. Check-out guests
4. Verify room status updated to "Available"

### Anytime:
- Create new bookings
- View room availability
- Generate invoices
- Track expenses
- View reports

## 📊 Reports & Analytics

### View Financial Data:
1. Go to **Reports**
2. Select period (Today/Month/Year)
3. View:
   - Total revenue
   - Income breakdown (GPay/Cash)
   - Expenses
   - Net profit
   - Occupancy rate

### Click for Details:
- Click **"Total Revenue"** → See all transactions
- Click **"Total Expenses"** → See expense list

## 🛠️ Troubleshooting

### Room not available?
- Check if there's an active booking
- Verify dates don't overlap
- Refresh the page

### Cannot create booking?
- Ensure dates are valid
- Check room availability
- Verify all required fields filled

### Invoice not showing?
- Booking must be confirmed/checked-in/checked-out
- Cannot generate for cancelled bookings

## 📞 Need Help?

Refer to:
- **HOTEL_SYSTEM_GUIDE.md** - Complete documentation
- **DEPLOYMENT_CHECKLIST.md** - Setup verification
- **SYSTEM_SUMMARY.md** - Technical details

## 🎉 You're All Set!

Your hotel management system is ready to use. Start by creating your first booking and watch the magic happen!

---

**Happy Managing! 🏨**
