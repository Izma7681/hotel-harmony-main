import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

export function useReceptionistStats() {
  const [stats, setStats] = useState({
    availableRooms: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const roomsSnapshot = await getDocs(collection(db, 'rooms'));
        const availableRooms = roomsSnapshot.docs.filter(doc => doc.data().status === 'available').length;

        const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let todayCheckIns = 0;
        let todayCheckOuts = 0;

        bookingsSnapshot.docs.forEach(doc => {
          const booking = doc.data();
          const checkIn = booking.checkIn.toDate();
          const checkOut = booking.checkOut.toDate();
          
          checkIn.setHours(0, 0, 0, 0);
          checkOut.setHours(0, 0, 0, 0);

          if (checkIn.getTime() === today.getTime()) todayCheckIns++;
          if (checkOut.getTime() === today.getTime()) todayCheckOuts++;
        });

        setStats({
          availableRooms,
          todayCheckIns,
          todayCheckOuts
        });
      } catch (error) {
        console.error('Error fetching receptionist stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
}
