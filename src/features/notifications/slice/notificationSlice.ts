import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { NotificationItem } from "../type/notification";
import { notificationApi } from "../api/announcementApi";

interface NotificationState {
  notifications: NotificationItem[];
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

      return await notificationApi.getNotifications(token);
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

      return await notificationApi.markAsRead(token, notificationId);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to mark notification as read"
      );
    }
  }
);

// Mark all as read
export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      await notificationApi.markAllAsRead(token);
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
    setWebSocketConnected: (state, action) => {
      state.isWebSocketConnected = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.is_read) {
        state.unreadCount += 1;
      }
    },
    handleWebSocketMessage: (state, action) => {
      if (action.payload.type === "notification") {
        const notification = action.payload.payload as NotificationItem;
        const exists = state.notifications.some(
          (n) => n.id === notification.id
        );
        if (!exists) {
          state.notifications.unshift(notification);
          if (!notification.is_read) {
            state.unreadCount += 1;
          }
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
          (n) => n.id === action.payload.id
        );
        if (notification && !notification.is_read) {
          notification.is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // markAllNotificationsAsRead
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((notification) => {
          notification.is_read = true;
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
