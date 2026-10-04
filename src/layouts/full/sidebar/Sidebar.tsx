import { useEffect, useMemo, useState } from "react";
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
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/redux/useAuth";
import { useUnreadAnnouncementCount } from "@/hooks/useUnreadAnnouncementCount";
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
  { name: "Announcements", href: "/announcements", icon: Megaphone },
  {
    name: "Members",
    icon: Users,
    children: [
      { name: "All Members", href: "/members", icon: Users },
      { name: "Newcomers", href: "/newcomers", icon: UserCheck },
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
  { name: "Announcements", href: "/announcements", icon: Megaphone },
  {
    name: "Members",
    icon: Users,
    children: [
      { name: "All Members", href: "/members", icon: Users },
      { name: "Newcomers", href: "/newcomers", icon: UserCheck },
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
];

const flNavigation: NavItem[] = [
  { name: "Dashboard", href: "/family-dashboard", icon: LayoutDashboard },
  { name: "My Family", href: "/families/my-family", icon: UserCheck },
  { name: "Attendance", href: "/attendance", icon: Calendar },
  { name: "Announcements", href: "/announcements", icon: Megaphone },
];

const fulNavigation: NavItem[] = [
  { name: "Follow-up", href: "/follow-up", icon: PhoneCall },
  { name: "Announcements", href: "/announcements", icon: Megaphone },
];

const mlNavigation: NavItem[] = [
  { name: "Dashboard", href: "/ministry-dashboard", icon: LayoutDashboard },
  { name: "My Ministry", href: "/ministries/my-ministry", icon: UserCog },
  { name: "Announcements", href: "/announcements", icon: Megaphone },
];

const ttNavigation: NavItem[] = [
  { name: "Dashboard", href: "/teen-dashboard", icon: LayoutDashboard },
  { name: "My Classes", href: "/teen-classes/my-classes", icon: BookOpen },
  { name: "Attendance", href: "/teen-attendance", icon: Calendar },
  { name: "Announcements", href: "/announcements", icon: Megaphone },
];

const memberNavigation: NavItem[] = [
  { name: "Announcements", href: "/announcements", icon: Megaphone },
];

function isPathActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

function groupHasActiveChild(pathname: string, group: NavGroup) {
  return group.children.some((child) => isPathActive(pathname, child.href));
}

function collectHrefs(entries: NavEntry[]): Set<string> {
  const seen = new Set<string>();
  for (const entry of entries) {
    if (isNavGroup(entry)) {
      for (const child of entry.children) seen.add(child.href);
    } else {
      seen.add(entry.href);
    }
  }
  return seen;
}

/** FC nav omits Follow-up; inject it under Members when the user also has FUL/FUC. */
function enrichFcNavigation(user: Parameters<typeof hasRole>[0]): NavEntry[] {
  const hasFollowUpRole = hasAnyRole(user, [ROLE.FUL, ROLE.FUC]);
  const entries: NavEntry[] = fcNavigation.map((entry) => {
    if (
      hasFollowUpRole &&
      isNavGroup(entry) &&
      entry.name === "Members" &&
      !entry.children.some((c) => c.href === "/follow-up")
    ) {
      return {
        ...entry,
        children: [
          ...entry.children,
          { name: "Follow-up", href: "/follow-up", icon: PhoneCall },
        ],
      };
    }
    return entry;
  });

  const seen = collectHrefs(entries);
  const extras: NavItem[] = [];
  if (hasRole(user, ROLE.FL)) extras.push(...flNavigation);
  if (hasRole(user, ROLE.ML)) extras.push(...mlNavigation);
  if (hasRole(user, ROLE.TT)) extras.push(...ttNavigation);
  for (const item of extras) {
    if (!seen.has(item.href)) {
      entries.push(item);
      seen.add(item.href);
    }
  }
  return entries;
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const { user } = useAuth();
  const { count: unreadAnnouncements } = useUnreadAnnouncementCount();

  // Multi-role: merge nav sets; ADMIN/MAIN full admin; FC family/member admin
  // (FC+FUL must still surface Follow-up — FC nav alone used to hide it)
  const navigation = useMemo((): NavEntry[] => {
    if (hasAnyRole(user, [ROLE.ADMIN, ROLE.MAIN])) {
      return adminNavigation;
    }
    if (hasRole(user, ROLE.FC)) {
      return enrichFcNavigation(user);
    }
    const items: NavItem[] = [];
    if (hasRole(user, ROLE.FL)) {
      items.push(...flNavigation);
    }
    if (hasAnyRole(user, [ROLE.FUL, ROLE.FUC])) {
      items.push(...fulNavigation);
    }
    if (hasRole(user, ROLE.ML)) {
      items.push(...mlNavigation);
    }
    if (hasRole(user, ROLE.TT)) {
      items.push(...ttNavigation);
    }
    if (hasRole(user, ROLE.FM)) {
      items.push(...memberNavigation);
    }
    if (items.length === 0) {
      return memberNavigation;
    }
    const seen = new Set<string>();
    return items.filter((item) => {
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    });
  }, [user]);

  const hasGroupedNav = navigation.some(isNavGroup);

  // Keep the group that contains the current route expanded
  useEffect(() => {
    if (!hasGroupedNav) return;
    setOpenGroups((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const entry of navigation) {
        if (
          isNavGroup(entry) &&
          groupHasActiveChild(location.pathname, entry) &&
          !next[entry.name]
        ) {
          next[entry.name] = true;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [hasGroupedNav, navigation, location.pathname]);

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const linkClass = (active: boolean) =>
    cn(
      "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      active
        ? "bg-brand-gradient text-white"
        : "text-sidebar-foreground/80 hover:bg-muted hover:text-foreground",
    );

  const renderUnreadBadge = (href: string, active: boolean) => {
    if (href !== "/announcements" || unreadAnnouncements <= 0) return null;
    return (
      <span
        className={cn(
          "ml-auto min-w-[1.25rem] h-5 px-1.5 rounded-full text-[11px] font-semibold leading-5 text-center",
          active ? "bg-white/20 text-white" : "bg-red-500 text-white",
        )}
      >
        {unreadAnnouncements > 99 ? "99+" : unreadAnnouncements}
      </span>
    );
  };

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
          className="bg-card text-card-foreground shadow-md"
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
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-sidebar-border">
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
                          ? "text-brand-gradient bg-muted"
                          : "text-sidebar-foreground/80 hover:bg-muted hover:text-foreground",
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
                      <div className="ml-3 space-y-1 border-l border-sidebar-border pl-2">
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
                              <span className="flex items-center space-x-3 min-w-0">
                                <child.icon className="h-4 w-4 shrink-0" />
                                <span>{child.name}</span>
                              </span>
                              {renderUnreadBadge(child.href, isActive)}
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
                  <span className="flex items-center space-x-3 min-w-0">
                    <entry.icon className="h-5 w-5 shrink-0" />
                    <span>{entry.name}</span>
                  </span>
                  {renderUnreadBadge(entry.href, isActive)}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="text-xs text-muted-foreground text-center">
              Gotera Youth Management System
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
