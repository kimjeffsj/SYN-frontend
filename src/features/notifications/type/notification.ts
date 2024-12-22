export enum NotificationType {
  SCHEDULE_CHANGE = "SCHEDULE_CHANGE",
  SHIFT_TRADE = "SHIFT_TRADE",
  ANNOUNCEMENT = "ANNOUNCEMENT",
  LEAVE_REQUEST = "LEAVE_REQUEST",
  SYSTEM = "SYSTEM",
}

export enum NotificationPriority {
  HIGH = "HIGH",
  NORMAL = "NORMAL",
  LOW = "LOW",
}

export interface BaseNotification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  // TODO: any type fix
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

// Schedule change notification interface
export interface ScheduleChangeNotification extends BaseNotification {
  type: NotificationType.SCHEDULE_CHANGE;
  data: {
    schedule_id: number;
    date: string;
    old_time?: string;
    new_time: string;
    changed_by: {
      id: number;
      name: string;
    };
  };
}

// Shift trade notification interface
export interface ShiftTradeNotification extends BaseNotification {
  type: NotificationType.SHIFT_TRADE;
  data: {
    trade_id: number;
    requester: {
      id: number;
      name: string;
    };
    original_shift: {
      date: string;
      time: string;
    };
    target_shift?: {
      date: string;
      time: string;
    };
  };
}

// Announcement notification interface
export interface AnnouncementNotification extends BaseNotification {
  type: NotificationType.ANNOUNCEMENT;
  data: {
    announcement_id: number;
    title: string;
    author: {
      id: number;
      name: string;
    };
    preview: string;
  };
}

export interface AnnouncementNotificationData {
  announcement_id: number;
  title: string;
  author: {
    id: number;
    name: string;
  };
  preview: string;
}

export interface TradeNotificationData {
  trade_id: number;
  requester: {
    id: number;
    name: string;
  };
  original_shift: {
    date: string;
    time: string;
  };
  target_shift?: {
    date: string;
    time: string;
  };
}

export interface ScheduleNotificationData {
  schedule_id?: number;
  schedule?: {
    id: number;
    start_time: string;
    end_time: string;
    status: string;
  };
  date?: string;
  time?: string;
  changed_by?: {
    id: number;
    name: string;
  };
}

export interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  data:
    | AnnouncementNotificationData
    | TradeNotificationData
    | ScheduleNotificationData;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}
export interface NotificationPayload {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  data: ScheduleChangeData | ShiftTradeData;
  is_read: boolean;
  created_at: string;
}

export interface ScheduleChangeData {
  schedule_id: number;
  original: {
    start_time: string;
    end_time: string;
  };
  updated: {
    start_time: string;
    end_time: string;
  };
  changed_by?: {
    id: number;
    name: string;
  };
}

export interface ShiftTradeData {
  trade_id: number;
  date: string;
  time: string;
}
