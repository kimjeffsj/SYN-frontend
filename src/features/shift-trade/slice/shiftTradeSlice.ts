import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { shiftTradeApi } from "../api/shiftTradeApi";
import { AxiosError } from "axios";
import {
  CreateTradeRequest,
  CreateTradeResponse,
  ShiftTradeRequest,
  ShiftTradeResponse,
} from "../types/shift-trade.type";

interface ShiftTradeState {
  requests: ShiftTradeRequest[];
  selectedRequest: ShiftTradeRequest | null;
  responses: Record<number, ShiftTradeResponse[]>;
  isLoading: boolean;
  error: string | null;
}

const initialState: ShiftTradeState = {
  requests: [],
  selectedRequest: null,
  responses: {},
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchTradeRequests = createAsyncThunk(
  "shiftTrade/fetchRequests",
  async (
    params: { status?: string; type?: string; search?: string } | undefined,
    { getState, rejectWithValue }
  ) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const requests = await shiftTradeApi.getTradeRequests(token, params);
      return requests;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to fetch requests"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Get single Request
export const fetchTradeRequest = createAsyncThunk(
  "shiftTrade/fetchRequest",
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const request = await shiftTradeApi.getTradeRequest(token, id);
      return request;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to fetch request"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const createTradeRequest = createAsyncThunk(
  "shiftTrade/createRequest",
  async (data: CreateTradeRequest, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const request = await shiftTradeApi.createTradeRequest(token, data);
      return request;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to create request"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const createTradeResponse = createAsyncThunk(
  "shiftTrade/createResponse",
  async (
    { tradeId, data }: { tradeId: number; data: CreateTradeResponse },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const response = await shiftTradeApi.createTradeResponse(
        token,
        tradeId,
        data
      );
      return { tradeId, response };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to create response"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const updateResponseStatus = createAsyncThunk(
  "shiftTrade/updateResponseStatus",
  async (
    {
      tradeId,
      responseId,
      status,
    }: {
      tradeId: number;
      responseId: number;
      status: "ACCEPTED" | "REJECTED" | "PENDING";
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const response = await shiftTradeApi.updateResponseStatus(
        token,
        tradeId,
        responseId,
        status
      );

      return { tradeId, response };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to update response status"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const cancelTradeRequest = createAsyncThunk(
  "shiftTrade/cancelRequest",
  async (tradeId: number, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      await shiftTradeApi.cancelTradeRequest(token, tradeId);
      return tradeId;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to cancel request"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const acceptGiveaway = createAsyncThunk(
  "shiftTrade/acceptGiveaway",
  async (tradeId: number, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const response = await shiftTradeApi.acceptGiveaway(token, tradeId);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to accept giveaway"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const shiftTradeSlice = createSlice({
  name: "shiftTrade",
  initialState,
  reducers: {
    clearSelected: (state) => {
      state.selectedRequest = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch requests
      .addCase(fetchTradeRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTradeRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload;
      })
      .addCase(fetchTradeRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch single request
      .addCase(fetchTradeRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTradeRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedRequest = action.payload;
        state.responses[action.payload.id] = action.payload.responses;
      })
      .addCase(fetchTradeRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create request
      .addCase(createTradeRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTradeRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests.unshift(action.payload);
      })
      .addCase(createTradeRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create response
      .addCase(createTradeResponse.fulfilled, (state, action) => {
        const { tradeId, response } = action.payload;
        const request = state.requests.find((r) => r.id === tradeId);
        if (request) {
          if (!request.responses) {
            request.responses = [];
          }
          request.responses.push(response);
        }
        if (state.selectedRequest?.id === tradeId) {
          if (!state.selectedRequest.responses) {
            state.selectedRequest.responses = [];
          }
          state.selectedRequest.responses.push(response);
        }
      })

      // Update response status
      .addCase(updateResponseStatus.fulfilled, (state, action) => {
        const { tradeId, response } = action.payload;
        if (response.status === "ACCEPTED") {
          state.requests = state.requests.filter((r) => r.id !== tradeId);
          if (state.selectedRequest?.id === tradeId) {
            state.selectedRequest = null;
          }
        } else {
          const request = state.requests.find((r) => r.id === tradeId);
          if (request) {
            const responseIndex = request.responses.findIndex(
              (r) => r.id === response.id
            );
            if (responseIndex !== -1) {
              request.responses[responseIndex] = response;
            }
          }
        }
      })
      .addCase(acceptGiveaway.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(acceptGiveaway.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the accepted request from the list
        state.requests = state.requests.filter(
          (request) => request.id !== action.payload.id
        );
        // Clear selected request if it was the one that was accepted
        if (state.selectedRequest?.id === action.payload.id) {
          state.selectedRequest = null;
        }
      })
      .addCase(acceptGiveaway.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Accept Giveaway
      .addCase(cancelTradeRequest.fulfilled, (state, action) => {
        state.requests = state.requests.filter((r) => r.id !== action.payload);
      });
  },
});

export const { clearSelected, clearError } = shiftTradeSlice.actions;
export default shiftTradeSlice.reducer;
