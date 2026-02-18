import { Booking } from '@/types/firebase';

export function isRoomAvailable(
  roomId: string,
  checkIn: Date,
  checkOut: Date,
  bookings: Booking[],
  excludeBookingId?: string
): boolean {
  const checkInTime = new Date(checkIn).setHours(0, 0, 0, 0);
  const checkOutTime = new Date(checkOut).setHours(0, 0, 0, 0);

  return !bookings.some(booking => {
    if (booking.id === excludeBookingId) return false;
    if (booking.roomId !== roomId) return false;
    if (booking.status === 'cancelled' || booking.status === 'checked-out') return false;

    const bookingCheckIn = new Date(booking.checkIn).setHours(0, 0, 0, 0);
    const bookingCheckOut = new Date(booking.checkOut).setHours(0, 0, 0, 0);

    // Check for date overlap
    return (
      (checkInTime >= bookingCheckIn && checkInTime < bookingCheckOut) ||
      (checkOutTime > bookingCheckIn && checkOutTime <= bookingCheckOut) ||
      (checkInTime <= bookingCheckIn && checkOutTime >= bookingCheckOut)
    );
  });
}

export function calculateBill(baseAmount: number, advancePayment: number = 0) {
  const gstAmount = baseAmount * 0.05; // 5% GST
  const totalAmount = baseAmount + gstAmount;
  const remainingAmount = totalAmount - advancePayment;

  return {
    baseAmount,
    gstAmount,
    totalAmount,
    advancePayment,
    remainingAmount
  };
}

export function getDaysBetween(checkIn: Date, checkOut: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  const start = new Date(checkIn).setHours(0, 0, 0, 0);
  const end = new Date(checkOut).setHours(0, 0, 0, 0);
  return Math.round(Math.abs((end - start) / oneDay));
}
