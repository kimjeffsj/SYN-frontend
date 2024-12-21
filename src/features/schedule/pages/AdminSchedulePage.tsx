import { useState, useEffect } from "react";
import { Calendar, LayoutList, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import {
  fetchAllSchedules,
  updateScheduleStatus,
  deleteSchedule,
} from "../slice/scheduleSlice";
import ScheduleCalendar from "../components/ScheduleCalendar";
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
  const [view, setView] = useState<"calendar" | "table">("calendar");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeSection, setActiveSection] = useState<
    "stats" | "calendar" | "table"
  >("stats");
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

  useEffect(() => {
    console.log("Schedules updated:", schedules);
  }, [schedules]);

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
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveSection("stats")}
              className={`px-3 py-1.5 rounded-md flex items-center ${
                activeSection === "stats"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Overview
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1.5 rounded-md flex items-center ${
                view === "table"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <LayoutList className="w-4 h-4 mr-2" />
              List
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
          {activeSection === "stats" && (
            <>
              <WeeklyStats
                schedules={schedules}
                pendingLeaves={0} // TODO: Implement pending leaves count
                currentDate={currentDate}
                onDateSelect={(date) => {
                  setCurrentDate(date);
                  setSelectedDate(date);
                }}
              />
              <DailyEmployeeList
                date={selectedDate}
                schedules={dailySchedules}
              />
            </>
          )}
          <div className="bg-white rounded-lg shadow">
            {activeSection === "calendar" ? (
              <ScheduleCalendar
                schedules={schedules}
                currentDate={currentDate}
                onDateChange={setCurrentDate}
              />
            ) : activeSection === "table" ? (
              <ScheduleManagement
                schedules={schedules}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ) : null}
          </div>
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
