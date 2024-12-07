export interface DashboardStats {
  employees: {
    total: number;
    active: number;
    onLeave: number;
    pendingApproval: number;
  };
  schedules: {
    today: number;
    pending: number;
    conflicts: number;
  };
}

export interface RecentUpdate {
  id: number;
  type: "TIME_OFF" | "SHIFT_TRADE" | "SCHEDULE_CHANGE";
  title: string;
  description: string;
  timestamp: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  status: "active" | "onLeave" | "offline";
  currentShift?: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  isNew: boolean;
  priority: "normal" | "high";
}

export interface AdminDashboardState {
  stats: DashboardStats | null;
  recentUpdates: RecentUpdate[];
  employees: Employee[];
  announcements: Announcement[];
  isLoading: boolean;
  error: string | null;
}

export interface DashboardStatsProps {
  stats: {
    totalEmployees: number;
    activeEmployees: number;
    todayShifts: number;
    pendingRequests: number;
    conflicts: number;
  };
}

export interface EmployeeOverviewProps {
  employees: Employee[];
  onEmployeeClick: (employeeId: number) => void;
}

export interface PendingRequestsProps {
  requests: RecentUpdate[];
  onApprove: (requestId: number) => void;
  onReject: (requestId: number) => void;
}

export interface RecentAnnouncementsProps {
  announcements: Announcement[];
  onViewAll: () => void;
  onAnnouncementClick: (id: number) => void;
}
