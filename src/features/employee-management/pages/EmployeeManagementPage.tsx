import { useEffect, useState, useMemo } from "react";
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
  clearSelectedEmployee,
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

  const handleClose = () => {
    setSelectedEmployeeId(null);
    dispatch(clearSelectedEmployee());
  };

  const handleEdit = (employee: Employee) => {
    handleClose();
    setEditingEmployee(employee);
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const searchTerm = searchQuery.toLowerCase().trim();
      if (!searchTerm) return true;

      return (
        employee.full_name?.toLowerCase().includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm) ||
        employee.position?.toLowerCase().includes(searchTerm) ||
        employee.department?.toLowerCase().includes(searchTerm)
      );
    });
  }, [employees, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Employee Management
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Manage and oversee all employees
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Employee
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="w-full">
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
          employees={filteredEmployees}
          onEmployeeClick={handleEmployeeClick}
        />
      )}

      {/* Modals */}
      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <EmployeeDetail
          employee={selectedEmployee}
          isOpen={true}
          onClose={handleClose}
          onEdit={() => {
            handleEdit(selectedEmployee);
          }}
        />
      )}

      {(showCreateModal || editingEmployee) && (
        <EmployeeForm
          isOpen={true}
          onClose={() => {
            setShowCreateModal(false);
            setEditingEmployee(null);
          }}
          onSubmit={
            editingEmployee ? handleUpdateEmployee : handleCreateEmployee
          }
          initialData={editingEmployee}
          mode={editingEmployee ? "edit" : "create"}
        />
      )}
    </div>
  );
};
