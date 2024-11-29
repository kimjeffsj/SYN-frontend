import { RootState } from "@/app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { scheduleApi } from "../api/scheduleApi";
import { AxiosError } from "axios";
import { CreateScheduleDto, ScheduleState } from "../types/schedule.type";

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

export const createSchedule = createAsyncThunk(
  "schedule/createSchedule",
  async (scheduleData: CreateScheduleDto, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const schedule = await scheduleApi.createSchedule(token, scheduleData);
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
      .addCase(createSchedule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.schedules.push(action.payload);
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectSchedule, clearSchedule } = scheduleSlice.actions;
export default scheduleSlice.reducer;
