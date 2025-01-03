import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { PendingRequestsProps } from "../types/admin-dashboard.type";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { getStatusBgStyle } from "@/shared/utils/status.utils";

export const PendingRequests: React.FC<PendingRequestsProps> = ({
  requests,
  onApprove,
  onReject,
}) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Pending Requests
          </h2>
          <span className="px-2.5 py-0.5 text-sm font-medium bg-primary/10 text-primary rounded-full">
            {requests.length} pending
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className={`border rounded-lg ${getStatusBgStyle(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              request.status.toLowerCase() as any
            )} p-4`}
          >
            <div className="flex justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <StatusBadge
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    status={request.type.toLowerCase().replace("_", "") as any}
                    size="sm"
                  />
                </div>
                <h3 className="font-medium mt-2">{request.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {request.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(request.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onApprove(request.id)}
                  className="p-1.5 rounded-full hover:bg-green-50 text-green-600 transition-colors"
                  title="Approve"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onReject(request.id)}
                  className="p-1.5 rounded-full hover:bg-red-50 text-red-600 transition-colors"
                  title="Reject"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No pending requests
          </div>
        )}
      </div>
    </div>
  );
};
