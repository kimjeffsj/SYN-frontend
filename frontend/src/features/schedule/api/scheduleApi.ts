import axios from "axios";
import {
  CreateScheduleDto,
  Schedule,
  ScheduleStatus,
} from "../types/schedule.type";

const API_URL = import.meta.env.VITE_API_URL;

export const scheduleApi = {
  getMySchedules: async (token: string) => {
    const response = await axios.get<Schedule[]>(
      `${API_URL}/schedules/my-schedules`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getAllSchedules: async (token: string) => {
    const response = await axios.get<Schedule[]>(`${API_URL}/admin/schedules`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  adminCreateSchedule: async (
    token: string,
    scheduleData: CreateScheduleDto
  ) => {
    const response = await axios.post<Schedule>(
      `${API_URL}/admin/schedules`,
      scheduleData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getSchedule: async (token: string, scheduleId: number) => {
    const response = await axios.get<Schedule>(
      `${API_URL}/schedules/${scheduleId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  updateScheduleStatus: async (
    token: string,
    scheduleId: number,
    status: ScheduleStatus
  ) => {
    const response = await axios.patch<Schedule>(
      `${API_URL}/admin/schedules/${scheduleId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  deleteSchedule: async (token: string, scheduleId: number) => {
    await axios.delete(`${API_URL}/admin/schedules/${scheduleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  bulkCreateSchedules: async (
    token: string,
    schedules: CreateScheduleDto[]
  ) => {
    const response = await axios.post<Schedule[]>(
      `${API_URL}/admin/schedules/bulk`,
      { schedules },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};
