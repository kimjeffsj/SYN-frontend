import axios from "axios";
import {
  DashboardStats,
  RecentUpdate,
  Employee,
  Announcement,
} from "../types/admin-dashboard.type";

const API_URL = import.meta.env.VITE_API_URL;

export const adminDashboardApi = {
  getDashboard: async (token: string): Promise<DashboardStats> => {
    const response = await axios.get<DashboardStats>(
      `${API_URL}/admin/dashboard/`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  getRecentUpdates: async (): Promise<RecentUpdate[]> => {
    const response = await axios.get<RecentUpdate[]>(
      `${API_URL}/admin/dashboard/updates`
    );
    return response.data;
  },

  getEmployees: async (): Promise<Employee[]> => {
    const response = await axios.get<Employee[]>(
      `${API_URL}/admin/dashboard/employees`
    );
    return response.data;
  },

  getAnnouncements: async (): Promise<Announcement[]> => {
    const response = await axios.get<Announcement[]>(
      `${API_URL}/admin/dashboard/announcements`
    );
    return response.data;
  },
};
