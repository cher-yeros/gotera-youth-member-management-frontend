import { Navigate } from "react-router-dom";
import { useAuth } from "@/redux/useAuth";
import { getDefaultPathForUser } from "@/lib/roles";

const RoleBasedDashboard = () => {
  const { user } = useAuth();
  return <Navigate to={getDefaultPathForUser(user)} replace />;
};

export default RoleBasedDashboard;
