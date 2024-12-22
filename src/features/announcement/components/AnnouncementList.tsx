import React from "react";
import { ChevronRight, Clock } from "lucide-react";

import { StatusBadge } from "@/shared/components/StatusBadge";
import { AnnouncementListProps } from "../types/announcement.type";

export const AnnouncementList: React.FC<AnnouncementListProps> = ({
  announcements,
  onAnnouncementClick,
}) => {
  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onAnnouncementClick(announcement)}
        >
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm sm:text-base">
                  {announcement.author.avatar || announcement.author.name[0]}
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="font-medium text-sm sm:text-base">
                      {announcement.author.name}
                    </span>
                    <span className="hidden sm:inline mx-2 text-gray-300">
                      •
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {announcement.author.position}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {new Date(announcement.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              <StatusBadge status={announcement.priority} size="sm" />
            </div>

            <h3 className="text-base sm:text-lg font-medium mb-2">
              {announcement.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 line-clamp-2">
              {announcement.content}
            </p>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="flex items-center text-xs sm:text-sm text-gray-500">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {new Date(announcement.created_at).toLocaleString()}
              </div>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
