import { Menu } from "lucide-react";
import { Avatar } from "../Avatar";
import NotificationCenter from "@/features/notifications/components/\bNotificationCenter";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

interface HeaderProps {
  userRole: "admin" | "employee";
  onMenuClick: () => void;
}
export const Header: React.FC<HeaderProps> = ({ userRole, onMenuClick }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-primary ml-4">
            SYN - {userRole === "admin" ? "Admin" : "Employee"} Overview
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationCenter />

          <div className="flex items-center">
            <Avatar name={user?.full_name || "User"} size="sm" />
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.full_name}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
