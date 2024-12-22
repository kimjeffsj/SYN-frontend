import React, { useState, useEffect, useRef } from "react";
import { Bell, X, Calendar, Clock, Megaphone } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@/app/store";
import { format } from "date-fns";

import { StatusBadge } from "@/shared/components/StatusBadge";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../slice/notificationSlice";
import { NotificationItem, NotificationType } from "../type/notification";
import { StatusColor } from "@/shared/utils/status.utils";

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { notifications, unreadCount } = useSelector(
    (state: RootState) => state.notification
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.is_read) {
      await dispatch(markNotificationAsRead(notification.id));
    }

    setIsOpen(false);

    setTimeout(() => {
      switch (notification.type) {
        case NotificationType.ANNOUNCEMENT:
          if (notification.data && "announcement_id" in notification.data) {
            navigate("/announcements", {
              state: {
                openModal: true,
                id: notification.data.announcement_id,
                from: "notification",
              },
            });
          }
          break;

        case NotificationType.SHIFT_TRADE:
          navigate("/trades");
          break;

        case NotificationType.SCHEDULE_CHANGE:
          navigate("/schedule");
          break;

        case NotificationType.LEAVE_REQUEST:
          navigate("/leave");
          break;
      }
    }, 100);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SCHEDULE_CHANGE:
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case NotificationType.SHIFT_TRADE:
        return <Clock className="w-4 h-4 text-purple-500" />;
      case NotificationType.ANNOUNCEMENT:
        return <Megaphone className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationPreview = (notification: NotificationItem) => {
    if (!notification.data) {
      return notification.message;
    }
    switch (notification.type) {
      case NotificationType.ANNOUNCEMENT:
        if ("preview" in notification.data) {
          return notification.data.preview;
        }
        break;

      case NotificationType.SHIFT_TRADE:
        if (notification.data && "original_shift" in notification.data) {
          const { date, time } = notification.data.original_shift;
          return `Shift Trade Request for ${date} ${time}`;
        }
        break;

      case NotificationType.SCHEDULE_CHANGE:
        if ("date" in notification.data) {
          return `Schedule updated for ${notification.data.date}`;
        }
        break;
    }
    return notification.message;
  };

  return (
    <div className="relative" ref={notificationRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="fixed sm:absolute left-0 sm:left-auto right-0 top-[60px] sm:top-auto sm:mt-2 w-full sm:w-96 bg-white rounded-none sm:rounded-lg shadow-xl border z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-900 text-base">
              Notifications
            </h3>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={() => dispatch(markAllNotificationsAsRead())}
                  className="text-xs text-primary hover:text-primary/80 font-medium"
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[calc(100vh-120px)] sm:max-h-[600px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`px-4 py-3 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.is_read ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {getNotificationPreview(notification)}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {format(new Date(notification.created_at), "PPp")}
                        </span>
                        <StatusBadge
                          status={
                            notification.priority.toLowerCase() as StatusColor
                          }
                          size="sm"
                        />
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
