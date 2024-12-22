export type LeaveType = "VACATION" | "ON_LEAVE";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface LeaveRequest {
  id: number;
  employee_id: number;
  employee: {
    id: number;
    name: string;
    position?: string;
    department?: string;
  };
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
  status: LeaveStatus;
  created_at: string;
  updated_at?: string;
  admin_response?: AdminResponse;
}

export interface AdminResponse {
  admin_id: number;
  admin_name: string;
  comment?: string;
  processed_at: string;
}

export interface CreateLeaveRequest {
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
}

export interface UpdateLeaveRequest {
  status: LeaveStatus;
  comment?: string;
}

export interface LeaveRequestState {
  requests: LeaveRequest[];
  selectedRequest: LeaveRequest | null;
  isLoading: boolean;
  error: string | null;
}

export interface LeaveRequestList {
  items: LeaveRequest[];
  total: number;
  pending: number;
}
