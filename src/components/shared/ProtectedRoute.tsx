import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/redux/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "fl" | "ml";
  allowedRoles?: ("admin" | "fl" | "ml")[];
}

const ProtectedRoute = ({
  children,
  requiredRole,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  const userRole = user.role?.toLowerCase();

  if (requiredRole && userRole !== requiredRole) {
    // If user doesn't have the required role, redirect based on their actual role
    if (userRole === "fl") {
      return <Navigate to="/family-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  if (allowedRoles && !allowedRoles.includes(userRole as "admin" | "fl")) {
    // If user doesn't have any of the allowed roles, redirect based on their actual role
    if (userRole === "fl") {
      return <Navigate to="/family-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
