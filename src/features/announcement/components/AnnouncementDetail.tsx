import React from "react";
import { Modal } from "@/shared/components/Modal";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Clock, Pin, Edit, Trash2 } from "lucide-react";
import { AnnouncementDetailProps } from "../types/announcement.type";

export const AnnouncementDetail: React.FC<AnnouncementDetailProps> = ({
  announcement,
  isOpen,
  onClose,
  canEdit = false,
  onEdit,
  onDelete,
}) => {
  if (!announcement) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Announcement Detail"
      size="lg"
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">
              {announcement.title}
            </h2>
            <div className="text-xs sm:text-sm text-gray-500 mt-1">
              By {announcement.author.name} • {announcement.author.position}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {announcement.priority === "high" && (
              <Pin className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
            )}
            <StatusBadge status={announcement.priority} size="sm" />
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-gray-600 min-h-[150px] sm:min-h-[200px] text-sm sm:text-base">
            {announcement.content}
          </div>
        </div>

        {/* Footer with metadata */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-gray-500 pt-4 border-t gap-4">
          <div className="space-y-1">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>Created: {formatDate(announcement.created_at)}</span>
            </div>
            {announcement.updated_at &&
              announcement.updated_at !== announcement.created_at && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Updated: {formatDate(announcement.updated_at)}</span>
                </div>
              )}
          </div>

          {/* Edit and Delete buttons for admins */}
          {canEdit && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
