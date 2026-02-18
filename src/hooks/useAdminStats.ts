import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';

export function useAdminStats() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalReceptionists: 0,
    monthlyRevenue: 0,
    occupancyRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const roomsSnapshot = await getDocs(collection(db, 'rooms'));
        const totalRooms = roomsSnapshot.size;
        const occupiedRooms = roomsSnapshot.docs.filter(doc => doc.data().status === 'occupied').length;

        const receptionistsQuery = query(collection(db, 'users'), where('role', '==', 'receptionist'));
        const receptionistsSnapshot = await getDocs(receptionistsQuery);

        const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
        const monthlyRevenue = bookingsSnapshot.docs.reduce((sum, doc) => {
          const booking = doc.data();
          const bookingDate = booking.createdAt.toDate();
          const now = new Date();
          if (bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear()) {
            return sum + (booking.totalAmount || 0);
          }
          return sum;
        }, 0);

        setStats({
          totalRooms,
          totalReceptionists: receptionistsSnapshot.size,
          monthlyRevenue,
          occupancyRate: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
}
