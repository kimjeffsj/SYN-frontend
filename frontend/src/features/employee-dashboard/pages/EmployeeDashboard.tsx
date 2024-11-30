import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Bell, Menu } from "lucide-react";

import { AnnouncementList } from "../components/AnnouncementList";

import { RootState } from "@/app/store";
import { markAnnouncementAsRead } from "../slice/employeeDashboardSlice";
import { ScheduleOverview } from "../components/scheduleOverview";
import { SideNav } from "../components/SideNav";

export const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const { employee, weeklySchedule, announcements } = useSelector(
    (state: RootState) => state.employeeDashboard
  );

  const handleAnnouncementClick = (id: number) => {
    dispatch(markAnnouncementAsRead(id));
    // TODO: Navigate to announcement detail
  };

  if (!employee) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-primary">
              {employee.name}
            </h1>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span>{employee.department}</span>
              <span>{employee.position}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative">
              <Bell className="w-6 h-6 text-secondary" />
              {announcements.some((a) => a.isNew) && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <button onClick={() => setIsNavOpen(true)}>
              <Menu className="w-6 h-6 text-secondary" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <ScheduleOverview
          weeklySchedule={weeklySchedule}
          onViewDetail={() => navigate("/schedule")}
        />

        <AnnouncementList
          announcements={announcements}
          onViewDetail={() => navigate("/announcements")}
          onAnnouncementClick={handleAnnouncementClick}
        />
      </div>

      <SideNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
    </div>
  );
};
