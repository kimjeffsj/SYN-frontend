import React from "react";
import { LeaveRequest } from "../types/leave.type";
import { LeaveRequestCard } from "./LeaveRequestCard";

interface LeaveRequestListProps {
  requests: LeaveRequest[];
  onRequestClick: (request: LeaveRequest) => void;
  // isAdmin?: boolean;
}

export const LeaveRequestList: React.FC<LeaveRequestListProps> = ({
  requests,
  onRequestClick,
  // isAdmin = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Request List */}
      {requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <p className="text-gray-500">No leave requests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <LeaveRequestCard
              key={request.id}
              request={request}
              onClick={() => onRequestClick(request)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
