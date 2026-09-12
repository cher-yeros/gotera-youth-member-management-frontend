import { useEffect, useState } from "react";
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
  PhoneCall,
  GraduationCap,
  BookOpen,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/redux/useAuth";
import { hasAnyRole, hasRole, ROLE } from "@/lib/roles";

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

type NavGroup = {
  name: string;
  icon: LucideIcon;
  children: NavItem[];
};

type NavEntry = NavItem | NavGroup;

function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "children" in entry;
}

/** Admin / MAIN: grouped menu → submenu */
const adminNavigation: NavEntry[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Overview", href: "/overview", icon: Home },
  {
    name: "Members",
    icon: Users,
    children: [
      { name: "All Members", href: "/members", icon: Users },
      { name: "Follow-up", href: "/follow-up", icon: PhoneCall },
    ],
  },
  {
    name: "Families",
    icon: UserCheck,
    children: [
      { name: "All Families", href: "/families", icon: UserCheck },
      { name: "Family Meetups", href: "/family-meetups", icon: CalendarCheck },
      { name: "Member Mapping", href: "/family-mapping", icon: Network },
    ],
  },
  { name: "Ministries", href: "/ministries", icon: UserCog },
  {
    name: "Teenagers",
    icon: GraduationCap,
    children: [
      { name: "All Teenagers", href: "/teenagers", icon: GraduationCap },
      { name: "Teen Classes", href: "/teen-classes", icon: BookOpen },
      { name: "Teen Sessions", href: "/teen-sessions", icon: Calendar },
      { name: "Attendance", href: "/teen-attendance", icon: CalendarCheck },
    ],
  },
  {
    name: "Reference",
    icon: Briefcase,
    children: [
      { name: "Professions", href: "/professions", icon: Briefcase },
      { name: "Locations", href: "/locations", icon: MapPin },
      { name: "Activity Logs", href: "/activity-logs", icon: Activity },
    ],
  },
];

/** Family Coordinator: admin family + member surfaces only */
const fcNavigation: NavEntry[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Overview", href: "/overview", icon: Home },
  {
    name: "Members",
    icon: Users,
    children: [{ name: "All Members", href: "/members", icon: Users }],
  },
  {
    name: "Families",
    icon: UserCheck,
    children: [
      { name: "All Families", href: "/families", icon: UserCheck },
      { name: "Family Meetups", href: "/family-meetups", icon: CalendarCheck },
      { name: "Member Mapping", href: "/family-mapping", icon: Network },
    ],
  },
];

const flNavigation: NavItem[] = [
  { name: "Dashboard", href: "/family-dashboard", icon: LayoutDashboard },
  { name: "My Family", href: "/families/my-family", icon: UserCheck },
  { name: "Attendance", href: "/attendance", icon: Calendar },
];

const fulNavigation: NavItem[] = [
  { name: "Follow-up", href: "/follow-up", icon: PhoneCall },
];

const mlNavigation: NavItem[] = [
  { name: "Dashboard", href: "/ministry-dashboard", icon: LayoutDashboard },
  { name: "My Ministry", href: "/ministries/my-ministry", icon: UserCog },
];

const ttNavigation: NavItem[] = [
  { name: "Dashboard", href: "/teen-dashboard", icon: LayoutDashboard },
  { name: "My Classes", href: "/teen-classes/my-classes", icon: BookOpen },
  { name: "Attendance", href: "/teen-attendance", icon: Calendar },
];

function isPathActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

function groupHasActiveChild(pathname: string, group: NavGroup) {
  return group.children.some((child) => isPathActive(pathname, child.href));
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const { user } = useAuth();

  const isAdminNav = hasAnyRole(user, [ROLE.ADMIN, ROLE.MAIN]);
  const isFcNav = !isAdminNav && hasRole(user, ROLE.FC);
  const groupedNav = isAdminNav
    ? adminNavigation
    : isFcNav
      ? fcNavigation
      : null;

  // Multi-role: merge nav sets; ADMIN/MAIN full admin; FC family/member admin
  const navigation = (() => {
    if (groupedNav) {
      return groupedNav;
    }
    const items: NavItem[] = [];
    if (hasRole(user, ROLE.FL)) {
      items.push(...flNavigation);
    }
    if (hasRole(user, ROLE.FUL)) {
      items.push(...fulNavigation);
    }
    if (hasRole(user, ROLE.ML)) {
      items.push(...mlNavigation);
    }
    if (hasRole(user, ROLE.TT)) {
      items.push(...ttNavigation);
    }
    if (items.length === 0) {
      return fulNavigation;
    }
    const seen = new Set<string>();
    return items.filter((item) => {
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    });
  })();

  // Keep the group that contains the current route expanded
  useEffect(() => {
    if (!groupedNav) return;
    setOpenGroups((prev) => {
      const next = { ...prev };
      for (const entry of groupedNav) {
        if (
          isNavGroup(entry) &&
          groupHasActiveChild(location.pathname, entry)
        ) {
          next[entry.name] = true;
        }
      }
      return next;
    });
  }, [groupedNav, location.pathname]);

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const linkClass = (active: boolean) =>
    cn(
      "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      active
        ? "bg-brand-gradient text-white"
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
    );

  return (
    <>
      {/* Mobile menu button */}
      <div
        className={cn(
          "lg:hidden fixed top-4 z-50 transition-all duration-300 ease-in-out",
          isOpen ? "left-72" : "left-4",
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
          isOpen ? "translate-x-0" : "-translate-x-full",
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
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((entry) => {
              if (isNavGroup(entry)) {
                const isExpanded = !!openGroups[entry.name];
                const groupActive = groupHasActiveChild(
                  location.pathname,
                  entry,
                );

                return (
                  <div key={entry.name} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => toggleGroup(entry.name)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        groupActive && !isExpanded
                          ? "text-brand-gradient bg-gray-50"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                      )}
                    >
                      <span className="flex items-center space-x-3">
                        <entry.icon className="h-5 w-5" />
                        <span>{entry.name}</span>
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </button>

                    {isExpanded && (
                      <div className="ml-3 space-y-1 border-l border-gray-200 pl-2">
                        {entry.children.map((child) => {
                          const isActive = isPathActive(
                            location.pathname,
                            child.href,
                          );
                          return (
                            <Link
                              key={child.href}
                              to={child.href}
                              onClick={() => setIsOpen(false)}
                              className={linkClass(isActive)}
                            >
                              <child.icon className="h-4 w-4" />
                              <span>{child.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = isPathActive(location.pathname, entry.href);
              return (
                <Link
                  key={entry.href}
                  to={entry.href}
                  onClick={() => setIsOpen(false)}
                  className={linkClass(isActive)}
                >
                  <entry.icon className="h-5 w-5" />
                  <span>{entry.name}</span>
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
