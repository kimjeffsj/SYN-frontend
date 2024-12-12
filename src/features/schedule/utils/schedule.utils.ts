import { ShiftType } from "../types/schedule.type";

export const getShiftTypeStyle = (type: ShiftType): string => {
  const styles = {
    morning: "bg-blue-100 text-blue-800",
    afternoon: "bg-purple-100 text-purple-800",
    evening: "bg-indigo-100 text-indigo-800",
    full_day: "bg-green-100 text-green-800",
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
  return new Date(dateString).toLocaleDateString();
};
