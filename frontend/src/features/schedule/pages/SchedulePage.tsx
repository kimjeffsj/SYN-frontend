import { AppDispatch, RootState } from "@/app/store";
import { CalendarPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScheduleCalendar } from "../components/ScheduleCalendar";
import { CreateScheduleForm } from "../components/CreateScheduleForm";
import { fetchMySchedules } from "../slice/scheduleSlice";

export const SchedulePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isLoading, error } = useSelector(
    (state: RootState) => state.schedule
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMySchedules());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Schedule Management
        </h1>
        {user?.role === "admin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <CalendarPlus className="w-5 h-5" />
            <span>New Schedule</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ScheduleCalendar />
      )}

      <CreateScheduleForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
