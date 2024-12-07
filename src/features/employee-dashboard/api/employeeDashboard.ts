import axios from "axios";
import {
  Announcement,
  Employee,
  ScheduleItem,
} from "../type/employee-dashboard.type";

const API_URL = import.meta.env.VITE_API_URL;

export const employeeDashboardApi = {
  getEmployeeInfo: async (token: string) => {
    const response = await axios.get<Employee>(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getTodaySchedule: async (token: string) => {
    const response = await axios.get<ScheduleItem>(
      `${API_URL}/schedule/today`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getWeeklySchedule: async (token: string) => {
    const response = await axios.get<ScheduleItem[]>(
      `${API_URL}/schedule/weekly`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getAnnouncements: async (token: string) => {
    const response = await axios.get<Announcement[]>(
      `${API_URL}/announcements`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  markAnnouncementAsRead: async (token: string, announcementId: number) => {
    await axios.patch(
      `${API_URL}/announcements/${announcementId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};
