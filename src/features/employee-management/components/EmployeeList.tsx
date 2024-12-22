// src/features/employee-management/components/EmployeeList.tsx
import React from "react";
import { User, MoreVertical } from "lucide-react";
import { Employee } from "../types/employee.type";
import { StatusBadge } from "@/shared/components/StatusBadge";

interface EmployeeListProps {
  employees: Employee[];
  onEmployeeClick: (employee: Employee) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  onEmployeeClick,
}) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comment
              </th>
              <th className="relative px-3 sm:px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onEmployeeClick(employee)}
              >
                <td className="px-3 sm:px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                      <User className="h-full w-full rounded-full bg-gray-100 p-2" />
                    </div>
                    <div className="ml-2 sm:ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.full_name}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {employee.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {employee.department || "-"}
                  </div>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {employee.position || "-"}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <StatusBadge
                    status={employee.is_active ? "active" : "onLeave"}
                    size="sm"
                  />
                </td>
                <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {employee.comment || "-"}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-500">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
