import React, { useState } from "react";
import { Modal } from "@/shared/components/Modal";
import {
  CreateEmployeeDto,
  Employee,
  UpdateEmployeeDto,
} from "../types/employee.type";

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEmployeeDto | UpdateEmployeeDto) => Promise<void>;
  initialData?: Employee | null; // Employee 타입을 받을 수 있도록 변경
  mode: "create" | "edit";
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<
    CreateEmployeeDto | UpdateEmployeeDto
  >(() => {
    if (mode === "edit" && initialData) {
      return {
        full_name: initialData.full_name,
        department: initialData.department,
        position: initialData.position,
        comment: initialData.comment,
      } as UpdateEmployeeDto;
    }

    return {
      full_name: "",
      email: "",
      password: "",
      department: null,
      position: null,
      comment: null,
    } as CreateEmployeeDto;
  });
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
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, full_name: e.target.value }))
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          {mode === "create" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={(formData as CreateEmployeeDto).password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              value={formData.department ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, department: e.target.value }))
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
              placeholder="Enter department name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <input
              type="text"
              value={formData.position ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, position: e.target.value }))
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
              placeholder="Enter position"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment
            </label>
            <textarea
              value={formData.comment ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comment: e.target.value }))
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20"
              rows={3}
              placeholder="Add a comment about this employee"
            />
          </div>
        </div>

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
            {isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
