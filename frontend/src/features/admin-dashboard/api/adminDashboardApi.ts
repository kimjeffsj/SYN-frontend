import axios from "axios";
import {
  AdminDashboardState,
  DashboardStats,
  RecentUpdate,
} from "../types/admin-dashboard.type";

const API_URL = import.meta.env.VITE_API_URL;

export const adminDashboardApi = {
  getDashboard: async (token: string) => {
    const response = await axios.get<
      Omit<AdminDashboardState, "isLoading" | "error">
    >(`${API_URL}/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

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
