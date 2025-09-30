import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/theme-toggle";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import { Bell, Search } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Search - Hidden on mobile */}
        <div className="flex-1 max-w-lg hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Spacer for mobile - pushes right side icons to the right */}
        <div className="flex-1 md:hidden"></div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle variant="icon" />

          {/* User Profile Dropdown */}

          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
