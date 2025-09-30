import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLogout } from "@/hooks/useGraphQL";
import { clearCredentials } from "@/redux/slices/authSlice";
import { useAuth } from "@/redux/useAuth";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/redux/hooks";

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, loading } = useLogout();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearCredentials());
      setIsOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    // Navigate to profile page if it exists
    // navigate("/profile");
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    // Navigate to settings page if it exists
    // navigate("/settings");
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (user?.member?.full_name) {
      const names = user.member.full_name.split(" ");
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(
          0
        )}`.toUpperCase();
      }
      return names[0].charAt(0).toUpperCase();
    }
    if (user?.phone) {
      return user.phone.slice(-2).toUpperCase();
    }
    return "U";
  };

  // Get display name
  const getDisplayName = () => {
    if (user?.member?.full_name) {
      return user.member.full_name;
    }
    if (user?.phone) {
      return user.phone;
    }
    return "User";
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {getDisplayName()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {user?.member?.role?.name || "Family Member"}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-64 p-2"
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <div className="space-y-1">
          {/* User Info */}
          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {getDisplayName()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.phone}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.member?.role?.name || "Family Member"}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-left px-3 py-2 h-auto font-normal"
              onClick={handleProfileClick}
            >
              <User className="h-4 w-4 mr-3" />
              <span>Profile</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-left px-3 py-2 h-auto font-normal"
              onClick={handleSettingsClick}
            >
              <Settings className="h-4 w-4 mr-3" />
              <span>Settings</span>
            </Button>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-left px-3 py-2 h-auto font-normal text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleLogout}
              disabled={loading}
            >
              <LogOut className="h-4 w-4 mr-3" />
              <span>{loading ? "Logging out..." : "Logout"}</span>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserProfileDropdown;
