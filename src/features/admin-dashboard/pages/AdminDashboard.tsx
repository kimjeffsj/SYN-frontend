import { useEffect } from "react";
import { DashboardStats } from "../components/DashboardStats";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { fetchDashboardStats } from "../slice/adminDashboardSlice";

export function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, isLoading, error } = useSelector(
    (state: RootState) => state.adminDashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (isLoading || !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <DashboardStats
        stats={{
          totalEmployees: stats.employees.total,
          activeEmployees: stats.employees.active,
          todayShifts: stats.schedules.today,
          pendingRequests: stats.employees.pendingApproval,
          conflicts: stats.schedules.conflicts,
        }}
      />
    </div>
  );
}
