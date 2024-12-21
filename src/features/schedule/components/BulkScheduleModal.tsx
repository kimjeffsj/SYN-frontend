import { useEffect, useState } from "react";
import { CreateScheduleDto, ShiftType } from "../types/schedule.type";
import { Modal } from "@/shared/components/Modal";
import { EmployeeCombobox } from "./EmployeeCombobo";
import { User, X } from "lucide-react";

interface BulkScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (schedules: CreateScheduleDto[]) => Promise<void>;
  selectedDate: Date;
}

const shiftTypes: { value: ShiftType; label: string }[] = [
  { value: "morning", label: "Morning (07:00-15:00)" },
  { value: "afternoon", label: "Afternoon (11:00-19:00)" },
  { value: "evening", label: "Evening (17:00-23:00)" },
];

export const BulkScheduleModal: React.FC<BulkScheduleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
}) => {
  const [selectedEmployees, setSelectedEmployees] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [selectedShiftType, setSelectedShiftType] =
    useState<ShiftType>("morning");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmployeeSelect = (employeeId: number, employeeName: string) => {
    if (!selectedEmployees.some((emp) => emp.id === employeeId)) {
      setSelectedEmployees((prev) => [
        ...prev,
        { id: employeeId, name: employeeName },
      ]);
    }
  };

  const handleRemoveEmployee = (employeeId: number) => {
    setSelectedEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
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

  const convertToUTCString = (date: Date, timeStr: string): string => {
    const [hours, minutes] = timeStr.split(":");
    const newDate = new Date(date);
    newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
    return newDate.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmployees.length === 0) {
      setError("Please select at least one employee");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const times = getShiftTimes(selectedShiftType);

      const schedules: CreateScheduleDto[] = selectedEmployees.map(
        (employee) => ({
          user_id: employee.id,
          start_time: convertToUTCString(selectedDate, times.start),
          end_time: convertToUTCString(selectedDate, times.end),
          shift_type: selectedShiftType,
          is_repeating: false,
        })
      );

      await onSubmit(schedules);
      setSelectedEmployees([]);
      setSelectedShiftType("morning");
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create schedules"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedEmployees([]);
      setSelectedShiftType("morning");
      setError(null);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Bulk Schedules">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {/* Employee Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Employees
          </label>
          <EmployeeCombobox
            value=""
            onChange={handleEmployeeSelect}
            disabled={isSubmitting}
            required={false}
          />
        </div>

        {/* Selected Employees List */}
        {selectedEmployees.length > 0 && (
          <div className="border rounded-lg divide-y">
            {selectedEmployees.map((employee) => (
              <div
                key={employee.id}
                className="p-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium">{employee.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveEmployee(employee.id)}
                  className="p-1 hover:bg-red-50 rounded-full text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="p-3 bg-gray-50">
              <span className="text-sm text-gray-500">
                {selectedEmployees.length} employees selected
              </span>
            </div>
          </div>
        )}

        {/* Shift Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shift Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {shiftTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setSelectedShiftType(type.value)}
                className={`p-3 border rounded-lg text-sm font-medium ${
                  selectedShiftType === type.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "hover:bg-gray-50"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
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
            disabled={isSubmitting || selectedEmployees.length === 0}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Schedules"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BulkScheduleModal;
