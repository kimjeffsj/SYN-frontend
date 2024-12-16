import { Modal } from "@/shared/components/Modal";
import { Schedule } from "../types/schedule.type";
import { Calendar, Clock, FilePen, User } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { formatTime } from "../\butils/schedule.utils";

interface ShiftDetailProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule | null;
}

export const ShiftDetail = ({
  isOpen,
  onClose,
  schedule,
}: ShiftDetailProps) => {
  if (!schedule) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Shift Details">
      <div className="space-y-6">
        {/* Status Badge */}
        <div className="flex justify-between items-center">
          <StatusBadge
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            status={schedule.status.toLowerCase() as any}
            size="lg"
          />
        </div>

        {/* Schedule Info */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">Date</div>
              <div className="text-gray-500">
                {new Date(schedule.start_time).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">Time</div>
              <div className="text-gray-500">
                {formatTime(schedule.start_time)} -{" "}
                {formatTime(schedule.end_time)}
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">Employee ID</div>
              <div className="text-gray-500">{schedule.user_id}</div>
            </div>
          </div>

          {schedule.description && (
            <div className="flex items-start space-x-3">
              <FilePen className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Description</div>
                <div className="text-gray-500">{schedule.description}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
