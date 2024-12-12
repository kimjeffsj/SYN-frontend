export type StatusColor =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "open"
  | "active"
  | "onLeave";

export const getStatusStyle = (status: StatusColor): string => {
  const styles: Record<StatusColor, string> = {
    // Base states
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    completed: "bg-blue-100 text-blue-800 border-blue-200",

    open: "bg-purple-100 text-purple-800 border-purple-200",
    active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    onLeave: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return styles[status.toLowerCase() as StatusColor] || styles.pending;
};

export const getStatusDotStyle = (status: StatusColor): string => {
  const styles: Record<StatusColor, string> = {
    pending: "bg-yellow-500",
    confirmed: "bg-green-500",
    cancelled: "bg-red-500",
    completed: "bg-blue-500",
    open: "bg-purple-500",
    active: "bg-emerald-500",
    onLeave: "bg-gray-500",
  };

  return styles[status.toLowerCase() as StatusColor] || styles.pending;
};

export const getStatusBgStyle = (status: StatusColor): string => {
  const styles: Record<StatusColor, string> = {
    pending: "bg-yellow-50",
    confirmed: "bg-green-50",
    cancelled: "bg-red-50",
    completed: "bg-blue-50",
    open: "bg-purple-50",
    active: "bg-emerald-50",
    onLeave: "bg-gray-50",
  };

  return styles[status.toLowerCase() as StatusColor] || styles.pending;
};
