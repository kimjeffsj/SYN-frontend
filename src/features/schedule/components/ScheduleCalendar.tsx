import { useState } from "react";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { Schedule } from "../types/schedule.type";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  addMonths,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  subWeeks,
  subMonths,
} from "date-fns";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { getStatusBgStyle, StatusColor } from "@/shared/utils/status.utils";
import { ShiftDetail } from "./ShiftDetail";

type CalendarView = "week" | "month";

interface ScheduleCalendarProps {
  schedules: Schedule[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  schedules: externalSchedules,
  currentDate: externalDate,
  onDateChange,
}) => {
  const { isLoading, error } = useSelector(
    (state: RootState) => state.schedule
  );
  const [view, setView] = useState<CalendarView>("week");
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(externalDate);
    const end = endOfMonth(externalDate);
    const days = [];
    const firstDayOfMonth = start.getDay();

    // Add days from previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(addDays(start, i - firstDayOfMonth));
    }

    // Add days of current month
    let day = start;
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }

    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(addDays(end, i));
    }

    return days;
  };

  const getDaysInWeek = () => {
    const start = startOfWeek(externalDate);
    return [...Array(7)].map((_, i) => addDays(start, i));
  };

  const moveNext = () => {
    if (view === "week") {
      onDateChange(addWeeks(externalDate, 1));
    } else {
      onDateChange(addMonths(externalDate, 1));
    }
  };

  const movePrevious = () => {
    if (view === "week") {
      onDateChange(subWeeks(externalDate, 1));
    } else {
      onDateChange(subMonths(externalDate, 1));
    }
  };

  const handleScheduleClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setShowDetailModal(true);
  };

  const renderSchedule = (schedule: Schedule) => (
    <div
      key={schedule.id}
      onClick={() => handleScheduleClick(schedule)}
      className={`${getStatusBgStyle(
        schedule.status.toLowerCase() as StatusColor
      )} p-2 rounded-lg mb-1 shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center justify-between">
        <StatusBadge
          status={schedule.status.toLowerCase() as StatusColor}
          size="sm"
        />
      </div>

      <div className="flex items-center text-xs mt-1">
        <Clock className="w-3 h-3 mr-1" />
        {formatTime(schedule.start_time)}
      </div>
    </div>
  );

  const renderCalendarHeader = () => (
    <div className="flex items-center justify-between mb-4 p-4 border-b">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-gray-900">My Schedules</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView("week")}
            className={`p-1.5 rounded ${
              view === "week"
                ? "bg-primary text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("month")}
            className={`p-1.5 rounded ${
              view === "month"
                ? "bg-primary text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={movePrevious}
          className="p-1.5 rounded hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="font-medium">
            {format(
              externalDate,
              view === "week" ? "MMM d, yyyy" : "MMMM yyyy"
            )}
          </span>
        </div>

        <button onClick={moveNext} className="p-1.5 rounded hover:bg-gray-100">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );

  const renderDayCell = (date: Date) => {
    const daySchedules = externalSchedules.filter((schedule) =>
      isSameDay(new Date(schedule.start_time), date)
    );

    const isToday = isSameDay(date, new Date());
    const isCurrentMonth = isSameMonth(date, externalDate);

    return (
      <div
        key={date.toISOString()}
        className={`border rounded-lg p-2 min-h-[100px] ${
          isCurrentMonth ? "bg-white" : "bg-gray-50"
        }`}
      >
        <div
          className={`text-sm mb-1 font-medium ${
            isToday
              ? "text-primary"
              : isCurrentMonth
              ? "text-gray-900"
              : "text-gray-400"
          }`}
        >
          {format(date, view === "week" ? "EEE, MMM d" : "d")}
        </div>
        <div className="space-y-1 overflow-y-auto max-h-[120px]">
          {daySchedules.map((schedule) => renderSchedule(schedule))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;
  }

  const days = view === "week" ? getDaysInWeek() : getDaysInMonth();

  return (
    <div className="bg-white rounded-lg shadow">
      {renderCalendarHeader()}
      <div className="p-4">
        <div
          className={`grid ${
            view === "week" ? "grid-cols-7 gap-4" : "grid-cols-7 gap-2"
          }`}
        >
          {days.map((day) => renderDayCell(day))}
        </div>
      </div>
      {/* Shift Detail Modal */}
      <ShiftDetail
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedSchedule(null);
        }}
        schedule={selectedSchedule}
      />
    </div>
  );
};

export default ScheduleCalendar;
