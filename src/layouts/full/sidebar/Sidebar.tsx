import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Home,
  Briefcase,
  MapPin,
  UserCheck,
  Menu,
  X,
  Network,
  Activity,
  Calendar,
  UserCog,
  CalendarCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/redux/useAuth";

// Define navigation items with role restrictions
const adminNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Overview", href: "/overview", icon: Home },
  { name: "Members", href: "/members", icon: Users },
  { name: "Families", href: "/families", icon: UserCheck },
  { name: "Family Meetups", href: "/family-meetups", icon: CalendarCheck },
  { name: "Ministries", href: "/ministries", icon: UserCog },
  { name: "Family Member Mapping", href: "/family-mapping", icon: Network },
  { name: "Professions", href: "/professions", icon: Briefcase },
  { name: "Locations", href: "/locations", icon: MapPin },
  { name: "Activity Logs", href: "/activity-logs", icon: Activity },
];

const flNavigation = [
  { name: "Dashboard", href: "/family-dashboard", icon: LayoutDashboard },
  { name: "My Family", href: "/families/my-family", icon: UserCheck },
  { name: "Attendance", href: "/attendance", icon: Calendar },
];

const mlNavigation = [
  { name: "Dashboard", href: "/ministry-dashboard", icon: LayoutDashboard },
  { name: "My Ministry", href: "/ministries/my-ministry", icon: UserCog },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Determine which navigation items to show based on user role
  const navigation =
    user?.role?.toLowerCase() === "admin"
      ? adminNavigation
      : user?.role?.toLowerCase() === "ml"
      ? mlNavigation
      : flNavigation;

  return (
    <>
      {/* Mobile menu button */}
      <div
        className={cn(
          "lg:hidden fixed top-4 z-50 transition-all duration-300 ease-in-out",
          isOpen ? "left-72" : "left-4"
        )}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white shadow-md"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-brand-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GY</span>
              </div>
              <span className="text-xl font-bold text-brand-gradient">
                Gotera Youth
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-gradient text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="text-xs text-gray-500 text-center">
              Gotera Youth Management System
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
