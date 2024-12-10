import axios from "axios";
import {
  CreateTradeRequest,
  CreateTradeResponse,
  ShiftTradeRequest,
  ShiftTradeResponse,
} from "../types/shift-trade.type";

const API_URL = import.meta.env.VITE_API_URL;

export const shiftTradeApi = {
  // Get trade requests
  getTradeRequests: async (
    token: string,
    params?: {
      status?: string;
      type?: string;
      search?: string;
    }
  ) => {
    const response = await axios.get<ShiftTradeRequest[]>(`${API_URL}/trades`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  },

  // Get a trade request
  getTradeRequest: async (token: string, id: number) => {
    const response = await axios.get<ShiftTradeRequest>(
      `${API_URL}/trades/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Create a new trade request
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

  // Response to trade request
  createTradeResponse: async (
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

  // Response Accepted | rejected
  updateResponseStatus: async (
    token: string,
    tradeId: number,
    responseId: number,
    status: "ACCEPTED" | "REJECTED"
  ) => {
    const response = await axios.patch<ShiftTradeResponse>(
      `${API_URL}/trades/${tradeId}/responses/${responseId}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Cancel Trade request
  cancelTradeRequest: async (token: string, tradeId: number) => {
    await axios.patch(
      `${API_URL}/trades/${tradeId}/cancel`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  setupInterceptors: () => {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          window.location.href = "/";
        }
        return Promise.reject(error);
      }
    );
  },
};
