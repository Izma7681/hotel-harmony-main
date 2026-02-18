import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Room } from '@/types/firebase';

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const roomsSnapshot = await getDocs(collection(db, 'rooms'));
      const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
      
      const bookingsData = bookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        checkIn: doc.data().checkIn.toDate(),
        checkOut: doc.data().checkOut.toDate()
      }));
      
      const roomsData = roomsSnapshot.docs.map(doc => {
        const room = { id: doc.id, ...doc.data() } as Room;
        
        // Check if room has active booking
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        const activeBooking = bookingsData.find(booking => {
          const checkIn = new Date(booking.checkIn);
          const checkOut = new Date(booking.checkOut);
          checkIn.setHours(0, 0, 0, 0);
          checkOut.setHours(0, 0, 0, 0);
          
          return booking.roomId === room.id &&
            (booking.status === 'confirmed' || booking.status === 'checked-in') &&
            checkIn <= now &&
            checkOut >= now;
        });
        
        const futureBooking = bookingsData.find(booking => {
          const checkIn = new Date(booking.checkIn);
          checkIn.setHours(0, 0, 0, 0);
          
          return booking.roomId === room.id &&
            booking.status === 'confirmed' &&
            checkIn > now;
        });
        
        // Auto-update room status based on booking
        if (activeBooking) {
          room.status = 'occupied';
        } else if (futureBooking) {
          room.status = 'reserved';
        } else {
          room.status = 'available';
        }
        
        return room;
      });
      
      setRooms(roomsData);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const addRoom = async (data: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDoc(collection(db, 'rooms'), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await fetchRooms();
    } catch (error) {
      console.error('Error adding room:', error);
      throw error;
    }
  };

  const updateRoom = async (id: string, data: Partial<Room>) => {
    try {
      await updateDoc(doc(db, 'rooms', id), {
        ...data,
        updatedAt: new Date()
      });
      await fetchRooms();
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  };

  const deleteRoom = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'rooms', id));
      await fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  };

  return { rooms, loading, addRoom, updateRoom, deleteRoom, refetch: fetchRooms };
}
