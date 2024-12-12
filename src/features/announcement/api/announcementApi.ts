import axios from "axios";
import { Announcement, CreateAnnouncement } from "../types/announcement.type";

const API_URL = import.meta.env.VITE_API_URL;

export const announcementApi = {
  // Get all announcements
  getAnnouncements: async (token: string) => {
    const response = await axios.get<Announcement[]>(
      `${API_URL}/announcements`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Get single announcement
  getAnnouncement: async (token: string, id: number) => {
    const response = await axios.get<Announcement>(
      `${API_URL}/announcements/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Create announcement
  createAnnouncement: async (token: string, data: CreateAnnouncement) => {
    const response = await axios.post<Announcement>(
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
    const response = await axios.patch<Announcement>(
      `${API_URL}/announcements/${id}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Delete announcement
  deleteAnnouncement: async (token: string, id: number) => {
    await axios.delete(`${API_URL}/announcements/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Mark as red
  markAsRead: async (token: string, id: number) => {
    const response = await axios.post<Announcement>(
      `${API_URL}/announcements/${id}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};
