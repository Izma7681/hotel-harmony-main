import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRooms } from '@/hooks/useRooms';
import { BedDouble, CheckCircle, XCircle, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/FirebaseAuthContext';
import { toast } from 'sonner';

export default function ManageRooms() {
  const { rooms, loading, refetch, addRoom, updateRoom, deleteRoom } = useRooms();
  const { isAdmin } = useAuth();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: 'single' as 'single' | 'double',
    price: '',
    floor: ''
  });

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        refetch();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refetch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if room number already exists (only for new rooms)
    if (!editingId && rooms.some(r => r.roomNumber === formData.roomNumber)) {
      toast.error('Room number already exists');
      return;
    }

    try {
      const roomData = {
        roomNumber: formData.roomNumber,
        type: formData.type,
        price: parseFloat(formData.price),
        floor: parseInt(formData.floor),
        status: 'available' as const,
        amenities: ['WiFi', 'TV', 'AC', 'Bathroom']
      };

      if (editingId) {
        await updateRoom(editingId, roomData);
        toast.success('Room updated successfully');
      } else {
        await addRoom(roomData);
        toast.success('Room added successfully');
      }
      
      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast.error(editingId ? 'Failed to update room' : 'Failed to add room');
    }
  };

  const handleEdit = (room: any) => {
    setEditingId(room.id);
    setFormData({
      roomNumber: room.roomNumber,
      type: room.type,
      price: room.price.toString(),
      floor: room.floor.toString()
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string, roomNumber: string) => {
    if (confirm(`Are you sure you want to delete Room ${roomNumber}?`)) {
      try {
        await deleteRoom(id);
        toast.success('Room deleted successfully');
      } catch (error) {
        toast.error('Failed to delete room');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      roomNumber: '',
      type: 'single',
      price: '',
      floor: ''
    });
    setEditingId(null);
  };

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Room Management</h1>
            <p className="text-muted-foreground mt-1">
              Room status updates automatically based on bookings
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Room
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Room' : 'Add New Room'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="roomNumber">Room Number *</Label>
                  <Input
                    id="roomNumber"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    placeholder="e.g., 18"
                    required
                    disabled={!!editingId}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Room Type *</Label>
                  <Select value={formData.type} onValueChange={(value: 'single' | 'double') => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price per Night (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., 1000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="floor">Floor Number *</Label>
                  <Input
                    id="floor"
                    type="number"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    placeholder="e.g., 1"
                    required
                  />
                </div>
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <p className="text-muted-foreground">
                    <strong>Note:</strong> {editingId ? 'Room status will remain unchanged.' : 'New room will be created with "Available" status and standard amenities (WiFi, TV, AC, Bathroom).'}
                  </p>
                </div>
                <Button type="submit" className="w-full">
                  {editingId ? 'Update Room' : 'Add Room'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Room Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{totalRooms}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{availableRooms}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Occupied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-2xl font-bold text-red-600">{occupiedRooms}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reserved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="text-2xl font-bold text-yellow-600">{reservedRooms}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Room Grid */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-lg font-semibold">All Rooms</h2>
            <div className="flex items-center gap-4 text-sm">
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
          </div>

          {loading ? (
            <p>Loading rooms...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {rooms
                .sort((a, b) => parseInt(a.roomNumber) - parseInt(b.roomNumber))
                .map((room) => (
                  <Card 
                    key={room.id}
                    className={`relative overflow-hidden transition-all hover:shadow-lg ${
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
                        <div className="flex gap-2 pt-3 justify-center">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEdit(room)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDelete(room.id, room.roomNumber)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>

        {/* Legend */}
        <Card className="bg-muted/50">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Room status is automatically updated based on booking dates. 
              Available rooms can be booked, Occupied rooms have active guests, and Reserved rooms have future bookings.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
