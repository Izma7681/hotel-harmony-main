import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useBookings } from '@/hooks/useBookings';
import { Search, User, Mail, Phone, Calendar, DollarSign, BedDouble } from 'lucide-react';
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Customer Management</h1>
            <p className="text-muted-foreground mt-1">Search by phone number to view complete stay history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
              <p className="text-xs text-muted-foreground">Unique customers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customers.length > 0 ? (bookings.length / customers.length).toFixed(1) : '0'}
              </div>
              <p className="text-xs text-muted-foreground">Per customer</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Spend</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{customers.length > 0 
                  ? (customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toFixed(2)
                  : '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">Per customer</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCustomers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No customers found</p>
              ) : (
                filteredCustomers.map((customer) => (
                  <div key={customer.phone}>
                    <div 
                      className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedCustomer(selectedCustomer?.phone === customer.phone ? null : customer)}
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-lg">{customer.name || 'N/A'}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {customer.phone || 'N/A'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {customer.email || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total Bookings</p>
                          <p className="font-bold text-lg">{customer.totalBookings || 0}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total Spent</p>
                          <p className="font-bold text-lg">₹{(customer.totalSpent || 0).toFixed(2)}</p>
                        </div>
                        <Badge variant="outline" className={(customer.totalBookings || 0) >= 5 ? 'bg-yellow-100 text-yellow-800' : ''}>
                          {(customer.totalBookings || 0) >= 5 ? 'VIP' : 'Regular'}
                        </Badge>
                      </div>
                    </div>

                    {/* Booking History */}
                    {selectedCustomer?.phone === customer.phone && (
                      <div className="mt-2 ml-4 p-4 border-l-2 border-primary bg-muted/30 rounded-r-lg">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Complete Stay History
                        </h3>
                        <div className="space-y-3">
                          {customer.bookings
                            .sort((a: any, b: any) => {
                              const dateA = a.checkIn ? new Date(a.checkIn).getTime() : 0;
                              const dateB = b.checkIn ? new Date(b.checkIn).getTime() : 0;
                              return dateB - dateA;
                            })
                            .map((booking: any) => (
                              <div key={booking.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                                <div className="flex items-center gap-3">
                                  <BedDouble className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium">Room {booking.roomNumber || 'N/A'}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {booking.checkIn ? format(new Date(booking.checkIn), 'dd MMM yyyy') : 'N/A'} - {booking.checkOut ? format(new Date(booking.checkOut), 'dd MMM yyyy') : 'N/A'}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold">₹{(booking.totalAmount || 0).toFixed(2)}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(booking.paymentMode || 'cash').toUpperCase()}
                                  </p>
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
                            ))}
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
