import axios from "axios";
import { DashboardStats, RecentUpdate } from "../types/admin-dashboard.type";

const API_URL = import.meta.env.VITE_API_URL;

export const dashboardApi = {
  getStats: async (token: string) => {
    const response = await axios.get<DashboardStats>(
      `${API_URL}/admin/dashboard/stats`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getRecentUpdates: async (token: string) => {
    const response = await axios.get<RecentUpdate[]>(
      `${API_URL}/admin/dashboard/updates`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};
