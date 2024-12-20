import { Schedule } from "@/features/schedule/types/schedule.type";
import { ShiftTradeRequest } from "@/features/shift-trade/types/shift-trade.type";

export interface Employee {
  id: number;
  email: string;
  full_name: string;
  department: string | null;
  position: string | null;
  is_active: boolean;
  comment: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface EmployeeDetail extends Employee {
  is_on_leave: boolean;
  leave_balance: number;
  last_active_at: string | null;
  schedules?: Schedule[];
  trade_requests?: ShiftTradeRequest[];
}

export interface CreateEmployeeDto {
  email: string;
  full_name: string;
  password: string;
  department?: string | null; // null 허용
  position?: string | null; // null 허용
  comment?: string | null; // null 허용
}

export interface UpdateEmployeeDto {
  email?: string;
  full_name?: string;
  department?: string | null;
  position?: string | null;
  is_active?: boolean;
  comment?: string | null;
}

export interface EmployeeFormData extends Partial<CreateEmployeeDto> {
  full_name: string; // required field
}

export interface EmployeeState {
  employees: Employee[];
  selectedEmployee: EmployeeDetail | null;
  isLoading: boolean;
  error: string | null;
}

// For history
export interface HistoryTabProps {
  schedules: Schedule[];
  tradeRequests: ShiftTradeRequest[];
}

export interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}
