interface StatusBadgeProps {
  status: "active" | "pending" | "completed" | "cancelled" | "onLeave";
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-600";
      case "pending":
        return "bg-yellow-50 text-yellow-600";
      case "completed":
        return "bg-blue-50 text-blue-600";
      case "cancelled":
        return "bg-red-50 text-red-600";
      case "onLeave":
        return "bg-gray-50 text-gray-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusStyle(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
}
