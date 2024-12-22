import { CreateScheduleDto, Schedule } from "../types/schedule.type";
import { format } from "date-fns";
import { User, Clock, Plus } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { getShiftTypeStyle } from "../\butils/schedule.utils";
import { StatusColor } from "@/shared/utils/status.utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { useState } from "react";
import { bulkCreateSchedules } from "../slice/scheduleSlice";
import { toast } from "react-toastify";
import BulkScheduleModal from "./BulkScheduleModal";

interface DailyEmployeeListProps {
  date: Date;
  schedules: Schedule[];
}

export const DailyEmployeeList = ({
  date,
  schedules,
}: DailyEmployeeListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showBulkModal, setShowBulkModal] = useState(false);
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBulkCreate = async (schedules: CreateScheduleDto[]) => {
    try {
      await dispatch(bulkCreateSchedules(schedules)).unwrap();
      toast.success("Schedules created successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create schedules"
      );
      throw error;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Employee Schedule - {format(date, "MMM d, yyyy")}
        </h3>
        <button
          onClick={() => setShowBulkModal(true)}
          className="flex items-center px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-primary text-white rounded-lg hover:bg-primary/90 w-full sm:w-auto justify-center"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Add Schedules
        </button>
      </div>

      <div className="p-3 sm:p-4">
        {schedules.length === 0 ? (
          <div className="text-center text-gray-500 py-6 sm:py-8">
            No schedules found for this date
          </div>
        ) : (
          <div className="divide-y">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-50 px-3 sm:px-4 rounded-lg gap-2 sm:gap-0"
              >
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <User className="w-8 h-8 bg-gray-100 rounded-full p-1.5 text-gray-600 shrink-0" />
                  <div>
                    <div className="font-medium text-sm sm:text-base">
                      {schedule.user?.name || `Employee #${schedule.user_id}`}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {schedule.user?.position && schedule.user?.department ? (
                        <>
                          {schedule.user.position} • {schedule.user.department}
                        </>
                      ) : schedule.user?.position ? (
                        schedule.user.position
                      ) : schedule.user?.department ? (
                        schedule.user.department
                      ) : (
                        "No position/department info"
                      )}
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {formatTime(schedule.start_time)} -{" "}
                      {formatTime(schedule.end_time)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-end">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getShiftTypeStyle(
                      schedule.shift_type
                    )}`}
                  >
                    {schedule.shift_type}
                  </span>
                  <StatusBadge
                    status={schedule.status.toLowerCase() as StatusColor}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BulkScheduleModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onSubmit={handleBulkCreate}
        selectedDate={date}
      />
    </div>
  );
};
