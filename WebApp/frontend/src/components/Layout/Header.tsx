import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Bell, User, X, Trash2, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import SettingsHandler from "../../handler/settings";
import SitesHandler from "../../handler/sites";
import NotificationsHandler from "../../handler/notifications";

interface HeaderProps {
  site: boolean;
}

export const Header: React.FC<HeaderProps> = ({ site = false }) => {
  const currentURL = window.location.pathname;
  const settingsHandler = new SettingsHandler();
  const sitesHandler = new SitesHandler();
  const notificationsHandler = new NotificationsHandler();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { siteId } = useParams();

  const [siteName, setSiteName] = useState("");
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    email: "",
    photo: "",
  });

  const [ProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [NotificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const getSelectPage = () => {
    let page = currentURL.split(`/`)[1];
    if (page) {
      page = page.replace("-", " ");
    }
    return page || "Dashboard";
  };

  const loadProfileData = async () => {
    try {
      const response = await settingsHandler.get_profile();
      if (response.success && response.data) {
        setProfileData({
          name: response.data.name || "",
          phone: response.data.phone || "",
          email: response.data.email || "",
          photo: response.data.photo || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await notificationsHandler.getAll();
      if (response.success) {
        // Handle both Array and Object with items property
        const data = Array.isArray(response.data)
          ? response.data
          : (response.data?.items || []);

        setNotifications(data);
        setUnreadCount(data.filter((n: any) => n && n.status === "unread").length);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await notificationsHandler.markAsRead(id);
      if (response.success) {
        loadNotifications();
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all notifications?")) return;
    try {
      const response = await notificationsHandler.clearAll();
      if (response.success) {
        loadNotifications();
      }
    } catch (error) {
      console.error("Error clearing all:", error);
    }
  };

  const closeDropdowns = () => {
    window.addEventListener("click", (e: any) => {
      let path = e.path || (e.composedPath && e.composedPath());

      let profile_dropdown_btn = document.getElementById("profile-dropdown-btn");
      let profile_dropdown_result = document.getElementById("profile-dropdown-result");
      let notif_btn = document.getElementById("notification-btn");
      let notif_result = document.getElementById("notification-result");

      if (Array.isArray(path)) {
        if (!path.includes(profile_dropdown_btn) && !path.includes(profile_dropdown_result)) {
          setProfileDropdownOpen(false);
        }
        if (!path.includes(notif_btn) && !path.includes(notif_result)) {
          setNotificationsOpen(false);
        }
      }
    });
  };

  const handlerDropdownAction = (action: string) => {
    if (action == "edit_profile") navigate("/settings");
    if (action == "logout") logout();
    setProfileDropdownOpen(false);
  };

  const loadSites = async () => {
    try {
      const response = await sitesHandler.get({ id: siteId });
      if (!response.success) return navigate("/sites");
      let sites = response.data.items || [];
      if (!sites.length) return navigate("/sites");
      setSiteName(sites[0].name);
    } catch (error) {
      console.error("Error loading sites:", error);
    }
  };

  const handleAcceptBudget = async (notif: any) => {
    try {
      if (!notif.allocation_id) return;
      const response = await notificationsHandler.acceptBudgetAllocation(notif.allocation_id);
      if (response.success) {
        alert("Budget accepted successfully!");

        // Locally update notification to hide buttons immediately
        const updated = notifications.map(n =>
          n._id === notif._id ? { ...n, status: 'read', message: `(ACCEPTED) ${n.message}` } : n
        );
        setNotifications(updated);
        setUnreadCount(updated.filter(n => n.status === 'unread').length);

        // Mark notification as read in DB too (for good measure)
        await handleMarkAsRead(notif._id);

        // Reload page to reflect financial changes
        window.location.reload();
      } else {
        alert("Error: " + (response.message || "Could not accept budget. (Note: Only the assigned employee can accept their budget)"));
      }
    } catch (error) {
      console.error("Error accepting budget:", error);
      alert("An unexpected error occurred while accepting the budget.");
    }
  };

  const handleDeclineBudget = async (notif: any) => {
    try {
      if (!notif.allocation_id) return;
      if (!window.confirm("Are you sure you want to decline this budget allocation?")) return;

      const response = await notificationsHandler.declineBudgetAllocation(notif.allocation_id);
      if (response.success) {
        alert("Budget declined successfully.");

        // Locally update
        const updated = notifications.map(n =>
          n._id === notif._id ? { ...n, status: 'read', message: `(DECLINED) ${n.message}` } : n
        );
        setNotifications(updated);
        setUnreadCount(updated.filter(n => n.status === 'unread').length);

        await handleMarkAsRead(notif._id);
        window.location.reload();
      } else {
        alert("Error: " + (response.message || "Could not decline budget."));
      }
    } catch (error) {
      console.error("Error declining budget:", error);
      alert("An unexpected error occurred.");
    }
  };

  useEffect(() => {
    loadProfileData();
    loadNotifications();
    if (site) loadSites();
    closeDropdowns();

    // Polling for real-time-like notifications (every 30 seconds)
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [siteId]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {site ? (
            <>
              <button
                onClick={() => navigate("/sites")}
                className="rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors w-8 h-8 flex items-center justify-center border border-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Site</span>
                <span className="text-sm font-semibold text-blue-700">{siteName}</span>
              </div>
            </>
          ) : (
            <h1 className="text-2xl font-semibold text-gray-900 capitalize">{getSelectPage()}</h1>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              id="notification-btn"
              onClick={() => setNotificationsOpen(!NotificationsOpen)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {NotificationsOpen && (
              <div
                id="notification-result"
                className="absolute top-[100%] right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
              >
                <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <span className="text-sm font-semibold text-gray-700">Notifications</span>
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {!Array.isArray(notifications) || notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notif, index) => {
                      if (!notif) return null;
                      return (
                        <div
                          key={notif._id?.toString() || index}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors relative group ${notif.status === "unread" ? "bg-blue-50/30" : ""
                            }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-sm ${notif.status === "unread" ? "font-bold" : "font-medium"} text-gray-900`}>
                              {notif.title || "Notification"}
                            </h4>
                            {notif.status === "unread" && (
                              <button
                                onClick={() => handleMarkAsRead(notif._id)}
                                className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                                title="Mark as read"
                              >
                                <CheckSquare className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed mb-2">{notif.message || ""}</p>

                          {notif.type === "budget_allocation" && notif.status === "unread" && (
                            <div className="flex space-x-2 mb-2">
                              <button
                                onClick={() => handleAcceptBudget(notif)}
                                className="flex-1 py-1.5 bg-green-600 text-white text-xs font-semibold rounded hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                              >
                                <CheckSquare className="w-3.5 h-3.5" />
                                <span>Accept</span>
                              </button>
                              <button
                                onClick={() => handleDeclineBudget(notif)}
                                className="flex-1 py-1.5 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Decline</span>
                              </button>
                            </div>
                          )}

                          <span className="text-[10px] text-gray-400">
                            {notif.created_at ? new Date(notif.created_at).toLocaleString() : ""}
                          </span>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              id="profile-dropdown-btn"
              onClick={() => setProfileDropdownOpen(!ProfileDropdownOpen)}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {profileData.photo ? (
                  <img
                    src={`data:image/jpeg;base64,${profileData.photo}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <span className="text-sm font-medium">{profileData.name || "User"}</span>
            </button>

            {ProfileDropdownOpen && (
              <div
                id="profile-dropdown-result"
                className="absolute top-[100%] right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-900">{profileData.name}</p>
                  <p className="text-xs text-gray-500 truncate">{profileData.email}</p>
                </div>
                <div className="py-1">
                  {profileData.email === "kavin@cloudheard.org" && (
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        navigate("/admin/users");
                        setProfileDropdownOpen(false);
                      }}
                    >
                      User Management
                    </button>
                  )}
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => handlerDropdownAction("edit_profile")}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => handlerDropdownAction("logout")}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
