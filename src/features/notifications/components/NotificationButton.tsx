import { useState } from "react";
import { useDispatch } from "react-redux";
import { NotificationItem } from "../type/notification";
import { markNotificationAsRead } from "../slice/notificationSlice";
import { ArrowRight, Bell, Calendar, Clock, X } from "lucide-react";

interface NotificationButtonProps {
  notifications: NotificationItem[];
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
    useState<NotificationItem | null>(null);
  const dispatch = useDispatch();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleNotificationClick = async (notification: NotificationItem) => {
    setSelectedNotification(notification);
    if (!notification.is_read) {
      await dispatch(markNotificationAsRead(notification.id));
      onMarkAsRead(notification.id);
    }
    onNotificationClick?.(notification);
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
                    {selectedNotification.message}
                  </p>
                </div>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer
                    ${
                      !notification.is_read
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
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        {notification.type === "SCHEDULE_CHANGE" && (
                          <Calendar className="w-3 h-3 mr-1" />
                        )}
                        {notification.type === "SHIFT_TRADE" && (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {new Date(notification.created_at).toLocaleString()}
                      </div>
                    </div>
                    {!notification.is_read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
