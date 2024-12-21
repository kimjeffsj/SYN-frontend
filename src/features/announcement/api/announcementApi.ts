import {
  Announcement,
  AnnouncementResponse,
  CreateAnnouncement,
} from "../types/announcement.type";
import axiosInstance from "@/services/axios-config";

const API_URL = import.meta.env.VITE_API_URL;

export const announcementApi = {
  // Get all announcements
  getAnnouncements: async (token: string) => {
    const response = await axiosInstance.get<AnnouncementResponse>(
      `${API_URL}/announcements`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Get single announcement
  getAnnouncement: async (token: string, id: number) => {
    const response = await axiosInstance.get<Announcement>(
      `${API_URL}/announcements/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Create announcement
  createAnnouncement: async (token: string, data: CreateAnnouncement) => {
    const response = await axiosInstance.post<Announcement>(
      `${API_URL}/announcements`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Update announcement
  updateAnnouncement: async (
    token: string,
    id: number,
    data: Partial<CreateAnnouncement>
  ) => {
    const response = await axiosInstance.patch<Announcement>(
      `${API_URL}/announcements/${id}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Delete announcement
  deleteAnnouncement: async (token: string, id: number) => {
    await axiosInstance.delete(`${API_URL}/announcements/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Mark as red
  markAsRead: async (token: string, id: number) => {
    const response = await axiosInstance.post<Announcement>(
      `${API_URL}/announcements/${id}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};
