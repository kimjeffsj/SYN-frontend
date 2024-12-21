import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { employeeApi } from "@/features/employee-management/api/employeeApi";
import { storage } from "@/shared/utils/storage";

interface Employee {
  id: number;
  full_name: string;
  position: string | null;
  department: string | null;
}

interface EmployeeComboboxProps {
  value: string;
  onChange: (employeeId: number, employeeName: string) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export const EmployeeCombobox: React.FC<EmployeeComboboxProps> = ({
  value,
  onChange,
  className = "",
  disabled = false,
  required = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const token = storage.getToken();
        if (!token) throw new Error("No access token");

        const response = await employeeApi.getEmployees(token);
        setEmployees(response);
        setFilteredEmployees(response);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter(
      (employee) =>
        employee.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.department?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchQuery, employees]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        comboboxRef.current &&
        !comboboxRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEmployeeSelect = (employee: Employee) => {
    onChange(employee.id, employee.full_name);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={`relative ${className}`} ref={comboboxRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery || value}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search employee..."
          disabled={disabled || isLoading}
          className={`
            w-full border rounded-lg pl-4 pr-10 py-2 
            focus:ring-2 focus:ring-primary/20 focus:border-primary
            disabled:bg-gray-100 disabled:cursor-not-allowed
          `}
          required={required}
        />
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled || isLoading}
          className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border max-h-60 overflow-auto">
          {filteredEmployees.map((employee) => (
            <button
              key={employee.id}
              type="button"
              onClick={() => handleEmployeeSelect(employee)}
              className={`
                w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between
                ${value === employee.full_name ? "bg-primary/5" : ""}
              `}
            >
              <div>
                <div className="font-medium">{employee.full_name}</div>
                {(employee.position || employee.department) && (
                  <div className="text-sm text-gray-500">
                    {[employee.position, employee.department]
                      .filter(Boolean)
                      .join(" • ")}
                  </div>
                )}
              </div>
              {value === employee.full_name && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}

          {filteredEmployees.length === 0 && (
            <div className="px-4 py-2 text-gray-500 text-sm">
              No employees found
            </div>
          )}
        </div>
      )}
    </div>
  );
};
