import { useState, useEffect } from "react";
import { LayoutGrid, LayoutList, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import {
  fetchAllSchedules,
  updateScheduleStatus,
  deleteSchedule,
} from "../slice/scheduleSlice";
import CreateScheduleForm from "../components/CreateScheduleForm";
import { ScheduleStatus } from "../types/schedule.type";
import ScheduleManagement from "../components/ScheduleManagement";
import { WeeklyStats } from "../components/WeeklyStats";
import { DailyEmployeeList } from "../components/DailyEmployeeList";

export const AdminSchedulePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { schedules, isLoading, error } = useSelector(
    (state: RootState) => state.schedule
  );

  // View States
  const [view, setView] = useState<"overview" | "table">("overview");
  const [overviewMode, setOverviewMode] = useState<"week" | "month">("week");

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Date States
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    dispatch(fetchAllSchedules());
  }, [dispatch]);

  const handleStatusChange = async (
    scheduleId: number,
    status: ScheduleStatus
  ) => {
    try {
      await dispatch(updateScheduleStatus({ scheduleId, status })).unwrap();
    } catch (error) {
      console.error("Failed to update schedule status:", error);
    }
  };

  const handleDelete = async (scheduleId: number) => {
    try {
      await dispatch(deleteSchedule(scheduleId)).unwrap();
    } catch (error) {
      console.error("Failed to delete schedule:", error);
    }
  };

  const dailySchedules = schedules.filter(
    (schedule) =>
      new Date(schedule.start_time).toDateString() ===
      selectedDate.toDateString()
  );

  const handleDateChange = (increment: boolean) => {
    if (overviewMode === "week") {
      setCurrentDate((prev) => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() + (increment ? 7 : -7));
        return newDate;
      });
    } else {
      const newDate = new Date(currentDate);
      if (increment) {
        newDate.setMonth(newDate.getMonth() + 1);
      } else {
        newDate.setMonth(newDate.getMonth() - 1);
      }
      setCurrentDate(newDate);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Schedule Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and oversee all employee schedules
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* View Type Toggle */}
          <div className="flex items-center bg-white rounded-lg shadow border p-1">
            <button
              onClick={() => setView("overview")}
              className={`p-2 rounded ${
                view === "overview"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              title="Overview"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView("table")}
              className={`p-2 rounded ${
                view === "table"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              title="List"
            >
              <LayoutList className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Schedule
          </button>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {view === "overview" && (
            <>
              <WeeklyStats
                schedules={schedules}
                pendingLeaves={0}
                currentDate={currentDate}
                onDateSelect={(date) => {
                  setCurrentDate(date);
                  setSelectedDate(date);
                }}
                viewMode={overviewMode}
                onViewModeChange={setOverviewMode}
                onDateChange={handleDateChange}
              />
              <DailyEmployeeList
                date={selectedDate}
                schedules={dailySchedules}
              />
            </>
          )}

          {view === "table" && (
            <div className="bg-white rounded-lg shadow">
              <ScheduleManagement
                schedules={schedules}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </div>
          )}
        </div>
      )}

      {/* Create Schedule Modal */}
      <CreateScheduleForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};
