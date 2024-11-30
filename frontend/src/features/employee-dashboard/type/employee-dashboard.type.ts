export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
}

export type ShiftType = "morning" | "afternoon" | "evening" | "full_day";
export type ScheduleStatus = "pending" | "confirmed" | "cancelled";

export interface ScheduleItem {
  id: number;
  date: string;
  shift_type: ShiftType;
  start_time: string;
  end_time: string;
  status: ScheduleStatus;
}

export interface Announcement {
  id: number;
  title: string;
  date: string;
  isNew: boolean;
}

export interface EmployeeDashboardState {
  employee: Employee | null;
  todaySchedule: ScheduleItem | null;
  weeklySchedule: ScheduleItem[];
  announcements: Announcement[];
  isLoading: boolean;
  error: string | null;
}
