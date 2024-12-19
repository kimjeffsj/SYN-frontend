import React, { useState } from "react";
import { Clock, Calendar, User, Trash2 } from "lucide-react";
import { Modal } from "@/shared/components/Modal";
import { Schedule, ShiftTradeRequest } from "../types/shift-trade.type";
import { getStatusBgStyle, StatusColor } from "@/shared/utils/status.utils";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { ScheduleSelector } from "./ScheduleSelector";
import { toast } from "react-toastify";
import TradeResponseList from "./TradeResponseList";
import { formatTime } from "@/features/schedule/\butils/schedule.utils";

interface TradeDetailProps {
  isOpen: boolean;
  onClose: () => void;
  request: ShiftTradeRequest;
  userSchedules: Schedule[];
  onRespond?: (scheduleId: number) => Promise<void>;
  onAcceptResponse?: (responseId: number) => Promise<void>;
  onRejectResponse?: (responseId: number) => Promise<void>;
  currentUserId: number;
  onUpdateStatus: (
    responseId: number,
    status: "ACCEPTED" | "REJECTED"
  ) => Promise<void>;
  onDelete?: (requestId: number) => Promise<void>;
}

export function TradeDetail({
  isOpen,
  onClose,
  request,
  userSchedules,
  onRespond,
  onAcceptResponse,
  onRejectResponse,
  currentUserId,
  onDelete,
}: TradeDetailProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRequester = currentUserId === request.author.id;

  const validUserSchedules = userSchedules.filter((schedule) => {
    const scheduleDate = new Date(schedule.start_time);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return scheduleDate >= today;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScheduleId) {
      setError("Please select a schedule to trade");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onRespond?.(selectedScheduleId);
      setSelectedScheduleId(null);
      toast.success("Trade response submitted successfully!");
      onClose();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to submit response"
      );
      toast.error(
        error instanceof Error ? error.message : "Failed to submit response"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccept = async (responseId: number) => {
    try {
      setIsSubmitting(true);
      await onAcceptResponse?.(responseId);
      toast.success("Response accepted successfully!");
    } catch (error) {
      toast.error("Failed to accept response");
      console.error("Error accepting response:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (responseId: number) => {
    try {
      setIsSubmitting(true);
      await onRejectResponse?.(responseId);
      toast.success("Response rejected successfully!");
    } catch (error) {
      toast.error("Failed to reject response");
      console.error("Error rejecting response:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Shift Trade Request Details"
    >
      <div className="space-y-6">
        {/* Author Info */}
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
          {isRequester && (
            <button
              onClick={() => onDelete?.(request.id)}
              className="flex items-center px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete Request
            </button>
          )}
          <div className="flex items-center space-x-2">
            <StatusBadge
              status={request.status.toLowerCase() as StatusColor}
              size="sm"
            />
            <StatusBadge
              status={request.type.toLowerCase() as StatusColor}
              size="sm"
            />
          </div>
        </div>

        {/* Original Shift Details */}
        <div className={`rounded-lg p-4 ${getStatusBgStyle("active")}`}>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Requested Shift
          </h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
              <span>{formatTime(request.original_shift.start_time)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-gray-400 mr-2" />
              <span>
                {formatTime(request.original_shift.start_time)} -{" "}
                {formatTime(request.original_shift.end_time)}
              </span>
            </div>
          </div>
        </div>

        {/* Reason if exists */}
        {request.reason && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Reason</h3>
            <p className="text-gray-600">{request.reason}</p>
          </div>
        )}

        {/* Responses Section */}
        {isRequester && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Responses</h3>
            <TradeResponseList
              responses={request.responses}
              isRequester={isRequester}
              onAcceptResponse={handleAccept}
              onRejectResponse={handleReject}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {/* Response Form for Non-requesters */}
        {!isRequester && request.status === "OPEN" && (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-medium text-gray-700">
              Select Your Schedule to Trade
            </h3>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            <ScheduleSelector
              selectedScheduleId={selectedScheduleId}
              onScheduleSelect={setSelectedScheduleId}
              schedules={validUserSchedules}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              mode="response"
            />

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedScheduleId}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Response"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
