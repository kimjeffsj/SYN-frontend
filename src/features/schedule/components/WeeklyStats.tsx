import { Schedule } from "../types/schedule.type";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { getShiftTypeStyle } from "../\butils/schedule.utils";

interface WeeklyStatsProps {
  schedules: Schedule[];
  pendingLeaves?: number;
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  viewMode: "week" | "month";
  onViewModeChange: (mode: "week" | "month") => void;
  onDateChange: (increment: boolean) => void;
}

export const WeeklyStats = ({
  schedules,
  pendingLeaves,
  currentDate,
  onDateSelect,
  viewMode,
  onViewModeChange,
  onDateChange,
}: WeeklyStatsProps) => {
  const getDays = () => {
    if (viewMode === "week") {
      const start = startOfWeek(currentDate);
      return [...Array(7)].map((_, i) => addDays(start, i));
    } else {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      return eachDayOfInterval({ start: monthStart, end: monthEnd });
    }
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

  const days = getDays();

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        {/* 좌측: 제목과 뷰 모드 토글 */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:space-x-4 w-full sm:w-auto">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Schedule Overview
          </h3>
          {/* 뷰 모드 토글 버튼 */}
          <div className="flex items-center bg-gray-100 rounded-lg">
            <button
              onClick={() => onViewModeChange("week")}
              className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                viewMode === "week"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => onViewModeChange("month")}
              className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                viewMode === "month"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* 우측: 날짜 네비게이션 */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => onDateChange(false)}
            className="p-1.5 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
          <span className="text-xs sm:text-sm font-medium text-gray-700 min-w-[100px] sm:min-w-[120px] text-center">
            {format(
              currentDate,
              viewMode === "week" ? "MMM d, yyyy" : "MMMM yyyy"
            )}
          </span>
          <button
            onClick={() => onDateChange(true)}
            className="p-1.5 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 캘린더 그리드 */}
      <div className="p-2 sm:p-4 overflow-x-auto">
        <div
          className={`grid ${
            viewMode === "month"
              ? "grid-cols-7 gap-1 sm:gap-2 min-w-[640px]"
              : "grid-cols-1 sm:grid-cols-7 gap-2 sm:gap-4"
          }`}
        >
          {days.map((day) => {
            const stats = getDayStats(day);
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <div
                key={day.toISOString()}
                onClick={() => onDateSelect(day)}
                className={`
                  ${viewMode === "month" ? "w-full" : "flex-1"}
                  border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer
                  ${!isCurrentMonth ? "opacity-50" : ""}
                  ${isToday(day) ? "border-primary" : "border-gray-200"}
                `}
              >
                <div className="text-sm font-medium text-gray-900 mb-2">
                  {format(day, viewMode === "week" ? "EEE" : "dd")}
                  <span className="block text-xs text-gray-500">
                    {format(day, viewMode === "week" ? "MMM d" : "EEE")}
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
                          key as "morning" | "afternoon" | "evening"
                        )}`}
                      >
                        {value} {key}
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
    </div>
  );
};
