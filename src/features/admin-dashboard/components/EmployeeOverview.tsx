import React from "react";
import { User, Clock, MoreVertical } from "lucide-react";
import { EmployeeOverviewProps } from "../types/admin-dashboard.type";
import { getStatusBgStyle } from "@/shared/utils/status.utils";
import { StatusBadge } from "@/shared/components/StatusBadge";

export const EmployeeOverview: React.FC<EmployeeOverviewProps> = ({
  employees,
  onEmployeeClick,
}) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Employee Overview
          </h2>
          <div className="text-sm text-gray-500">
            {employees.length} employees
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onEmployeeClick(employee.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-lg ${getStatusBgStyle(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    employee.status as any
                  )}`}
                >
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{employee.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{employee.position}</span>
                    {employee.department && (
                      <>
                        <span>•</span>
                        <span>{employee.department}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {employee.currentShift && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{employee.currentShift}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <StatusBadge
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    status={employee.status as any}
                    size="sm"
                  />
                  <button
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle more actions
                    }}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {employees.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No employees found
          </div>
        )}
      </div>
    </div>
  );
};
