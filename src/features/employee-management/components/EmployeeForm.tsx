import React, { useState, useEffect } from "react";
import { Modal } from "@/shared/components/Modal";
import { AlertCircle } from "lucide-react";
import {
  CreateEmployeeDto,
  Employee,
  UpdateEmployeeDto,
} from "../types/employee.type";
import { Combobox } from "./Combobox";

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEmployeeDto | UpdateEmployeeDto) => Promise<void>;
  initialData?: Employee | null;
  mode: "create" | "edit";
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [departments, setDepartments] = useState<string[]>([
    "Engineering",
    "Marketing",
    "Sales",
    "Human Resources",
  ]);

  const [positions, setPositions] = useState<string[]>([
    "Software Engineer",
    "Product Manager",
    "Sales Representative",
    "HR Manager",
  ]);

  const [formData, setFormData] = useState<
    CreateEmployeeDto | UpdateEmployeeDto
  >(() => {
    if (mode === "edit" && initialData) {
      return {
        full_name: initialData.full_name,
        email: initialData.email,
        department: initialData.department || null,
        position: initialData.position || null,
        comment: initialData.comment || null,
        is_active: initialData.is_active,
      };
    }

    return {
      full_name: "",
      email: "",
      password: "",
      department: null,
      position: null,
      comment: null,
    };
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        full_name: initialData.full_name,
        email: initialData.email,
        department: initialData.department || null,
        position: initialData.position || null,
        comment: initialData.comment || null,
        is_active: initialData.is_active,
      });
    }
  }, [initialData, mode]);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Add New Employee" : "Edit Employee"}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  full_name: e.target.value,
                }))
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
              required={mode === "create"}
              readOnly={mode === "edit"}
            />
          </div>

          {/* Password (only for create mode) */}
          {mode === "create" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={(formData as CreateEmployeeDto).password || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
                required={mode === "create"}
              />
            </div>
          )}

          {/* Department */}
          <Combobox
            label="Department"
            value={formData.department || ""}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                department: value,
              }))
            }
            options={departments}
            placeholder="Select or enter department"
            onAddNewOption={(value) => {
              if (!departments.includes(value)) {
                setDepartments((prev) => [...prev, value]);
              }
            }}
          />

          {/* Position */}
          <Combobox
            label="Position"
            value={formData.position || ""}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                position: value,
              }))
            }
            options={positions}
            placeholder="Select or enter position"
            onAddNewOption={(value) => {
              if (!positions.includes(value)) {
                setPositions((prev) => [...prev, value]);
              }
            }}
          />

          {/* Active Status (only for edit mode) */}
          {mode === "edit" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={
                  (formData as UpdateEmployeeDto).is_active
                    ? "active"
                    : "inactive"
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: e.target.value === "active",
                  }))
                }
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment
            </label>
            <textarea
              value={formData.comment || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  comment: e.target.value,
                }))
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
              rows={3}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : mode === "create"
              ? "Create"
              : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
