import React from "react";
import { Modal } from "@/shared/components/Modal";
import { EmployeeDetail as EmployeeDetailType } from "../types/employee.type";
import { User, Calendar, Clock, Building2, Briefcase } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { format } from "date-fns";
import { EmployeeHistory } from "./EmployeeHistory";

interface EmployeeDetailProps {
  employee: EmployeeDetailType;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export const EmployeeDetail: React.FC<EmployeeDetailProps> = ({
  employee,
  isOpen,
  onClose,
  onEdit,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Employee Details" size="lg">
      <div className="space-y-4 sm:space-y-6">
        {/* Basic Info */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <User className="h-20 w-20 sm:h-16 sm:w-16 rounded-full bg-gray-100 p-3" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-lg font-medium">{employee.full_name}</h3>
                <p className="text-sm text-gray-500">{employee.email}</p>
              </div>
              <StatusBadge
                status={employee.is_active ? "active" : "onLeave"}
                size="lg"
              />
            </div>
          </div>
        </div>

        {/* Detail Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <Building2 className="w-5 h-5 text-gray-400 mr-2" />
              <div>
                <div className="text-sm text-gray-500">Department</div>
                <div className="font-medium">
                  {employee.department || "Not Assigned"}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Briefcase className="w-5 h-5 text-gray-400 mr-2" />
              <div>
                <div className="text-sm text-gray-500">Position</div>
                <div className="font-medium">
                  {employee.position || "Not Assigned"}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-2" />
              <div>
                <div className="text-sm text-gray-500">Joined Date</div>
                <div className="font-medium">
                  {format(new Date(employee.created_at), "PP")}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-400 mr-2" />
              <div>
                <div className="text-sm text-gray-500">Last Active</div>
                <div className="font-medium">
                  {employee.last_active_at
                    ? format(new Date(employee.last_active_at), "PP pp")
                    : "Never"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        {employee.schedules && employee.trade_requests && (
          <EmployeeHistory
            schedules={employee.schedules}
            tradeRequests={employee.trade_requests}
          />
        )}

        {/* Comments Section */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Comments</h4>
          <p className="text-gray-600 text-sm">
            {employee.comment || "No comments available"}
          </p>
        </div>

        {/* Leave & Schedule Info */}
        <div className="border-t pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-900">Leave Status</h4>
            <StatusBadge
              status={employee.is_on_leave ? "onLeave" : "active"}
              size="sm"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm">
              <span className="font-medium">Leave Balance:</span>{" "}
              {employee.leave_balance} days
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4 pt-4 border-t">
          <button
            onClick={() => onClose()}
            className="w-full sm:w-auto px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Close
          </button>
          <button
            onClick={() => onEdit()}
            className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Edit Employee
          </button>
        </div>
      </div>
    </Modal>
  );
};
