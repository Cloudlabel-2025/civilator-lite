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

import { PermissionGuard } from "./components/Common/PermissionGuard";

function AppIndex() {
  console.log("AppIndex Rendering - Path:", window.location.pathname);
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header site={false} />
        <Routes>
          <Route index element={<Sites />} />
          <Route
            path="/sites/*"
            element={
              <PermissionGuard module="sites" redirect="/">
                <Sites />
              </PermissionGuard>
            }
          />
          <Route
            path="/vendors/*"
            element={
              <PermissionGuard module="vendors" redirect="/">
                <Vendors />
              </PermissionGuard>
            }
          />
          <Route
            path="/employees/*"
            element={
              <PermissionGuard module="employees" redirect="/">
                <Employees />
              </PermissionGuard>
            }
          />
          <Route
            path="/master-database/*"
            element={
              <PermissionGuard module="masterDatabase" redirect="/">
                <MasterDatabase />
              </PermissionGuard>
            }
          />
          <Route
            path="/roles/*"
            element={
              <PermissionGuard module="roleManagement" redirect="/">
                <RoleManagement />
              </PermissionGuard>
            }
          />
          <Route
            path="/settings/*"
            element={
              <PermissionGuard module="settings" redirect="/">
                <Settings />
              </PermissionGuard>
            }
          />
          <Route path="*" element={<Sites />} />
        </Routes>
      </div>
    </div>
  );
}

export default AppIndex;
