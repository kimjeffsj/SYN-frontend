import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { Notification } from "../type/notification";
import { WebSocketMessage } from "@/services/websocket";
import axios from "axios";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  isWebSocketConnected: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  isWebSocketConnected: false,
};

// Get notification list
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch notifications"
      );
    }
  }
);

// Mark as read
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId: number, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return notificationId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to mark notification as read"
      );
    }
  }
);

// Mark as read all notifications
export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/notifications/read-all`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to mark all notifications as read"
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setWebSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.isWebSocketConnected = action.payload;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    handleWebSocketMessage: (
      state,
      action: PayloadAction<WebSocketMessage>
    ) => {
      if (action.payload.type === "notification") {
        const notification = action.payload.payload as Notification;
        state.notifications.unshift(notification);
        if (!notification.isRead) {
          state.unreadCount += 1;
        }
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchNotifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.items;
        state.unreadCount = action.payload.unread;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // markNotificationAsRead
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (n) => n.id === action.payload
        );
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // markAllNotificationsAsRead
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((notification) => {
          notification.isRead = true;
        });
        state.unreadCount = 0;
      });
  },
});

export const {
  setWebSocketConnected,
  addNotification,
  handleWebSocketMessage,
  clearNotifications,
} = notificationSlice.actions;

export const selectNotifications = (state: RootState) =>
  state.notification.notifications;
export const selectUnreadCount = (state: RootState) =>
  state.notification.unreadCount;
export const selectIsWebSocketConnected = (state: RootState) =>
  state.notification.isWebSocketConnected;

export default notificationSlice.reducer;
