import { Routes, Route } from "react-router-dom";

import { SiteSidebar } from "./components/Layout/SiteSidebar";
import { Header } from "./components/Layout/Header";

import { SiteMoreMenus } from "./pages/site/SiteMoreMenus";
import QuickMenu from "./pages/site/QuickMenu";
import { Expenses } from "./pages/site/Expenses";
import { Payments } from "./pages/site/Payments";
import { Materials } from "./pages/site/Materials";
import { TaskList } from "./pages/site/task/TaskList";
import { Attendances } from "./pages/site/Attendances";
import { Dashboard } from "./pages/site/Dashboard";

import { PermissionGuard } from "./components/Common/PermissionGuard";

function SiteIndex() {
  return (
    <div className="site-index-main flex h-screen bg-gray-50">
      <SiteSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header site={true} />
        <Routes>
          <Route index element={<QuickMenu />} />
          <Route
            path="/dashboard/*"
            element={
              <PermissionGuard module="financeDashboard" redirect="./">
                <Dashboard />
              </PermissionGuard>
            }
          />
          <Route path="/more/*" element={<SiteMoreMenus />} />
          <Route
            path="/expenses/*"
            element={
              <PermissionGuard module="expenses" redirect="./">
                <Expenses />
              </PermissionGuard>
            }
          />
          <Route
            path="/payments/*"
            element={
              <PermissionGuard module="payments" redirect="./">
                <Payments />
              </PermissionGuard>
            }
          />
          <Route
            path="/materials/*"
            element={
              <PermissionGuard module="materials" redirect="./">
                <Materials />
              </PermissionGuard>
            }
          />
          <Route
            path="/tasks/*"
            element={
              <PermissionGuard module="tasks" redirect="./">
                <TaskList />
              </PermissionGuard>
            }
          />
          <Route
            path="/attendances/*"
            element={
              <PermissionGuard module="attendances" redirect="./">
                <Attendances />
              </PermissionGuard>
            }
          />
          <Route path="*" element={<QuickMenu />} />
        </Routes>
      </div>
    </div>
  );
}

export default SiteIndex;
