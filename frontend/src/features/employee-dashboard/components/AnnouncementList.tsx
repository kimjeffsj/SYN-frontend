import React from "react";
import { ChevronRight } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  date: string;
  isNew: boolean;
}

interface AnnouncementListProps {
  announcements: Announcement[];
  onViewDetail: () => void;
  onAnnouncementClick: (id: number) => void;
}

export const AnnouncementList: React.FC<AnnouncementListProps> = ({
  announcements,
  onViewDetail,
  onAnnouncementClick,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary">Announcements</h2>
        <button
          onClick={onViewDetail}
          className="flex items-center text-sm text-secondary"
        >
          View All
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      <div className="border rounded-lg">
        {announcements.map((announcement, index) => (
          <div
            key={announcement.id}
            className={`p-4 flex items-center hover:bg-gray-50 cursor-pointer
              ${index !== announcements.length - 1 ? "border-b" : ""}`}
            onClick={() => onAnnouncementClick(announcement.id)}
          >
            <span className="mr-4 text-gray-400 w-8">{announcement.id}.</span>
            <div className="flex-1">
              <div className="flex items-center">
                <span>{announcement.title}</span>
                {announcement.isNew && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full text-white bg-red-500">
                    New
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-400">
                {new Date(announcement.date).toLocaleDateString()}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
};
