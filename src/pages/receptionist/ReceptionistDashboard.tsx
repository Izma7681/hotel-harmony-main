import React from 'react';
import { useAuth } from '@/contexts/FirebaseAuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { BedDouble, CalendarCheck, Users } from 'lucide-react';
import { useReceptionistStats } from '@/hooks/useReceptionistStats';

export default function ReceptionistDashboard() {
  const { user } = useAuth();
  const { stats, loading } = useReceptionistStats();

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Receptionist Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Available Rooms"
            value={stats?.availableRooms || 0}
            icon={BedDouble}
            variant="success"
          />
          <StatCard
            title="Today's Check-ins"
            value={stats?.todayCheckIns || 0}
            icon={CalendarCheck}
            variant="info"
          />
          <StatCard
            title="Today's Check-outs"
            value={stats?.todayCheckOuts || 0}
            icon={Users}
            variant="warning"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
