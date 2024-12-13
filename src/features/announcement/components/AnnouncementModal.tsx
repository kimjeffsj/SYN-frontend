import React, { useState } from "react";
import { Modal } from "@/shared/components/Modal";
import { AlertCircle } from "lucide-react";
import {
  AnnouncementModalProps,
  CreateAnnouncement,
} from "../types/announcement.type";

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<CreateAnnouncement>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    priority: initialData?.priority || "normal",
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.content.trim()) {
      setError("Content is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit announcement"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Announcement" : "New Announcement"}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Enter announcement title"
            required
          />
        </div>

        {/* Content Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content: e.target.value }))
            }
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary/20 focus:border-primary"
            rows={6}
            placeholder="Enter announcement content"
            required
          />
        </div>

        {/* Priority Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <div className="flex gap-4">
            {(["normal", "high"] as const).map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, priority }))}
                className={`
                  flex-1 px-4 py-2 rounded-lg border transition-colors capitalize
                  ${
                    formData.priority === priority
                      ? priority === "high"
                        ? "bg-red-100 text-red-800 border-red-200"
                        : "bg-blue-100 text-blue-800 border-blue-200"
                      : "bg-white hover:bg-gray-50"
                  }
                `}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
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
            {isSubmitting ? "Submitting..." : initialData ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
