import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();
    const userDetailsStr = localStorage.getItem("userdetails");
    const userDetails = userDetailsStr ? JSON.parse(userDetailsStr) : null;

    // Force super-admin to admin page if they land on regular protected routes
    if (isAuthenticated && userDetails?.email?.toLowerCase().trim() === "kavin@cloudheard.org") {
        return <Navigate to="/admin/users" replace />;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
