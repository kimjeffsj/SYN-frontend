import { AppDispatch, RootState } from "@/app/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../slice/adminDashboardSlice";
import { Bell, Menu } from "lucide-react";
import { EmployeeOverview } from "../components/EmployeeOverview";
import { RecentAnnouncements } from "../components/RecentAnnouncements";
import { DashboardStats } from "../components/DashboardStats";
import { SideNav } from "../components/SideNav";
import { PendingRequests } from "../components/PendingRequests";

export const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const { stats, employees, recentUpdates, announcements, isLoading, error } =
    useSelector((state: RootState) => state.adminDashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const handleEmployeeClick = (employeeId: number) => {
    console.log("Employee Clicked: ", employeeId);
  };

  const handleRequestApproval = (requestId: number) => {
    console.log("Request approved: ", requestId);
  };

  const handleRequestRejection = (requestId: number) => {
    console.log("Request rejected: ", requestId);
  };

  const handleAnnouncementClick = (id: number) => {
    console.log("Announcement clicked: ", id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Overview and team management</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                {recentUpdates.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              <button onClick={() => setIsNavOpen(true)}>
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Stats Overview */}
          {stats && <DashboardStats stats={stats} />}

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left - Employee Overview */}
            <div className="lg:col-span-8 space-y-6">
              <EmployeeOverview
                employees={employees}
                onEmployeeClick={handleEmployeeClick}
              />

              <RecentAnnouncements
                announcements={announcements}
                onViewAll={() => console.log("View all announcements")}
                onAnnouncementClick={handleAnnouncementClick}
              />
            </div>

            {/* Right - Requests */}
            <div className="lg:col-span-4">
              <PendingRequests
                requests={recentUpdates}
                onApprove={handleRequestApproval}
                onReject={handleRequestRejection}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Side Nav */}
      <SideNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
    </div>
  );
};
