import React, { useState } from "react";
import { Schedule } from "../types/shift-trade.type";
import { format } from "date-fns";
import { Calendar, ChevronDown } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge";

interface ScheduleSelectorProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  onScheduleSelect: (scheduleId: number) => void;
  schedules: Schedule[];
  selectedScheduleId: number | null;
}

export const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({
  selectedDate,
  onDateChange,
  onScheduleSelect,
  schedules,
  selectedScheduleId,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const availableSchedules = schedules.filter((schedule) => {
    if (!selectedDate || !schedule.start_time) return false;

    const scheduleDate = new Date(schedule.start_time);
    return (
      scheduleDate.getFullYear() === selectedDate.getFullYear() &&
      scheduleDate.getMonth() === selectedDate.getMonth() &&
      scheduleDate.getDate() === selectedDate.getDate()
    );
  });

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        className="flex items-center justify-between w-full px-4 py-2 border rounded-lg hover:bg-gray-50"
      >
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            {selectedDate ? format(selectedDate, "PPP") : "Select date"}
          </span>
        </div>
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Calendar Dropdown */}
      {isCalendarOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg">
          {/* Replace with your preferred calendar component */}
          <div className="p-4">
            <input
              type="date"
              value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
              onChange={(e) => {
                onDateChange(new Date(e.target.value));
                setIsCalendarOpen(false);
              }}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>
      )}

      {/* Available Schedules */}
      {selectedDate && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">
            Available Schedules
          </h3>
          {availableSchedules.length > 0 ? (
            <div className="space-y-2">
              {availableSchedules.map((schedule) => (
                <button
                  key={schedule.id}
                  type="button"
                  onClick={() => onScheduleSelect(schedule.id)}
                  className={`w-full p-3 border rounded-lg text-left transition-colors ${
                    selectedScheduleId === schedule.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {format(new Date(schedule.start_time), "HH:mm")} -{" "}
                        {format(new Date(schedule.end_time), "HH:mm")}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {schedule.shift_type}
                      </p>
                    </div>
                    <StatusBadge
                      //TODO: Fix type
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      status={schedule.status.toLowerCase() as any}
                      size="sm"
                    />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
              No schedules available for this date
            </p>
          )}
        </div>
      )}
    </div>
  );
};
