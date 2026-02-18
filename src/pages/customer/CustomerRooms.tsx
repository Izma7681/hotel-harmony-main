import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRooms } from '@/hooks/useRooms';
import { BedDouble } from 'lucide-react';

export default function CustomerRooms() {
  const { rooms, loading } = useRooms();

  // Filter only available rooms
  const availableRooms = rooms.filter(room => room.status === 'available');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Available Rooms</h1>
          <p className="text-muted-foreground mt-1">Browse our available rooms</p>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : availableRooms.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">No rooms available at the moment.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please check back later or contact our reception.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRooms.map((room) => (
              <Card key={room.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BedDouble className="h-5 w-5" />
                      Room {room.roomNumber}
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      Available
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{room.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price per Night</p>
                      <p className="text-2xl font-bold text-primary">${room.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Floor</p>
                      <p className="font-medium">{room.floor}</p>
                    </div>
                    {room.amenities && room.amenities.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Amenities</p>
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.map((amenity, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground">
                        Contact reception to book this room
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
