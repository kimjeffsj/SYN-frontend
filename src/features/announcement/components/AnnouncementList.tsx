import React from "react";
import { Pin, ChevronRight, Clock } from "lucide-react";

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
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {announcement.author.avatar || announcement.author.name[0]}
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">
                      {announcement.author.name}
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-gray-500">
                      {announcement.author.position}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(announcement.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {announcement.priority === "high" && (
                  <Pin className="w-4 h-4 text-red-500" />
                )}
                <StatusBadge
                  status={
                    announcement.priority === "high" ? "pending" : "active"
                  }
                  size="sm"
                />
              </div>
            </div>

            <h3 className="text-lg font-medium mb-2">{announcement.title}</h3>
            <p className="text-gray-600 line-clamp-2">{announcement.content}</p>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(announcement.created_at).toLocaleString()}
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
