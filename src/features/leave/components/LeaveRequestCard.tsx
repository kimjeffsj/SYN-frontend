import { format } from "date-fns";
import { LeaveRequest } from "../types/leave.type";
import { formatDates } from "../utils/leave.utils";
import { getStatusBgStyle, StatusColor } from "@/shared/utils/status.utils";
import { Calendar, Clock, User } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge";

interface LeaveRequestCardProps {
  request: LeaveRequest;
  onClick?: (requestId: number) => void;
  className?: string;
}

export const LeaveRequestCard = ({
  request,
  onClick,
  className = "",
}: LeaveRequestCardProps) => {
  const getDurationDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ${className}`}
      onClick={() => onClick?.(request.id)}
    >
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-medium">{request.employee.name}</span>
                {(request.employee.position || request.employee.department) && (
                  <>
                    <span className="hidden sm:inline text-gray-300">•</span>
                    <span className="text-gray-500 text-sm">
                      {[request.employee.position, request.employee.department]
                        .filter(Boolean)
                        .join(" • ")}
                    </span>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {format(new Date(request.created_at), "MMM d, yyyy")}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <StatusBadge
              status={request.status.toLowerCase() as StatusColor}
              size="sm"
            />
            <StatusBadge
              status={request.leave_type.toLowerCase() as StatusColor}
              size="sm"
            />
          </div>
        </div>

        {/* Leave Details */}
        <div className={`rounded-lg p-4 ${getStatusBgStyle("active")} mb-4`}>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
              <span className="font-medium">
                {formatDates(request.start_date, request.end_date)}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-400 mr-2" />
              <span>
                {getDurationDays(request.start_date, request.end_date)} days
              </span>
            </div>
          </div>
        </div>

        {/* Reason */}
        {request.reason && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">{request.reason}</p>
          </div>
        )}

        {/* Admin Response */}
        {request.admin_response && (
          <div className="pt-4 border-t">
            <div className="text-sm text-gray-500">
              {request.status === "APPROVED" ? "Approved" : "Rejected"} by{" "}
              <span className="font-medium">
                {request.admin_response.admin_name}
              </span>
              {" • "}
              {format(
                new Date(request.admin_response.processed_at),
                "MMM d, yyyy"
              )}
            </div>
            {request.admin_response.comment && (
              <p className="mt-1 text-sm text-gray-600">
                {request.admin_response.comment}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
