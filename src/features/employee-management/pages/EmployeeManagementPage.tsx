import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { Plus, Search } from "lucide-react";
import { EmployeeList } from "../components/EmployeeList";
import { EmployeeForm } from "../components/EmployeeForm";
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  fetchEmployee,
} from "../slice/employeeSlice";
import {
  CreateEmployeeDto,
  Employee,
  UpdateEmployeeDto,
} from "../types/employee.type";
import { toast } from "react-toastify";
import { EmployeeDetail } from "../components/EmployeeDetail";

export const EmployeesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, isLoading, error } = useSelector(
    (state: RootState) => state.employees
  );

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );

  const selectedEmployee = useSelector(
    (state: RootState) => state.employees.selectedEmployee
  );

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (selectedEmployeeId) {
      dispatch(fetchEmployee(selectedEmployeeId));
    }
  }, [selectedEmployeeId, dispatch]);

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployeeId(employee.id);
  };

  const handleCreateEmployee = async (
    data: CreateEmployeeDto | UpdateEmployeeDto
  ) => {
    if (!("password" in data)) {
      toast.error("Password is required for creating an employee");
      return;
    }
    try {
      await dispatch(createEmployee(data)).unwrap();
      toast.success("Employee created successfully");
      setShowCreateModal(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create employee"
      );
      throw error;
    }
  };

  const handleUpdateEmployee = async (data: UpdateEmployeeDto) => {
    if (!editingEmployee) return;

    try {
      await dispatch(
        updateEmployee({
          id: editingEmployee.id,
          data,
        })
      ).unwrap();
      toast.success("Employee updated successfully");
      setEditingEmployee(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update employee"
      );
      throw error;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Employee Management
          </h1>
          <p className="text-gray-500 mt-1">Manage and oversee all employees</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Employee
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search employees..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Employee List */}
      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <EmployeeList
          employees={employees}
          onEmployeeClick={handleEmployeeClick}
        />
      )}

      {/* Modals */}
      <EmployeeForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateEmployee}
        mode="create"
      />

      {editingEmployee && (
        <EmployeeForm
          isOpen={true}
          onClose={() => setEditingEmployee(null)}
          onSubmit={handleUpdateEmployee}
          initialData={editingEmployee}
          mode="edit"
        />
      )}

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <EmployeeDetail
          employee={selectedEmployee}
          isOpen={true}
          onClose={() => setSelectedEmployeeId(null)}
          onEdit={() => {
            setEditingEmployee(selectedEmployee);
            setSelectedEmployeeId(null);
          }}
        />
      )}
    </div>
  );
};
