export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
}

export type ShiftType = "morning" | "afternoon" | "evening";
export type ScheduleStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface Announcement {
  id: number;
  title: string;
  date: string;
  isNew: boolean;
}

export interface EmployeeDashboardState {
  employee: Employee | null;
  todaySchedule: Schedule | null;
  weeklySchedule: Schedule[];
  announcements: Announcement[];
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

export interface DashboardResponse {
  employee: Employee;
  stats: DashboardStats;
  today_schedule: Schedule | null;
  weekly_schedule: Schedule[];
  announcement: Announcement[];
}

export interface EmployeeOverviewResponse {
  id: number;
  name: string;
  position: string;
  department: string;
  status: string;
  currentShift: string | null;
}

export interface EmployeeResponse {
  user: Employee;
  currentSchedule: Schedule | null;
}
interface DashboardStats {
  totalHours: number;
  completedShifts: number;
  upcomingShifts: number;
  leaveBalance: number;
}

interface DashboardEmployee {
  id: number;
  name: string;
  position: string | null;
  department: string | null;
}

interface Schedule {
  id: number;
  start_time: string;
  end_time: string;
  shift_type: string;
  status: string;
}

export interface DashboardData {
  employee: DashboardEmployee;
  stats: DashboardStats;
  todaySchedule: Schedule | null;
  weeklySchedule: Schedule[];
}
