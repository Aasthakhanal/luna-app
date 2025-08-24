import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  X,
  Calendar,
  AlertTriangle,
  Flower,
  Check,
  CheckCheck,
} from "lucide-react";
import {
  useGetUserNotificationsQuery,
  useMarkAsReadMutation,
} from "../../app/notificationsApi";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
  } = useGetUserNotificationsQuery({
    page: 1,
    limit: 20,
  });

  const [markAsRead] = useMarkAsReadMutation();

  const notifications = notificationsData?.data || [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNotificationIcon = (title) => {
    if (title.includes("Period") || title.includes("🩸")) {
      return <Calendar className="h-4 w-4 text-red-500" />;
    } else if (title.includes("Irregularity") || title.includes("⚠️")) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    } else if (title.includes("Ovulation") || title.includes("🌸")) {
      return <Flower className="h-4 w-4 text-pink-500" />;
    }
    return <Bell className="h-4 w-4 text-blue-500" />;
  };

  const getNotificationBg = (title) => {
    if (title.includes("Period") || title.includes("🩸")) {
      return "bg-red-50 border-red-100";
    } else if (title.includes("Irregularity") || title.includes("⚠️")) {
      return "bg-yellow-50 border-yellow-100";
    } else if (title.includes("Ovulation") || title.includes("🌸")) {
      return "bg-pink-50 border-pink-100";
    }
    return "bg-blue-50 border-blue-100";
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      refetch(); // Refresh notifications when opening
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 hover:bg-accent rounded-full transition-colors"
      >
        <Bell className="h-5 w-5 text-neutral" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">
                  Loading notifications...
                </p>
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-red-600">
                  Failed to load notifications
                </p>
                <button
                  onClick={refetch}
                  className="text-xs text-primary hover:underline mt-1"
                >
                  Try again
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  We'll notify you about your cycle updates
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${getNotificationBg(
                    notification.title
                  )} ${
                    !notification.read ? "border-l-4 border-l-primary" : ""
                  }`}
                  onClick={() =>
                    !notification.read && handleMarkAsRead(notification.id)
                  }
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.title)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium mb-1 ${
                              !notification.read
                                ? "text-gray-900"
                                : "text-gray-600"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <p
                            className={`text-sm leading-relaxed ${
                              !notification.read
                                ? "text-gray-600"
                                : "text-gray-500"
                            }`}
                          >
                            {notification.body}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.created_at
                              ? formatDistanceToNow(
                                  new Date(notification.created_at),
                                  {
                                    addSuffix: true,
                                  }
                                )
                              : "Just now"}
                          </p>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          {notification.read ? (
                            <CheckCheck className="h-4 w-4 text-green-500" />
                          ) : (
                            <div className="h-2 w-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => {
                  navigate("/notifications");
                  setIsOpen(false);
                }}
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
