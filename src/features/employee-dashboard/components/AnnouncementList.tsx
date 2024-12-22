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
    <div className="px-4 md:px-0">
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-primary">
          Announcements
        </h2>
        <button
          onClick={onViewDetail}
          className="flex items-center text-xs md:text-sm text-secondary"
        >
          View All
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
        </button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        {announcements.map((announcement, index) => (
          <div
            key={announcement.id}
            className={`p-3 md:p-4 flex items-center hover:bg-gray-50 active:bg-gray-100 cursor-pointer
              ${index !== announcements.length - 1 ? "border-b" : ""}`}
            onClick={() => onAnnouncementClick(announcement.id)}
          >
            <span className="mr-3 md:mr-4 text-gray-400 w-6 md:w-8 text-sm md:text-base">
              {announcement.id}.
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <span className="text-sm md:text-base truncate">
                  {announcement.title}
                </span>
                {announcement.isNew && (
                  <span className="ml-2 px-1.5 md:px-2 py-0.5 text-xs rounded-full text-white bg-red-500 whitespace-nowrap">
                    New
                  </span>
                )}
              </div>
              <span className="text-xs md:text-sm text-gray-400">
                {new Date(announcement.date).toLocaleDateString()}
              </span>
            </div>
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0 ml-2" />
          </div>
        ))}
      </div>
    </div>
  );
};
