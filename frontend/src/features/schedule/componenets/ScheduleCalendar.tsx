import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { Schedule } from "../types/schedule.type";
import { Clock } from "lucide-react";

const ShiftTypeColors = {
  morning: "bg-blue-100 text-blue-800",
  afternoon: "bg-purple-100 text-purple-800",
  evening: "bg-indigo-100 text-indigo-800",
  full_day: "bg-green-100 text-green-800",
};

export const ScheduleCalendar = () => {
  const { schedules, isLoading, error } = useSelector(
    (state: RootState) => state.schedule
  );

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderSchedule = (schedule: Schedule) => (
    <div
      key={schedule.id}
      className={`p-3 rounded-lg mb-2 ${ShiftTypeColors[schedule.shift_type]}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium">{schedule.shift_type}</span>
        <span className="text-sm">{schedule.status}</span>
      </div>

      <div className="flex items-center text-sm">
        <Clock className="w-4 h-4 mr-1" />
        {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
      </div>
      {schedule.description && (
        <p className="text-sm mt-1 text-gray-600">{schedule.description}</p>
      )}
    </div>
  );

  if (isLoading) {
    return <div>Loading schedules...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">My Schedules</h2>
      </div>

      <div className="p-4">
        <div className="gird grid-cols-7 gap-4">
          {/* Calendar */}
          <div>{schedules.map((schedule) => renderSchedule(schedule))}</div>
        </div>
      </div>
    </div>
  );
};
