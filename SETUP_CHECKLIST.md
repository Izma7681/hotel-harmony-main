# 📋 Setup Checklist

Use this checklist to ensure your hotel management system is properly configured.

## ✅ Pre-Setup

- [ ] Node.js installed (v16 or higher)
- [ ] npm or yarn installed
- [ ] Google account for Firebase
- [ ] Code editor (VS Code recommended)
- [ ] Git installed (optional)

---

## 🔥 Firebase Console Setup

### Authentication
- [ ] Opened Firebase Console (https://console.firebase.google.com/)
- [ ] Selected project: `hotel-system-70a44`
- [ ] Navigated to Authentication section
- [ ] Clicked "Get started" (if first time)
- [ ] Enabled Email/Password sign-in method
- [ ] Verified "Email/Password" shows as "Enabled"

### Firestore Database
- [ ] Navigated to Firestore Database section
- [ ] Clicked "Create database"
- [ ] Selected "Test mode" (for development)
- [ ] Chose database location
- [ ] Clicked "Enable"
- [ ] Waited for database creation to complete
- [ ] Verified empty database is visible

### Admin User - Authentication
- [ ] Navigated to Authentication > Users
- [ ] Clicked "Add user"
- [ ] Entered email: `izmashaikh7681@gmail.com`
- [ ] Entered password: `123456`
- [ ] Clicked "Add user"
- [ ] Copied the generated UID
- [ ] Saved UID for next step

### Admin User - Firestore Document
- [ ] Navigated to Firestore Database
- [ ] Clicked "Start collection"
- [ ] Entered collection ID: `users`
- [ ] Clicked "Next"
- [ ] Pasted UID as Document ID
- [ ] Added field: `email` (string) = `izmashaikh7681@gmail.com`
- [ ] Added field: `name` (string) = `Admin User`
- [ ] Added field: `role` (string) = `admin`
- [ ] Added field: `createdAt` (timestamp) = [current time]
- [ ] Clicked "Save"
- [ ] Verified document appears in Firestore

---

## 💻 Local Development Setup

### Installation
- [ ] Opened terminal in project directory
- [ ] Ran `npm install`
- [ ] Waited for installation to complete
- [ ] Verified no error messages

### Configuration
- [ ] Opened `src/config/firebase.ts`
- [ ] Verified Firebase config matches your project
- [ ] Saved file (no changes needed if using provided config)

### Build Test
- [ ] Ran `npm run build`
- [ ] Verified build completed successfully
- [ ] No TypeScript errors
- [ ] No build errors

### Development Server
- [ ] Ran `npm run dev`
- [ ] Server started successfully
- [ ] Opened browser to `http://localhost:5173`
- [ ] Login page loads correctly

---

## 🔐 Authentication Test

### Admin Login
- [ ] Entered email: `izmashaikh7681@gmail.com`
- [ ] Entered password: `123456`
- [ ] Clicked "Sign In"
- [ ] Redirected to `/admin/dashboard`
- [ ] Dashboard loads without errors
- [ ] User name displays in header
- [ ] Role badge shows "admin"

### Navigation Test
- [ ] Clicked "Receptionists" in sidebar
- [ ] Page loads correctly
- [ ] Clicked "Rooms" in sidebar
- [ ] Page loads correctly
- [ ] Clicked "Bookings" in sidebar
- [ ] Page loads correctly
- [ ] Clicked "Dashboard" in sidebar
- [ ] Returns to dashboard

---

## 🎯 Feature Testing

### Add Receptionist
- [ ] Navigated to Receptionists page
- [ ] Clicked "Add Receptionist"
- [ ] Filled in form:
  - Name: Test Receptionist
  - Email: test@hotel.com
  - Password: test123
- [ ] Clicked "Add Receptionist"
- [ ] Success toast appears
- [ ] Receptionist appears in list
- [ ] Verified in Firebase Console > Authentication
- [ ] Verified in Firebase Console > Firestore > users

### Add Room
- [ ] Navigated to Rooms page
- [ ] Clicked "Add Room"
- [ ] Filled in form:
  - Room Number: 101
  - Type: Single
  - Price: 100
  - Floor: 1
  - Status: Available
  - Amenities: WiFi, TV, AC
- [ ] Clicked "Add Room"
- [ ] Success toast appears
- [ ] Room appears in list
- [ ] Verified in Firebase Console > Firestore > rooms

### Create Booking
- [ ] Navigated to Bookings page
- [ ] Clicked "New Booking"
- [ ] Filled in form:
  - Room: Selected from dropdown
  - Guest Name: John Doe
  - Guest Email: john@email.com
  - Guest Phone: +1234567890
  - Check-in: Tomorrow's date
  - Check-out: Day after tomorrow
  - Status: Confirmed
- [ ] Clicked "Create Booking"
- [ ] Success toast appears
- [ ] Booking appears in list
- [ ] Total amount calculated correctly
- [ ] Verified in Firebase Console > Firestore > bookings

### Edit Operations
- [ ] Edited a receptionist
- [ ] Changes saved successfully
- [ ] Edited a room
- [ ] Changes saved successfully
- [ ] Edited a booking
- [ ] Changes saved successfully

### Delete Operations
- [ ] Deleted a test receptionist
- [ ] Confirmation dialog appeared
- [ ] Deletion successful
- [ ] Deleted a test room
- [ ] Deletion successful
- [ ] Deleted a test booking
- [ ] Deletion successful

---

## 👨‍💻 Receptionist Access Test

### Logout as Admin
- [ ] Clicked user menu in header
- [ ] Clicked "Sign Out"
- [ ] Redirected to login page

### Login as Receptionist
- [ ] Entered receptionist email
- [ ] Entered receptionist password
- [ ] Clicked "Sign In"
- [ ] Redirected to `/receptionist/dashboard`
- [ ] Dashboard loads correctly
- [ ] Role badge shows "receptionist"

### Receptionist Navigation
- [ ] Only sees Dashboard and Bookings in sidebar
- [ ] Cannot access admin routes
- [ ] Can create bookings
- [ ] Can edit bookings
- [ ] Can view statistics

---

## 📱 Responsive Design Test

### Desktop (>1024px)
- [ ] Full sidebar visible
- [ ] Multi-column layouts work
- [ ] All features accessible
- [ ] No layout issues

### Tablet (768px - 1023px)
- [ ] Sidebar collapsible
- [ ] 2-column layouts work
- [ ] Touch targets adequate
- [ ] No layout issues

### Mobile (<768px)
- [ ] Bottom navigation visible
- [ ] Single column layouts
- [ ] Forms are usable
- [ ] All features accessible
- [ ] No horizontal scroll

---

## 🔒 Security Test

### Route Protection
- [ ] Logged out user redirected to login
- [ ] Admin routes blocked for receptionist
- [ ] Receptionist routes blocked for admin
- [ ] Direct URL access properly protected

### Firestore Rules (if in production mode)
- [ ] Non-authenticated users cannot read data
- [ ] Receptionists cannot create users
- [ ] Receptionists cannot delete bookings
- [ ] Only admins can manage rooms

---

## 📊 Data Verification

### Firebase Console Check
- [ ] Authentication > Users shows all users
- [ ] Firestore > users collection has correct data
- [ ] Firestore > rooms collection has correct data
- [ ] Firestore > bookings collection has correct data
- [ ] All timestamps are correct
- [ ] All relationships are correct

---

## 📚 Documentation Review

### Files Present
- [ ] README.md exists and is complete
- [ ] QUICKSTART.md exists
- [ ] FIREBASE_SETUP_VISUAL_GUIDE.md exists
- [ ] PROJECT_SUMMARY.md exists
- [ ] MIGRATION_COMPLETE.md exists
- [ ] PROJECT_OVERVIEW.txt exists
- [ ] SETUP_CHECKLIST.md exists (this file)

### Documentation Accuracy
- [ ] README matches actual implementation
- [ ] Setup guides are accurate
- [ ] Code examples work
- [ ] Links are valid

---

## 🚀 Production Readiness

### Before Deploying
- [ ] Updated Firestore security rules
- [ ] Tested all features thoroughly
- [ ] Verified on multiple browsers
- [ ] Tested on mobile devices
- [ ] Removed test data
- [ ] Changed default passwords
- [ ] Set up error monitoring
- [ ] Configured backup strategy

### Build for Production
- [ ] Ran `npm run build`
- [ ] Build completed without errors
- [ ] Tested production build with `npm run preview`
- [ ] All features work in production build

---

## ✅ Final Verification

### System Status
- [ ] All features working
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] No build warnings
- [ ] All tests passed
- [ ] Documentation complete
- [ ] Ready for use

---

## 🎉 Completion

If all items are checked, your hotel management system is fully set up and ready to use!

### Next Steps:
1. Start adding real data
2. Train staff on system usage
3. Monitor Firebase usage
4. Plan future enhancements

### Support:
- Check documentation files for help
- Review Firebase Console for data
- Check browser console for errors
- Refer to learning resources in PROJECT_OVERVIEW.txt

---

**Congratulations! Your hotel management system is ready! 🏨**
