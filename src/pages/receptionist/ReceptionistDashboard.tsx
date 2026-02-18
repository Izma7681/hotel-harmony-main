import React, { useMemo } from 'react';
import { useAuth } from '@/contexts/FirebaseAuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BedDouble, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useRooms } from '@/hooks/useRooms';
import { useBookings } from '@/hooks/useBookings';
import { format, isToday } from 'date-fns';

export default function ReceptionistDashboard() {
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

    return {
      totalRooms,
      occupiedRooms,
      availableRooms,
      reservedRooms,
      todayCheckIns,
      todayCheckOuts
    };
  }, [rooms, bookings]);

  const todayBookings = useMemo(() => {
    return bookings
      .filter(b => isToday(new Date(b.checkIn)) || isToday(new Date(b.checkOut)))
      .filter(b => b.status !== 'cancelled')
      .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
      .slice(0, 10);
  }, [bookings]);

  const loading = roomsLoading || bookingsLoading;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Receptionist Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.name}</p>
        </div>

        {/* Room Overview */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Room Status (View Only)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Rooms"
              value={stats.totalRooms}
              icon={BedDouble}
              variant="primary"
            />
            <StatCard
              title="Available Rooms"
              value={stats.availableRooms}
              icon={CheckCircle}
              variant="success"
            />
            <StatCard
              title="Occupied Rooms"
              value={stats.occupiedRooms}
              icon={XCircle}
              variant="danger"
            />
            <StatCard
              title="Reserved Rooms"
              value={stats.reservedRooms}
              icon={Clock}
              variant="warning"
            />
          </div>
        </div>

        {/* Today's Activity */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Today's Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </div>

        {/* Today's Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : todayBookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No bookings scheduled for today</p>
            ) : (
              <div className="space-y-3">
                {todayBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{booking.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        Room {booking.roomNumber} • {format(new Date(booking.checkIn), 'MMM dd')} - {format(new Date(booking.checkOut), 'MMM dd')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${
                        isToday(new Date(booking.checkIn)) ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isToday(new Date(booking.checkIn)) ? 'Check-in Today' : 'Check-out Today'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Access Notice */}
        <Card className="bg-muted/50 border-primary/20">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> As a receptionist, you have view-only access to rooms and dashboard. 
              You can create and view bookings, and generate invoices. For other operations, please contact the administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
