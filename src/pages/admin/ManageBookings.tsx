import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useBookings } from '@/hooks/useBookings';
import { useRooms } from '@/hooks/useRooms';
import { Calendar, User, BedDouble, DollarSign, Plus, CheckCircle, XCircle, Phone, Mail } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { toast } from 'sonner';
import { isRoomAvailable, calculateBill, getDaysBetween } from '@/utils/roomAvailability';

export default function ManageBookings() {
  const { bookings, loading, addBooking, updateBookingStatus } = useBookings();
  const { rooms } = useRooms();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    secondPersonName: '',
    customerEmail: '',
    customerPhone: '',
    aadharNumber: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    numberOfAdults: '1',
    baseAmount: '',
    paymentMode: 'cash' as 'gpay' | 'cash',
    advancePayment: '0'
  });

  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  // Filter bookings by tabs
  const allBookings = bookings.filter(b => b.status !== 'cancelled');
  const todayCheckIns = bookings.filter(b => {
    const checkIn = new Date(b.checkIn);
    return isToday(checkIn) && (b.status === 'confirmed' || b.status === 'pending');
  });
  const todayCheckOuts = bookings.filter(b => {
    const checkIn = new Date(b.checkOut);
    return isToday(checkIn) && b.status === 'checked-in';
  });

  // Get available rooms based on selected dates
  const availableRooms = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut) return rooms;
    
    return rooms.filter(room => 
      isRoomAvailable(
        room.id,
        new Date(formData.checkIn),
        new Date(formData.checkOut),
        bookings
      )
    );
  }, [formData.checkIn, formData.checkOut, rooms, bookings]);

  // Calculate bill when room or dates change
  useMemo(() => {
    if (selectedRoom && formData.checkIn && formData.checkOut) {
      const days = getDaysBetween(new Date(formData.checkIn), new Date(formData.checkOut));
      const baseAmount = selectedRoom.price * days;
      setFormData(prev => ({ ...prev, baseAmount: baseAmount.toString() }));
    }
  }, [selectedRoom, formData.checkIn, formData.checkOut]);

  const handleRoomSelect = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    setSelectedRoom(room);
    setFormData(prev => ({ ...prev, roomId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.checkIn || !formData.checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    if (!formData.roomId) {
      toast.error('Please select a room');
      return;
    }

    // Check room availability
    if (!isRoomAvailable(formData.roomId, new Date(formData.checkIn), new Date(formData.checkOut), bookings)) {
      toast.error('Selected room is not available for these dates');
      return;
    }

    try {
      const baseAmount = parseFloat(formData.baseAmount);
      const advancePayment = parseFloat(formData.advancePayment);
      const bill = calculateBill(baseAmount, advancePayment);

      const room = rooms.find(r => r.id === formData.roomId);
      const customerId = formData.customerPhone.replace(/\D/g, ''); // Generate customerId from phone

      // Build booking data, only include secondPersonName if it exists
      const bookingData: any = {
        customerId: customerId,
        roomId: formData.roomId,
        roomNumber: room?.roomNumber || '',
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        aadharNumber: formData.aadharNumber,
        checkIn: new Date(formData.checkIn),
        checkOut: new Date(formData.checkOut),
        numberOfAdults: parseInt(formData.numberOfAdults),
        baseAmount: bill.baseAmount,
        gstAmount: bill.gstAmount,
        totalAmount: bill.totalAmount,
        advancePayment: bill.advancePayment,
        remainingAmount: bill.remainingAmount,
        paymentMode: formData.paymentMode,
        status: 'confirmed'
      };

      // Only add secondPersonName if it's not empty
      if (formData.secondPersonName && formData.secondPersonName.trim()) {
        bookingData.secondPersonName = formData.secondPersonName;
      }

      await addBooking(bookingData);

      toast.success('Booking created successfully');
      setIsOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Booking creation error:', error);
      toast.error(error.message || 'Failed to create booking');
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      secondPersonName: '',
      customerEmail: '',
      customerPhone: '',
      aadharNumber: '',
      roomId: '',
      checkIn: '',
      checkOut: '',
      numberOfAdults: '1',
      baseAmount: '',
      paymentMode: 'cash',
      advancePayment: '0'
    });
    setSelectedRoom(null);
  };

  const handleCheckIn = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, 'checked-in');
      toast.success('Guest checked in successfully');
    } catch (error) {
      toast.error('Failed to check in guest');
    }
  };

  const handleCheckOut = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, 'checked-out');
      toast.success('Guest checked out successfully');
    } catch (error) {
      toast.error('Failed to check out guest');
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        await updateBookingStatus(bookingId, 'cancelled');
        toast.success('Booking cancelled');
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'checked-in': return 'bg-blue-100 text-blue-800';
      case 'checked-out': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card key={booking.id} className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-base truncate">Booking #{booking.id.slice(0, 8)}</CardTitle>
          <Badge className={`${getStatusColor(booking.status)} text-xs flex-shrink-0`}>
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Customer Info */}
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Customer</p>
              <p className="font-medium text-sm truncate">{booking.customerName}</p>
              {booking.secondPersonName && (
                <p className="text-xs text-muted-foreground">+ {booking.secondPersonName}</p>
              )}
            </div>
          </div>

          {/* Room Info */}
          <div className="flex items-start gap-2">
            <BedDouble className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Room</p>
              <p className="font-medium text-sm">Room {booking.roomNumber}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Check-in / Check-out</p>
              <p className="font-medium text-sm">
                {format(new Date(booking.checkIn), 'MMM dd')} - {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>

          {/* Amount */}
          <div className="flex items-start gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Total Amount</p>
              <p className="font-medium text-sm">₹{booking.totalAmount.toFixed(0)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            {booking.status === 'confirmed' && (
              <Button size="sm" className="text-xs" onClick={() => handleCheckIn(booking.id)}>
                <CheckCircle className="h-3 w-3 mr-1" />
                Check In
              </Button>
            )}
            {booking.status === 'checked-in' && (
              <Button size="sm" className="text-xs" onClick={() => handleCheckOut(booking.id)}>
                <CheckCircle className="h-3 w-3 mr-1" />
                Check Out
              </Button>
            )}
            {(booking.status === 'confirmed' || booking.status === 'pending') && (
              <Button size="sm" variant="destructive" className="text-xs" onClick={() => handleCancel(booking.id)}>
                <XCircle className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-4 px-2 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold">Manage Bookings</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                New Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg">Create New Booking</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="customerName" className="text-sm">Customer Name *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      required
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone" className="text-sm">Phone Number *</Label>
                    <Input
                      id="customerPhone"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      required
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="customerEmail" className="text-sm">Email *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      required
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="aadharNumber" className="text-sm">Aadhar Card Number *</Label>
                    <Input
                      id="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                      required
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="checkIn" className="text-sm">Check-in Date *</Label>
                    <Input
                      id="checkIn"
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      required
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkOut" className="text-sm">Check-out Date *</Label>
                    <Input
                      id="checkOut"
                      type="date"
                      value={formData.checkOut}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      required
                      className="text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="roomId" className="text-sm">Select Room *</Label>
                  <Select value={formData.roomId} onValueChange={handleRoomSelect}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select an available room" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRooms.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          No rooms available for selected dates
                        </div>
                      ) : (
                        availableRooms.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            Room {room.roomNumber} - {room.type} (₹{room.price}/night)
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {selectedRoom?.type === 'double' && (
                  <div>
                    <Label htmlFor="secondPersonName" className="text-sm">Second Person Name</Label>
                    <Input
                      id="secondPersonName"
                      value={formData.secondPersonName}
                      onChange={(e) => setFormData({ ...formData, secondPersonName: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="numberOfAdults" className="text-sm">Number of Adults *</Label>
                    <Input
                      id="numberOfAdults"
                      type="number"
                      min="1"
                      value={formData.numberOfAdults}
                      onChange={(e) => setFormData({ ...formData, numberOfAdults: e.target.value })}
                      required
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="baseAmount" className="text-sm">Base Amount (₹) *</Label>
                    <Input
                      id="baseAmount"
                      type="number"
                      step="0.01"
                      value={formData.baseAmount}
                      onChange={(e) => setFormData({ ...formData, baseAmount: e.target.value })}
                      required
                      readOnly
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="paymentMode" className="text-sm">Payment Mode *</Label>
                    <Select value={formData.paymentMode} onValueChange={(value: any) => setFormData({ ...formData, paymentMode: value })}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="gpay">GPay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="advancePayment" className="text-sm">Advance Payment (₹)</Label>
                    <Input
                      id="advancePayment"
                      type="number"
                      step="0.01"
                      value={formData.advancePayment}
                      onChange={(e) => setFormData({ ...formData, advancePayment: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                </div>

                {formData.baseAmount && (
                  <Card className="bg-muted">
                    <CardContent className="pt-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Base Amount:</span>
                          <span className="font-medium">₹{parseFloat(formData.baseAmount).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>GST (5%):</span>
                          <span className="font-medium">₹{(parseFloat(formData.baseAmount) * 0.05).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Advance Paid:</span>
                          <span className="font-medium">₹{parseFloat(formData.advancePayment).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base pt-2 border-t">
                          <span>Total Amount:</span>
                          <span>₹{(parseFloat(formData.baseAmount) * 1.05).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base text-primary">
                          <span>Remaining:</span>
                          <span>₹{((parseFloat(formData.baseAmount) * 1.05) - parseFloat(formData.advancePayment)).toFixed(0)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button type="submit" className="w-full">
                  Create Booking
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="text-xs">All ({allBookings.length})</TabsTrigger>
            <TabsTrigger value="checkin" className="text-xs">Check-in ({todayCheckIns.length})</TabsTrigger>
            <TabsTrigger value="checkout" className="text-xs">Check-out ({todayCheckOuts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {loading ? (
              <p className="text-center text-sm">Loading bookings...</p>
            ) : allBookings.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground text-sm">
                  No bookings found
                </CardContent>
              </Card>
            ) : (
              allBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
            )}
          </TabsContent>

          <TabsContent value="checkin" className="space-y-3">
            {todayCheckIns.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground text-sm">
                  No check-ins scheduled for today
                </CardContent>
              </Card>
            ) : (
              todayCheckIns.map((booking) => <BookingCard key={booking.id} booking={booking} />)
            )}
          </TabsContent>

          <TabsContent value="checkout" className="space-y-3">
            {todayCheckOuts.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground text-sm">
                  No check-outs scheduled for today
                </CardContent>
              </Card>
            ) : (
              todayCheckOuts.map((booking) => <BookingCard key={booking.id} booking={booking} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
