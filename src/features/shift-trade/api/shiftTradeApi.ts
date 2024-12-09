import axios from "axios";
import {
  CreateTradeRequest,
  CreateTradeResponse,
  ShiftTradeRequest,
  ShiftTradeResponse,
} from "../types/shift-trade.type";

const API_URL = import.meta.env.BASE_URL;

export const shiftTradeApi = {
  // Get shift trade list
  getTradeRequests: async (
    token: string,
    params?: { status?: string; type?: string }
  ) => {
    const response = await axios.get<ShiftTradeRequest[]>(`${API_URL}/trades`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  },

  // Create Shift Trade
  createTradeRequest: async (token: string, data: CreateTradeRequest) => {
    const response = await axios.post<ShiftTradeRequest>(
      `${API_URL}/trades`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Response for the request
  respondToTrade: async (
    token: string,
    tradeId: number,
    data: CreateTradeResponse
  ) => {
    const response = await axios.post<ShiftTradeResponse>(
      `${API_URL}/trades/${tradeId}/responses`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Accept trade
  approveTradeResponse: async (
    token: string,
    tradeId: number,
    responseId: number
  ) => {
    const response = await axios.post(
      `${API_URL}/trades/${tradeId}/responses/${responseId}/approve`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};
