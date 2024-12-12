import { getStatusStyle, StatusColor } from "../utils/status.utils";

interface StatusBadgeProps {
  status: StatusColor;
  className?: string;
  size?: "sm" | "md" | "lg";
}
export function StatusBadge({
  status,
  className = "",
  size = "md",
}: StatusBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={`
        font-medium rounded-full inline-flex items-center justify-center
        ${getStatusStyle(status)}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  );
}
