import axios from "axios";
import { CreateScheduleDto, Schedule } from "../types/schedule.type";

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

  createSchedule: async (token: string, scheduleData: CreateScheduleDto) => {
    const response = await axios.post<Schedule>(
      `${API_URL}/schedules`,
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
};
