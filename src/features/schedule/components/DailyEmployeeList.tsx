import { Schedule } from "../types/schedule.type";
import { format } from "date-fns";
import { User, Clock } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { getShiftTypeStyle } from "../\butils/schedule.utils";

interface DailyEmployeeListProps {
  date: Date;
  schedules: Schedule[];
}

export const DailyEmployeeList = ({
  date,
  schedules,
}: DailyEmployeeListProps) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">
          Employee Schedule - {format(date, "MMM d, yyyy")}
        </h3>
      </div>
      <div className="p-4">
        {schedules.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No schedules found for this date
          </div>
        ) : (
          <div className="divide-y">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="py-3 flex items-center justify-between hover:bg-gray-50 px-4 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <User className="w-8 h-8 bg-gray-100 rounded-full p-1.5 text-gray-600" />
                  <div>
                    <div className="font-medium">
                      Employee #{schedule.user_id}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTime(schedule.start_time)} -{" "}
                      {formatTime(schedule.end_time)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getShiftTypeStyle(
                      schedule.shift_type
                    )}`}
                  >
                    {schedule.shift_type}
                  </span>
                  <StatusBadge
                    // TODO: Fix type error
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    status={schedule.status.toLowerCase() as any}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
