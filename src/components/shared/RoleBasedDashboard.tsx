import { Navigate } from "react-router-dom";
import { useAuth } from "@/redux/useAuth";

const RoleBasedDashboard = () => {
  const { user } = useAuth();
  const userRole = user?.role?.toLowerCase();

  // Redirect based on user role
  if (userRole === "fl") {
    return <Navigate to="/family-dashboard" replace />;
  } else if (userRole === "ml") {
    return <Navigate to="/ministry-dashboard" replace />;
  } else if (userRole === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Default fallback
  return <Navigate to="/dashboard" replace />;
};

export default RoleBasedDashboard;
