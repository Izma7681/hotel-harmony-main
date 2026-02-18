import React from 'react';
import { useAuth } from '@/contexts/FirebaseAuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, BedDouble, User } from 'lucide-react';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground mt-1">Manage your bookings and reservations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> Customer</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5" />
                My Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View and manage your room reservations
              </p>
              <Button onClick={() => navigate('/customer/bookings')} className="w-full">
                View Bookings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BedDouble className="h-5 w-5" />
                Available Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Browse available rooms and make a reservation
              </p>
              <Button onClick={() => navigate('/customer/rooms')} className="w-full" variant="outline">
                Browse Rooms
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={() => navigate('/customer/rooms')} className="w-full">
                <BedDouble className="mr-2 h-4 w-4" />
                Book a Room
              </Button>
              <Button onClick={() => navigate('/customer/bookings')} variant="outline" className="w-full">
                <CalendarCheck className="mr-2 h-4 w-4" />
                My Reservations
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-2">Welcome to Hotel Krishna</h2>
          <p className="text-muted-foreground">
            Thank you for choosing our hotel. You can now browse available rooms and make reservations 
            directly from your dashboard. If you need any assistance, please contact our reception.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
