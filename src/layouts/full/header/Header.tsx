import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/theme-toggle";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import { useUnreadAnnouncementCount } from "@/hooks/useUnreadAnnouncementCount";
import { Bell, Search } from "lucide-react";

const Header = () => {
  const { count: unreadCount } = useUnreadAnnouncementCount();

  return (
    <header className="bg-card text-card-foreground shadow-sm border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Search - Hidden on mobile */}
        <div className="flex-1 max-w-lg hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-background text-foreground border border-border rounded-lg placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>

        {/* Spacer for mobile - pushes right side icons to the right */}
        <div className="flex-1 md:hidden"></div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Announcement notifications */}
          <Button variant="ghost" size="sm" className="relative" asChild>
            <Link
              to="/announcements"
              aria-label={
                unreadCount > 0
                  ? `${unreadCount} unseen announcements`
                  : "Announcements"
              }
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.125rem] h-[1.125rem] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold leading-[1.125rem] text-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
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
