import axiosInstance from "@/services/axios-config";
import {
  CreateLeaveRequest,
  LeaveRequest,
  LeaveRequestList,
  LeaveRequestUpdate,
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
    data: LeaveRequestUpdate
  ) => {
    try {
      const originalRequest = await leaveApi.getLeaveRequest(token, id);

      const formattedData: LeaveRequestUpdate = {
        leave_type: originalRequest.leave_type,
        start_date: originalRequest.start_date,
        end_date: originalRequest.end_date,
        reason: originalRequest.reason,
        status: data.status,
        comment: data.comment || undefined,
      };

      const response = await axiosInstance.patch<LeaveRequest>(
        `${API_URL}/leave/${id}`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in processLeaveRequest:", error);
      throw error;
    }
  },

  // Cancel leave request
  cancelLeaveRequest: async (token: string, id: number) => {
    const response = await axiosInstance.delete(`${API_URL}/leave/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
