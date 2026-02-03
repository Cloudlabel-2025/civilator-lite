import { Routes, Route } from "react-router-dom";

/*Custom hook*/
import { AuthProvider } from "./hooks/AuthContext";
import ProtectedRoute from "./hooks/ProtectedRoute";

import { Login } from "./pages/Login";
import { VerifyOTP } from "./pages/VerifyOTP";
import AppIndex from "./AppIndex";
import SiteIndex from "./SiteIndex";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login/*" element={<Login />} />
        <Route path="/verify-otp/*" element={<VerifyOTP />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<AppIndex />} />
          <Route path="/site/:siteId/*" element={<SiteIndex />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
