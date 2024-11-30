import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  User,
  Calendar,
  Repeat,
  Plane,
  Users,
  LogOut,
} from "lucide-react";

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const navigationItems = [
    { icon: User, label: "내 정보", path: "/profile" },
    { icon: Calendar, label: "내 스케줄", path: "/schedule" },
    { icon: Repeat, label: "Shift Trade", path: "/shift-trade" },
    { icon: Plane, label: "휴가 신청", path: "/vacation" },
    { icon: Users, label: "Contacts", path: "/contacts" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-primary">Menu</h2>
          <button onClick={onClose}>
            <Menu className="w-6 h-6 text-secondary" />
          </button>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className="w-full flex items-center p-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}

          <hr className="my-4" />

          <button
            onClick={() => navigate("/logout")}
            className="w-full flex items-center p-3 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="w-5 h-5 mr-3" />
            로그아웃
          </button>
        </nav>
      </div>
    </div>
  );
};
