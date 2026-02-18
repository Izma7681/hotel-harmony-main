export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'receptionist' | 'customer';
  createdAt: Date;
  createdBy?: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  type: string;
  price: number;
  status: 'available' | 'occupied' | 'maintenance';
  floor: number;
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  roomId: string;
  roomNumber: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: Date;
  checkOut: Date;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: Date;
  createdBy: string;
  createdAt: Date;
}
