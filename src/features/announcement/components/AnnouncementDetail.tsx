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
      <div className="space-y-6">
        {/* Header section */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">{announcement.title}</h2>
            <div className="text-sm text-gray-500 mt-1">
              By {announcement.author.name} • {announcement.author.position}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {announcement.priority === "high" && (
              <Pin className="w-4 h-4 text-red-500" />
            )}
            <StatusBadge
              status={announcement.priority} // 직접 priority 값을 사용
              size="sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-gray-600 min-h-[200px]">
            {announcement.content}
          </div>
        </div>

        {/* Footer with metadata */}
        <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t">
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
            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="flex items-center px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
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
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
