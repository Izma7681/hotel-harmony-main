import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/FirebaseAuthContext';
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Users,
  DollarSign,
  FileText,
  TrendingUp,
  UserCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = 
    user?.role === 'admin' ? [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
      { icon: BedDouble, label: 'Rooms', href: '/admin/rooms' },
      { icon: CalendarCheck, label: 'Bookings', href: '/admin/bookings' },
      { icon: DollarSign, label: 'Billing', href: '/admin/billing' },
      { icon: FileText, label: 'Reports', href: '/admin/reports' },
      { icon: TrendingUp, label: 'Expenses', href: '/admin/expenses' },
      { icon: UserCircle, label: 'Customers', href: '/admin/customers' },
      { icon: Users, label: 'Staff', href: '/admin/receptionists' },
    ] : user?.role === 'receptionist' ? [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/receptionist/dashboard' },
      { icon: BedDouble, label: 'Rooms', href: '/receptionist/rooms' },
      { icon: CalendarCheck, label: 'Bookings', href: '/receptionist/bookings' },
      { icon: DollarSign, label: 'Billing', href: '/receptionist/billing' },
    ] : [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/customer/dashboard' },
      { icon: BedDouble, label: 'Rooms', href: '/customer/rooms' },
      { icon: CalendarCheck, label: 'Bookings', href: '/customer/bookings' },
    ];

  return (
    <nav className="mobile-nav">
      <div className="flex items-center h-16 px-2 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 min-w-max">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  'mobile-nav-item flex-shrink-0 min-w-[70px]',
                  isActive && 'active text-primary'
                )}
              >
                <item.icon className={cn('h-4 w-4', isActive && 'text-primary')} />
                <span className="text-[10px] mt-1 leading-tight">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
