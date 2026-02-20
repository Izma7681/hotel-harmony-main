import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBookings } from '@/hooks/useBookings';
import { DollarSign, Download, Search, Calendar, FileText, CheckCircle2, Loader2, Edit2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { getDaysBetween } from '@/utils/roomAvailability';
import { useToast } from '@/hooks/use-toast';

export default function Billing() {
  const { bookings, loading, updateBooking } = useBookings();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [bookingToMarkPaid, setBookingToMarkPaid] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'gpay'>('cash');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showGstDialog, setShowGstDialog] = useState(false);
  const [bookingForGst, setBookingForGst] = useState<any>(null);
  const [gstNumber, setGstNumber] = useState('');
  const [gstError, setGstError] = useState('');
  const [isProcessingGst, setIsProcessingGst] = useState(false);

  const completedBookings = bookings.filter(b => 
    b.status === 'confirmed' || b.status === 'checked-in' || b.status === 'checked-out'
  );
  
  const filteredBills = completedBookings.filter(booking =>
    booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.roomNumber?.includes(searchTerm) ||
    booking.customerPhone?.includes(searchTerm)
  );

  const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalAdvance = completedBookings.reduce((sum, b) => sum + (b.advancePayment || 0), 0);
  const totalRemaining = completedBookings.reduce((sum, b) => sum + (b.remainingAmount || 0), 0);

  const generateInvoice = (booking: any) => {
    setSelectedBooking(booking);
    setShowInvoice(true);
  };

  const downloadInvoice = () => {
    window.print();
  };

  const handleMarkAsPaidClick = (booking: any) => {
    setBookingToMarkPaid(booking);
    setPaymentMethod('cash');
    setShowPaymentConfirm(true);
  };

  const handleConfirmPayment = async () => {
    if (!bookingToMarkPaid || isProcessingPayment) return;

    setIsProcessingPayment(true);
    try {
      await updateBooking(bookingToMarkPaid.id, {
        remainingAmount: 0,
        advancePayment: bookingToMarkPaid.totalAmount,
        paymentMode: paymentMethod,
        paymentStatus: 'paid',
        paidAt: new Date(),
        updatedAt: new Date()
      });

      toast({
        title: "Payment Recorded",
        description: `Booking marked as fully paid via ${paymentMethod.toUpperCase()}`,
        variant: "default",
      });

      setShowPaymentConfirm(false);
      setBookingToMarkPaid(null);
    } catch (error) {
      console.error('Error marking as paid:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCancelPayment = () => {
    setShowPaymentConfirm(false);
    setBookingToMarkPaid(null);
    setPaymentMethod('cash');
  };

  const validateGstNumber = (gst: string): boolean => {
    // Indian GST format: 2 digits (state code) + 10 alphanumeric (PAN) + 1 digit (entity number) + 1 letter (Z) + 1 alphanumeric (checksum)
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  };

  const handleAddGstClick = (booking: any) => {
    setBookingForGst(booking);
    setGstNumber(booking.gstNumber || '');
    setGstError('');
    setShowGstDialog(true);
  };

  const handleGstChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setGstNumber(upperValue);
    setGstError('');
  };

  const handleSaveGst = async () => {
    if (!bookingForGst || isProcessingGst) return;

    // Validate GST number
    if (gstNumber.trim() && !validateGstNumber(gstNumber.trim())) {
      setGstError('Invalid GST format. Must be 15 characters (e.g., 27ABCDE1234F1Z5)');
      return;
    }

    setIsProcessingGst(true);
    try {
      // Update the booking with GST number
      await updateBooking(bookingForGst.id, {
        gstNumber: gstNumber.trim() || null,
        updatedAt: new Date()
      });

      toast({
        title: "GST Number Updated",
        description: gstNumber.trim() ? "GST number has been saved successfully" : "GST number has been removed",
        variant: "default",
      });

      setShowGstDialog(false);
      setBookingForGst(null);
      setGstNumber('');
    } catch (error) {
      console.error('Error updating GST number:', error);
      toast({
        title: "Error",
        description: "Failed to update GST number. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingGst(false);
    }
  };

  const handleCancelGst = () => {
    setShowGstDialog(false);
    setBookingForGst(null);
    setGstNumber('');
    setGstError('');
  };

  const Invoice = ({ booking }: { booking: any }) => {
    if (!booking) return null;
    
    const days = getDaysBetween(new Date(booking.checkIn), new Date(booking.checkOut));
    
    return (
      <div className="p-8 bg-white text-black" id="invoice">
        <div className="border-b-2 border-gray-800 pb-4 mb-6">
          <h1 className="text-3xl font-bold">HOTEL KRISHNA</h1>
          <p className="text-sm text-gray-600">Hotel Management System</p>
          <p className="text-sm text-gray-600">Phone: +91 XXXXXXXXXX | Email: info@hotelkrishna.com</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <h2 className="font-bold text-lg mb-2">BILL TO:</h2>
            <p className="font-medium">{booking.customerName || 'N/A'}</p>
            {booking.secondPersonName && <p className="text-sm">+ {booking.secondPersonName}</p>}
            <p className="text-sm">{booking.customerEmail || 'N/A'}</p>
            <p className="text-sm">{booking.customerPhone || 'N/A'}</p>
            <p className="text-sm">Aadhar: {booking.aadharNumber || 'N/A'}</p>
            {booking.gstNumber && (
              <p className="text-sm font-medium mt-1">GST No: {booking.gstNumber}</p>
            )}
          </div>
          <div className="text-right">
            <h2 className="font-bold text-lg mb-2">INVOICE DETAILS:</h2>
            <p className="text-sm"><span className="font-medium">Invoice #:</span> {booking.id?.slice(0, 8).toUpperCase() || 'N/A'}</p>
            <p className="text-sm"><span className="font-medium">Date:</span> {booking.createdAt ? format(new Date(booking.createdAt), 'dd MMM yyyy') : 'N/A'}</p>
            <p className="text-sm"><span className="font-medium">Room:</span> {booking.roomNumber || 'N/A'}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-bold text-lg mb-2">STAY DETAILS:</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Check-in:</p>
              <p className="font-medium">{booking.checkIn ? format(new Date(booking.checkIn), 'dd MMM yyyy') : 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">Check-out:</p>
              <p className="font-medium">{booking.checkOut ? format(new Date(booking.checkOut), 'dd MMM yyyy') : 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">Duration:</p>
              <p className="font-medium">{days} {days === 1 ? 'Night' : 'Nights'}</p>
            </div>
          </div>
        </div>

        <table className="w-full mb-6 border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-800">
              <th className="text-left py-2">Description</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Room Charges ({days} nights)</td>
              <td className="text-right">₹{(booking.baseAmount || 0).toFixed(2)}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">GST (5%)</td>
              <td className="text-right">₹{(booking.gstAmount || 0).toFixed(2)}</td>
            </tr>
            <tr className="border-b-2 border-gray-800 font-bold">
              <td className="py-2">Total Amount</td>
              <td className="text-right">₹{(booking.totalAmount || 0).toFixed(2)}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 text-green-600">Advance Paid ({(booking.paymentMode || 'cash').toUpperCase()})</td>
              <td className="text-right text-green-600">-₹{(booking.advancePayment || 0).toFixed(2)}</td>
            </tr>
            <tr className="border-b-2 border-gray-800 font-bold text-lg">
              <td className="py-2">Amount Due</td>
              <td className="text-right text-red-600">₹{(booking.remainingAmount || 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-8 pt-4 border-t">
          <p className="text-sm text-gray-600">Payment Mode: <span className="font-medium uppercase">{booking.paymentMode || 'N/A'}</span></p>
          <p className="text-sm text-gray-600 mt-2">Number of Adults: <span className="font-medium">{booking.numberOfAdults || 1}</span></p>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Thank you for choosing Hotel Krishna!</p>
          <p className="mt-2">For any queries, please contact us at info@hotelkrishna.com</p>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Billing & Invoices</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From all bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedBookings.length}</div>
              <p className="text-xs text-muted-foreground">Generated invoices</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Advance Collected</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{totalAdvance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total advance payments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Amount Pending</CardTitle>
              <DollarSign className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₹{totalRemaining.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Remaining to collect</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer name, room number, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <p>Loading bills...</p>
              ) : filteredBills.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No bills found</p>
              ) : (
                filteredBills.map((booking) => {
                  const hasDueAmount = (booking.remainingAmount || 0) > 0;
                  const isPaid = (booking.remainingAmount || 0) === 0;
                  
                  return (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{booking.customerName || 'N/A'}</p>
                          {booking.gstNumber ? (
                            <p className="text-xs text-blue-600 font-medium mt-0.5">
                              GST: {booking.gstNumber}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              GST: Not Provided
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            Room {booking.roomNumber || 'N/A'} • {booking.checkIn ? format(new Date(booking.checkIn), 'MMM dd') : 'N/A'} - {booking.checkOut ? format(new Date(booking.checkOut), 'MMM dd, yyyy') : 'N/A'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {booking.customerPhone || 'N/A'} • {(booking.paymentMode || 'cash').toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-lg">₹{(booking.totalAmount || 0).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          Advance: ₹{(booking.advancePayment || 0).toFixed(2)}
                        </p>
                        {isPaid ? (
                          <div className="flex items-center gap-1 mt-1">
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Paid
                            </Badge>
                          </div>
                        ) : hasDueAmount ? (
                          <p className="text-xs text-red-600 font-medium">
                            Due: ₹{(booking.remainingAmount || 0).toFixed(2)}
                          </p>
                        ) : null}
                        <Badge className={
                          booking.status === 'checked-out' ? 'bg-gray-100 text-gray-800 mt-1' :
                          booking.status === 'checked-in' ? 'bg-blue-100 text-blue-800 mt-1' :
                          'bg-green-100 text-green-800 mt-1'
                        }>
                          {booking.status || 'pending'}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAddGstClick(booking)}
                        >
                          {booking.gstNumber ? (
                            <>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit GST
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Add GST
                            </>
                          )}
                        </Button>
                        {hasDueAmount && !isPaid && (
                          <Button 
                            size="sm" 
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleMarkAsPaidClick(booking)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Mark as Paid
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => generateInvoice(booking)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Invoice
                        </Button>
                      </div>
                    </div>
                  </div>
                )})
              )}
            </div>
          </CardContent>
        </Card>

        <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Invoice</span>
                <Button size="sm" onClick={downloadInvoice}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </DialogTitle>
            </DialogHeader>
            {selectedBooking && <Invoice booking={selectedBooking} />}
          </DialogContent>
        </Dialog>

        <Dialog open={showPaymentConfirm} onOpenChange={setShowPaymentConfirm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to mark this booking as fully paid?
              </p>
              {bookingToMarkPaid && (
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Customer:</span>
                    <span className="text-sm">{bookingToMarkPaid.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Room:</span>
                    <span className="text-sm">{bookingToMarkPaid.roomNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Amount:</span>
                    <span className="text-sm font-bold">₹{(bookingToMarkPaid.totalAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Already Paid:</span>
                    <span className="text-sm text-green-600">₹{(bookingToMarkPaid.advancePayment || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">Amount to Pay:</span>
                    <span className="text-sm font-bold text-red-600">₹{(bookingToMarkPaid.remainingAmount || 0).toFixed(2)}</span>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select value={paymentMethod} onValueChange={(value: 'cash' | 'gpay') => setPaymentMethod(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="gpay">GPay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={handleCancelPayment}
                disabled={isProcessingPayment}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmPayment}
                disabled={isProcessingPayment}
                className="bg-green-600 hover:bg-green-700"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Confirm Payment
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showGstDialog} onOpenChange={setShowGstDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {bookingForGst?.gstNumber ? 'Edit GST Number' : 'Add GST Number'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Enter the customer's GST number for tax purposes. This will be displayed on the invoice.
              </p>
              {bookingForGst && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm font-medium">{bookingForGst.customerName}</p>
                  <p className="text-xs text-muted-foreground">{bookingForGst.customerPhone}</p>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">GST Number</label>
                <Input
                  placeholder="27ABCDE1234F1Z5"
                  value={gstNumber}
                  onChange={(e) => handleGstChange(e.target.value)}
                  maxLength={15}
                  className={gstError ? 'border-red-500' : ''}
                />
                <p className="text-xs text-muted-foreground">
                  Format: 15 characters (e.g., 27ABCDE1234F1Z5)
                </p>
                {gstError && (
                  <p className="text-xs text-red-600">{gstError}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={handleCancelGst}
                disabled={isProcessingGst}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveGst}
                disabled={isProcessingGst}
              >
                {isProcessingGst ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Save GST
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
