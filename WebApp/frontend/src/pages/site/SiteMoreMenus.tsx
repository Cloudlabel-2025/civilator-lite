import React from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { ReceiptText, Landmark } from "lucide-react";

const navigation = [
  { name: "Expenses", href: "/expenses", icon: ReceiptText },
  { name: "Payments", href: "/payments", icon: Landmark },
];

export const SiteMoreMenus: React.FC = () => {
  const location = useLocation();
  const { siteId } = useParams();

  return (
    <>
      <div className="w-full h-full  site-mobile-menubar-main w-full h-16 gap-4 flex border-t border-gray-200 p-4">
        {/* Navigation */}
        {navigation.map((item) => {
          const isActive = location.pathname == `/site/${siteId}${item.href}`;
          return (
            <NavLink
              key={item.name}
              to={`/site/${siteId}${item.href}`}
              className={`w-[max-content] h-[max-content] flex flex-col justify-center items-center border border-gray-200 hover:border-blue-700 space-y-1 px-2 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-blue-700"
                  : "text-gray-900 hover:bg-gray-50 hover:text-blue-700"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${
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
