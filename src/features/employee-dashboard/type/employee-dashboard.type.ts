export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
}

export type ShiftType = "morning" | "afternoon" | "evening" | "full_day";
export type ScheduleStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface Schedule {
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

export interface DashboardStats {
  totalHours: number;
  completedShifts: number;
  upcomingShifts: number;
  leaveBalance: number;
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
