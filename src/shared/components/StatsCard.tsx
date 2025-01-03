import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label?: string;
    isPositive?: boolean;
  };
  iconClassName?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  iconClassName,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-card p-4 sm:p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-xs sm:text-sm">{title}</p>
          <h3 className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">
            {value}
          </h3>
          {trend && (
            <div className="flex items-center mt-1 sm:mt-2 text-xs sm:text-sm">
              <span
                className={`${
                  trend.isPositive ? "text-success-500" : "text-error-500"
                } font-medium`}
              >
                {trend.value}%
              </span>
              <span className="text-gray-500 ml-1">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-lg ${iconClassName}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
}
