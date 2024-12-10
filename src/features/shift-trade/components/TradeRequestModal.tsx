import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { Modal } from "@/shared/components/Modal";
import { AlertCircle } from "lucide-react";
import { createTradeRequest } from "../slice/shiftTradeSlice";
import {
  CreateTradeRequest,
  TradeType,
  UrgencyLevel,
} from "../types/shift-trade.type";

interface TradeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleId: number;
}

export function TradeRequestModal({
  isOpen,
  onClose,
  scheduleId,
}: TradeRequestModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector(
    (state: RootState) => state.shiftTrade
  );

  const [formData, setFormData] = useState<{
    type: TradeType;
    preferredScheduleId?: number;
    reason: string;
    urgency: UrgencyLevel;
  }>({
    type: "TRADE",
    reason: "",
    urgency: "medium",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const requestData: CreateTradeRequest = {
        type: formData.type,
        original_shift_id: scheduleId,
        preferred_shift_id: formData.preferredScheduleId,
        reason: formData.reason.trim(),
        urgency: formData.urgency,
      };

      await dispatch(createTradeRequest(requestData)).unwrap();
      onClose();
      setFormData({
        type: "TRADE",
        reason: "",
        urgency: "medium",
      });
    } catch (err) {
      console.error("Failed to create trade request:", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Shift Trade Request">
      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Urgency Level */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Urgency Level
          </label>
          <div className="flex gap-4">
            {(["low", "medium", "high"] as const).map((level) => (
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
                      : level === "medium"
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
            rows={4}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Please provide a reason for your request..."
            value={formData.reason}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, reason: e.target.value }))
            }
            required
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Request"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
