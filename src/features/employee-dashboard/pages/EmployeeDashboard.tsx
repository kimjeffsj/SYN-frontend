import { AppDispatch, RootState } from "@/app/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchDashboardData,
  markAnnouncementAsRead,
} from "../slice/employeeDashboardSlice";
import { ScheduleOverview } from "../components/scheduleOverview";
import { AnnouncementList } from "../components/AnnouncementList";
import StatsCard from "@/shared/components/StatsCard";
import { Briefcase, Calendar, CheckCircle2, Clock } from "lucide-react";

export const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { employee, stats, weeklySchedule, announcements, isLoading, error } =
    useSelector((state: RootState) => state.employeeDashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const handleAnnouncementClick = (id: number) => {
    dispatch(markAnnouncementAsRead(id));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;
  }

  if (!employee || !stats) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {employee.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Hours"
          value={`${stats.totalHours}h`}
          icon={Clock}
          iconClassName="bg-blue-50 text-blue-600"
        />
        <StatsCard
          title="Completed Shifts"
          value={stats.completedShifts}
          icon={CheckCircle2}
          iconClassName="bg-green-50 text-green-600"
        />
        <StatsCard
          title="Upcoming Shifts"
          value={stats.upcomingShifts}
          icon={Calendar}
          iconClassName="bg-purple-50 text-purple-600"
        />
        <StatsCard
          title="Leave Balance"
          value={`${stats.leaveBalance} days`}
          icon={Briefcase}
          iconClassName="bg-orange-50 text-orange-600"
        />
      </div>

      {/* Schedule Overview */}
      <ScheduleOverview
        weeklySchedule={weeklySchedule}
        onViewDetail={() => navigate("/schedule")}
      />

      {/* Announcements */}
      {announcements && announcements.length > 0 && (
        <AnnouncementList
          announcements={announcements}
          onViewDetail={() => navigate("/announcements")}
          onAnnouncementClick={handleAnnouncementClick}
        />
      )}
    </div>
  );
};
