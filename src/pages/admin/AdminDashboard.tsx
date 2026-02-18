import React from 'react';
import { useAuth } from '@/contexts/FirebaseAuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Users, BedDouble, DollarSign, TrendingUp } from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminStats';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { stats, loading } = useAdminStats();

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Rooms"
            value={stats?.totalRooms || 0}
            icon={BedDouble}
            variant="primary"
          />
          <StatCard
            title="Total Receptionists"
            value={stats?.totalReceptionists || 0}
            icon={Users}
            variant="success"
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${stats?.monthlyRevenue || 0}`}
            icon={DollarSign}
            variant="warning"
          />
          <StatCard
            title="Occupancy Rate"
            value={`${stats?.occupancyRate || 0}%`}
            icon={TrendingUp}
            variant="info"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
