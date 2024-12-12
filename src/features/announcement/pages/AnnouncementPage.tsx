import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Search } from "lucide-react";
import { AppDispatch, RootState } from "@/app/store";

import { AnnouncementList } from "../components/AnnouncementList";
import { AnnouncementModal } from "../components/AnnouncementModal";
import { AnnouncementDetail } from "../components/AnnouncementDetail";

import {
  fetchAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  setSelectedAnnouncement,
  clearSelectedAnnouncement,
} from "../slice/announcementSlice";
import {
  Announcement,
  AnnouncementPriority,
  CreateAnnouncement,
} from "../types/announcement.type";

export default function AnnouncementsPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);
  const {
    announcements: { items = [] },
    selectedAnnouncement,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.announcement);

  const isAdmin = user?.role === "admin";

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | AnnouncementPriority
  >("all");

  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  const handleCreateAnnouncement = async (data: CreateAnnouncement) => {
    try {
      await dispatch(createAnnouncement(data)).unwrap();
      setShowCreateModal(false);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to create announcement"
      );
    }
  };

  const handleUpdateAnnouncement = async (data: CreateAnnouncement) => {
    if (!editingAnnouncement) return;

    try {
      await dispatch(
        updateAnnouncement({
          id: editingAnnouncement.id,
          data,
        })
      ).unwrap();
      setEditingAnnouncement(null);
      setShowCreateModal(false);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to update announcement"
      );
    }
  };

  const handleAnnouncementClick = (announcement: Announcement) => {
    dispatch(setSelectedAnnouncement(announcement));
  };

  const handleEdit = (announcement: Announcement) => {
    dispatch(clearSelectedAnnouncement());
    setEditingAnnouncement(announcement);
    setShowCreateModal(true);
  };

  // Filter announcements
  const filteredAnnouncements = items
    .filter(
      (announcement) =>
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((announcement) =>
      priorityFilter === "all" ? true : announcement.priority === priorityFilter
    );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-500 mt-1">
              {isAdmin
                ? "Manage and create company announcements"
                : "View company announcements"}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Announcement
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search announcements..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <select
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20"
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value as "all" | AnnouncementPriority)
            }
          >
            <option value="all">All Priority</option>
            <option value="high">High Priority</option>
            <option value="normal">Normal Priority</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      {filteredAnnouncements.length > 0 ? (
        <AnnouncementList
          announcements={filteredAnnouncements}
          onAnnouncementClick={handleAnnouncementClick}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <p className="text-gray-500">No announcements found</p>
        </div>
      )}

      {/* Modals */}
      <AnnouncementModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingAnnouncement(null);
        }}
        onSubmit={
          editingAnnouncement
            ? handleUpdateAnnouncement
            : handleCreateAnnouncement
        }
        initialData={editingAnnouncement}
      />

      {selectedAnnouncement && (
        <AnnouncementDetail
          isOpen={true}
          onClose={() => dispatch(clearSelectedAnnouncement())}
          announcement={selectedAnnouncement}
          canEdit={isAdmin}
          onEdit={() => handleEdit(selectedAnnouncement)}
        />
      )}
    </div>
  );
}