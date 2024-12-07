import { useState } from "react";
import { DashboardStats } from "../components/DashboardStats";
import { MainLayout } from "@/shared/components/Layout/MainLayout";

export function AdminDashboard() {
  // TODO: Redux for actual data
  const [stats, setStats] = useState({
    totalEmployees: 25,
    activeEmployees: 18,
    todayShifts: 15,
    pendingRequests: 3,
    conflicts: 1,
    trend: {
      value: 2.5,
      isPositive: true,
    },
  });

  return (
    <MainLayout userRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        <DashboardStats stats={stats} />

        {/* TODO: sections will work on */}
        {/* <EmployeeOverview /> */}
        {/* <RecentActivities /> */}
      </div>
    </MainLayout>
  );
}
