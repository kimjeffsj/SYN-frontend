import { Clock, User } from "lucide-react";
import {
  Schedule,
  ShiftTradeRequest,
  UrgencyLevel,
} from "../types/shift-trade.type";
import { getStatusBgStyle } from "@/shared/utils/status.utils";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { formatDistanceToNow, format } from "date-fns";

interface TradeRequestCardProps {
  request: ShiftTradeRequest;
  onClick?: (requestId: number) => void;
  className?: string;
}

export const TradeRequestCard = ({
  request,
  onClick,
  className = "",
}: TradeRequestCardProps) => {
  const getUrgencyStyle = (urgency: UrgencyLevel) => {
    const styles = {
      high: "bg-red-50 text-red-600 border-red-100",
      medium: "bg-yellow-50 text-yellow-600 border-yellow-100",
      low: "bg-blue-50 text-blue-600 border-blue-100",
    };
    return styles[urgency];
  };

  const formatScheduleDateTime = (schedule: Schedule) => {
    if (!schedule || !schedule.start_time || !schedule.end_time) {
      console.log("Invalid schedule data:", schedule);
      return {
        date: "N/A",
        time: "N/A",
      };
    }

    try {
      const startDate = new Date(schedule.start_time);
      const endDate = new Date(schedule.end_time);

      return {
        date: format(startDate, "MMM d, yyyy"),
        time: `${format(startDate, "HH:mm")} - ${format(endDate, "HH:mm")}`,
      };
    } catch (error) {
      console.error("Date formatting error: ", error);

      return {
        date: "Invalid date",
        time: "Invalid time",
      };
    }
  };

  const scheduleInfo = formatScheduleDateTime(request.original_shift);
  const timeAgo = request.created_at
    ? formatDistanceToNow(new Date(request.created_at), { addSuffix: true })
    : "N/A";

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ${className}`}
      onClick={() => onClick?.(request.id)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>

            <div>
              <div className="flex items-center">
                <span className="font-medium">{request.author.name}</span>
                {request.author.position && (
                  <>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-gray-500">
                      {request.author.position}
                    </span>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-500">{timeAgo}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <StatusBadge
              // TODO: Fix type any
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              status={request.status.toLowerCase() as any}
              size="sm"
            />
            <span
              className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getUrgencyStyle(
                request.urgency
              )}`}
            >
              {request.urgency}
            </span>
          </div>
        </div>

        {/* Shift Information */}
        <div className={`rounded-lg p-4 ${getStatusBgStyle("active")} mb-4`}>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Shift Information
          </h3>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 text-gray-400 mr-2" />
              <span className="font-medium">{scheduleInfo.date}</span>
            </div>
            <div className="text-sm text-gray-600">{scheduleInfo.time}</div>
          </div>
        </div>

        {/* Reason */}
        {request.reason && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">{request.reason}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            {request.responses.length} response(s)
          </div>
        </div>
      </div>
    </div>
  );
};
