/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: create mapping function for type warning any
import { useState } from "react";
import { Clock, Calendar, User, CheckCircle, XCircle } from "lucide-react";
import { Modal } from "@/shared/components/Modal";
import { ShiftTradeRequest } from "../types/shift-trade.type";
import { getStatusBgStyle } from "@/shared/utils/status.utils";
import { StatusBadge } from "@/shared/components/StatusBadge";

interface TradeDetailProps {
  isOpen: boolean;
  onClose: () => void;
  request: ShiftTradeRequest;
  onRespond?: (response: {
    offeredShiftId: number;
    content: string;
  }) => Promise<void>;
  onUpdateStatus?: (
    responseId: number,
    status: "ACCEPTED" | "REJECTED"
  ) => Promise<void>;
}

export function TradeDetail({
  isOpen,
  onClose,
  request,
  onRespond,
  onUpdateStatus,
}: TradeDetailProps) {
  const [responseContent, setResponseContent] = useState("");
  const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null);

  const handleSubmitResponse = async () => {
    if (!selectedShiftId) return;

    try {
      await onRespond?.({
        offeredShiftId: selectedShiftId,
        content: responseContent.trim(),
      });
      setResponseContent("");
      setSelectedShiftId(null);
    } catch (error) {
      console.error("Failed to submit response:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Shift Trade Request Details"
    >
      <div className="space-y-6">
        {/* Header section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="text-base font-medium">{request.author.name}</div>
              <div className="text-sm text-gray-500">
                {request.author.position}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge
              status={request.status.toLowerCase() as any}
              size="sm"
            />
            <StatusBadge status={request.type.toLowerCase() as any} size="sm" />
          </div>
        </div>

        {/* Shift Details */}
        <div className="grid grid-cols-1 gap-4">
          <div className={`rounded-lg p-4 ${getStatusBgStyle("active")}`}>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Original Shift
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                <span>{request.original_shift.start_time}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                <span>
                  {request.original_shift.start_time} -{" "}
                  {request.original_shift.end_time}
                </span>
              </div>
            </div>
          </div>

          {request.type === "TRADE" && request.preferred_shift && (
            <div className={`rounded-lg p-4 ${getStatusBgStyle("pending")}`}>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Preferred Shift
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{request.preferred_shift.start_time}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span>
                    {request.preferred_shift.start_time} -{" "}
                    {request.preferred_shift.end_time}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reason */}
        {request.reason && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Reason</h3>
            <p className="text-gray-600">{request.reason}</p>
          </div>
        )}

        {/* Responses */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Responses</h3>
          <div className="space-y-4">
            {Array.isArray(request.responses) &&
            request.responses.length > 0 ? (
              request.responses.map((response) => (
                <div key={response.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {response.respondent.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {response.created_at}
                        </p>
                      </div>
                    </div>
                    <StatusBadge
                      status={response.status.toLowerCase() as any}
                      size="sm"
                    />
                  </div>

                  <div className="mt-3">
                    <div
                      className={`rounded p-3 mb-2 ${getStatusBgStyle(
                        "active"
                      )}`}
                    >
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <span>
                          {response.offered_shift.start_time} -{" "}
                          {response.offered_shift.end_time}
                        </span>
                      </div>
                    </div>
                    {response.content && (
                      <p className="text-sm text-gray-600 mt-2">
                        {response.content}
                      </p>
                    )}
                  </div>

                  {response.status === "PENDING" && (
                    <div className="mt-3 flex justify-end space-x-2">
                      <button
                        onClick={() =>
                          onUpdateStatus?.(response.id, "ACCEPTED")
                        }
                        className="flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          onUpdateStatus?.(response.id, "REJECTED")
                        }
                        className="flex items-center px-3 py-1.5 text-sm border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">
                No responses yet
              </div>
            )}
          </div>
        </div>

        {/* New Response Form */}
        {request.status === "OPEN" && (
          <div className="pt-6 border-t">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Add Response
            </h3>
            {/* TODO: Add shift selector */}
            <textarea
              value={responseContent}
              onChange={(e) => setResponseContent(e.target.value)}
              placeholder="Add your message..."
              className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              rows={3}
            />
            <button
              onClick={handleSubmitResponse}
              disabled={!selectedShiftId}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              Submit Response
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
