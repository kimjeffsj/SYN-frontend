import React, { useState } from "react";
import { AppDispatch } from "@/app/store";
import { useDispatch } from "react-redux";
import { CreateScheduleDto, ShiftType } from "../types/schedule.type";
import { adminCreateSchedule } from "../slice/scheduleSlice";
import { Modal } from "@/shared/components/Modal";
import { Calendar } from "lucide-react";
import { EmployeeCombobox } from "./EmployeeCombobo";

interface CreateScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const shiftTypes: { value: ShiftType; label: string }[] = [
  { value: "morning", label: "Morning (07:00-15:00)" },
  { value: "afternoon", label: "Afternoon (11:00-19:00)" },
  { value: "evening", label: "Evening (17:00-23:00)" },
];

export const CreateScheduleForm: React.FC<CreateScheduleFormProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");

  const [formData, setFormData] = useState<CreateScheduleDto>({
    user_id: 0,
    start_time: "",
    end_time: "",
    shift_type: "morning",
    description: "",
    is_repeating: false,
    repeat_pattern: "",
  });

  const handleEmployeeSelect = (employeeId: number, employeeName: string) => {
    setSelectedEmployeeName(employeeName);
    setFormData((prev) => ({
      ...prev,
      user_id: employeeId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.user_id) {
      setError("Please select an employee");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await dispatch(adminCreateSchedule(formData)).unwrap();
      onClose();
    } catch (err) {
      setError(err as string);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getShiftTimes = (
    shiftType: ShiftType
  ): { start: string; end: string } => {
    const times = {
      morning: { start: "07:00", end: "15:00" },
      afternoon: { start: "11:00", end: "19:00" },
      evening: { start: "17:00", end: "23:00" },
    };
    return times[shiftType];
  };

  const convertToUTCString = (dateStr: string, timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const date = new Date(dateStr);
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
    return date.toISOString();
  };

  const handleShiftTypeChange = (shiftType: ShiftType) => {
    const date = formData.start_time.split("T")[0];
    if (date) {
      const times = getShiftTimes(shiftType);
      setFormData((prev) => ({
        ...prev,
        shift_type: shiftType,
        start_time: convertToUTCString(date, times.start),
        end_time: convertToUTCString(date, times.end),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        shift_type: shiftType,
      }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Schedule">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {/* Employee Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employee
          </label>
          <EmployeeCombobox
            value={selectedEmployeeName}
            onChange={handleEmployeeSelect}
            disabled={isSubmitting}
          />
        </div>

        {/* Shift Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shift Type
          </label>
          <select
            value={formData.shift_type}
            onChange={(e) => handleShiftTypeChange(e.target.value as ShiftType)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
          >
            {shiftTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4 inline-block mr-1" />
            Date
          </label>
          <input
            type="date"
            value={formData.start_time.split("T")[0]}
            onChange={(e) => {
              const date = e.target.value;
              const times = getShiftTimes(formData.shift_type);
              setFormData((prev) => ({
                ...prev,
                start_time: convertToUTCString(date, times.start),
                end_time: convertToUTCString(date, times.end),
              }));
            }}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
            rows={3}
            placeholder="Add any notes or instructions..."
          />
        </div>

        {/* Form Actions */}
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
            {isSubmitting ? "Creating..." : "Create Schedule"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateScheduleForm;
