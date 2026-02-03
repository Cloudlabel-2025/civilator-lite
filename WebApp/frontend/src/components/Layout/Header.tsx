import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Bell, Search, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import SettingsHandler from "../../handler/settings";
import SitesHandler from "../../handler/sites";
interface HeaderProps {
  site: boolean;
}

export const Header: React.FC<HeaderProps> = ({ site = false }) => {
  const currentURL = window.location.pathname;
  const settingsHandler = new SettingsHandler();
  const sitesHandler = new SitesHandler();
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

  const closeProfileDropdown = () => {
    window.addEventListener("click", (e: any) => {
      let path = e.path || (e.composedPath && e.composedPath());

      let profile_dropdown_btn = document.getElementById(
        "profile-dropdown-btn"
      );
      let profile_dropdown_result = document.getElementById(
        "profile-dropdown-result"
      );

      if (
        Array.isArray(path) &&
        !path.includes(profile_dropdown_btn) &&
        !path.includes(profile_dropdown_result)
      )
        setProfileDropdownOpen(false);
    });
  };

  const handlerDropdownAction = (action: string) => {
    if (action == "edit_profile") navigate("/settings");
    if (action == "logout") logout();

    setProfileDropdownOpen(false);
  };

  const loadSites = async () => {
    try {
      const response = await sitesHandler.get({
        id: siteId,
      });

      if (!response.success) {
        return navigate("/sites");
      }

      let sites = response.data.items || [];

      if (!sites.length) {
        return navigate("/sites");
      }

      setSiteName(sites[0].name);
    } catch (error) {
      console.error("Error loading sites:", error);
    }
  };

  useEffect(() => {
    loadProfileData();
    if (site) loadSites();
    closeProfileDropdown();
  }, []);

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
                <span className="text-sm font-semibold text-blue-700">
                  {siteName}
                </span>
              </div>
            </>
          ) : (
            <h1 className="text-2xl font-semibold text-gray-900 capitalize">
              {getSelectPage()}
            </h1>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              id="profile-dropdown-btn"
              onClick={() => setProfileDropdownOpen(!ProfileDropdownOpen)}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                {profileData.photo ? (
                  <img
                    src={`data:image/jpeg;base64,${profileData.photo}`}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full "
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <span className="text-sm font-medium">
                {profileData.name || "User"}
              </span>
            </button>

            {ProfileDropdownOpen && (
              <div
                id="profile-dropdown-result"
                className="absolute top-[100%] right-0 w-48 bg-white rounded-md shadow-lg border border-gray-200"
              >
                <div className="px-4 py-2">
                  <p className="text-sm font-medium">{profileData.name}</p>
                  <p className="text-xs text-gray-500">{profileData.email}</p>
                </div>
                {/* show edit profile button */}
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handlerDropdownAction("edit_profile")}
                >
                  Edit Profile
                </button>
                {/* show logout button */}
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                  onClick={() => handlerDropdownAction("logout")}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
