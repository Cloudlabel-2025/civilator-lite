import React from "react";

interface ToggleTabsProps {
  activeTab: string;
  tabs: any[];
  onTabChange: (tabKey: any) => void;
}

export const ToggleTabs: React.FC<ToggleTabsProps> = ({
  activeTab,
  tabs,
  onTabChange,
}) => {
  return (
    <div className="w-[max-content] h-[40px] flex items-center bg-gray-200 rounded-md">
      {tabs?.map((tab: any) => (
        <span
          key={`toggle-tab-${tab.id}`}
          className={`w-[max-content] h-[100%] ${
            tab.id == activeTab
              ? "bg-blue-700 text-white"
              : "bg-transparent text-gray-900"
          } rounded-md flex items-center justify-center px-4 cursor-pointer select-none`}
          onClick={() => onTabChange(tab)}
        >
          {tab.label}
        </span>
      ))}
    </div>
  );
};
