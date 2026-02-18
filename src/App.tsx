import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/FirebaseAuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TestFirebase from "./pages/TestFirebase";
import CheckUser from "./pages/CheckUser";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageReceptionists from "./pages/admin/ManageReceptionists";
import ManageRooms from "./pages/admin/ManageRooms";
import ReceptionistDashboard from "./pages/receptionist/ReceptionistDashboard";
import ManageBookings from "./pages/receptionist/ManageBookings";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerRooms from "./pages/customer/CustomerRooms";
import CustomerBookings from "./pages/customer/CustomerBookings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/test-firebase" element={<TestFirebase />} />
            <Route path="/check-user" element={<CheckUser />} />
            
            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/receptionists"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageReceptionists />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/rooms"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageRooms />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageBookings />
                </ProtectedRoute>
              }
            />
            
            {/* Receptionist Routes */}
            <Route
              path="/receptionist/dashboard"
              element={
                <ProtectedRoute allowedRoles={['receptionist']}>
                  <ReceptionistDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/receptionist/bookings"
              element={
                <ProtectedRoute allowedRoles={['receptionist']}>
                  <ManageBookings />
                </ProtectedRoute>
              }
            />
            
            {/* Customer Routes */}
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/rooms"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerRooms />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/bookings"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerBookings />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
