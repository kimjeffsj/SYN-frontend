import { useState } from "react";
import {
  LeaveRequestBrief,
  Notification,
  ScheduleChangeBrief,
  ShiftTradeBrief,
} from "../type/notification";
import {
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";

interface NotificationButtonProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: number) => void;
  onNotificationClick?: (notification: Notification) => void;
  className?: string;
}

export function NotificationButton({
  notifications,
  onMarkAsRead,
  onNotificationClick,
  className = "",
}: NotificationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    onNotificationClick?.(notification);
  };
  const getBriefContent = (notification: Notification) => {
    switch (notification.type) {
      case "SHIFT_TRADE": {
        const brief = notification.brief as ShiftTradeBrief;
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Original Shift</span>
              <span className="text-sm text-gray-500">
                {brief.oldShift.date}
              </span>
            </div>
            <div className="bg-gray-50 p-2 rounded flex items-center">
              <Clock className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm">{brief.oldShift.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">New Shift</span>
              <span className="text-sm text-gray-500">
                {brief.newShift.date}
              </span>
            </div>
            <div className="bg-gray-50 p-2 rounded flex items-center">
              <Clock className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm">{brief.newShift.time}</span>
            </div>
            <div className="mt-2 flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm text-green-600">{brief.status}</span>
            </div>
          </div>
        );
      }

      case "SCHEDULE_CHANGE": {
        const brief = notification.brief as ScheduleChangeBrief;
        return (
          <div className="space-y-3">
            {brief.changes.map((change, index) => (
              <div key={index} className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{change.date}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-500 line-through">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">{change.old}</span>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">{change.new}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      }

      case "LEAVE_REQUEST": {
        const brief = notification.brief as LeaveRequestBrief;
        return (
          <div className="space-y-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Leave Details</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    brief.status === "approved"
                      ? "bg-green-100 text-green-600"
                      : brief.status === "rejected"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {brief.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  {brief.dates.join(" - ")}
                </div>
                <div className="text-sm text-gray-600">Type: {brief.type}</div>
                {brief.approvedBy && (
                  <div className="text-sm text-gray-600">
                    Approved by: {brief.approvedBy}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border z-50">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
            <button
              onClick={() => {
                setIsOpen(false);
                setSelectedNotification(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {selectedNotification ? (
              <div className="p-4">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="flex items-center text-sm text-blue-600 mb-4"
                >
                  <ArrowRight className="w-4 h-4 mr-1 transform rotate-180" />
                  Back to notifications
                </button>
                <div className="mb-4">
                  <h4 className="font-medium">{selectedNotification.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedNotification.time}
                  </p>
                </div>
                {getBriefContent(selectedNotification)}
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer
                      ${
                        !notification.isRead
                          ? "bg-blue-50 hover:bg-blue-50/80"
                          : ""
                      }`}
                >
                  <div className="flex items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">
                        {notification.title}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {notification.message}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
