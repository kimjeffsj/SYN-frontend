import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AdminDashboardState } from "../types/admin-dashboard.type";

import { RootState } from "@/app/store";
import { AxiosError } from "axios";
import { adminDashboardApi } from "../api/adminDashboardApi";

const initialState: AdminDashboardState = {
  stats: {
    employees: {
      total: 0,
      active: 0,
      onLeave: 0,
      pendingApproval: 0,
    },
    requests: {
      timeOff: 0,
      shiftTrade: 0,
      total: 0,
    },
  },
  recentUpdates: [],
  employees: [],
  announcements: [],
  isLoading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  "adminDashboard/fetchData",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const data = await adminDashboardApi.getDashboard(token);
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

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const stats = await adminDashboardApi.getStats(token);
      return stats;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to fetch stats"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const fetchRecentUpdates = createAsyncThunk(
  "dashboard/fetchUpdates",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const updates = await adminDashboardApi.getRecentUpdates(token);
      return updates;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to fetch updates"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.stats = null;
      state.recentUpdates = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.recentUpdates = action.payload.recentUpdates;
        state.employees = action.payload.employees;
        state.announcements = action.payload.announcements;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRecentUpdates.fulfilled, (state, action) => {
        state.recentUpdates = action.payload;
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
