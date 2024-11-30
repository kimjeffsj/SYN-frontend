import { RootState } from "@/app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { scheduleApi } from "../api/scheduleApi";
import { AxiosError } from "axios";
import {
  CreateScheduleDto,
  ScheduleState,
  ScheduleStatus,
} from "../types/schedule.type";

const initialState: ScheduleState = {
  schedules: [],
  selectedSchedule: null,
  isLoading: false,
  error: null,
};

export const fetchMySchedules = createAsyncThunk(
  "schedule/fetchMySchedules",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const schedules = await scheduleApi.getMySchedules(token);
      return schedules;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to fetch schedules"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const fetchAllSchedules = createAsyncThunk(
  "schedule/fetchAllSchedules",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const schedules = await scheduleApi.getAllSchedules(token);
      return schedules;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to fetch schedules"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const updateScheduleStatus = createAsyncThunk(
  "schedule/updateStatus",
  async (
    { scheduleId, status }: { scheduleId: number; status: ScheduleStatus },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const updatedSchedule = await scheduleApi.updateScheduleStatus(
        token,
        scheduleId,
        status
      );
      return updatedSchedule;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to update schedule status"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const deleteSchedule = createAsyncThunk(
  "schedule/delete",
  async (scheduleId: number, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      await scheduleApi.deleteSchedule(token, scheduleId);
      return scheduleId;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to delete schedule"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const adminCreateSchedule = createAsyncThunk(
  "schedule/adminCreate",
  async (scheduleData: CreateScheduleDto, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const schedule = await scheduleApi.adminCreateSchedule(
        token,
        scheduleData
      );
      return schedule;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to create schedule"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const bulkCreateSchedules = createAsyncThunk(
  "schedule/bulkCreate",
  async (schedules: CreateScheduleDto[], { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const createdSchedules = await scheduleApi.bulkCreateSchedules(
        token,
        schedules
      );
      return createdSchedules;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to create schedules"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    selectSchedule: (state, action) => {
      state.selectedSchedule = action.payload;
    },
    clearSchedule: (state) => {
      state.selectedSchedule = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMySchedules.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMySchedules.fulfilled, (state, action) => {
        state.isLoading = false;
        state.schedules = action.payload;
      })
      .addCase(fetchMySchedules.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // AdminCreateSchedules
      .addCase(adminCreateSchedule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminCreateSchedule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.schedules.push(action.payload);
      })
      .addCase(adminCreateSchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchAllSchedules
      .addCase(fetchAllSchedules.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllSchedules.fulfilled, (state, action) => {
        state.isLoading = false;
        state.schedules = action.payload;
      })
      .addCase(fetchAllSchedules.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // updateScheduleStatus
      .addCase(updateScheduleStatus.fulfilled, (state, action) => {
        const index = state.schedules.findIndex(
          (schedule) => schedule.id === action.payload.id
        );
        if (index !== -1) {
          state.schedules[index] = action.payload;
        }
      })

      // deleteSchedule
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.schedules = state.schedules.filter(
          (schedule) => schedule.id !== action.payload
        );
      })

      // bulkCreateSchedules
      .addCase(bulkCreateSchedules.fulfilled, (state, action) => {
        state.schedules = [...state.schedules, ...action.payload];
      });
  },
});

export const { selectSchedule, clearSchedule } = scheduleSlice.actions;
export default scheduleSlice.reducer;
