import React from "react";
import { Routes, Route } from "react-router-dom";

import { Dashboard } from "./pages/Dashboard";
import { Sites } from "./pages/Sites";
import { Vendors } from "./pages/Vendors";
import { Employees } from "./pages/Employees";
import { MasterDatabase } from "./pages/MasterDatabase";
import { RoleManagement } from "./pages/RoleManagement";
import { Settings } from "./pages/Settings";

import { Sidebar } from "./components/Layout/Sidebar";
import { Header } from "./components/Layout/Header";

function AppIndex() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header site={false} />
        <Routes>
          <Route path="/*" element={<Sites />} />
          <Route path="/sites/*" element={<Sites />} />
          <Route path="/vendors/*" element={<Vendors />} />
          <Route path="/employees/*" element={<Employees />} />
          <Route path="/master-database/*" element={<MasterDatabase />} />
          <Route path="/roles/*" element={<RoleManagement />} />
          <Route path="/settings/*" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default AppIndex;
