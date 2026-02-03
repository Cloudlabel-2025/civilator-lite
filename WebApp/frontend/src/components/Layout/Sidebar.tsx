import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

import Images from "../../assets/Images";
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  Database,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {}

const navigation = [
  // { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Sites", href: "/sites", icon: Building2 },
  { name: "Vendors", href: "/vendors", icon: Users },
  { name: "Employees", href: "/employees", icon: UserCheck },
  { name: "Master Database", href: "/master-database", icon: Database },
  { name: "Role Management", href: "/roles", icon: Shield },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSetSidebarCollapsed = (value: boolean) => {
    localStorage.setItem("sidebarCollapsed", value ? "true" : "false");
    setSidebarCollapsed(value);
  };

  const getSidebarCollapsed = () => {
    let status = localStorage.getItem("sidebarCollapsed");
    setSidebarCollapsed(status == "true" ? true : false);
  };
  useEffect(() => {
    getSidebarCollapsed();
  }, []);
  return (
    <div
      className={`shadow-lg transition-all duration-300 ease-in-out flex flex-col items-center bg-[var(--sidebar-color)] ${
        sidebarCollapsed
          ? "w-[var(--sidebar-closed-width)]"
          : "w-[var(--sidebar-opened-width)]"
      }`}
    >
      {/* Header */}
      <div className="w-full p-4  mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={Images.LogoSmall} className="w-8 h-8 rounded-lg" />
            {!sidebarCollapsed && (
              <span className="text-lg font-semibold text-white">
                Civilator
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="w-full flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3  ${
                sidebarCollapsed ? "px-2" : "px-3"
              } py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-white hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  isActive ? "text-blue-700" : "hover:text-gray-900"
                }`}
              />
              {!sidebarCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={() => handleSetSidebarCollapsed(!sidebarCollapsed)}
        className="mb-2 rounded-lg text-white  hover:bg-gray-100 hover:text-gray-900 transition-colors w-8 h-8 flex items-center justify-center border border-gray-200"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};
