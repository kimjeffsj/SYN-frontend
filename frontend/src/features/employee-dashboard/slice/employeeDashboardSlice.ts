import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Announcement,
  Employee,
  EmployeeDashboardState,
  ScheduleItem,
} from "../type/employee-dashboard.type";

const initialState: EmployeeDashboardState = {
  employee: {
    id: 1,
    name: "Employee Name",
    position: "매니저",
    department: "양진 네일샵",
  },
  todaySchedule: {
    id: 1,
    date: new Date().toISOString(),
    shift_type: "morning",
    start_time: "09:00",
    end_time: "17:00",
    status: "confirmed",
  },
  weeklySchedule: [
    {
      id: 1,
      date: new Date().toISOString(),
      shift_type: "morning",
      start_time: "09:00",
      end_time: "17:00",
      status: "confirmed",
    },
  ],
  announcements: [
    {
      id: 1,
      title: "11월 근무 일정 안내",
      date: "2024-11-15",
      isNew: true,
    },
  ],
  isLoading: false,
  error: null,
};

const employeeDashboardSlice = createSlice({
  name: "employeeDashboard",
  initialState,
  reducers: {
    setEmployeeInfo: (state, action: PayloadAction<Employee>) => {
      state.employee = action.payload;
    },
    setTodaySchedule: (state, action: PayloadAction<ScheduleItem>) => {
      state.todaySchedule = action.payload;
    },
    setWeeklySchedule: (state, action: PayloadAction<ScheduleItem[]>) => {
      state.weeklySchedule = action.payload;
    },
    setAnnouncements: (state, action: PayloadAction<Announcement[]>) => {
      state.announcements = action.payload;
    },
    markAnnouncementAsRead: (state, action: PayloadAction<number>) => {
      const announcement = state.announcements.find(
        (a) => a.id === action.payload
      );
      if (announcement) {
        announcement.isNew = false;
      }
    },
  },
});

export const {
  setEmployeeInfo,
  setTodaySchedule,
  setWeeklySchedule,
  setAnnouncements,
  markAnnouncementAsRead,
} = employeeDashboardSlice.actions;

export default employeeDashboardSlice.reducer;
