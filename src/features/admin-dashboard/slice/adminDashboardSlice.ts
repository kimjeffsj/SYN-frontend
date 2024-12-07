import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AdminDashboardState } from "../types/admin-dashboard.type";
import { RootState } from "@/app/store";
import { AxiosError } from "axios";
import { adminDashboardApi } from "../api/adminDashboardApi";

const initialState: AdminDashboardState = {
  stats: null,
  recentUpdates: [],
  employees: [],
  announcements: [],
  isLoading: false,
  error: null,
};

// Fetch dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  "adminDashboard/fetchStats",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const stats = await adminDashboardApi.getDashboard(token);
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

// Fetch recent updates
export const fetchRecentUpdates = createAsyncThunk(
  "adminDashboard/fetchUpdates",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const updates = await adminDashboardApi.getRecentUpdates();
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

// Fetch employees list
export const fetchEmployees = createAsyncThunk(
  "adminDashboard/fetchEmployees",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const employees = await adminDashboardApi.getEmployees();
      return employees;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to fetch employees"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Fetch Announcements
export const fetchAnnouncements = createAsyncThunk(
  "adminDashboard/fetchAnnouncements",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const announcements = await adminDashboardApi.getAnnouncements();
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

// Fetch all dashboard data
export const fetchAllDashboardData = createAsyncThunk(
  "adminDashboard/fetchAllData",
  async (_, { dispatch }) => {
    await Promise.all([
      dispatch(fetchDashboardStats()),
      dispatch(fetchRecentUpdates()),
      dispatch(fetchEmployees()),
      dispatch(fetchAnnouncements()),
    ]);
  }
);

const dashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.stats = null;
      state.recentUpdates = [];
      state.employees = [];
      state.announcements = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Stats
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

      // Recent Updates
      .addCase(fetchRecentUpdates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentUpdates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recentUpdates = action.payload;
      })
      .addCase(fetchRecentUpdates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Announcements
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
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
