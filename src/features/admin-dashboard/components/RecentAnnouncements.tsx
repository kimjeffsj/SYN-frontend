import React from "react";
import { ChevronRight, Bell, AlertCircle } from "lucide-react";
import { RecentAnnouncementsProps } from "../types/admin-dashboard.type";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { getStatusBgStyle } from "@/shared/utils/status.utils";

export const RecentAnnouncements: React.FC<RecentAnnouncementsProps> = ({
  announcements,
  onViewAll,
  onAnnouncementClick,
}) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Announcements</h2>
          <button
            onClick={onViewAll}
            className="text-primary hover:text-primary/80 text-sm font-medium flex items-center"
          >
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onAnnouncementClick(announcement.id)}
          >
            <div className="flex items-start space-x-4">
              <div
                className={`p-2 rounded-lg ${getStatusBgStyle(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  announcement.priority as any
                )}`}
              >
                {announcement.priority === "high" ? (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <Bell className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {announcement.title}
                  </h3>
                  {announcement.isNew && (
                    <StatusBadge
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      status={"pending" as any}
                      size="sm"
                    />
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {announcement.content}
                </p>
                <div className="mt-1 flex items-center space-x-2">
                  <span className="text-xs text-gray-400">
                    {new Date(announcement.date).toLocaleDateString()}
                  </span>
                  <StatusBadge
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    status={announcement.priority as any}
                    size="sm"
                  />
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </div>
          </div>
        ))}

        {announcements.length === 0 && (
          <div className="p-8 text-center text-gray-500">No announcements</div>
        )}
      </div>
    </div>
  );
};
