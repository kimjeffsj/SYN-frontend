import { Menu } from "lucide-react";
import { Avatar } from "../Avatar";
import NotificationCenter from "@/features/notifications/components/\bNotificationCenter";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  userRole: "admin" | "employee";
  onMenuClick: () => void;
}
export const Header: React.FC<HeaderProps> = ({ userRole, onMenuClick }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
          <h1
            className="text-lg sm:text-xl font-semibold text-primary ml-3 sm:ml-4 cursor-pointer hidden sm:block"
            onClick={() => navigate("/dashboard")}
          >
            SYN - {userRole === "admin" ? "Admin" : "Employee"}
          </h1>
          <h1
            className="text-lg font-semibold text-primary ml-3 cursor-pointer sm:hidden"
            onClick={() => navigate("/dashboard")}
          >
            SYN
          </h1>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <NotificationCenter />

          <div className="flex items-center">
            <Avatar name={user?.full_name || "User"} size="sm" />
            <div className="ml-2 sm:ml-3 hidden sm:block">
              <p className="text-sm font-medium">{user?.full_name}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
