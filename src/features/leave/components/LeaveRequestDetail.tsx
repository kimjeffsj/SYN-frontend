import React, { useState } from "react";
import { LeaveRequest } from "../types/leave.type";
import { Modal } from "@/shared/components/Modal";
import { Calendar, Check, Clock, MessageSquare, User, X } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { StatusColor } from "@/shared/utils/status.utils";

interface LeaveRequestDetailProps {
  isOpen: boolean;
  onClose: () => void;
  request: LeaveRequest;
  isAdmin?: boolean;
  onApprove?: (id: number, comment?: string) => Promise<void>;
  onReject?: (id: number, comment?: string) => Promise<void>;
}

export const LeaveRequestDetail: React.FC<LeaveRequestDetailProps> = ({
  isOpen,
  onClose,
  request,
  isAdmin = false,
  onApprove,
  onReject,
}) => {
  const [adminComment, setAdminComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    if (!onApprove) return;

    try {
      setIsSubmitting(true);
      await onApprove(request.id, adminComment);
      onClose();
    } catch (error) {
      console.error("ERror approving request: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;

    try {
      setIsSubmitting(true);
      await onReject(request.id, adminComment);
      onClose();
    } catch (error) {
      console.error("Error rejecting request: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave Request Details">
      <div className="space-y-6">
        {/* Employee Info */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {request.employee.name}
            </h3>
            <div className="text-sm text-gray-500">
              {request.employee.position} • {request.employee.department}
            </div>
          </div>
        </div>

        {/* Leave Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center text-gray-700">
            <Calendar className="w-5 h-5 text-gray-400 mr-2" />
            <span>
              {format(new Date(request.start_date), "PP")} -{" "}
              {format(new Date(request.end_date), "PP")}
            </span>
          </div>
          <div className="flex items-center text-gray-700">
            <Clock className="w-5 h-5 text-gray-400 mr-2" />
            <span className="capitalize">
              {request.leave_type.toLowerCase().replace("_", " ")}
            </span>
          </div>
          {request.reason && (
            <div className="flex items-start">
              <MessageSquare className="w-5 h-5 text-gray-400 mr-2 mt-1" />
              <p className="text-gray-700">{request.reason}</p>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex justify-between items-center">
          <StatusBadge
            status={request.status.toLowerCase() as StatusColor}
            size="lg"
          />
          <div className="text-sm text-gray-500">
            Submitted on {format(new Date(request.created_at), "PPpp")}
          </div>
        </div>

        {/* Admin Response Section */}
        {request.admin_response && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Admin Response
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                {request.admin_response.comment}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                By {request.admin_response.admin_name} •{" "}
                {format(new Date(request.admin_response.processed_at), "PPpp")}
              </div>
            </div>
          </div>
        )}

        {/* Admin Actions */}
        {isAdmin && request.status === "PENDING" && (
          <div className="border-t pt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Comment (Optional)
              </label>
              <textarea
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
                rows={3}
                placeholder="Enter your comment..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleReject}
                disabled={isSubmitting}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 disabled:opacity-50"
              >
                <X className="w-4 h-4 inline-block mr-2" />
                Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Check className="w-4 h-4 inline-block mr-2" />
                Approve
              </button>
            </div>
          </div>
        )}

        {/* Close Button */}
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
