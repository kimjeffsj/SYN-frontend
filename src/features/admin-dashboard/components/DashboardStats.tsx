import StatsCard from "@/shared/components/StatsCard";
import { AlertCircle, BarChart3, Calendar, Users } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    totalEmployees: number;
    activeEmployees: number;
    todayShifts: number;
    pendingRequests: number;
    conflicts: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <StatsCard
        title="Active Employees"
        value={`${stats.activeEmployees}/${stats.totalEmployees}`}
        icon={Users}
        iconClassName="bg-blue-50 text-blue-500 p-4 sm:p-6"
      />

      <StatsCard
        title="Today's Shifts"
        value={stats.todayShifts}
        icon={Calendar}
        iconClassName="bg-purple-50 text-purple-500 p-4 sm:p-6"
      />

      <StatsCard
        title="Pending Requests"
        value={stats.pendingRequests}
        icon={BarChart3}
        iconClassName="bg-yellow-50 text-yellow-500 p-4 sm:p-6"
      />

      <StatsCard
        title="Schedule Conflicts"
        value={stats.conflicts}
        icon={AlertCircle}
        iconClassName="bg-red-50 text-red-500 p-4 sm:p-6"
      />
    </div>
  );
}
