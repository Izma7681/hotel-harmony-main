export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'receptionist' | 'customer';
  gstNumber?: string;
  createdAt: Date;
  createdBy?: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  type: 'single' | 'double';
  price: number;
  status: 'available' | 'occupied' | 'reserved';
  floor: number;
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  customerId: string;
  roomId: string;
  roomNumber: string;
  customerName: string;
  secondPersonName?: string;
  customerEmail: string;
  customerPhone: string;
  aadharNumber: string;
  gstNumber?: string;
  checkIn: Date;
  checkOut: Date;
  numberOfAdults: number;
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  advancePayment: number;
  remainingAmount: number;
  paymentMode: 'gpay' | 'cash';
  paymentStatus?: 'pending' | 'partial' | 'paid';
  paidAt?: Date;
  finalPaymentMode?: 'gpay' | 'cash';
  finalPaymentAmount?: number;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  title: string;
  category: 'maintenance' | 'staff' | 'utility' | 'other';
  amount: number;
  description: string;
  notes?: string;
  date: Date;
  createdBy: string;
  createdAt: Date;
}

export interface Payment {
  id: string;
  bookingId: string;
  roomNumber: string;
  customerName: string;
  amount: number;
  paymentMode: 'gpay' | 'cash';
  date: Date;
  createdAt: Date;
}
