import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBookings } from '@/hooks/useBookings';
import { useRooms } from '@/hooks/useRooms';
import { useExpenses } from '@/hooks/useExpenses';
import { TrendingUp, TrendingDown, DollarSign, BedDouble, Calendar, ArrowRight } from 'lucide-react';
import { format, startOfDay, startOfMonth, startOfYear, isWithinInterval } from 'date-fns';

export default function Reports() {
  const { bookings } = useBookings();
  const { rooms } = useRooms();
  const { expenses } = useExpenses();
  const [period, setPeriod] = useState('month');
  const [showIncomeDetails, setShowIncomeDetails] = useState(false);
  const [showExpenseDetails, setShowExpenseDetails] = useState(false);

  const stats = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = startOfDay(now);
        break;
      case 'month':
        startDate = startOfMonth(now);
        break;
      case 'year':
        startDate = startOfYear(now);
        break;
      default:
        startDate = startOfMonth(now);
    }

    const confirmedBookings = bookings.filter(b => 
      (b.status === 'confirmed' || b.status === 'checked-in' || b.status === 'checked-out') &&
      b.createdAt && isWithinInterval(new Date(b.createdAt), { start: startDate, end: now })
    );

    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalBookings = confirmedBookings.length;

    // Income breakdown
    const gpayIncome = confirmedBookings
      .filter(b => b.paymentMode === 'gpay')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    
    const cashIncome = confirmedBookings
      .filter(b => b.paymentMode === 'cash')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    // Real expenses from Firebase
    const periodExpenses = expenses.filter(exp =>
      exp.date && isWithinInterval(new Date(exp.date), { start: startDate, end: now })
    );
    
    const totalExpenses = periodExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
    const occupancyRate = rooms.length > 0 ? ((occupiedRooms / rooms.length) * 100).toFixed(1) : '0';

    // Room type revenue
    const roomTypeRevenue = confirmedBookings.reduce((acc, booking) => {
      const room = rooms.find(r => r.roomNumber === booking.roomNumber);
      if (room) {
        acc[room.type] = (acc[room.type] || 0) + (booking.totalAmount || 0);
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRevenue,
      totalBookings,
      gpayIncome,
      cashIncome,
      totalExpenses,
      netProfit,
      occupancyRate,
      roomTypeRevenue,
      confirmedBookings,
      periodExpenses
    };
  }, [bookings, rooms, expenses, period]);

  const getPeriodLabel = () => {
    switch (period) {
      case 'day': return 'Today';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      default: return 'This Month';
    }
  };

  const IncomeDetailsDialog = () => (
    <Dialog open={showIncomeDetails} onOpenChange={setShowIncomeDetails}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Income Details - {getPeriodLabel()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">GPay Income</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">₹{stats.gpayIncome.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Cash Income</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">₹{stats.cashIncome.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Transaction List</h3>
            {stats.confirmedBookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No transactions found</p>
            ) : (
              stats.confirmedBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{booking.customerName || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">
                      Room {booking.roomNumber || 'N/A'} • {booking.createdAt ? format(new Date(booking.createdAt), 'dd MMM yyyy') : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{(booking.totalAmount || 0).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      booking.paymentMode === 'gpay' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {(booking.paymentMode || 'cash').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const ExpenseDetailsDialog = () => (
    <Dialog open={showExpenseDetails} onOpenChange={setShowExpenseDetails}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Expense Details - {getPeriodLabel()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">₹{stats.totalExpenses.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Number of Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.periodExpenses.length}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Expense List</h3>
            {stats.periodExpenses.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No expenses found</p>
            ) : (
              stats.periodExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{expense.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {expense.description} • {expense.date ? format(new Date(expense.date), 'dd MMM yyyy') : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{expense.amount.toFixed(2)}</p>
                    <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 capitalize">
                      {expense.category}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Financial Overview */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Financial Overview - {getPeriodLabel()}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowIncomeDetails(true)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">₹{stats.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <ArrowRight className="h-3 w-3" />
                  Click for details
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
                <p className="text-xs text-muted-foreground mt-1">Confirmed bookings</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowExpenseDetails(true)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">₹{stats.totalExpenses.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <ArrowRight className="h-3 w-3" />
                  Click for details
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{stats.netProfit.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Revenue - Expenses</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Income Breakdown */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Income Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Mode Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-600" />
                      <span className="font-medium">GPay Income</span>
                    </div>
                    <span className="font-bold text-green-600">₹{stats.gpayIncome.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-600" />
                      <span className="font-medium">Cash Income</span>
                    </div>
                    <span className="font-bold text-blue-600">₹{stats.cashIncome.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Total Income</span>
                      <span className="font-bold text-lg">₹{stats.totalRevenue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>Revenue by Room Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.roomTypeRevenue).map(([type, revenue]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BedDouble className="h-4 w-4 text-muted-foreground" />
                        <span className="capitalize font-medium">{type} Rooms</span>
                      </div>
                      <span className="font-bold">₹{revenue.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>

        {/* Occupancy Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Current Occupancy Rate</p>
                <p className="text-3xl font-bold text-primary">{stats.occupancyRate}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Rooms</p>
                <p className="text-3xl font-bold">{rooms.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Occupied Rooms</p>
                <p className="text-3xl font-bold">{rooms.filter(r => r.status === 'occupied').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Export Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => window.print()}>
                Export as PDF
              </Button>
              <Button variant="outline">Export as Excel</Button>
              <Button variant="outline">Export as CSV</Button>
            </div>
          </CardContent>
        </Card>

        <IncomeDetailsDialog />
      </div>
    </DashboardLayout>
  );
}
