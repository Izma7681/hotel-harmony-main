import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBookings } from '@/hooks/useBookings';
import { useRooms } from '@/hooks/useRooms';
import { useExpenses } from '@/hooks/useExpenses';
import { TrendingUp, TrendingDown, DollarSign, BedDouble, Calendar, ArrowRight, ChevronRight } from 'lucide-react';
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
      <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Income Details - {getPeriodLabel()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">GPay Income</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold text-green-600">₹{stats.gpayIncome.toFixed(0)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Cash Income</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold text-blue-600">₹{stats.cashIncome.toFixed(0)}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Transaction List</h3>
            {stats.confirmedBookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-4 text-sm">No transactions found</p>
            ) : (
              stats.confirmedBookings.map((booking) => (
                <div key={booking.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{booking.customerName || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">
                        Room {booking.roomNumber || 'N/A'} • {booking.createdAt ? format(new Date(booking.createdAt), 'dd MMM yyyy') : 'N/A'}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-sm">₹{(booking.totalAmount || 0).toFixed(0)}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        booking.paymentMode === 'gpay' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {(booking.paymentMode || 'cash').toUpperCase()}
                      </span>
                    </div>
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
      <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Expense Details - {getPeriodLabel()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold text-red-600">₹{stats.totalExpenses.toFixed(0)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Number of Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">{stats.periodExpenses.length}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Expense List</h3>
            {stats.periodExpenses.length === 0 ? (
              <p className="text-center text-muted-foreground py-4 text-sm">No expenses found</p>
            ) : (
              stats.periodExpenses.map((expense) => (
                <div key={expense.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{expense.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {expense.description} • {expense.date ? format(new Date(expense.date), 'dd MMM yyyy') : 'N/A'}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-sm">₹{expense.amount.toFixed(0)}</p>
                      <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 capitalize">
                        {expense.category}
                      </span>
                    </div>
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
      <div className="space-y-4 px-2 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold">Reports & Analytics</h1>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
          <h2 className="text-base font-semibold mb-3">Financial Overview - {getPeriodLabel()}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowIncomeDetails(true)}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Total Revenue
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-green-600">₹{stats.totalRevenue.toFixed(0)}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <ChevronRight className="h-3 w-3" />
                  Click for details
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Total Bookings
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{stats.totalBookings}</div>
                <p className="text-xs text-muted-foreground mt-1">Confirmed bookings</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowExpenseDetails(true)}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Total Expenses
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-red-600">₹{stats.totalExpenses.toFixed(0)}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <ChevronRight className="h-3 w-3" />
                  Click for details
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Net Profit
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-xl font-bold ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{stats.netProfit.toFixed(0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Revenue - Expenses</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Income Breakdown */}
        <div>
          <h2 className="text-base font-semibold mb-3">Income Breakdown</h2>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Payment Mode Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-600" />
                    <span className="font-medium text-sm">GPay Income</span>
                  </div>
                  <span className="font-bold text-green-600 text-sm">₹{stats.gpayIncome.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600" />
                    <span className="font-medium text-sm">Cash Income</span>
                  </div>
                  <span className="font-bold text-blue-600 text-sm">₹{stats.cashIncome.toFixed(0)}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">Total Income</span>
                    <span className="font-bold text-base">₹{stats.totalRevenue.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Occupancy Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Occupancy Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xs text-muted-foreground">Current Occupancy Rate</p>
                <p className="text-2xl font-bold text-primary">{stats.occupancyRate}%</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs text-muted-foreground">Total Rooms</p>
                <p className="text-2xl font-bold">{rooms.length}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs text-muted-foreground">Occupied Rooms</p>
                <p className="text-2xl font-bold">{rooms.filter(r => r.status === 'occupied').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Export Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" onClick={() => window.print()} className="text-xs">
                Export as PDF
              </Button>
              <Button variant="outline" size="sm" className="text-xs">Export as Excel</Button>
              <Button variant="outline" size="sm" className="text-xs">Export as CSV</Button>
            </div>
          </CardContent>
        </Card>

        <IncomeDetailsDialog />
        <ExpenseDetailsDialog />
      </div>
    </DashboardLayout>
  );
}
