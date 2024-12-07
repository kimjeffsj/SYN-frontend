import { Menu } from "lucide-react";
import { Avatar } from "../Avatar";
import { NotificationButton } from "../Notification/NotificationButton";
import { useState } from "react";
import type { Notification } from "../Notification/type/notification";

interface HeaderProps {
  userRole: "admin" | "employee";
  onMenuClick: () => void;
  userName?: string;
}

// TODO: need to add redux
// Temp Data
const tempNotifications: Notification[] = [
  {
    id: 1,
    type: "SHIFT_TRADE",
    title: "New shift trade request",
    message: "John requested to trade shifts with you",
    time: "5 mins ago",
    isRead: false,
    brief: {
      oldShift: {
        date: "2024-12-15",
        time: "09:00-17:00",
      },
      newShift: {
        date: "2024-12-16",
        time: "13:00-21:00",
      },
      status: "pending",
    },
  },
];

export function Header({
  userRole,
  onMenuClick,
  userName = "User Name",
}: HeaderProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(tempNotifications);

  const handleMarkAsRead = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

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
          <NotificationButton
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onNotificationClick={(notification) => {
              console.log("Notification clicked:", notification);
            }}
          />
          <div className="flex items-center">
            <Avatar name={userName} size="sm" />
            <div className="ml-3">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
