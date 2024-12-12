import { Clock, CheckCircle, XCircle, User } from "lucide-react";
import { ShiftTradeRequest, UrgencyLevel } from "../types/shift-trade.type";
import { getStatusBgStyle } from "@/shared/utils/status.utils";
import { StatusBadge } from "@/shared/components/StatusBadge";

interface TradeRequestCardProps {
  request: ShiftTradeRequest;
  onAction?: (requestId: number, action: "accept" | "reject") => void;
  onClick?: (requestId: number) => void;
  className?: string;
}

export const TradeRequestCard = ({
  request,
  onAction,
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
              <div className="text-sm text-gray-500">{request.created_at}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <StatusBadge
              // TODO: create mapping function for type warning any
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

        {/* Schedule Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className={`rounded-lg p-4 ${getStatusBgStyle("active")}`}>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Original Shift
            </h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                <span>{request.original_shift.date}</span>
              </div>
              <div className="text-sm text-gray-600">
                {request.original_shift.start_time} -{" "}
                {request.original_shift.end_time}
              </div>
              <div className="text-sm text-gray-600">
                Type: {request.original_shift.shift_type}
              </div>
            </div>
          </div>

          {request.type === "TRADE" && request.preferred_shift && (
            <div className={`rounded-lg p-4 ${getStatusBgStyle("pending")}`}>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Preferred Shift
              </h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{request.preferred_shift.date}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {request.preferred_shift.start_time} -{" "}
                  {request.preferred_shift.end_time}
                </div>
                <div className="text-sm text-gray-600">
                  Type: {request.preferred_shift.shift_type}
                </div>
              </div>
            </div>
          )}
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

          {onAction && request.status === "OPEN" && (
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(request.id, "accept");
                }}
                className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Accept
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(request.id, "reject");
                }}
                className="flex items-center px-3 py-1.5 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
