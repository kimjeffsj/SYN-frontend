export type NotificationType =
  | "SHIFT_TRADE"
  | "SCHEDULE_CHANGE"
  | "LEAVE_REQUEST";

export interface ShiftDetail {
  date: string;
  time: string;
}

export interface ShiftTradeBrief {
  oldShift: ShiftDetail;
  newShift: ShiftDetail;
  status: "approved" | "pending" | "rejected";
}

export interface ScheduleChangeBrief {
  affected_dates: string[];
  changes: {
    date: string;
    old: string;
    new: string;
  }[];
}

export interface LeaveRequestBrief {
  dates: string[];
  type: string;
  approvedBy?: string;
  status: "approved" | "pending" | "rejected";
}

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  brief: ShiftTradeBrief | ScheduleChangeBrief | LeaveRequestBrief;
}
