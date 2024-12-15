import axios from "axios";
import { NotificationItem } from "../type/notification";

const API_URL = import.meta.env.VITE_API_URL;

interface NotificationResponse {
  items: NotificationItem[];
  total: number;
  unread: number;
}

export const notificationApi = {
  getNotifications: async (token: string) => {
    const response = await axios.get<NotificationResponse>(
      `${API_URL}/notifications`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Mark as read
  markAsRead: async (token: string, id: number) => {
    const response = await axios.post<NotificationItem>(
      `${API_URL}/notifications/${id}/read`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async (token: string) => {
    await axios.post(
      `${API_URL}/notifications/read-all`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // Get notifications with params
  getNotificationsWithParams: async (
    token: string,
    params: {
      unread_only?: boolean;
      limit?: number;
      skip?: number;
    }
  ) => {
    const response = await axios.get<NotificationResponse>(
      `${API_URL}/notifications`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }
    );
    return response.data;
  },

  // Setup interceptors
  setupInterceptors: () => {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          window.location.href = "/";
        }
        return Promise.reject(error);
      }
    );
  },
};
