import { CreateTradeResponse } from "./../types/shift-trade.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateTradeRequest, ShiftTradeState } from "../types/shift-trade.type";
import { RootState } from "@/app/store";
import { shiftTradeApi } from "../api/shiftTradeApi";
import { AxiosError } from "axios";

const initialState: ShiftTradeState = {
  requests: [],
  selectedRequest: null,
  responses: [],
  isLoading: false,
  error: null,
};

export const fetchTradeRequests = createAsyncThunk(
  "shiftTrade/fetchRequests",
  async (
    params: { status?: string; type?: string } | undefined,
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

export const respondToTrade = createAsyncThunk(
  "shiftTrade/respondToTrade",
  async (
    { tradeId, data }: { tradeId: number; data: CreateTradeResponse },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = (getState() as RootState).auth.accessToken;
      if (!token) throw new Error("No access token");

      const response = await shiftTradeApi.respondToTrade(token, tradeId, data);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to respond"
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
    selectRequest: (state, action) => {
      state.selectedRequest = action.payload;
    },
    clearSelected: (state) => {
      state.selectedRequest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetching Trade requests list
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
      .addCase(createTradeRequest.fulfilled, (state, action) => {
        state.requests.unshift(action.payload);
      })
      .addCase(respondToTrade.fulfilled, (state, action) => {
        if (state.selectedRequest) {
          state.responses = [...state.responses, action.payload];
        }
      });
  },
});

export const { selectRequest, clearSelected } = shiftTradeSlice.actions;
export default shiftTradeSlice.reducer;
