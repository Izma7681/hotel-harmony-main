import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useRooms } from '@/hooks/useRooms';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function ViewRooms() {
  const { rooms, loading, refetch } = useRooms();
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        refetch();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refetch]);

  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const reservedRooms = rooms.filter(r => r.status === 'reserved').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'occupied': return 'bg-red-500';
      case 'reserved': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'occupied': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'reserved': return <Clock className="h-5 w-5 text-yellow-600" />;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">View Rooms (Read Only)</h1>
          <p className="text-muted-foreground mt-1">
            Room status updates automatically based on bookings
          </p>
        </div>

        {/* Room Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Rooms</p>
                <p className="text-3xl font-bold">{totalRooms}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-3xl font-bold text-green-600">{availableRooms}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Occupied</p>
                <p className="text-3xl font-bold text-red-600">{occupiedRooms}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Reserved</p>
                <p className="text-3xl font-bold text-yellow-600">{reservedRooms}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Reserved</span>
          </div>
        </div>

        {/* Room Grid */}
        {loading ? (
          <p>Loading rooms...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {rooms
              .sort((a, b) => parseInt(a.roomNumber) - parseInt(b.roomNumber))
              .map((room) => (
                <Card 
                  key={room.id}
                  className={`relative overflow-hidden ${
                    room.status === 'available' ? 'border-green-200' :
                    room.status === 'occupied' ? 'border-red-200' :
                    'border-yellow-200'
                  }`}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 ${getStatusColor(room.status)}`}></div>
                  <CardContent className="pt-6 pb-4">
                    <div className="text-center space-y-2">
                      <div className="flex justify-center">
                        {getStatusIcon(room.status)}
                      </div>
                      <div>
                        <p className="text-2xl font-bold">Room {room.roomNumber}</p>
                        <p className="text-sm text-muted-foreground capitalize">{room.type}</p>
                      </div>
                      <div className="pt-2">
                        <p className="text-lg font-semibold">₹{room.price}</p>
                        <p className="text-xs text-muted-foreground">per night</p>
                      </div>
                      <div className="pt-2">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          room.status === 'available' ? 'bg-green-100 text-green-800' :
                          room.status === 'occupied' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {room.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        {/* Access Notice */}
        <Card className="bg-muted/50">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> You have view-only access to rooms. Room status is automatically managed by the system based on bookings.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
