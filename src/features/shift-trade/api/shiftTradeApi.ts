import {
  CreateTradeRequest,
  CreateTradeResponse,
  ShiftTradeRequest,
  ShiftTradeResponse,
} from "../types/shift-trade.type";
import axiosInstance from "@/services/axios-config";

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
    try {
      const response = await axiosInstance.get<ShiftTradeRequest[]>(
        `${API_URL}/trades`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params,
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  // Get a trade request
  getTradeRequest: async (token: string, id: number) => {
    const response = await axiosInstance.get<ShiftTradeRequest>(
      `${API_URL}/trades/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Create a new trade request
  createTradeRequest: async (token: string, data: CreateTradeRequest) => {
    const response = await axiosInstance.post<ShiftTradeRequest>(
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
  ): Promise<ShiftTradeResponse> => {
    const response = await axiosInstance.post<ShiftTradeResponse>(
      `${API_URL}/trades/${tradeId}/responses`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  // Response Accepted | rejected
  updateResponseStatus: async (
    token: string,
    tradeId: number,
    responseId: number,
    status: "ACCEPTED" | "REJECTED" | "PENDING"
  ) => {
    const response = await axiosInstance.patch<ShiftTradeResponse>(
      `${API_URL}/trades/${tradeId}/responses/${responseId}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  },

  // Giveaway Accept
  acceptGiveaway: async (token: string, tradeId: number) => {
    const response = await axiosInstance.post<ShiftTradeResponse>(
      `${API_URL}/trades/${tradeId}/accept-giveaway`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // cancel Trade request
  cancelTradeRequest: async (token: string, tradeId: number) => {
    await axiosInstance.delete(
      `${API_URL}/trades/${tradeId}/cancel`,

      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // checkAvailability
  checkAvailability: async (token: string, tradeId: number) => {
    const response = await axiosInstance.get<{ is_available: boolean }>(
      `${API_URL}/trades/${tradeId}/check-availability`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  setupInterceptors: () => {
    axiosInstance.interceptors.response.use(
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
