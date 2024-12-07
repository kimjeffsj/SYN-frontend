import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { logoutUser } from "@/features/auth/slice/authSlice";

interface SidebarProps {
  userRole: "admin" | "employee";
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ userRole, isOpen, onClose }: SidebarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const adminNavItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/admin/dashboard" },
    { icon: Calendar, label: "Schedule Management", path: "/admin/schedules" },
    { icon: Users, label: "Employees Management", path: "/admin/employees" },
    { icon: FileText, label: "Announcements", path: "/admin/announcements" },
  ];

  const employeeNavItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
    { icon: Calendar, label: "My schedule", path: "/schedule" },
    { icon: FileText, label: "Announcements", path: "/announcements" },
  ];

  const navItems = userRole === "admin" ? adminNavItems : employeeNavItems;

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r z-40
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 py-6">
            <nav className="px-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  className="flex items-center w-full px-4 py-3 text-gray-600 
                    rounded-lg hover:bg-gray-50 hover:text-primary"
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="p-4 border-t">
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center w-full px-4 py-3 text-gray-600 
                rounded-lg hover:bg-gray-50"
            >
              <Settings className="w-5 h-5 mr-3" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-600 
                rounded-lg hover:bg-red-50 mt-1"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
