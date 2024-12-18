import { AppDispatch, RootState } from "@/app/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScheduleCalendar } from "../components/ScheduleCalendar";
import { fetchMySchedules } from "../slice/scheduleSlice";

export const SchedulePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, schedules } = useSelector(
    (state: RootState) => state.schedule
  );

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    dispatch(fetchMySchedules());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Schedules</h1>
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
        <ScheduleCalendar
          schedules={schedules}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
        />
      )}
    </div>
  );
};
