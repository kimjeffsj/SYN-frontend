import { Schedule } from "../types/shift-trade.type";

export const isFutureOrToday = (date: Date | string): boolean => {
  const compareDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return compareDate >= today;
};

export const filterFutureSchedules = (schedules: Schedule[]): Schedule[] => {
  return schedules.filter((schedule) => isFutureOrToday(schedule.start_time));
};
