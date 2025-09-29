import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useGraphQL";
import { useAuth } from "@/redux/useAuth";

const LogoutButton = () => {
  const { logout, loading } = useLogout();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Welcome, {user?.phone}
      </span>
      <Button
        variant="outline"
        onClick={handleLogout}
        disabled={loading}
        className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
      >
        {loading ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
};

export default LogoutButton;
