import React from "react";
import { Clock, Calendar, MessageSquare, User } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { ShiftTradeResponse } from "../types/shift-trade.type";
import { StatusColor } from "@/shared/utils/status.utils";
import { formatTime } from "@/features/schedule/\butils/schedule.utils";

interface TradeResponseListProps {
  responses: ShiftTradeResponse[];
  isRequester: boolean;
  onAcceptResponse: (responseId: number) => Promise<void>;
  onRejectResponse: (responseId: number) => Promise<void>;
  isSubmitting: boolean;
}

const TradeResponseList: React.FC<TradeResponseListProps> = ({
  responses = [],
  isRequester,
  onAcceptResponse,
  onRejectResponse,
  isSubmitting,
}) => {
  if (!responses || !Array.isArray(responses) || responses.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">No responses yet</div>
    );
  }

  return (
    <div className="space-y-4">
      {/* scroll container */}
      <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {responses.map((response) => (
          <div key={response.id} className="border rounded-lg p-4">
            {/* Respondent Info */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium">{response.respondent.name}</div>
                  <div className="text-sm text-gray-500">
                    {response.respondent.position}
                  </div>
                </div>
              </div>
              <StatusBadge
                status={response.status.toLowerCase() as StatusColor}
                size="sm"
              />
            </div>

            {/* Offered Shift Details */}
            {response.offered_shift && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span>
                    {new Date(
                      response.offered_shift.start_time
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span>
                    {formatTime(response.offered_shift.start_time)} -{" "}
                    {formatTime(response.offered_shift.end_time)}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Shift Type: {response.offered_shift.shift_type}
                </div>
              </div>
            )}

            {/* Response Message */}
            {response.content && (
              <div className="flex items-start mb-4">
                <MessageSquare className="w-4 h-4 text-gray-400 mr-2 mt-1" />
                <p className="text-sm text-gray-600">{response.content}</p>
              </div>
            )}

            {/* Action Buttons */}
            {isRequester && response.status === "PENDING" && (
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => onAcceptResponse(response.id)}
                  disabled={isSubmitting}
                  className="flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <span className="mr-1">✓</span>
                  Accept
                </button>
                <button
                  onClick={() => onRejectResponse(response.id)}
                  disabled={isSubmitting}
                  className="flex items-center px-3 py-1.5 text-sm border border-red-600 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
                >
                  <span className="mr-1">×</span>
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeResponseList;
