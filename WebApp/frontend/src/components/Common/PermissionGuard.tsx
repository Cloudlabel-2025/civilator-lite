import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PermissionGuardProps {
    children: ReactNode;
    module?: string;
    action?: "view" | "create" | "edit" | "delete";
    fallback?: ReactNode;
    redirect?: string;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
    children,
    module,
    action = "view",
    fallback = null,
    redirect,
}) => {
    const userDetailsStr = localStorage.getItem("userdetails");
    const userDetails = userDetailsStr ? JSON.parse(userDetailsStr) : null;

    // 1. Super-Admin restriction: strictly limited to admin modules
    const userEmail = userDetails?.email?.toLowerCase().trim();
    if (userEmail === "kavin@cloudheard.org") {
        // Super admin can only access admin modules.
        // We let them through if no module is specified (e.g. Layout)
        if (!module) return <>{children}</>;

        if (redirect) {
            return <Navigate to={redirect} replace />;
        }
        return <>{fallback}</>;
    }
    const userRole = userDetails?.role_type?.toLowerCase().trim();

    // 2. Parent User bypass: grant full access
    if (userRole === "admin") {
        return <>{children}</>;
    }

    if (!module) return <>{children}</>;

    const permissions = userDetails?.permissions;
    const hasPermission = permissions?.[module]?.[action] === true;

    console.log(`[PermissionGuard] Check for ${module}.${action}:`, {
        userEmail,
        userRole,
        hasPerm: hasPermission,
        permissions: permissions ? 'Loaded' : 'Missing'
    });

    if (!hasPermission) {
        if (redirect) {
            return <Navigate to={redirect} replace />;
        }
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

export const hasPermission = (
    module: string,
    action: "view" | "create" | "edit" | "delete" = "view"
): boolean => {
    const userDetailsStr = localStorage.getItem("userdetails");
    const userDetails = userDetailsStr ? JSON.parse(userDetailsStr) : null;

    if (userDetails?.email?.toLowerCase().trim() === "kavin@cloudheard.org") {
        return false;
    }

    if (userDetails?.role_type?.toLowerCase().trim() === "admin") {
        return true;
    }

    const permissions = userDetails?.permissions;
    const hasPerm = permissions?.[module]?.[action] === true;

    if (process.env.NODE_ENV === 'development') {
        console.log(`[hasPermission] ${module}.${action} for ${userDetails?.email}: ${hasPerm}`);
    }

    return hasPerm;
};
