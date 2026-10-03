import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/redux/useAuth";
import { getDefaultPathForUser, getUserRoles, hasAnyRole } from "@/lib/roles";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  allowedRoles?: string[];
}

const ProtectedRoute = ({
  children,
  requiredRole,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const roles = getUserRoles(user).map((r) => r.toLowerCase());

  if (requiredRole) {
    const accepted = [requiredRole.toLowerCase()];
    // Main Leader shares admin route access
    if (requiredRole.toLowerCase() === "admin") {
      accepted.push("main");
    }
    // Family Coordinator / Follow up share family-leader routes
    if (requiredRole.toLowerCase() === "fl") {
      accepted.push("fc", "ful");
    }
    // Admin/Main can access TT routes
    if (requiredRole.toLowerCase() === "tt") {
      accepted.push("admin", "main");
    }
    if (!accepted.some((r) => roles.includes(r))) {
      return <Navigate to={getDefaultPathForUser(user)} replace />;
    }
  }

  if (
    allowedRoles &&
    !hasAnyRole(
      user,
      allowedRoles.map((r) => r.toUpperCase()),
    )
  ) {
    return <Navigate to={getDefaultPathForUser(user)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
