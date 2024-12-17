import React, { useState } from "react";
import { Schedule } from "../types/shift-trade.type";
import { format, isValid, parseISO } from "date-fns";
import { Calendar, ChevronDown, Clock } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { StatusColor } from "@/shared/utils/status.utils";

interface ScheduleSelectorProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  onScheduleSelect: (scheduleId: number) => void;
  schedules: Schedule[];
  selectedScheduleId: number | null;
  mode?: "default" | "response";
}

export const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({
  selectedDate,
  onDateChange,
  onScheduleSelect,
  schedules = [],
  selectedScheduleId,
  mode = "default",
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm");
  };

  const getAvailableSchedules = () => {
    if (!Array.isArray(schedules)) return [];

    if (!selectedDate) return schedules;

    return schedules.filter((schedule) => {
      if (!schedule?.start_time) return false;

      const scheduleDate = new Date(schedule.start_time);

      return (
        scheduleDate.getFullYear() === selectedDate.getFullYear() &&
        scheduleDate.getMonth() === selectedDate.getMonth() &&
        scheduleDate.getDate() === selectedDate.getDate()
      );
    });
  };

  const renderScheduleList = () => {
    const availableSchedules = getAvailableSchedules();

    if (availableSchedules.length === 0) {
      return (
        <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
          No schedules available
        </div>
      );
    }

    return (
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {availableSchedules.map((schedule) => (
          <button
            key={schedule.id}
            type="button"
            onClick={() => onScheduleSelect(schedule.id)}
            className={`w-full p-3 border rounded-lg text-left transition-colors
              ${
                selectedScheduleId === schedule.id
                  ? "border-primary bg-primary/5"
                  : "hover:bg-gray-50"
              }`}
          >
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="font-medium">
                    {format(new Date(schedule.start_time), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span>
                    {formatTime(schedule.start_time)} -{" "}
                    {formatTime(schedule.end_time)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge
                  status={schedule.shift_type.toLowerCase() as StatusColor}
                  size="sm"
                />
                <StatusBadge
                  status={schedule.status.toLowerCase() as StatusColor}
                  size="sm"
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Calendar Selection */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="w-full flex items-center justify-between px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {selectedDate ? format(selectedDate, "PPP") : "Select date"}
            </span>
          </div>
          <ChevronDown className="w-4 h-4" />
        </button>

        {isCalendarOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg">
            <div className="p-4">
              <input
                type="date"
                value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const date = parseISO(e.target.value);
                  if (isValid(date)) {
                    onDateChange(date);
                    setIsCalendarOpen(false);
                  }
                }}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        )}
      </div>

      {/* Schedule List */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          {mode === "response"
            ? "Select Schedule to Trade"
            : "Available Schedules"}
        </h3>
        <div className="relative">
          <div className="max-h-[150px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {renderScheduleList()}
          </div>
          {/* Fade effect for scroll indication */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
