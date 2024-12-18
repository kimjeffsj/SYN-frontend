export type ShiftType = "morning" | "afternoon" | "evening";
export type ScheduleStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface Schedule {
  id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  shift_type: ShiftType;
  status: ScheduleStatus;
  description?: string;
  is_repeating: boolean;
  repeat_pattern?: string;
  created_by: number;
  created_at: string;
  updated_at?: string;
}

export interface CreateScheduleDto {
  user_id: number;
  start_time: string;
  end_time: string;
  shift_type: ShiftType;
  description?: string;
  is_repeating?: boolean;
  repeat_pattern?: string;
}

export interface ScheduleState {
  schedules: Schedule[];
  selectedSchedule: Schedule | null;
  isLoading: boolean;
  error: string | null;
}
