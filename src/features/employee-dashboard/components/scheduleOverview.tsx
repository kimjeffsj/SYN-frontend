import React from "react";
import { ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Schedule } from "../type/employee-dashboard.type";

interface ScheduleOverviewProps {
  weeklySchedule: Schedule[];
  onViewDetail: () => void;
}

export const ScheduleOverview: React.FC<ScheduleOverviewProps> = ({
  weeklySchedule,
  onViewDetail,
}) => {
  const getShiftTypeColor = (type: string) => {
    const colors = {
      morning: "bg-blue-100 text-blue-800",
      afternoon: "bg-yellow-100 text-yellow-800",
      evening: "bg-purple-100 text-purple-800",
    };
    return colors[type as keyof typeof colors] || colors.morning;
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary">My Schedule</h2>
        <button
          onClick={onViewDetail}
          className="flex items-center text-sm text-secondary"
        >
          View Detail
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      <div className="border rounded-lg p-4">
        <div className="grid grid-cols-7 gap-2">
          {weeklySchedule.map((schedule) => (
            <div key={schedule.id} className="text-center p-2">
              <div className="text-sm font-medium mb-1 text-primary">
                {format(new Date(schedule.date), "EEE d")}
              </div>
              <div
                className={`p-2 rounded-lg ${getShiftTypeColor(
                  schedule.shift_type
                )}`}
              >
                <div className="text-xs font-medium">
                  {schedule.start_time} - {schedule.end_time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
