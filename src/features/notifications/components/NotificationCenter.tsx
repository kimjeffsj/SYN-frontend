import { useState, useEffect } from "react";
import { Bell, X, Calendar, Clock, AlertCircle } from "lucide-react";
import { Notification } from "../type/notification";

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token || !userString) return;

    const user = JSON.parse(userString);

    const wsUrl = `${import.meta.env.VITE_WS_URL}/ws/notifications/${
      user.id
    }?token=${token}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "notification") {
          setNotifications((prev) => [data.payload, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setWsConnected(false);
    };

    ws.onclose = () => {
      setWsConnected(false);
    };

    // Cleanup on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `${import.meta.env.VITE_API_URL}/notifications/${notificationId}/read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "SCHEDULE_CHANGE":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case "SHIFT_TRADE":
        return <Clock className="w-5 h-5 text-purple-500" />;
      case "ANNOUNCEMENT":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="relative">
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
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center space-x-2">
              {wsConnected && (
                <span className="flex items-center text-xs text-green-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                  Connected
                </span>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                  onClick={() =>
                    !notification.isRead && handleMarkAsRead(notification.id)
                  }
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div>
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

export default NotificationCenter;
