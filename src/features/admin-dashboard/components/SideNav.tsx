import React from "react";
import {
  Menu,
  LayoutDashboard,
  Calendar,
  Users,
  Bell,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { logoutUser } from "@/features/auth/slice/authSlice";

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const navigate = useNavigate();

  const navigationItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin/dashboard",
      color: "text-primary",
    },
    {
      icon: Calendar,
      label: "Schedule Management",
      path: "/admin/schedules",
    },
    {
      icon: Users,
      label: "Employee Management",
      path: "/admin/employees",
    },
    {
      icon: Bell,
      label: "Notifications",
      path: "/admin/notifications",
    },
    {
      icon: FileText,
      label: "Announcements",
      path: "/admin/announcements",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Side Navigation Panel */}
      <div className="absolute top-0 right-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center p-3 rounded-lg text-gray-600 
                  hover:bg-gray-50 transition-colors ${item.color || ""}`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="absolute bottom-8 left-6 right-6 space-y-2">
            <button
              onClick={() => handleNavigation("/admin/settings")}
              className="w-full flex items-center p-3 rounded-lg text-gray-600 
                hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-5 h-5 mr-3" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => handleLogout()}
              className="w-full flex items-center p-3 rounded-lg text-red-600 
                hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
