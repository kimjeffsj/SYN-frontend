import React, { useState } from "react";
import { Calendar, Clock, User, Check, X, Search } from "lucide-react";
import { Schedule, ScheduleStatus } from "../types/schedule.type";
import { getShiftTypeStyle } from "../\butils/schedule.utils";
import { StatusBadge } from "@/shared/components/StatusBadge";

interface ScheduleManagementProps {
  schedules: Schedule[];
  onStatusChange: (id: number, status: ScheduleStatus) => void;
  onDelete: (id: number) => Promise<void>;
}

const ScheduleManagement: React.FC<ScheduleManagementProps> = ({
  schedules,
  onStatusChange,
  onDelete,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Filters Section */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by employee..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shift Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedules.map((schedule) => (
              <tr key={schedule.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="w-8 h-8 bg-gray-100 rounded-full p-1.5 text-gray-600" />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {schedule.user_id}{" "}
                        {/* TODO: Add user name from relationship */}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(schedule.start_time).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-500 mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(schedule.start_time).toLocaleTimeString()} -
                      {new Date(schedule.end_time).toLocaleTimeString()}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getShiftTypeStyle(
                      schedule.shift_type
                    )}`}
                  >
                    {schedule.shift_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    status={schedule.status.toLowerCase() as any}
                    size="sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    {schedule.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            onStatusChange(schedule.id, "confirmed")
                          }
                          className="p-1 hover:bg-green-50 rounded text-green-600"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            onStatusChange(schedule.id, "cancelled")
                          }
                          className="p-1 hover:bg-red-50 rounded text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onDelete(schedule.id)}
                      className="p-1 hover:bg-red-50 rounded text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {schedules.length} results
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement;
