import { format } from "date-fns";
import { ShiftType } from "../types/schedule.type";

export const getShiftTypeStyle = (type: ShiftType): string => {
  const styles = {
    morning: "bg-blue-100 text-blue-800",
    afternoon: "bg-purple-100 text-purple-800",
    evening: "bg-indigo-100 text-indigo-800",
  };
  return styles[type];
};

export const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (dateString: string) => {
  return format(new Date(dateString), "MMM d, yyyy");
};
