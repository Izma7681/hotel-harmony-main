import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Booking } from '@/types/firebase';
import { useAuth } from '@/contexts/FirebaseAuthContext';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBookings = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'bookings'));
      const data = snapshot.docs.map(doc => {
        const booking = doc.data();
        return {
          id: doc.id,
          ...booking,
          checkIn: booking.checkIn?.toDate ? booking.checkIn.toDate() : new Date(booking.checkIn),
          checkOut: booking.checkOut?.toDate ? booking.checkOut.toDate() : new Date(booking.checkOut),
          createdAt: booking.createdAt?.toDate ? booking.createdAt.toDate() : new Date(booking.createdAt),
          customerId: booking.customerId || booking.customerPhone?.replace(/\D/g, '') || 'unknown'
        } as Booking;
      });
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const addBooking = async (data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    try {
      // Generate a customerId from phone number for customer tracking
      const customerId = data.customerPhone.replace(/\D/g, ''); // Remove non-digits
      
      const bookingData = {
        ...data,
        customerId: customerId,
        createdBy: user?.id || 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Creating booking with data:', bookingData);
      
      await addDoc(collection(db, 'bookings'), bookingData);
      
      await fetchBookings();
    } catch (error: any) {
      console.error('Error adding booking:', error);
      console.error('Error details:', error.message, error.code);
      throw error;
    }
  };

  const updateBooking = async (id: string, data: Partial<Booking>) => {
    try {
      await updateDoc(doc(db, 'bookings', id), {
        ...data,
        updatedAt: new Date()
      });
      
      await fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    await updateBooking(id, { status });
  };

  const deleteBooking = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'bookings', id));
      await fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  };

  return { bookings, loading, addBooking, updateBooking, updateBookingStatus, deleteBooking, refetch: fetchBookings };
}
