import React, { useState, useEffect } from "react";
import { Bell, X, Calendar, Clock, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { format } from "date-fns";

import { StatusBadge } from "@/shared/components/StatusBadge";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  addNotification,
} from "../slice/notificationSlice";
import { NotificationItem, NotificationType } from "../type/notification";
import { WebSocketMessage, wsService } from "@/services/websocket";

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, unreadCount, isWebSocketConnected } = useSelector(
    (state: RootState) => state.notification
  );

  useEffect(() => {
    dispatch(fetchNotifications());

    if (!isWebSocketConnected) {
      dispatch({ type: "notification/connect" });
    }

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [dispatch, isWebSocketConnected]);

  useEffect(() => {
    const handleNewNotification = (message: WebSocketMessage<unknown>) => {
      if (message.type === "notification" && message.payload) {
        dispatch(addNotification(message.payload));
      }
    };

    if (isWebSocketConnected) {
      wsService.addMessageHandler(handleNewNotification);
    }

    return () => {
      if (isWebSocketConnected) {
        wsService.removeMessageHandler(handleNewNotification);
      }
    };
  }, [dispatch, isWebSocketConnected]);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SCHEDULE_CHANGE:
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case NotificationType.SHIFT_TRADE:
        return <Clock className="w-4 h-4 text-purple-500" />;
      case NotificationType.ANNOUNCEMENT:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.is_read) {
      await dispatch(markNotificationAsRead(notification.id));
    }

    switch (notification.type) {
      case NotificationType.SCHEDULE_CHANGE:
        if ("schedule_id" in notification.data) {
          window.location.href = `/schedule?date=${notification.data.schedule_id}`;
        }
        break;
      case NotificationType.SHIFT_TRADE:
        if ("trade_id" in notification.data) {
          window.location.href = `/trades/${notification.data.trade_id}`;
        }
        break;
      case NotificationType.ANNOUNCEMENT:
        window.location.href = "/announcements";
        break;
    }
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllNotificationsAsRead());
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
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">Notifications</h3>
              {isWebSocketConnected && (
                <span className="flex items-center text-xs text-green-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                  Connected
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-primary hover:text-primary/80"
                >
                  Mark all as read
                </button>
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
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    !notification.is_read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start">
                    {getNotificationIcon(notification.type)}
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {format(
                            new Date(notification.created_at),
                            "MMM d, yyyy HH:mm"
                          )}
                        </span>
                        {notification.priority === "HIGH" && (
                          <StatusBadge status="high" size="sm" />
                        )}
                      </div>
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
