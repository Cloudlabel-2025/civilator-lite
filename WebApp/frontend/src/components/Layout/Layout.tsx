import React from "react";

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  return <main className="flex-1 overflow-y-auto p-2 lg:p-4">{children}</main>;
};
