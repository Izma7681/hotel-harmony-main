import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useBookings } from '@/hooks/useBookings';
import { Search, User, Mail, Phone, Calendar, BedDouble, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

export default function Customers() {
  const { bookings } = useBookings();
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique customers from bookings
  const customers = useMemo(() => {
    if (!bookings || bookings.length === 0) return [];
    
    const customerMap = new Map();
    
    bookings.forEach(booking => {
      if (!booking.customerPhone) return; // Skip bookings without phone
      
      const phone = booking.customerPhone;
      if (!customerMap.has(phone)) {
        customerMap.set(phone, {
          phone,
          name: booking.customerName || 'N/A',
          email: booking.customerEmail || 'N/A',
          aadharNumber: booking.aadharNumber || 'N/A',
          bookings: []
        });
      }
      customerMap.get(phone).bookings.push(booking);
    });

    return Array.from(customerMap.values()).map(customer => ({
      ...customer,
      totalBookings: customer.bookings.length,
      totalSpent: customer.bookings
        .filter((b: any) => b.status === 'confirmed' || b.status === 'checked-in' || b.status === 'checked-out')
        .reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0),
      lastBooking: customer.bookings.sort((a: any, b: any) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })[0]
    }));
  }, [bookings]);

  const filteredCustomers = customers.filter(customer =>
    (customer.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone || '').includes(searchTerm)
  );

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  return (
    <DashboardLayout>
      <div className="space-y-4 px-2 sm:px-0">
        {/* Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold">Customer Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Search by phone number to view complete stay history</p>
        </div>

        {/* Stats Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">Unique customers</p>
          </CardContent>
        </Card>

        {/* Search */}
        <Card>
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {filteredCustomers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">No customers found</p>
              ) : (
                filteredCustomers.map((customer) => (
                  <div key={customer.phone} className="border rounded-lg overflow-hidden">
                    <div 
                      className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedCustomer(selectedCustomer?.phone === customer.phone ? null : customer)}
                    >
                      {/* Customer Info */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm truncate pr-2">{customer.name || 'N/A'}</p>
                            {selectedCustomer?.phone === customer.phone ? 
                              <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : 
                              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            }
                          </div>
                          
                          {/* Contact Info */}
                          <div className="space-y-1 mb-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{customer.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{customer.email || 'N/A'}</span>
                            </div>
                          </div>

                          {/* Stats Row */}
                          <div className="flex items-center justify-between">
                            <div className="flex gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Total Bookings</p>
                                <p className="font-bold text-sm">{customer.totalBookings || 0}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Total Spent</p>
                                <p className="font-bold text-sm">₹{(customer.totalSpent || 0).toFixed(0)}</p>
                              </div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${(customer.totalBookings || 0) >= 5 ? 'bg-yellow-100 text-yellow-800' : ''}`}
                            >
                              {(customer.totalBookings || 0) >= 5 ? 'VIP' : 'Regular'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Booking History */}
                    {selectedCustomer?.phone === customer.phone && (
                      <div className="border-t bg-muted/30">
                        <div className="p-3">
                          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Complete Stay History
                          </h3>
                          <div className="space-y-2">
                            {customer.bookings
                              .sort((a: any, b: any) => {
                                const dateA = a.checkIn ? new Date(a.checkIn).getTime() : 0;
                                const dateB = b.checkIn ? new Date(b.checkIn).getTime() : 0;
                                return dateB - dateA;
                              })
                              .map((booking: any) => (
                                <div key={booking.id} className="bg-background rounded-lg border p-3">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-2 flex-1 min-w-0">
                                      <BedDouble className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                      <div className="min-w-0 flex-1">
                                        <p className="font-medium text-sm">Room {booking.roomNumber || 'N/A'}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {booking.checkIn ? format(new Date(booking.checkIn), 'dd MMM yyyy') : 'N/A'} - {booking.checkOut ? format(new Date(booking.checkOut), 'dd MMM yyyy') : 'N/A'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {(booking.paymentMode || 'cash').toUpperCase()}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                      <p className="font-bold text-sm">₹{(booking.totalAmount || 0).toFixed(0)}</p>
                                      <Badge className={`mt-1 text-xs ${
                                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        booking.status === 'checked-in' ? 'bg-blue-100 text-blue-800' :
                                        booking.status === 'checked-out' ? 'bg-gray-100 text-gray-800' :
                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                      }`}>
                                        {booking.status || 'pending'}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
