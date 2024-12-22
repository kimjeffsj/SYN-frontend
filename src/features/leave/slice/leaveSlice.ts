import { RootState } from "@/app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { leaveApi } from "../api/leaveApi";
import { AxiosError } from "axios";
import {
  CreateLeaveRequest,
  LeaveRequest,
  LeaveRequestState,
  LeaveRequestUpdate,
} from "../types/leave.type";

const initialState: LeaveRequestState = {
  requests: [],
  selectedRequest: null,
  isLoading: false,
  error: null,
};

export const fetchLeaveRequests = createAsyncThunk(
  "leave/fetchAll",
  async (status: string | undefined, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      return await leaveApi.getLeaveRequests(token, status);
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to fetch leave requests"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Fetch my leave requests
export const fetchMyLeaveRequests = createAsyncThunk(
  "leave/fetchMine",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      return await leaveApi.getMyLeaveRequests(token);
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to fetch leave requests"
        );
      }
    }
    return rejectWithValue("An unexpected error occurred");
  }
);

// Create leave request
export const createLeaveRequest = createAsyncThunk(
  "leave/create",
  async (data: CreateLeaveRequest, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      return await leaveApi.createLeaveRequest(token, data);
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to create leave request"
        );
      }
    }
    return rejectWithValue("An unexpected error occurred");
  }
);

// Process leave request
export const processLeaveRequest = createAsyncThunk(
  "leave/process",
  async (
    { id, data }: { id: number; data: LeaveRequestUpdate },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const response = await leaveApi.processLeaveRequest(token, id, data);
      return response;
    } catch (error) {
      console.error("Error details:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }
);

// Cancel leave request
export const cancelLeaveRequest = createAsyncThunk(
  "leave/cancel",
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      await leaveApi.cancelLeaveRequest(token, id);
      return id;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to cancel leave request"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    setSelectedRequest: (state, action) => {
      state.selectedRequest = action.payload;
    },
    clearSelectedRequest: (state) => {
      state.selectedRequest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchLeaveRequests
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload.items;
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // fetchMyLeaveRequests
      .addCase(fetchMyLeaveRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyLeaveRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload)) {
          state.requests = action.payload;
        } else if (action.payload) {
          const leaveRequest = action.payload as LeaveRequest;
          const existingIndex = state.requests.findIndex(
            (req) => req.id === leaveRequest.id
          );

          if (existingIndex >= 0) {
            state.requests[existingIndex] = leaveRequest;
          } else {
            state.requests.push(leaveRequest);
          }
        }
      })
      .addCase(fetchMyLeaveRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // createLeaveRequest
      .addCase(createLeaveRequest.fulfilled, (state, action) => {
        state.requests.unshift(action.payload);
      })

      // processLeaveRequest
      .addCase(processLeaveRequest.fulfilled, (state, action) => {
        const index: number = state.requests.findIndex(
          (request: LeaveRequest) => request.id === action.payload.id
        );
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.selectedRequest?.id === action.payload.id) {
          state.selectedRequest = action.payload;
        }
      })

      // cancelLeaveRequest
      .addCase(cancelLeaveRequest.fulfilled, (state, action) => {
        state.requests = state.requests.filter(
          (request) => request.id !== action.payload
        );
        if (state.selectedRequest?.id === action.payload) {
          state.selectedRequest = null;
        }
      });
  },
});

export const { setSelectedRequest, clearSelectedRequest } = leaveSlice.actions;
export default leaveSlice.reducer;
