export type StatusColor =
  | "pending"
  | "approved"
  | "confirmed"
  | "rejected"
  | "cancelled"
  | "completed"
  | "open"
  | "active"
  | "onLeave"
  | "vacation"
  | "trade"
  | "giveaway"
  | "high"
  | "normal";

export const getStatusStyle = (status: StatusColor): string => {
  const styles: Record<StatusColor, string> = {
    // Base states
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    confirmed: "bg-green-100 text-green-700 border-green-200",
    approved: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    cancelled: "bg-gray-100 text-gray-700 border-gray-200",
    completed: "bg-blue-100 text-blue-700 border-blue-200",
    open: "bg-indigo-100 text-indigo-700 border-indigo-200",

    active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    onLeave: "bg-gray-100 text-gray-700 border-gray-200",
    vacation: "bg-sky-100 text-sky-700 border-sky-200",

    trade: "bg-violet-100 text-violet-700 border-violet-200",
    giveaway: "bg-orange-100 text-orange-700 border-orange-200",

    high: "bg-red-100 text-red-700 border-red-200",
    normal: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  return styles[status.toLowerCase() as StatusColor] || styles.pending;
};

export const getStatusBgStyle = (status: StatusColor): string => {
  const styles: Record<StatusColor, string> = {
    pending: "border-yellow-200",
    confirmed: "border-green-200",
    approved: "border-green-200",
    rejected: "border-red-200",
    cancelled: "border-red-200",
    completed: "border-blue-200",
    open: "border-indigo-200",
    active: "border-emerald-200",
    onLeave: "border-gray-200",
    trade: "border-violet-200",
    giveaway: "border-orange-200",
    vacation: "border-sky-200",

    high: "border-red-200",
    normal: "border-emerald-200",
  };

  return styles[status.toLowerCase() as StatusColor] || styles.pending;
};
