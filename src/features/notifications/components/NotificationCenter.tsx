import { useState, useEffect } from "react";
import { Bell, Check, X, Info, AlertTriangle } from "lucide-react";
import { Notification, NotificationType } from "../type/notification";

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: number) => void;
  onNotificationClick?: (notification: Notification) => void;
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onNotificationClick,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      setSelectedNotification(notification);
      if (!notification.isRead) {
        onMarkAsRead(notification.id);
      }
      onNotificationClick?.(notification);
    },
    [onMarkAsRead, onNotificationClick]
  );

  // 알림 타입에 따른 아이콘 반환
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "SCHEDULE_CHANGE":
        return <Info className="w-5 h-5 text-blue-500" />;
      case "SHIFT_TRADE":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "LEAVE_REQUEST":
        return <Bell className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* 알림 벨 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 알림 패널 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50">
          {/* 알림 헤더 */}
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">알림</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 알림 목록 */}
          <div className="max-h-[70vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                알림이 없습니다
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer
                    ${!notification.isRead ? "bg-blue-50" : ""}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(notification.id);
                        }}
                        className="flex-shrink-0 p-1 hover:bg-gray-100 rounded"
                      >
                        <Check className="w-4 h-4 text-gray-400" />
                      </button>
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
};
