import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";

import Images from "../../assets/Images";

import {
  LayoutDashboard,
  Blocks,
  Contact2Icon,
  ReceiptText,
  ClipboardCheck,
  Package2,
  Landmark,
  ChevronLeft,
  ChevronRight,
  MenuSquare,
} from "lucide-react";

interface SidebarProps {}

const navigation = [
  { name: "Quick Menu", href: "", icon: Blocks },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tasks", href: "/tasks", icon: ClipboardCheck },
  { name: "Attendance", href: "/attendances", icon: Contact2Icon },
  { name: "Expenses", href: "/expenses", icon: ReceiptText },
  { name: "Payments", href: "/payments", icon: Landmark },
  { name: "Materials", href: "/materials", icon: Package2 },
];
const mobile_navigation = [
  { name: "Menus", href: "", icon: Blocks },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tasks", href: "/tasks", icon: ClipboardCheck },
  { name: "Materials", href: "/materials", icon: Package2 },
  { name: "Attendance", href: "/attendances", icon: Contact2Icon },
  { name: "More", href: "/more", icon: MenuSquare },
];

export const SiteSidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const { siteId } = useParams();
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
    <>
      <div
        className={`site-sidebar-main shadow-lg transition-all border-r border-gray-200 duration-300 ease-in-out flex flex-col items-center bg-[var(--site-sidebar-color)] ${
          sidebarCollapsed
            ? "w-[var(--sidebar-closed-width)]"
            : "w-[var(--sidebar-opened-width)]"
        }`}
      >
        {/* Header */}
        <div className="w-full p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src={Images.LogoSmall} className="w-8 h-8 rounded-lg" />
              {!sidebarCollapsed && (
                <span className="text-lg font-semibold text-gray-900">
                  Site Menus
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="w-full flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname == `/site/${siteId}${item.href}`;
            return (
              <NavLink
                key={item.name}
                to={`/site/${siteId}${item.href}`}
                className={`flex items-center space-x-3  ${
                  sidebarCollapsed ? "px-2" : "px-3"
                } py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-900 hover:bg-gray-50 hover:text-blue-700"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    isActive ? "text-blue-700" : "hover:text-blue-700"
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
          className="mb-2 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors w-8 h-8 flex items-center justify-center border border-gray-200"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="site-mobile-menubar-main w-full h-16 flex justify-between border-t border-gray-200 px-4">
        {/* Navigation */}
        {mobile_navigation.map((item) => {
          const isActive = location.pathname == `/site/${siteId}${item.href}`;
          return (
            <NavLink
              key={item.name}
              to={`/site/${siteId}${item.href}`}
              className={`flex flex-col justify-center items-center space-y-1 px-2 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-blue-700"
                  : "text-gray-900 hover:bg-gray-50 hover:text-blue-700"
              }`}
            >
              <item.icon
                className={`w-10 h-10 ${
                  isActive ? "text-blue-700" : "hover:text-blue-700"
                }`}
              />
              <span className="text-xs font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};
