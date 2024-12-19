import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { Modal } from "@/shared/components/Modal";
import { AlertCircle } from "lucide-react";
import { createTradeRequest } from "../slice/shiftTradeSlice";

import {
  CreateTradeRequest,
  Schedule,
  TradeType,
  UrgencyLevel,
} from "../types/shift-trade.type";
import { ScheduleSelector } from "./ScheduleSelector";

interface TradeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedules: Schedule[];
}

export function TradeRequestModal({
  isOpen,
  onClose,
  schedules,
}: TradeRequestModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector(
    (state: RootState) => state.schedule
  );

  const [formData, setFormData] = useState<{
    type: TradeType;
    scheduleId: number | null;
    reason: string;
    urgency: UrgencyLevel;
  }>({
    type: "TRADE",
    scheduleId: null,
    reason: "",
    urgency: "normal",
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validSchedules = schedules.filter((schedule) => {
    const scheduleDate = new Date(schedule.start_time);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return scheduleDate >= today;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.scheduleId) {
      setValidationError("Please select a schedule to trade");
      return;
    }

    if (!formData.reason.trim()) {
      setValidationError("Please provide a reason for your request");
      return;
    }

    try {
      setIsSubmitting(true);
      const requestData: CreateTradeRequest = {
        type: formData.type,
        original_shift_id: formData.scheduleId,
        reason: formData.reason.trim(),
        urgency: formData.urgency,
      };

      await dispatch(createTradeRequest(requestData)).unwrap();
      onClose();
      // Reset form
      setFormData({
        type: "TRADE",
        scheduleId: null,
        reason: "",
        urgency: "normal",
      });
      setSelectedDate(null);
    } catch (err) {
      setValidationError(
        err instanceof Error ? err.message : "Failed to create trade request"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Shift Trade Request">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {(validationError || error) && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            {validationError || error}
          </div>
        )}

        {/* Request Type */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Request Type
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, type: "TRADE" }))
              }
              className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                formData.type === "TRADE"
                  ? "bg-primary text-white border-primary"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              Trade
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, type: "GIVEAWAY" }))
              }
              className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                formData.type === "GIVEAWAY"
                  ? "bg-primary text-white border-primary"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              Giveaway
            </button>
          </div>
        </div>

        {/* Schedule Selector */}
        <div className="relative">
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Select Schedule
          </label>
          <ScheduleSelector
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onScheduleSelect={(scheduleId) =>
              setFormData((prev) => ({ ...prev, scheduleId }))
            }
            schedules={validSchedules}
            selectedScheduleId={formData.scheduleId}
          />
        </div>

        {/* Urgency Level */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Urgency Level
          </label>
          <div className="flex gap-4">
            {(["normal", "high"] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, urgency: level }))
                }
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors capitalize ${
                  formData.urgency === level
                    ? level === "high"
                      ? "bg-red-100 text-red-800 border-red-200"
                      : level === "normal"
                      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                      : "bg-green-100 text-green-800 border-green-200"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Reason */}
        <div>
          <label
            htmlFor="reason"
            className="text-sm font-medium text-gray-700 block mb-2"
          >
            Reason
          </label>
          <textarea
            id="reason"
            rows={2}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Please provide a reason for your request..."
            value={formData.reason}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, reason: e.target.value }))
            }
            required
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Request"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
