# Hotel Management System - Complete Guide

## 🏨 System Overview

A professional, role-based hotel management system with real-time room status updates, comprehensive billing, and financial analytics.

## 👥 User Roles

### 1. Admin (Full Access)
- Dashboard with real-time statistics
- Room management (view only - auto-managed)
- Booking management (create, view, check-in, check-out, cancel)
- Billing & invoices
- Financial reports & analytics
- Expense management
- Customer history tracking
- Receptionist management

### 2. Receptionist (Limited Access)
- Dashboard (view only)
- Rooms (view only)
- Bookings (create & view)
- Billing (generate invoices only)
- ❌ Cannot access: Reports, Expenses, Customer Management

## 🚀 Getting Started

### Step 1: Initial Setup

1. **Login as Admin**
   - Use your admin credentials to log in

2. **Initialize Rooms**
   - Navigate to: `/admin/setup-rooms`
   - Click "Initialize 17 Rooms"
   - This creates:
     - Rooms 1-10: Single (₹1000/night)
     - Rooms 11-17: Double (₹1500/night)

### Step 2: System Features

## 📊 Admin Panel Modules

### 1️⃣ Dashboard
**Real-time Statistics:**
- Total Rooms / Occupied / Available / Reserved
- Today's Check-ins / Check-outs
- Occupancy Rate
- Revenue (Today / Monthly / Yearly)
- Recent Bookings

**Auto-updates:** Dashboard refreshes automatically based on booking data

### 2️⃣ Rooms Module
**Features:**
- Shows all 17 rooms in grid layout
- Color-coded status indicators:
  - 🟢 Green = Available
  - 🔴 Red = Occupied
  - 🟡 Yellow = Reserved
- Auto-refresh every 30 seconds
- Room status changes automatically based on booking dates

**Important:** Room status is READ-ONLY and managed automatically by the system

### 3️⃣ Bookings Module
**Tabs:**
- All Bookings
- Check-in Ready (Today's check-ins)
- Check-out Ready (Today's check-outs)

**Booking Form Fields:**
- Customer Name (Required)
- Second Person Name (Only for Double rooms)
- Customer Email (Required)
- Customer Phone Number (Required - Unique Identifier)
- Aadhar Card Number (Required)
- Check-in Date (Required)
- Check-out Date (Required)
- Number of Adults
- Base Amount (Auto-calculated)
- Payment Mode (GPay / Cash)
- Advance Payment (Optional)

**System Logic:**
- ✅ Prevents double booking
- ✅ Shows only available rooms for selected dates
- ✅ Auto-calculates bill with 5% GST
- ✅ Auto marks room as occupied on check-in
- ✅ Auto marks room as available after check-out
- ✅ Deducts advance from final bill

### 4️⃣ Billing Module
**Features:**
- View all invoices
- Search by customer name, room number, or phone
- Revenue statistics:
  - Total Revenue
  - Total Invoices
  - Advance Collected
  - Amount Pending

**Invoice Details:**
- Hotel information
- Customer details
- Stay duration
- Room charges breakdown
- GST (5%)
- Advance payment
- Remaining amount
- Payment mode

**Actions:**
- Generate professional invoice
- Download as PDF (print functionality)

### 5️⃣ Reports Module (Finance Analytics)
**Financial Dashboard:**
- Total Revenue (Daily / Monthly / Yearly)
- Total Bookings
- Income Breakdown:
  - GPay Income
  - Cash Income
- Total Expenses
- Net Profit = Total Income - Total Expenses

**Clickable Reports:**
- Click "Income" → Shows detailed transaction list with:
  - Room Number
  - Payment Mode (GPay/Cash)
  - Customer Name
  - Amount
  - Date

**Analytics:**
- Revenue by Room Type
- Occupancy Statistics
- Payment Mode Distribution

### 6️⃣ Expense Management Module
**Features:**
- Add Expense Form:
  - Expense Title
  - Amount
  - Category (Maintenance, Staff, Utility, Other)
  - Date
  - Notes

**Financial Tracking:**
- Daily Expense
- Monthly Expense
- Yearly Expense
- Total expense summary
- Category-wise breakdown

### 7️⃣ Customers Module (History Tracking)
**Search System:**
- Search by Phone Number, Name, or Email
- Shows complete stay history:
  - Customer Name
  - Room Number
  - Check-in Date
  - Check-out Date
  - Room Rate Given
  - Total Bill Paid
  - Payment Mode
  - Booking Status

**Customer Insights:**
- Total Bookings
- Total Spent
- VIP Badge (5+ bookings)
- Last Booking Date

**Acts as a customer lifetime record system**

## 🧑‍💻 Receptionist Panel

### Access Permissions:
✅ **Can Access:**
- Dashboard (View Only)
- Rooms (View Only)
- Bookings (Create + View)
- Billing (Generate Invoice Only)

❌ **Restrictions:**
- Cannot Edit Rooms
- Cannot Delete Data
- Cannot Access Reports
- Cannot Access Expense Module
- Cannot Modify Financial Data

## 🧠 Advanced System Logic

### Automatic Room Status Management
```
1. Room becomes "Reserved" when booking is confirmed for future date
2. Room becomes "Occupied" on check-in date
3. Room becomes "Available" on check-out date
4. Status updates happen automatically - no manual intervention needed
```

### Booking Conflict Prevention
```
1. System checks date overlaps before allowing booking
2. Only available rooms shown in booking form
3. Real-time availability calculation
4. Prevents double booking automatically
```

### Billing Calculation
```
Base Amount = Room Price × Number of Nights
GST Amount = Base Amount × 5%
Total Amount = Base Amount + GST Amount
Remaining Amount = Total Amount - Advance Payment
```

## 🎨 UI/UX Features

- Professional hotel dashboard design
- Card-based layout
- Smooth animations and transitions
- Status badges for rooms & bookings
- Clean tables with filters & search
- Export buttons (PDF for invoices & reports)
- Responsive design (Desktop + Tablet friendly)
- Auto-refresh for real-time updates

## 📱 Navigation

### Admin Sidebar:
1. Dashboard
2. Rooms
3. Bookings
4. Billing
5. Reports
6. Expenses
7. Customers
8. Receptionists

### Receptionist Sidebar:
1. Dashboard
2. View Rooms
3. Bookings
4. Billing

## 🔐 Security Features

- Role-based authentication
- Protected routes
- Secure Firebase integration
- Phone number as unique customer identifier
- Aadhar verification

## 📊 Data Management

### All data is stored dynamically in Firebase:
- Users (Admin, Receptionist, Customer)
- Rooms (17 rooms with auto-status)
- Bookings (with full details)
- Expenses (categorized)
- Payments (tracked by mode)

### No static values - everything is database-driven

## 🎯 Workflow Example

### Creating a Booking:
1. Admin/Receptionist goes to Bookings
2. Clicks "New Booking"
3. Selects check-in and check-out dates
4. System shows only available rooms
5. Selects room (auto-calculates price)
6. Enters customer details
7. Enters payment details
8. System calculates GST and total
9. Creates booking
10. Room status automatically updates

### Check-in Process:
1. Go to "Check-in Ready" tab
2. Find today's check-in
3. Click "Check In"
4. Room status changes to "Occupied"

### Check-out Process:
1. Go to "Check-out Ready" tab
2. Find today's check-out
3. Click "Check Out"
4. Room status changes to "Available"
5. Generate final invoice

## 🛠️ Technical Stack

- **Frontend:** React + TypeScript + Vite
- **UI:** Shadcn/ui + Tailwind CSS
- **Backend:** Firebase (Firestore + Auth)
- **State Management:** React Query
- **Date Handling:** date-fns
- **Routing:** React Router
- **Forms:** React Hook Form
- **Notifications:** Sonner

## 📝 Important Notes

1. **Room Status:** Never manually edit room status - it's auto-managed
2. **Phone Number:** Used as unique customer identifier
3. **GST:** Always 5% - automatically calculated
4. **Advance Payment:** Optional but recommended
5. **Date Conflicts:** System prevents overlapping bookings
6. **Real-time Updates:** Dashboard and rooms auto-refresh
7. **Invoice Generation:** Available for all confirmed bookings
8. **Customer History:** Searchable by phone number

## 🚨 Troubleshooting

### Room not showing as available?
- Check if there's an active booking
- Verify check-out date has passed
- Refresh the page

### Cannot create booking?
- Ensure dates don't overlap with existing bookings
- Check if room is available for selected dates
- Verify all required fields are filled

### Invoice not generating?
- Ensure booking status is confirmed/checked-in/checked-out
- Check if customer details are complete

## 📞 Support

For any issues or questions, contact the system administrator.

---

**System Version:** 2.0
**Last Updated:** February 2026
**Optimized for:** Real hotel workflow
