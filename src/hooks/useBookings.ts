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
          checkIn: booking.checkIn.toDate(),
          checkOut: booking.checkOut.toDate(),
          createdAt: booking.createdAt.toDate()
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
      await addDoc(collection(db, 'bookings'), {
        ...data,
        createdBy: user?.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Update room status to occupied if booking is confirmed or checked-in
      if (data.roomId && (data.status === 'confirmed' || data.status === 'checked-in')) {
        await updateDoc(doc(db, 'rooms', data.roomId), {
          status: 'occupied',
          updatedAt: new Date()
        });
      }
      
      await fetchBookings();
    } catch (error) {
      console.error('Error adding booking:', error);
      throw error;
    }
  };

  const updateBooking = async (id: string, data: Partial<Booking>) => {
    try {
      const booking = bookings.find(b => b.id === id);
      
      await updateDoc(doc(db, 'bookings', id), {
        ...data,
        updatedAt: new Date()
      });
      
      // Update room status based on booking status
      if (booking?.roomId) {
        if (data.status === 'confirmed' || data.status === 'checked-in') {
          // Set room to occupied
          await updateDoc(doc(db, 'rooms', booking.roomId), {
            status: 'occupied',
            updatedAt: new Date()
          });
        } else if (data.status === 'checked-out' || data.status === 'cancelled') {
          // Set room back to available
          await updateDoc(doc(db, 'rooms', booking.roomId), {
            status: 'available',
            updatedAt: new Date()
          });
        }
      }
      
      await fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      const booking = bookings.find(b => b.id === id);
      
      await deleteDoc(doc(db, 'bookings', id));
      
      // Set room back to available when booking is deleted
      if (booking?.roomId) {
        await updateDoc(doc(db, 'rooms', booking.roomId), {
          status: 'available',
          updatedAt: new Date()
        });
      }
      
      await fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  };

  return { bookings, loading, addBooking, updateBooking, deleteBooking, refetch: fetchBookings };
}
