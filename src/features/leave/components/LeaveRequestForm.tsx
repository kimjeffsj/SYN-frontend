import { FormEvent, useState } from "react";
import { CreateLeaveRequest } from "../types/leave.type";
import { Modal } from "@/shared/components/Modal";
import { validateLeaveRequest } from "../utils/leave.utils";
import { AlertCircle } from "lucide-react";

interface LeaveRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLeaveRequest) => Promise<void>;
}

export const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateLeaveRequest>({
    leave_type: "VACATION",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationError = validateLeaveRequest(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit leave request"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Leave Request">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Leave Type */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Leave Type
          </label>
          <div className="flex gap-4">
            {(["VACATION", "ON_LEAVE"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, leave_type: type }))
                }
                className={`
                  flex-1 px-4 py-2 rounded-lg border transition-colors capitalize
                  ${
                    formData.leave_type === type
                      ? "bg-primary text-white border-primary"
                      : "bg-white hover:bg-gray-50"
                  }
                `}
              >
                {type.replace("_", " ").toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  start_date: e.target.value,
                }))
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              End Date
            </label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  end_date: e.target.value,
                }))
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
              min={
                formData.start_date || new Date().toISOString().split("T")[0]
              }
              required
            />
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Reason
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                reason: e.target.value,
              }))
            }
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
            rows={4}
            placeholder="Please provide a reason for your leave request..."
            required
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4">
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
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
