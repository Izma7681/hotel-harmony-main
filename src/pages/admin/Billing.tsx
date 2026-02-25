import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBookings } from '@/hooks/useBookings';
import { DollarSign, Download, Search, FileText, CheckCircle2, Loader2, Edit2, Plus, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { getDaysBetween } from '@/utils/roomAvailability';
import { useToast } from '@/hooks/use-toast';

const OWNER_PHONE = '9426786111';

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
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [sharingBookingId, setSharingBookingId] = useState<string | null>(null);

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
    const invoiceEl = document.getElementById('invoice');
    if (!invoiceEl) return;

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              color: #000;
              background: #fff;
              padding: 15mm 18mm;
              width: 210mm;
              min-height: 297mm;
            }
            @page { size: A4 portrait; margin: 0; }
          </style>
        </head>
        <body>
          ${invoiceEl.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // ─── Generate real PDF Blob using jsPDF ──────────────────────────────────
  const generatePdfBlob = async (booking: any): Promise<Blob> => {
    const jspdfModule = await new Promise<any>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
      script.onload = () => resolve((window as any).jspdf);
      script.onerror = reject;
      // If already loaded, skip
      if ((window as any).jspdf) { resolve((window as any).jspdf); return; }
      document.head.appendChild(script);
    });

    const { jsPDF } = jspdfModule;
    const days = getDaysBetween(new Date(booking.checkIn), new Date(booking.checkOut));

    const fmt = (date: any, f: string = 'dd MMM yyyy'): string => {
      try {
        if (!date) return 'N/A';
        const d = date?.toDate ? date.toDate() : new Date(date);
        if (isNaN(d.getTime())) return 'N/A';
        return format(d, f);
      } catch { return 'N/A'; }
    };

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = 210;
    const margin = 18;
    let y = 18;

    const drawLine = (x1: number, y1: number, x2: number, y2: number, w = 0.3) => {
      doc.setLineWidth(w); doc.line(x1, y1, x2, y2);
    };

    // Header
    doc.setFont('helvetica', 'bold'); doc.setFontSize(20);
    doc.text('HOTEL KRISHNA', margin, y); y += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(90, 90, 90);
    doc.text('Hotel Management System', margin, y); y += 4.5;
    doc.text(`Phone: +91 ${OWNER_PHONE}  |  Email: info@hotelkrishna.com`, margin, y); y += 5;
    doc.setTextColor(0, 0, 0);
    drawLine(margin, y, W - margin, y, 0.6); y += 6;

    // Bill To / Invoice Details
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text('BILL TO:', margin, y);
    doc.text('INVOICE DETAILS:', W - margin - 55, y); y += 5;
    doc.setFontSize(11);
    doc.text(booking.customerName || 'N/A', margin, y);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(90, 90, 90);
    doc.text(`Invoice #: ${(booking.id?.slice(0, 8) || 'N/A').toUpperCase()}`, W - margin - 55, y); y += 4.5;
    if (booking.secondPersonName) { doc.setTextColor(0,0,0); doc.text(`+ ${booking.secondPersonName}`, margin, y); doc.setTextColor(90,90,90); }
    doc.text(`Date: ${fmt(booking.createdAt)}`, W - margin - 55, y); y += 4.5;
    doc.text(booking.customerEmail || 'N/A', margin, y);
    doc.text(`Room: ${booking.roomNumber || 'N/A'}`, W - margin - 55, y); y += 4.5;
    doc.text(booking.customerPhone || 'N/A', margin, y); y += 4.5;
    doc.text(`Aadhar: ${booking.aadharNumber || 'N/A'}`, margin, y); y += 4.5;
    if (booking.gstNumber) {
      doc.setTextColor(0,0,0); doc.setFont('helvetica', 'bold');
      doc.text(`GST No: ${booking.gstNumber}`, margin, y);
      doc.setFont('helvetica', 'normal');
    }
    doc.setTextColor(0,0,0); y += 7;

    // Stay Details
    drawLine(margin, y, W - margin, y, 0.4); y += 5;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text('STAY DETAILS:', margin, y); y += 5;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    doc.setTextColor(100,100,100);
    doc.text('Check-in:', margin, y); doc.text('Check-out:', margin + 55, y); doc.text('Duration:', margin + 115, y); y += 4;
    doc.setTextColor(0,0,0); doc.setFont('helvetica', 'bold');
    doc.text(fmt(booking.checkIn), margin, y);
    doc.text(fmt(booking.checkOut), margin + 55, y);
    doc.text(`${days} ${days === 1 ? 'Night' : 'Nights'}`, margin + 115, y);
    doc.setFont('helvetica', 'normal'); y += 8;

    // Table header
    drawLine(margin, y, W - margin, y, 0.6); y += 5;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text('Description', margin, y);
    doc.text('Amount', W - margin, y, { align: 'right' });
    y += 3; drawLine(margin, y, W - margin, y, 0.6); y += 6;

    const tableRow = (label: string, amount: string, color?: [number,number,number], bold = false) => {
      doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(10);
      if (color) doc.setTextColor(...color); else doc.setTextColor(0,0,0);
      doc.text(label, margin, y);
      doc.text(amount, W - margin, y, { align: 'right' });
      doc.setTextColor(0,0,0); y += 5;
      doc.setDrawColor(220,220,220); drawLine(margin, y, W - margin, y, 0.2); doc.setDrawColor(0,0,0);
      y += 3;
    };

    const actualAdvance = booking.paymentStatus === 'paid' && booking.finalPaymentAmount
      ? booking.totalAmount - booking.finalPaymentAmount
      : booking.advancePayment || 0;

    tableRow(`Room Charges (${days} ${days === 1 ? 'night' : 'nights'})`, `Rs.${(booking.baseAmount || 0).toFixed(2)}`);
    tableRow('GST (5%)', `Rs.${(booking.gstAmount || 0).toFixed(2)}`);

    // Total bold row
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
    doc.text('Total Amount', margin, y);
    doc.text(`Rs.${(booking.totalAmount || 0).toFixed(2)}`, W - margin, y, { align: 'right' });
    y += 3; drawLine(margin, y, W - margin, y, 0.6); y += 6;

    tableRow(`Advance Paid (${(booking.paymentMode || 'CASH').toUpperCase()})`, `-Rs.${actualAdvance.toFixed(2)}`, [22,163,74]);
    if ((booking.finalPaymentAmount || 0) > 0 && booking.paymentStatus === 'paid') {
      tableRow(`Remaining Paid (${(booking.finalPaymentMode || 'CASH').toUpperCase()})`, `-Rs.${(booking.finalPaymentAmount).toFixed(2)}`, [22,163,74]);
    }

    // Amount Due
    const due = booking.remainingAmount || 0;
    drawLine(margin, y, W - margin, y, 0.6); y += 5;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
    doc.text('Amount Due', margin, y);
    doc.setTextColor(due === 0 ? 22 : 220, due === 0 ? 163 : 38, due === 0 ? 74 : 38);
    doc.text(`Rs.${due.toFixed(2)}`, W - margin, y, { align: 'right' });
    doc.setTextColor(0,0,0); y += 8;

    // Footer info
    drawLine(margin, y, W - margin, y, 0.3); y += 5;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(90,90,90);
    doc.text(`Initial Payment Mode: ${(booking.paymentMode || 'N/A').toUpperCase()}`, margin, y); y += 4.5;
    if (booking.finalPaymentMode && booking.paymentStatus === 'paid') {
      doc.text(`Final Payment Mode: ${booking.finalPaymentMode.toUpperCase()}`, margin, y); y += 4.5;
    }
    doc.text(`Number of Adults: ${booking.numberOfAdults || 1}`, margin, y); y += 4.5;
    if (booking.paymentStatus === 'paid' && booking.paidAt) {
      doc.setTextColor(22,163,74); doc.setFont('helvetica', 'bold');
      doc.text(`Fully Paid on ${fmt(booking.paidAt)}`, margin, y);
    }
    y += 8;

    // Thank you
    drawLine(margin, y, W - margin, y, 0.3); y += 6;
    doc.setTextColor(100,100,100); doc.setFontSize(9); doc.setFont('helvetica', 'italic');
    doc.text('Thank you for choosing Hotel Krishna!', W / 2, y, { align: 'center' }); y += 4.5;
    doc.text(`For queries: +91 ${OWNER_PHONE}  |  info@hotelkrishna.com`, W / 2, y, { align: 'center' });

    return doc.output('blob') as Blob;
  };

  // ─── Open WhatsApp directly to customer number ────────────────────────────
  const openWhatsAppWithBill = (booking: any) => {
    const rawPhone = (booking.customerPhone || '').replace(/\D/g, '');
    // Ensure Indian country code prefix
    const phone = rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;

    const days = getDaysBetween(new Date(booking.checkIn), new Date(booking.checkOut));
    const totalAmt = (booking.totalAmount || 0).toFixed(2);
    const dueAmt = (booking.remainingAmount || 0).toFixed(2);
    const advAmt = (booking.advancePayment || 0).toFixed(2);

    const checkInStr = booking.checkIn ? format(new Date(booking.checkIn), 'dd MMM yyyy') : 'N/A';
    const checkOutStr = booking.checkOut ? format(new Date(booking.checkOut), 'dd MMM yyyy') : 'N/A';

    const isPaid = (booking.remainingAmount || 0) === 0;

    const message =
`🏨 *HOTEL KRISHNA*
━━━━━━━━━━━━━━━━━━━━
📄 *INVOICE / BILL SUMMARY*
━━━━━━━━━━━━━━━━━━━━

👤 *Guest:* ${booking.customerName || 'N/A'}
🚪 *Room No:* ${booking.roomNumber || 'N/A'}
📅 *Check-in:* ${checkInStr}
📅 *Check-out:* ${checkOutStr}
🌙 *Duration:* ${days} ${days === 1 ? 'Night' : 'Nights'}

━━━━━━━━━━━━━━━━━━━━
💰 *PAYMENT DETAILS*
━━━━━━━━━━━━━━━━━━━━
🧾 Total Amount:  ₹${totalAmt}
✅ Advance Paid:  ₹${advAmt}
${isPaid ? '✅ *Status: FULLY PAID*' : `❗ Amount Due:    ₹${dueAmt}`}

━━━━━━━━━━━━━━━━━━━━
📞 *Hotel Contact:* +91 ${OWNER_PHONE}
📧 info@hotelkrishna.com

_Thank you for staying with us! 🙏_`;

    const encoded = encodeURIComponent(message);

    // On mobile: open WhatsApp app; on desktop: open WhatsApp Web directly to the chat
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
    } else {
      window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${encoded}`, '_blank');
    }
  };

  const handleShareBill = async (booking: any) => {
    if (sharingBookingId) return;
    setSharingBookingId(booking.id);

    try {
      // 1️⃣ Generate a real PDF using jsPDF
      const pdfBlob = await generatePdfBlob(booking);
      const fileName = `Invoice_HotelKrishna_${(booking.customerName || 'Guest').replace(/\s+/g, '_')}_Room${booking.roomNumber || ''}.pdf`;
      const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

      const canShareFiles = navigator.canShare && navigator.canShare({ files: [pdfFile] });

      if (navigator.share && canShareFiles) {
        // 2️⃣ Share PDF file directly (Android Chrome, Safari iOS 15+)
        await navigator.share({
          title: `Invoice - Hotel Krishna | ${booking.customerName || 'Guest'}`,
          files: [pdfFile],
        });
        toast({ title: "PDF Invoice Shared!", description: `Invoice PDF sent for ${booking.customerName}`, variant: "default" });
      } else {
        // 3️⃣ Fallback: download PDF + open WhatsApp chat
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url; a.download = fileName; a.click();
        URL.revokeObjectURL(url);
        setTimeout(() => openWhatsAppWithBill(booking), 800);
        toast({ title: "PDF Downloaded + WhatsApp Opening", description: "PDF saved — attach it in the WhatsApp chat that opens", variant: "default" });
      }
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        // 4️⃣ Last resort: WhatsApp text message
        openWhatsAppWithBill(booking);
        toast({ title: "Opening WhatsApp", description: `Opening chat with ${booking.customerPhone || 'customer'}`, variant: "default" });
      }
    } finally {
      setSharingBookingId(null);
    }
  };
  // ──────────────────────────────────────────────────────────────────────────

  const handleMarkAsPaidClick = (booking: any) => {
    setBookingToMarkPaid(booking);
    setPaymentMethod('cash');
    setShowPaymentConfirm(true);
  };

  const handleConfirmPayment = async () => {
    if (!bookingToMarkPaid || isProcessingPayment) return;
    setIsProcessingPayment(true);
    try {
      const finalPaymentAmount = bookingToMarkPaid.remainingAmount || 0;
      await updateBooking(bookingToMarkPaid.id, {
        remainingAmount: 0,
        advancePayment: bookingToMarkPaid.totalAmount,
        finalPaymentMode: paymentMethod,
        finalPaymentAmount: finalPaymentAmount,
        paymentStatus: 'paid',
        paidAt: new Date(),
        updatedAt: new Date()
      });
      toast({ title: "Payment Recorded", description: `Booking marked as fully paid via ${paymentMethod.toUpperCase()}`, variant: "default" });
      setShowPaymentConfirm(false);
      setBookingToMarkPaid(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to update payment status. Please try again.", variant: "destructive" });
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
    setGstNumber(value.toUpperCase());
    setGstError('');
  };

  const handleSaveGst = async () => {
    if (!bookingForGst || isProcessingGst) return;
    if (gstNumber.trim() && !validateGstNumber(gstNumber.trim())) {
      setGstError('Invalid GST format. Must be 15 characters (e.g., 27ABCDE1234F1Z5)');
      return;
    }
    setIsProcessingGst(true);
    try {
      await updateBooking(bookingForGst.id, { gstNumber: gstNumber.trim() || null, updatedAt: new Date() });
      toast({ title: "GST Number Updated", description: gstNumber.trim() ? "GST number has been saved successfully" : "GST number has been removed", variant: "default" });
      setShowGstDialog(false);
      setBookingForGst(null);
      setGstNumber('');
    } catch (error) {
      toast({ title: "Error", description: "Failed to update GST number. Please try again.", variant: "destructive" });
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

  const toggleBookingExpansion = (bookingId: string) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  const Invoice = ({ booking }: { booking: any }) => {
    if (!booking) return null;

    const days = getDaysBetween(new Date(booking.checkIn), new Date(booking.checkOut));

    const actualAdvancePayment = booking.paymentStatus === 'paid' && booking.finalPaymentAmount
      ? booking.totalAmount - booking.finalPaymentAmount
      : booking.advancePayment || 0;

    const formatDate = (date: any, formatStr: string = 'dd MMM yyyy'): string => {
      try {
        if (!date) return 'N/A';
        const dateObj = date?.toDate ? date.toDate() : new Date(date);
        if (isNaN(dateObj.getTime())) return 'N/A';
        return format(dateObj, formatStr);
      } catch (e) {
        return 'N/A';
      }
    };

    return (
      <div
        id="invoice"
        style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '12px',
          color: '#000',
          background: '#fff',
          padding: '20px',
          maxWidth: '700px',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div style={{ borderBottom: '2px solid #222', paddingBottom: '8px', marginBottom: '10px' }}>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', letterSpacing: '1px' }}>HOTEL KRISHNA</h1>
          <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#555' }}>Hotel Management System</p>
          <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#555' }}>Phone: +91 {OWNER_PHONE} | Email: info@hotelkrishna.com</p>
        </div>

        {/* Bill To + Invoice Details */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 'bold' }}>BILL TO:</h2>
            <p style={{ margin: '2px 0', fontWeight: 'bold', fontSize: '13px' }}>{booking.customerName || 'N/A'}</p>
            {booking.secondPersonName && (
              <p style={{ margin: '2px 0', fontSize: '11px' }}>+ {booking.secondPersonName}</p>
            )}
            <p style={{ margin: '2px 0', fontSize: '11px', color: '#444' }}>{booking.customerEmail || 'N/A'}</p>
            <p style={{ margin: '2px 0', fontSize: '11px', color: '#444' }}>{booking.customerPhone || 'N/A'}</p>
            <p style={{ margin: '2px 0', fontSize: '11px', color: '#444' }}>Aadhar: {booking.aadharNumber || 'N/A'}</p>
            {booking.gstNumber && (
              <p style={{ margin: '4px 0 0', fontSize: '11px', fontWeight: 'bold' }}>GST No: {booking.gstNumber}</p>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 'bold' }}>INVOICE DETAILS:</h2>
            <p style={{ margin: '2px 0', fontSize: '11px' }}><b>Invoice #:</b> {booking.id?.slice(0, 8).toUpperCase() || 'N/A'}</p>
            <p style={{ margin: '2px 0', fontSize: '11px' }}><b>Date:</b> {formatDate(booking.createdAt)}</p>
            <p style={{ margin: '2px 0', fontSize: '11px' }}><b>Room:</b> {booking.roomNumber || 'N/A'}</p>
          </div>
        </div>

        {/* Stay Details */}
        <div style={{ marginBottom: '10px' }}>
          <h2 style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 'bold' }}>STAY DETAILS:</h2>
          <div style={{ display: 'flex', gap: '40px', fontSize: '11px' }}>
            <div>
              <p style={{ margin: 0, color: '#666' }}>Check-in:</p>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{formatDate(booking.checkIn)}</p>
            </div>
            <div>
              <p style={{ margin: 0, color: '#666' }}>Check-out:</p>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{formatDate(booking.checkOut)}</p>
            </div>
            <div>
              <p style={{ margin: 0, color: '#666' }}>Duration:</p>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{days} {days === 1 ? 'Night' : 'Nights'}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '10px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #222', borderTop: '2px solid #222' }}>
              <th style={{ textAlign: 'left', padding: '6px 4px' }}>Description</th>
              <th style={{ textAlign: 'right', padding: '6px 4px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '5px 4px' }}>Room Charges ({days} {days === 1 ? 'night' : 'nights'})</td>
              <td style={{ textAlign: 'right', padding: '5px 4px' }}>₹{(booking.baseAmount || 0).toFixed(2)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '5px 4px' }}>GST (5%)</td>
              <td style={{ textAlign: 'right', padding: '5px 4px' }}>₹{(booking.gstAmount || 0).toFixed(2)}</td>
            </tr>
            <tr style={{ borderBottom: '2px solid #222', fontWeight: 'bold' }}>
              <td style={{ padding: '5px 4px' }}>Total Amount</td>
              <td style={{ textAlign: 'right', padding: '5px 4px' }}>₹{(booking.totalAmount || 0).toFixed(2)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '5px 4px', color: '#16a34a' }}>
                Advance Paid ({(booking.paymentMode || 'cash').toUpperCase()})
              </td>
              <td style={{ textAlign: 'right', padding: '5px 4px', color: '#16a34a' }}>
                -₹{actualAdvancePayment.toFixed(2)}
              </td>
            </tr>
            {booking.finalPaymentAmount > 0 && booking.paymentStatus === 'paid' && (
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '5px 4px', color: '#16a34a' }}>
                  Remaining Paid ({(booking.finalPaymentMode || 'cash').toUpperCase()})
                </td>
                <td style={{ textAlign: 'right', padding: '5px 4px', color: '#16a34a' }}>
                  -₹{(booking.finalPaymentAmount || 0).toFixed(2)}
                </td>
              </tr>
            )}
            <tr style={{ borderTop: '2px solid #222', fontWeight: 'bold' }}>
              <td style={{ padding: '5px 4px' }}>Amount Due</td>
              <td style={{
                textAlign: 'right',
                padding: '5px 4px',
                color: (booking.remainingAmount || 0) === 0 ? '#16a34a' : '#dc2626'
              }}>
                ₹{(booking.remainingAmount || 0).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer Info */}
        <div style={{ fontSize: '11px', borderTop: '1px solid #ddd', paddingTop: '8px', marginBottom: '10px' }}>
          <p style={{ margin: '2px 0', color: '#555' }}>
            Initial Payment Mode: <b style={{ textTransform: 'uppercase' }}>{booking.paymentMode || 'N/A'}</b>
          </p>
          {booking.finalPaymentMode && booking.paymentStatus === 'paid' && (
            <p style={{ margin: '2px 0', color: '#555' }}>
              Final Payment Mode: <b style={{ textTransform: 'uppercase' }}>{booking.finalPaymentMode}</b>
            </p>
          )}
          <p style={{ margin: '2px 0', color: '#555' }}>Number of Adults: <b>{booking.numberOfAdults || 1}</b></p>
          {booking.paymentStatus === 'paid' && booking.paidAt && formatDate(booking.paidAt) !== 'N/A' && (
            <p style={{ margin: '4px 0 0', color: '#16a34a', fontWeight: 'bold' }}>
              ✓ Fully Paid on {formatDate(booking.paidAt)}
            </p>
          )}
        </div>

        {/* Thank You */}
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#666', borderTop: '1px solid #ddd', paddingTop: '8px' }}>
          <p style={{ margin: '2px 0' }}>Thank you for choosing Hotel Krishna!</p>
          <p style={{ margin: '2px 0' }}>For any queries, contact us at +91 {OWNER_PHONE} | info@hotelkrishna.com</p>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex justify-between items-center px-1">
          <h1 className="text-2xl md:text-3xl font-bold">Billing & Invoices</h1>
        </div>

        {/* Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card className="p-3 md:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-0">
              <CardTitle className="text-xs md:text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-1">
              <div className="text-lg md:text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">From all bookings</p>
            </CardContent>
          </Card>
          <Card className="p-3 md:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-0">
              <CardTitle className="text-xs md:text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-1">
              <div className="text-lg md:text-2xl font-bold">{completedBookings.length}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Generated invoices</p>
            </CardContent>
          </Card>
          <Card className="p-3 md:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-0">
              <CardTitle className="text-xs md:text-sm font-medium">Advance Collected</CardTitle>
              <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
            </CardHeader>
            <CardContent className="p-0 pt-1">
              <div className="text-lg md:text-2xl font-bold text-green-600">₹{totalAdvance.toFixed(2)}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Total advance payments</p>
            </CardContent>
          </Card>
          <Card className="p-3 md:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 p-0">
              <CardTitle className="text-xs md:text-sm font-medium">Amount Pending</CardTitle>
              <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
            </CardHeader>
            <CardContent className="p-0 pt-1">
              <div className="text-lg md:text-2xl font-bold text-red-600">₹{totalRemaining.toFixed(2)}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Remaining to collect</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="p-3 md:p-6">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer name, room number, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-2">
              Tap on any booking to view action buttons
            </p>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="space-y-3 md:space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading bills...</p>
                </div>
              ) : filteredBills.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg mb-2">No bills found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
                </div>
              ) : (
                filteredBills.map((booking) => {
                  const hasDueAmount = (booking.remainingAmount || 0) > 0;
                  const isPaid = (booking.remainingAmount || 0) === 0;
                  const isExpanded = expandedBooking === booking.id;
                  const isSharing = sharingBookingId === booking.id;

                  return (
                    <div key={booking.id} className={`booking-card mobile-billing-card border rounded-lg overflow-hidden transition-all duration-200 ${isExpanded ? 'expanded border-primary/20 shadow-sm' : 'hover:border-muted-foreground/20'}`}>
                      {/* Main booking info - clickable */}
                      <div 
                        className="flex items-start justify-between p-3 md:p-4 hover:bg-muted/50 transition-colors cursor-pointer select-none"
                        onClick={() => toggleBookingExpansion(booking.id)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 md:gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="customer-name font-medium text-base md:text-lg truncate">{booking.customerName || 'N/A'}</p>
                              {booking.gstNumber ? (
                                <p className="text-xs text-blue-600 font-medium mt-0.5 truncate">GST: {booking.gstNumber}</p>
                              ) : (
                                <p className="text-xs text-muted-foreground mt-0.5">GST: Not Provided</p>
                              )}
                              <p className="text-xs md:text-sm text-muted-foreground mt-1 truncate">
                                Room {booking.roomNumber || 'N/A'} • {booking.checkIn ? format(new Date(booking.checkIn), 'MMM dd') : 'N/A'} - {booking.checkOut ? format(new Date(booking.checkOut), 'MMM dd, yyyy') : 'N/A'}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                {booking.customerPhone || 'N/A'} • {(booking.paymentMode || 'cash').toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                          <div className="text-right">
                            <p className="amount font-bold text-lg md:text-xl">₹{(booking.totalAmount || 0).toFixed(2)}</p>
                            <p className="text-xs md:text-sm text-muted-foreground">Advance: ₹{(booking.advancePayment || 0).toFixed(2)}</p>
                            {isPaid ? (
                              <div className="flex items-center gap-1 mt-1 justify-end">
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Paid
                                </Badge>
                              </div>
                            ) : hasDueAmount ? (
                              <p className="text-xs md:text-sm text-red-600 font-medium">Due: ₹{(booking.remainingAmount || 0).toFixed(2)}</p>
                            ) : null}
                            <div className="mt-1 flex justify-end">
                              <Badge className={
                                booking.status === 'checked-out' ? 'bg-gray-100 text-gray-800 text-xs' :
                                booking.status === 'checked-in' ? 'bg-blue-100 text-blue-800 text-xs' :
                                'bg-green-100 text-green-800 text-xs'
                              }>
                                {booking.status || 'pending'}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-muted-foreground transition-transform duration-200 flex-shrink-0">
                            <div className={`transform ${isExpanded ? 'rotate-90' : ''} text-lg`}>
                              ▶
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded action buttons */}
                      {isExpanded && (
                        <div className="booking-actions px-3 md:px-4 pb-3 md:pb-4 border-t bg-muted/20">
                          <div className="mobile-billing-actions flex flex-col gap-2 pt-3">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddGstClick(booking);
                              }}
                              className="w-full justify-start"
                            >
                              {booking.gstNumber ? (
                                <><Edit2 className="h-4 w-4 mr-2" />Edit GST Number</>
                              ) : (
                                <><Plus className="h-4 w-4 mr-2" />Add GST Number</>
                              )}
                            </Button>
                            
                            {hasDueAmount && !isPaid && (
                              <Button 
                                size="sm" 
                                variant="default" 
                                className="bg-green-600 hover:bg-green-700 w-full justify-start" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsPaidClick(booking);
                                }}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Mark as Paid (₹{(booking.remainingAmount || 0).toFixed(2)})
                              </Button>
                            )}
                            
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={(e) => {
                                e.stopPropagation();
                                generateInvoice(booking);
                              }}
                              className="w-full justify-start"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Generate Invoice
                            </Button>

                            {/* ── SHARE BILL BUTTON ── */}
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isSharing}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShareBill(booking);
                              }}
                              className="w-full justify-start border-green-500 text-green-700 hover:bg-green-50 hover:text-green-800"
                            >
                              {isSharing ? (
                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sharing...</>
                              ) : (
                                <>
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Share Bill to {booking.customerPhone ? booking.customerPhone : 'Customer'}
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Invoice Dialog */}
        <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
          <DialogContent className="max-w-[95vw] w-full md:max-w-3xl max-h-[90vh] overflow-y-auto print:max-w-full print:max-h-full print:overflow-visible print:shadow-none print:border-0 p-3 md:p-6">
            <DialogHeader className="print:hidden pb-2">
              <DialogTitle className="flex items-center justify-between text-lg">
                <span>Invoice</span>
                <Button size="sm" onClick={downloadInvoice} className="ml-2">
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Download PDF</span>
                  <span className="sm:hidden">PDF</span>
                </Button>
              </DialogTitle>
            </DialogHeader>
            {selectedBooking && <Invoice booking={selectedBooking} />}
          </DialogContent>
        </Dialog>

        {/* Print styles */}
        <style>{`
          @media print {
            @page {
              size: A4 portrait;
              margin: 12mm 15mm;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box !important;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #fff !important;
              width: 100% !important;
            }
            body > * {
              display: none !important;
            }
            #invoice-print-wrapper {
              display: block !important;
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              width: 100% !important;
            }
            #invoice {
              width: 100% !important;
              max-width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
              font-size: 12px !important;
              line-height: 1.5 !important;
              background: #fff !important;
              color: #000 !important;
            }
          }
        `}</style>

        {/* Payment Confirm Dialog */}
        <Dialog open={showPaymentConfirm} onOpenChange={setShowPaymentConfirm}>
          <DialogContent className="max-w-[95vw] w-full md:max-w-md p-4 md:p-6">
            <DialogHeader>
              <DialogTitle className="text-lg">Confirm Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">Are you sure you want to mark this booking as fully paid?</p>
              {bookingToMarkPaid && (
                <div className="bg-muted p-3 md:p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Customer:</span>
                    <span className="text-sm truncate ml-2">{bookingToMarkPaid.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Room:</span>
                    <span className="text-sm">{bookingToMarkPaid.roomNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Amount:</span>
                    <span className="text-sm font-bold">₹{(bookingToMarkPaid.totalAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Already Paid:</span>
                    <span className="text-sm text-green-600">₹{(bookingToMarkPaid.advancePayment || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-sm font-medium">Amount to Pay:</span>
                    <span className="text-sm font-bold text-red-600">₹{(bookingToMarkPaid.remainingAmount || 0).toFixed(2)}</span>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select value={paymentMethod} onValueChange={(value: 'cash' | 'gpay') => setPaymentMethod(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="gpay">GPay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
              <Button variant="outline" onClick={handleCancelPayment} disabled={isProcessingPayment} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleConfirmPayment} disabled={isProcessingPayment} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                {isProcessingPayment ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing...</>
                ) : (
                  <><CheckCircle2 className="h-4 w-4 mr-2" />Confirm Payment</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* GST Dialog */}
        <Dialog open={showGstDialog} onOpenChange={setShowGstDialog}>
          <DialogContent className="max-w-[95vw] w-full md:max-w-md p-4 md:p-6">
            <DialogHeader>
              <DialogTitle className="text-lg">{bookingForGst?.gstNumber ? 'Edit GST Number' : 'Add GST Number'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">Enter the customer's GST number for tax purposes. This will be displayed on the invoice.</p>
              {bookingForGst && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm font-medium truncate">{bookingForGst.customerName}</p>
                  <p className="text-xs text-muted-foreground truncate">{bookingForGst.customerPhone}</p>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">GST Number</label>
                <Input
                  placeholder="27ABCDE1234F1Z5"
                  value={gstNumber}
                  onChange={(e) => handleGstChange(e.target.value)}
                  maxLength={15}
                  className={`w-full ${gstError ? 'border-red-500' : ''}`}
                />
                <p className="text-xs text-muted-foreground">Format: 15 characters (e.g., 27ABCDE1234F1Z5)</p>
                {gstError && <p className="text-xs text-red-600">{gstError}</p>}
              </div>
            </div>
            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
              <Button variant="outline" onClick={handleCancelGst} disabled={isProcessingGst} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleSaveGst} disabled={isProcessingGst} className="w-full sm:w-auto">
                {isProcessingGst ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                ) : (
                  <><CheckCircle2 className="h-4 w-4 mr-2" />Save GST</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}