import { format } from "date-fns";
import { CreateLeaveRequest, LeaveRequest } from "../types/leave.type";

export const validateLeaveRequest = (
  data: CreateLeaveRequest
): string | null => {
  if (!data.start_date || !data.end_date) {
    return "Please select both start and end dates";
  }

  if (!data.reason.trim()) {
    return "Please provide a reason for the leave";
  }

  const start = new Date(data.start_date);
  const end = new Date(data.end_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    return "Start date cannot be in the past";
  }

  if (end < start) {
    return "End date must be after start date";
  }

  return null;
};

export const formatDates = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start.toDateString() === end.toDateString()) {
    return format(start, "MMM d, yyyy");
  }
  return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
};

interface FilterParams {
  status: string;
  type: string;
  search: string;
}

export const filterLeaveRequests = (
  requests: LeaveRequest[],
  filters: FilterParams
) => {
  return requests.filter((request) => {
    // Status filter
    if (
      filters.status !== "all" &&
      request.status.toLowerCase() !== filters.status.toLowerCase()
    ) {
      return false;
    }

    // Type filter
    if (
      filters.type !== "all" &&
      request.leave_type.toLowerCase() !== filters.type.toLowerCase()
    ) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        request.reason?.toLowerCase().includes(searchLower) ||
        request.leave_type.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });
};
