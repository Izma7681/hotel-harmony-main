import React, { useMemo } from 'react';
import { useAuth } from '@/contexts/FirebaseAuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BedDouble, DollarSign, TrendingUp, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useRooms } from '@/hooks/useRooms';
import { useBookings } from '@/hooks/useBookings';
import { format, isToday, startOfMonth, startOfYear } from 'date-fns';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { rooms, loading: roomsLoading } = useRooms();
  const { bookings, loading: bookingsLoading } = useBookings();

  const stats = useMemo(() => {
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
    const availableRooms = rooms.filter(r => r.status === 'available').length;
    const reservedRooms = rooms.filter(r => r.status === 'reserved').length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCheckIns = bookings.filter(b => {
      const checkIn = new Date(b.checkIn);
      checkIn.setHours(0, 0, 0, 0);
      return checkIn.getTime() === today.getTime() && b.status !== 'cancelled';
    }).length;

    const todayCheckOuts = bookings.filter(b => {
      const checkOut = new Date(b.checkOut);
      checkOut.setHours(0, 0, 0, 0);
      return checkOut.getTime() === today.getTime() && b.status !== 'cancelled';
    }).length;

    const confirmedBookings = bookings.filter(b => 
      b.status === 'confirmed' || b.status === 'checked-in' || b.status === 'checked-out'
    );

    const todayRevenue = confirmedBookings
      .filter(b => isToday(new Date(b.createdAt)))
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const monthlyRevenue = confirmedBookings
      .filter(b => new Date(b.createdAt) >= startOfMonth(new Date()))
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const yearlyRevenue = confirmedBookings
      .filter(b => new Date(b.createdAt) >= startOfYear(new Date()))
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : '0';

    return {
      totalRooms,
      occupiedRooms,
      availableRooms,
      reservedRooms,
      todayCheckIns,
      todayCheckOuts,
      todayRevenue,
      monthlyRevenue,
      yearlyRevenue,
      occupancyRate
    };
  }, [rooms, bookings]);

  const recentBookings = useMemo(() => {
    return bookings
      .filter(b => b.status !== 'cancelled')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [bookings]);

  const loading = roomsLoading || bookingsLoading;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.name}</p>
        </div>

        {/* Room Statistics */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Room Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Rooms"
              value={stats.totalRooms}
              icon={BedDouble}
              variant="primary"
            />
            <StatCard
              title="Occupied Rooms"
              value={stats.occupiedRooms}
              icon={XCircle}
              variant="danger"
            />
            <StatCard
              title="Available Rooms"
              value={stats.availableRooms}
              icon={CheckCircle}
              variant="success"
            />
            <StatCard
              title="Reserved Rooms"
              value={stats.reservedRooms}
              icon={Calendar}
              variant="warning"
            />
          </div>
        </div>

        {/* Today's Activity */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Today's Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="Today's Check-ins"
              value={stats.todayCheckIns}
              icon={Calendar}
              variant="info"
            />
            <StatCard
              title="Today's Check-outs"
              value={stats.todayCheckOuts}
              icon={Calendar}
              variant="info"
            />
            <StatCard
              title="Occupancy Rate"
              value={`${stats.occupancyRate}%`}
              icon={TrendingUp}
              variant="success"
            />
          </div>
        </div>

        {/* Revenue Statistics */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Revenue Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Today's Revenue"
              value={`₹${stats.todayRevenue.toFixed(2)}`}
              icon={DollarSign}
              variant="success"
            />
            <StatCard
              title="Monthly Revenue"
              value={`₹${stats.monthlyRevenue.toFixed(2)}`}
              icon={DollarSign}
              variant="success"
            />
            <StatCard
              title="Yearly Revenue"
              value={`₹${stats.yearlyRevenue.toFixed(2)}`}
              icon={DollarSign}
              variant="success"
            />
          </div>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : recentBookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No recent bookings</p>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{booking.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        Room {booking.roomNumber} • {format(new Date(booking.checkIn), 'MMM dd')} - {format(new Date(booking.checkOut), 'MMM dd')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{booking.totalAmount}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'checked-in' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'checked-out' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
