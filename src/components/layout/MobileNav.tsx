import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/FirebaseAuthContext';
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = 
    user?.role === 'admin' ? [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
      { icon: Users, label: 'Staff', href: '/admin/receptionists' },
      { icon: BedDouble, label: 'Rooms', href: '/admin/rooms' },
      { icon: CalendarCheck, label: 'Bookings', href: '/admin/bookings' },
    ] : user?.role === 'receptionist' ? [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/receptionist/dashboard' },
      { icon: CalendarCheck, label: 'Bookings', href: '/receptionist/bookings' },
    ] : [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/customer/dashboard' },
      { icon: BedDouble, label: 'Rooms', href: '/customer/rooms' },
      { icon: CalendarCheck, label: 'Bookings', href: '/customer/bookings' },
    ];

  return (
    <nav className="mobile-nav">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                'mobile-nav-item flex-1',
                isActive && 'active text-primary'
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
