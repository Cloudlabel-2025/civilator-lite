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

function SiteIndex() {
  return (
    <div className="site-index-main flex h-screen bg-gray-50">
      <SiteSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header site={true} />
        <Routes>
          <Route path="*" element={<QuickMenu />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/more/*" element={<SiteMoreMenus />} />
          <Route path="/expenses/*" element={<Expenses />} />
          <Route path="/payments/*" element={<Payments />} />
          <Route path="/materials/*" element={<Materials />} />
          <Route path="/tasks/*" element={<TaskList />} />
          <Route path="/attendances/*" element={<Attendances />} />
        </Routes>
      </div>
    </div>
  );
}

export default SiteIndex;
