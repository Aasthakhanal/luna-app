import React, { useState } from "react";
import {
  Bell,
  Calendar,
  AlertTriangle,
  Flower,
  Search,
  Trash2,
  Settings,
} from "lucide-react";
import {
  useGetUserNotificationsQuery,
  useDeleteNotificationMutation,
} from "../../app/notificationsApi";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "react-hot-toast";

const Notifications = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
  } = useGetUserNotificationsQuery({
    page: currentPage,
    limit: 10,
    search: searchTerm,
  });

  const [deleteNotification] = useDeleteNotificationMutation();

  const notifications = notificationsData?.data || [];
  const meta = notificationsData?.meta || {};

  const getNotificationIcon = (title) => {
    if (title.includes("Period") || title.includes("🩸")) {
      return <Calendar className="h-5 w-5 text-red-500" />;
    } else if (title.includes("Irregularity") || title.includes("⚠️")) {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    } else if (title.includes("Ovulation") || title.includes("🌸")) {
      return <Flower className="h-5 w-5 text-pink-500" />;
    }
    return <Bell className="h-2 w-2 text-blue-500" />;
  };

  const getNotificationBg = (title) => {
    if (title.includes("Period") || title.includes("🩸")) {
      return "bg-red-50 border-l-red-400";
    } else if (title.includes("Irregularity") || title.includes("⚠️")) {
      return "bg-yellow-50 border-l-yellow-400";
    } else if (title.includes("Ovulation") || title.includes("🌸")) {
      return "bg-pink-50 border-l-pink-400";
    }
    return "bg-blue-50 border-l-blue-400";
  };

  const getNotificationTypeFromTitle = (title) => {
    if (title.includes("Period") || title.includes("🩸")) return "period";
    if (title.includes("Irregularity") || title.includes("⚠️"))
      return "irregularity";
    if (title.includes("Ovulation") || title.includes("🌸")) return "ovulation";
    return "general";
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filterType === "all") return true;
    return getNotificationTypeFromTitle(notification.title) === filterType;
  });

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id).unwrap();
      toast.success("Notification deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedNotifications.map((id) => deleteNotification(id).unwrap())
      );
      toast.success(`${selectedNotifications.length} notifications deleted`);
      setSelectedNotifications([]);
      refetch();
    } catch {
      toast.error("Failed to delete notifications");
    }
  };

  const toggleSelectNotification = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((nId) => nId !== id) : [...prev, id]
    );
  };

  const selectAllNotifications = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Notifications
              </h1>
              <p className="text-gray-600">
                Stay updated with your cycle and health insights
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="period">Period Updates</option>
                <option value="ovulation">Ovulation</option>
                <option value="irregularity">Irregularities</option>
                <option value="general">General</option>
              </select>
              {selectedNotifications.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete ({selectedNotifications.length})</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">
                  {meta.total || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Calendar className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Period</p>
                <p className="text-xl font-bold text-gray-900">
                  {
                    notifications.filter(
                      (n) => getNotificationTypeFromTitle(n.title) === "period"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Flower className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ovulation</p>
                <p className="text-xl font-bold text-gray-900">
                  {
                    notifications.filter(
                      (n) =>
                        getNotificationTypeFromTitle(n.title) === "ovulation"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Alerts</p>
                <p className="text-xl font-bold text-gray-900">
                  {
                    notifications.filter(
                      (n) =>
                        getNotificationTypeFromTitle(n.title) === "irregularity"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* List Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={
                    filteredNotifications.length > 0 &&
                    selectedNotifications.length ===
                      filteredNotifications.length
                  }
                  onChange={selectAllNotifications}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">
                  {filteredNotifications.length} notifications
                </span>
              </div>
              <button
                onClick={refetch}
                className="text-sm text-primary hover:text-primary-dark"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-500">Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-2">
                  Failed to load notifications
                </p>
                <button
                  onClick={refetch}
                  className="text-sm text-primary hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No notifications found</p>
                <p className="text-sm text-gray-400">
                  {searchTerm || filterType !== "all"
                    ? "Try adjusting your search or filters"
                    : "We'll notify you about important cycle updates"}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors border-l-4 ${getNotificationBg(
                    notification.title
                  )}`}
                >
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => toggleSelectNotification(notification.id)}
                      className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.title)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed mb-3">
                            {notification.body}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              {notification.created_at
                                ? format(
                                    new Date(notification.created_at),
                                    "MMM dd, yyyy 'at' HH:mm"
                                  )
                                : "Just now"}
                            </span>
                            <span>•</span>
                            <span>
                              {notification.created_at
                                ? formatDistanceToNow(
                                    new Date(notification.created_at),
                                    { addSuffix: true }
                                  )
                                : "Just now"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * (meta.limit || 10) + 1} to{" "}
                  {Math.min(currentPage * (meta.limit || 10), meta.total)} of{" "}
                  {meta.total} notifications
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-2 text-sm">
                    Page {currentPage} of {meta.totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === meta.totalPages}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
