import { useState } from "react";
import { Clock, Calendar, User, CheckCircle, XCircle, X } from "lucide-react";
import { Modal } from "@/shared/components/Modal";
import { ShiftTradeRequest } from "../types/shift-trade.type";

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
      title="Shift Trade Request Details"
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 sm:px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold">
                      {request.author.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {request.author.position}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-sm font-medium ${
                    request.status === "OPEN"
                      ? "bg-green-100 text-green-800"
                      : request.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {request.status}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-full text-sm font-medium ${
                    request.type === "TRADE"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-indigo-100 text-indigo-800"
                  }`}
                >
                  {request.type}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {/* Shift Details */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Original Shift
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span>{request.original_shift.date}</span>
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
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Preferred Shift
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{request.preferred_shift.date}</span>
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
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Reason</h3>
              <p className="text-gray-600">{request.reason}</p>
            </div>

            {/* Responses */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Responses
              </h3>
              <div className="space-y-4">
                {Array.isArray(request.responses) ? (
                  request.responses.map((response) => (
                    <div
                      key={response.id}
                      className="bg-gray-50 rounded-lg p-3 sm:p-4"
                    >
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
                        <div
                          className={`px-2.5 py-1 rounded-full text-xs font-medium
                      ${
                        response.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : response.status === "ACCEPTED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                        >
                          {response.status}
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="bg-white rounded p-3 mb-2">
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
                    No response yet
                  </div>
                )}
              </div>
            </div>

            {/* New Response Form */}
            {request.status === "OPEN" && (
              <div className="mt-6 pt-6 border-t">
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
        </div>
      </div>
    </Modal>
  );
}
