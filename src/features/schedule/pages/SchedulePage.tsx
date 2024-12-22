import { AppDispatch, RootState } from "@/app/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScheduleCalendar } from "../components/ScheduleCalendar";
import { fetchMySchedules } from "../slice/scheduleSlice";
import { useLocation } from "react-router-dom";
import { ShiftDetail } from "../components/ShiftDetail";
import { toast } from "react-toastify";

export const SchedulePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { isLoading, error, schedules } = useSelector(
    (state: RootState) => state.schedule
  );
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null
  );

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    dispatch(fetchMySchedules());
  }, [dispatch]);

  // SchedulePage.tsx
  useEffect(() => {
    const handleScheduleSelection = async (scheduleId: number) => {
      // schedules에서 먼저 찾기
      const found = schedules.find((s) => s.id === scheduleId);
      if (found) {
        setSelectedScheduleId(scheduleId);
      } else {
        // schedules에 없는 경우 전체 목록 다시 fetch
        try {
          await dispatch(fetchMySchedules()).unwrap();
          setSelectedScheduleId(scheduleId);
        } catch (error) {
          console.error("Failed to load schedule:", error);
          toast.error("Failed to load schedule details");
        }
      }
    };

    // notification에서 온 경우나 일반 선택의 경우
    if (location.state?.from === "notification" && location.state?.id) {
      handleScheduleSelection(location.state.id);
    }
  }, [location.state, schedules, dispatch]);

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="flex justify-between items-center mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Schedules
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
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

      {selectedScheduleId && (
        <ShiftDetail
          isOpen={true}
          onClose={() => setSelectedScheduleId(null)}
          schedule={schedules.find((s) => s.id === selectedScheduleId) || null}
        />
      )}
    </div>
  );
};
