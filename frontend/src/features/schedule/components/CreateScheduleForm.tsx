import { AppDispatch, RootState } from "@/app/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateScheduleDto, ShiftType } from "../types/schedule.type";
import { createSchedule } from "../slice/scheduleSlice";
import { Modal } from "@/shared/components/Modal";
import { Calendar, Clock } from "lucide-react";

interface CreateScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateScheduleForm: React.FC<CreateScheduleFormProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isLoading } = useSelector((state: RootState) => state.schedule);

  const [formData, setFormData] = useState<Omit<CreateScheduleDto, "user_id">>({
    start_time: "",
    end_time: "",
    shift_type: "morning",
    description: "",
    is_repeating: false,
    repeat_pattern: "",
  });

  const shiftTypes: { value: ShiftType; label: string }[] = [
    { value: "morning", label: "Morning (08:00-16:00)" },
    { value: "afternoon", label: "Afternoon (12:00-20:00)" },
    { value: "evening", label: "Evening (17:00-22:00)" },
    { value: "full_day", label: "Full Day (08:00-18:00)" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await dispatch(
        createSchedule({
          ...formData,
          user_id: user.id,
        })
      ).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to create schedule: ", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Schedule">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shift Type
          </label>
          <select
            value={formData.shift_type}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                shift_type: e.target.value as ShiftType,
              }))
            }
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
          >
            {shiftTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4 inline-block mr-1" />
            Date
          </label>
          <input
            type="data"
            value={formData.start_time.split("T")[0]}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                start_time: `${e.target.value}T09:00:00Z`,
                end_time: `${e.target.value}T17:00:00Z`,
              }))
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Clock className="w-4 h-4 inline-block mr-1" />
            Time Range
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="time"
              value={formData.start_time.split("T")[1]?.slice(0, 5)}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  start_time: `${prev.start_time.split("T")[0]}T${
                    e.target.value
                  }:00Z`,
                }))
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
              required
            />
            <input
              type="time"
              value={formData.end_time.split("T")[1]?.slice(0, 5)}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  end_time: `${prev.end_time.split("T")[0]}T${
                    e.target.value
                  }:00Z`,
                }))
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
            rows={3}
            placeholder="Add any additional details..."
          />
        </div>

        <div className="flex items-center pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Schedule"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
