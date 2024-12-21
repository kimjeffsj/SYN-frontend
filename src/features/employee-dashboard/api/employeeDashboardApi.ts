import {
  DashboardResponse,
  Employee,
  Schedule,
  Announcement,
  DashboardStats,
} from "../type/employee-dashboard.type";
import axiosInstance from "@/services/axios-config";

const API_URL = import.meta.env.VITE_API_URL;

export const employeeDashboardApi = {
  getDashboardStats: async (token: string) => {
    const response = await axiosInstance.get<DashboardResponse>(
      `${API_URL}/dashboard/`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  },

  getEmployeeInfo: async (token: string) => {
    const response = await axiosInstance.get<Employee>(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getTodaySchedule: async (token: string) => {
    const response = await axiosInstance.get<Schedule>(
      `${API_URL}/schedule/today`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  getWeeklySchedule: async (token: string) => {
    const response = await axiosInstance.get<Schedule[]>(
      `${API_URL}/schedule/weekly`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  getAnnouncements: async (token: string) => {
    const response = await axiosInstance.get<Announcement[]>(
      `${API_URL}/announcements`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  markAnnouncementAsRead: async (token: string, announcementId: number) => {
    await axiosInstance.patch(
      `${API_URL}/announcements/${announcementId}/read`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // Total hours
  getHoursStats: async (token: string) => {
    const response = await axiosInstance.get<DashboardStats>(
      `${API_URL}/stats/hours`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Vacation Request
  requestLeave: async (
    token: string,
    data: {
      startDate: string;
      endDate: string;
      reason: string;
    }
  ) => {
    const response = await axiosInstance.post(
      `${API_URL}/leave/request`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Shift Trade requests
  requestShiftTrade: async (
    token: string,
    data: {
      scheduleId: number;
      targetDate: string;
      message?: string;
    }
  ) => {
    const response = await axiosInstance.post(
      `${API_URL}/schedule/trade-request`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  setupInterceptors: () => {
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          window.location.href = "/";
        }
        return Promise.reject(error);
      }
    );
  },
};
