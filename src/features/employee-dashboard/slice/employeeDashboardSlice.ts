import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { EmployeeDashboardState } from "../type/employee-dashboard.type";
import { RootState } from "@/app/store";
import { employeeDashboardApi } from "../api/employeeDashboardApi";

const initialState: EmployeeDashboardState = {
  employee: null,
  stats: null,
  todaySchedule: null,
  weeklySchedule: [],
  announcements: [],
  isLoading: false,
  error: null,
};

let isDataFetched = false;
// Get Dashboard Data
export const fetchDashboardData = createAsyncThunk(
  "employeeDashboard/fetchDashboardData",
  async (_, { getState, rejectWithValue }) => {
    try {
      if (isDataFetched) return;

      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const data = await employeeDashboardApi.getDashboardStats(token);
      isDataFetched = true;
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to fetch dashboard data"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Get weekly schedule
export const fetchWeeklySchedule = createAsyncThunk(
  "employeeDashboard/fetchWeeklySchedule",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const schedule = await employeeDashboardApi.getWeeklySchedule(token);
      return schedule;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to fetch weekly schedule"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Get Announcements
export const fetchAnnouncements = createAsyncThunk(
  "employeeDashboard/fetchAnnouncements",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const announcements = await employeeDashboardApi.getAnnouncements(token);
      return announcements;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to fetch announcements"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Mark Announcement read
export const markAnnouncementAsReadAsync = createAsyncThunk(
  "employeeDashboard/markAnnouncementAsRead",
  async (announcementId: number, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      await employeeDashboardApi.markAnnouncementAsRead(token, announcementId);
      return announcementId;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to mark announcement as read"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const employeeDashboardSlice = createSlice({
  name: "employeeDashboard",
  initialState,
  reducers: {
    clearDashboard: () => initialState,
    markAnnouncementAsRead: (state, action) => {
      const announcement = state.announcements.find(
        (a) => a.id === action.payload
      );
      if (announcement) {
        announcement.isNew = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchDashboardData
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.employee = action.payload.employee;
          state.stats = {
            totalHours: 0,
            completedShifts: 0,
            upcomingShifts: 0,
            leaveBalance: 0,
          };
          state.todaySchedule = action.payload.today_schedule;
          state.weeklySchedule = action.payload.weekly_schedule;
          state.announcements = action.payload.announcement || [];
        }
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // fetchWeeklySchedule
      .addCase(fetchWeeklySchedule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWeeklySchedule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.weeklySchedule = action.payload;
      })
      .addCase(fetchWeeklySchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // fetchAnnouncements
      .addCase(fetchAnnouncements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.announcements = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // markAnnouncementAsRead
      .addCase(markAnnouncementAsReadAsync.fulfilled, (state, action) => {
        const announcement = state.announcements.find(
          (a) => a.id === action.payload
        );
        if (announcement) {
          announcement.isNew = false;
        }
      });
  },
});

export const { clearDashboard, markAnnouncementAsRead } =
  employeeDashboardSlice.actions;

export default employeeDashboardSlice.reducer;
