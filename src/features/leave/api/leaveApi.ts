import axiosInstance from "@/services/axios-config";
import {
  CreateLeaveRequest,
  LeaveRequest,
  LeaveRequestList,
  UpdateLeaveRequest,
} from "../types/leave.type";

const API_URL = import.meta.env.VITE_API_URL;

export const leaveApi = {
  // Getall leave requests
  getLeaveRequests: async (token: string, status?: string) => {
    const response = await axiosInstance.get<LeaveRequestList>(
      `${API_URL}/leave`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { status },
      }
    );
    return response.data;
  },

  // Get user leave requests
  getMyLeaveRequests: async (token: string) => {
    const response = await axiosInstance.get<LeaveRequest[]>(
      `${API_URL}/leave/my-requests`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Get a single leave request
  getLeaveRequest: async (token: string, id: number) => {
    const response = await axiosInstance.get<LeaveRequest>(
      `${API_URL}/leave/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Create leave request
  createLeaveRequest: async (token: string, data: CreateLeaveRequest) => {
    const request = await axiosInstance.post<LeaveRequest>(
      `${API_URL}/leave`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return request.data;
  },

  // Process leave request
  processLeaveRequest: async (
    token: string,
    id: number,
    data: UpdateLeaveRequest
  ) => {
    const response = await axiosInstance.patch<LeaveRequest>(
      `${API_URL}/leave/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Cancel leave request
  cancelLeaveRequest: async (token: string, id: number) => {
    const response = await axiosInstance.delete(`${API_URL}/leave/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
