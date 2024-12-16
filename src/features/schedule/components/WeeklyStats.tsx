import { Schedule } from "../types/schedule.type";
import { addDays, format, startOfWeek } from "date-fns";
import { AlertCircle } from "lucide-react";
import { getShiftTypeStyle } from "../\butils/schedule.utils";

interface WeeklyStatsProps {
  schedules: Schedule[];
  pendingLeaves?: number;
  currentDate: Date;
  onDateSelect: (date: Date) => void;
}

export const WeeklyStats = ({
  schedules,
  pendingLeaves,
  currentDate,
  onDateSelect,
}: WeeklyStatsProps) => {
  const getWeekDays = () => {
    const start = startOfWeek(currentDate);
    return [...Array(7)].map((_, i) => addDays(start, i));
  };

  const getDayStats = (date: Date) => {
    const daySchedules = schedules.filter(
      (schedule) =>
        new Date(schedule.start_time).toDateString() === date.toDateString()
    );

    const stats = {
      total: daySchedules.length,
      morning: daySchedules.filter((s) => s.shift_type === "morning").length,
      afternoon: daySchedules.filter((s) => s.shift_type === "afternoon")
        .length,
      evening: daySchedules.filter((s) => s.shift_type === "evening").length,
    };

    return stats;
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Weekly Overview</h3>
      </div>
      <div className="grid grid-cols-7 gap-4 p-4">
        {getWeekDays().map((day) => {
          const stats = getDayStats(day);

          return (
            <div
              key={day.toISOString()}
              className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onDateSelect(day)}
            >
              <div className="text-sm font-medium text-gray-900 mb-2">
                {format(day, "EEE")}
                <span className="block text-xs text-gray-500">
                  {format(day, "MMM d")}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Total:</span>
                  <span className="text-sm font-medium">{stats.total}</span>
                </div>

                {Object.entries(stats).map(([key, value]) => {
                  if (key === "total") return null;
                  return (
                    <div
                      key={key}
                      className={`text-xs px-2 py-1 rounded ${getShiftTypeStyle(
                        // TODO: Fix type error
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        key as any
                      )}`}
                    >
                      {value}
                    </div>
                  );
                })}

                {(pendingLeaves ?? 0) > 0 && (
                  <div className="flex items-center text-xs text-amber-600 mt-2">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {pendingLeaves} pending
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
