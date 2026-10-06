import RoleTestComponent from "@/components/test/RoleTestComponent";
import RecentActivitiesWidget from "@/components/widgets/RecentActivitiesWidget";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingCard from "@/components/ui/loading-card";
import type { Member } from "@/generated/graphql";
import type { Ministry } from "@/types/graphql";
import {
  useGetIncompleteFamilies,
  useGetMinistries,
  useGetOverviewStats,
  useGetRecentMembers,
} from "@/hooks/useGraphQL";
import { useGetTeenOverviewStats } from "@/hooks/useTeenGraphQL";
import { GET_FOLLOW_UP_DASHBOARD } from "@/graphql/operations";
import { useQuery } from "@apollo/client/react";
import { hasAnyRole, ROLE } from "@/lib/roles";
import { useAuth } from "@/redux/useAuth";
import {
  Activity,
  AlertTriangle,
  Briefcase,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Clock,
  GraduationCap,
  Home,
  MapPin,
  Network,
  PhoneCall,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const isFullAdmin = hasAnyRole(user, [ROLE.ADMIN, ROLE.MAIN]);
  const isFamilyCoordinator = hasAnyRole(user, [ROLE.FC]) && !isFullAdmin;

  // Fetch dashboard data
  const { data: statsData, loading: statsLoading } = useGetOverviewStats();
  const { data: recentMembersData, loading: recentMembersLoading } =
    useGetRecentMembers(3);
  const { data: incompleteFamiliesData, loading: incompleteFamiliesLoading } =
    useGetIncompleteFamilies(50);
  const { data: ministriesData, loading: ministriesLoading } = useGetMinistries(
    { skip: isFamilyCoordinator },
  );
  const { data: followUpDashData } = useQuery(GET_FOLLOW_UP_DASHBOARD, {
    skip: isFamilyCoordinator,
    errorPolicy: "all",
  });
  const { data: teenStatsData } = useGetTeenOverviewStats({
    skip: isFamilyCoordinator,
  });
  const teenStats = (teenStatsData as any)?.teenOverviewStats;

  const stats = statsData?.overviewStats;
  const recentMembers = recentMembersData?.recentMembers || [];
  const incompleteFamilies = incompleteFamiliesData?.incompleteFamilies || [];
  const followUpDash = (followUpDashData as any)?.followUpDashboard;
  const ministries: Ministry[] = ministriesData?.ministries || [];
  const dayUnassignedMinistries = ministries.filter(
    (ministry) => !ministry.program_day || !ministry.program_frequency,
  );
  const fullyUncompletedFamilies = incompleteFamilies.filter(
    (family: any) => family.isFullyIncomplete,
  );
  const incompleteFamiliesCount =
    stats?.incompleteFamiliesCount ?? incompleteFamilies.length;
  const fullyIncompleteFamiliesCount =
    stats?.fullyIncompleteFamiliesCount ?? fullyUncompletedFamilies.length;
  const isLoading =
    statsLoading ||
    recentMembersLoading ||
    incompleteFamiliesLoading ||
    (!isFamilyCoordinator && ministriesLoading);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-gradient">
              Dashboard
            </h1>
            <p className="text-muted-foreground">Overview</p>
          </div>
        </div>

        {/* Statistics Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingCard
              key={index}
              variant="minimal"
              className="hover-brand-glow transition-all duration-300"
            />
          ))}
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Role Test Component Skeleton */}
          <LoadingCard
            title="Role Management"
            subtitle="Testing role-based access"
            variant="detailed"
            skeletonLines={4}
          />

          {/* Quick Actions Skeleton */}
          <LoadingCard
            title="Quick Actions"
            subtitle="Navigate to different sections"
            variant="detailed"
            skeletonLines={5}
          />

          {/* System Status Skeleton */}
          <LoadingCard
            title="System Status"
            subtitle="Current system information"
            variant="detailed"
            skeletonLines={5}
          />
        </div>

        {/* Recent Activity Skeleton */}
        <LoadingCard
          title="Recent Activity"
          subtitle="Latest system updates"
          variant="detailed"
          skeletonLines={4}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-gradient">Dashboard</h1>
          <p className="text-muted-foreground">
            {isFamilyCoordinator
              ? "Family coordinator view"
              : stats
                ? `${stats.totalMembers || 0} members · ${stats.totalFamilies || 0} families`
                : "Overview"}
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value={stats?.totalMembers || 0}
          description={`${stats?.activeMembers || 0} active members`}
          icon={Users}
          tone="primary"
        />

        {isFamilyCoordinator ? (
          <StatCard
            title="Unassigned members"
            value={stats?.unassignedMembers || 0}
            description="Members with no family"
            icon={UserCheck}
            tone={(stats?.unassignedMembers || 0) > 0 ? "warning" : "success"}
            href="/members?unassigned=1"
            linkLabel="View unassigned"
          />
        ) : (
          <StatCard
            title="Teenagers"
            value={teenStats?.activeTeenagers || 0}
            description={`${teenStats?.totalClasses || 0} classes${
              teenStats?.incompleteTeenagers
                ? ` · ${teenStats.incompleteTeenagers} incomplete`
                : ""
            }`}
            icon={GraduationCap}
            tone="primary"
            href="/teenagers"
            linkLabel="Manage teenagers"
          />
        )}

        <StatCard
          title="Families"
          value={stats?.totalFamilies || 0}
          description={
            incompleteFamiliesCount > 0
              ? `${incompleteFamiliesCount} with incomplete info`
              : "Registered families"
          }
          icon={Home}
          tone={
            incompleteFamiliesCount > 0
              ? fullyIncompleteFamiliesCount > 0
                ? "danger"
                : "warning"
              : "secondary"
          }
        />

        {isFamilyCoordinator ? (
          <StatCard
            title="Open newcomers"
            value={stats?.openNewcomers || 0}
            description="Awaiting family placement"
            icon={PhoneCall}
            tone={(stats?.openNewcomers || 0) > 0 ? "warning" : "success"}
            href="/newcomers"
            linkLabel="View newcomers"
          />
        ) : (
          <StatCard
            title="Professions"
            value={stats?.totalProfessions || 0}
            description="Different professions"
            icon={Briefcase}
            tone="accent"
          />
        )}

        {isFamilyCoordinator ? (
          <StatCard
            title="Needs Profession"
            value={stats?.professionUnallocatedMembers || 0}
            description="Members without profession"
            icon={AlertTriangle}
            tone={
              (stats?.professionUnallocatedMembers || 0) > 0
                ? "warning"
                : "success"
            }
          />
        ) : (
          <StatCard
            title="Locations"
            value={stats?.totalLocations || 0}
            description="Covered locations"
            icon={MapPin}
            tone="primary"
          />
        )}
      </div>

      {/* Follow-up pipeline summary */}
      {!isFamilyCoordinator && followUpDash && (
        <Card className="shadow-brand">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-brand-gradient text-lg flex items-center gap-2">
                  <PhoneCall className="h-5 w-5 text-primary" />
                  Follow-up pipeline
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Newcomer intake and coordinator workload
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/follow-up">Open Follow-up</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
              <StatCard
                variant="compact"
                title="New"
                value={followUpDash.newCount}
                tone="primary"
              />
              <StatCard
                variant="compact"
                title="Assigned"
                value={followUpDash.assignedCount}
                tone="secondary"
              />
              <StatCard
                variant="compact"
                title="In progress"
                value={followUpDash.inProgressCount}
                tone="accent"
              />
              <StatCard
                variant="compact"
                title="Overdue"
                value={followUpDash.overdueCount}
                tone={followUpDash.overdueCount > 0 ? "danger" : "muted"}
                valueClassName={
                  followUpDash.overdueCount > 0
                    ? "text-red-600 dark:text-red-400"
                    : undefined
                }
              />
              <StatCard
                variant="compact"
                title="Promoted this month"
                value={followUpDash.joinedThisMonth}
                tone="success"
              />
            </div>
            {followUpDash.coordinatorWorkload?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {followUpDash.coordinatorWorkload.map((c: any) => (
                  <Badge key={c.member_id} variant="outline">
                    {c.full_name}: {c.openCases} open
                    {c.overdueCases > 0 ? ` · ${c.overdueCases} overdue` : ""}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Families with incomplete member data */}
      <Card
        className={`shadow-brand ${
          fullyIncompleteFamiliesCount > 0
            ? "border-2 border-red-500/40"
            : incompleteFamiliesCount > 0
              ? "border-2 border-yellow-500/40"
              : ""
        }`}
      >
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-brand-gradient text-lg flex items-center gap-2">
                <AlertTriangle
                  className={`h-5 w-5 ${
                    fullyIncompleteFamiliesCount > 0
                      ? "text-red-600"
                      : incompleteFamiliesCount > 0
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                />
                Families with Incomplete Info
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Families with Active members missing contact, gender, status,
                role, profession, location, or ministry
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-yellow-100 text-yellow-800">
                {incompleteFamiliesCount} incomplete
              </Badge>
              {fullyIncompleteFamiliesCount > 0 && (
                <Badge className="bg-red-100 text-red-800">
                  {fullyIncompleteFamiliesCount} fully incomplete
                </Badge>
              )}
              <Badge className="bg-green-100 text-green-800">
                {Math.max(
                  (stats?.totalFamilies || 0) - incompleteFamiliesCount,
                  0,
                )}{" "}
                complete
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {incompleteFamilies.length === 0 ? (
            <div className="flex items-center gap-3 p-4 rounded-lg border border-green-500/30 bg-green-50 dark:bg-green-950/20">
              <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">
                  All families look complete
                </p>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Every registered family has complete member profiles.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {incompleteFamilies.map((family: any) => (
                <div
                  key={family.id}
                  className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border transition-colors ${
                    family.isFullyIncomplete
                      ? "border-red-500/50 bg-red-50/60 dark:bg-red-950/20"
                      : "border-yellow-500/40 bg-yellow-50/50 dark:bg-yellow-950/10"
                  }`}
                >
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                      family.isFullyIncomplete
                        ? "bg-red-100 dark:bg-red-900/40"
                        : "bg-yellow-100 dark:bg-yellow-900/40"
                    }`}
                  >
                    <Home
                      className={`h-5 w-5 ${
                        family.isFullyIncomplete
                          ? "text-red-600"
                          : "text-yellow-700"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold truncate">{family.name}</p>
                      {family.isFullyIncomplete ? (
                        <Badge className="text-xs bg-red-100 text-red-800">
                          Fully incomplete
                        </Badge>
                      ) : (
                        <Badge className="text-xs bg-yellow-100 text-yellow-800">
                          Incomplete
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {family.incompleteMemberCount} of {family.memberCount}{" "}
                      active members need data filled
                      {family.fullyIncompleteMemberCount > 0
                        ? ` · ${family.fullyIncompleteMemberCount} mostly empty`
                        : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="text-xs">
                      {family.completeMemberCount} complete
                    </Badge>
                    <Link to={`/families/${family.id}/members`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-current"
                      >
                        View Members
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Link to="/families">
                  <Button
                    variant="outline"
                    className="w-full border-brand-gradient hover:bg-brand-gradient hover:text-white transition-all duration-200"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Manage All Families
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ministries without regular program day */}
      {!isFamilyCoordinator && (
        <Card
          className={`shadow-brand ${
            dayUnassignedMinistries.length > 0
              ? "border-2 border-yellow-500/40"
              : ""
          }`}
        >
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-brand-gradient text-lg flex items-center gap-2">
                  <CalendarClock
                    className={`h-5 w-5 ${
                      dayUnassignedMinistries.length > 0
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  />
                  Day Unassigned Ministries
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Ministries that have not set a weekly, bi-monthly, or monthly
                  program day
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-yellow-100 text-yellow-800">
                  {dayUnassignedMinistries.length} unassigned
                </Badge>
                <Badge className="bg-green-100 text-green-800">
                  {Math.max(
                    ministries.length - dayUnassignedMinistries.length,
                    0,
                  )}{" "}
                  scheduled
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {dayUnassignedMinistries.length === 0 ? (
              <div className="flex items-center gap-3 p-4 rounded-lg border border-green-500/30 bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">
                    All ministries have a program day
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Every ministry has a regular program schedule set.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {dayUnassignedMinistries.map((ministry) => (
                  <div
                    key={ministry.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-yellow-500/40 bg-yellow-50/50 dark:bg-yellow-950/10"
                  >
                    <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 bg-yellow-100 dark:bg-yellow-900/40">
                      <CalendarClock className="h-5 w-5 text-yellow-700" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold truncate">
                          {ministry.name}
                        </p>
                        <Badge
                          className={`text-xs ${
                            ministry.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {ministry.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge className="text-xs bg-yellow-100 text-yellow-800">
                          Program day not set
                        </Badge>
                      </div>
                      {ministry.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {ministry.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link to={`/ministries/${ministry.id}/members`}>
                        <Button variant="outline" size="sm">
                          View Ministry
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Link to="/ministries">
                    <Button
                      variant="outline"
                      className="w-full border-brand-gradient hover:bg-brand-gradient hover:text-white transition-all duration-200"
                    >
                      <CalendarClock className="mr-2 h-4 w-4" />
                      Manage All Ministries
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Member Status Statistics */}
      <Card className="shadow-brand">
        <CardHeader className="pb-4">
          <CardTitle className="text-brand-gradient text-lg">
            Member Status Overview
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Breakdown of members by their current status
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <StatCard
              variant="row"
              title="Active Members"
              description="Currently active members"
              value={stats?.activeMembers || 0}
              icon={UserCheck}
              tone="success"
            />
            <StatCard
              variant="row"
              title="Not Active Members"
              description="Members not currently active"
              value={stats?.notActiveMembers || 0}
              icon={Users}
              tone="muted"
            />
            <StatCard
              variant="row"
              title="Moved Out"
              description="Members who have moved out"
              value={stats?.movedOutMembers || 0}
              icon={Users}
              tone="warning"
            />
            <StatCard
              variant="row"
              title="New Members"
              description="Members added in the last 30 days"
              value={stats?.newMembers || 0}
              icon={TrendingUp}
              tone="primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Allocation Statistics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Location Allocation */}
        <Card className="shadow-brand">
          <CardHeader className="pb-4">
            <CardTitle className="text-brand-gradient text-lg">
              Location Allocation
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Members with and without location assignments
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatCard
              variant="row"
              title="Location Allocated"
              description="Members with location assigned"
              value={stats?.locationAllocatedMembers || 0}
              icon={MapPin}
              tone="success"
            />
            <StatCard
              variant="row"
              title="Location Unallocated"
              description="Members without location"
              value={stats?.locationUnallocatedMembers || 0}
              icon={AlertTriangle}
              tone={
                (stats?.locationUnallocatedMembers || 0) > 0
                  ? "warning"
                  : "success"
              }
              valueClassName={
                (stats?.locationUnallocatedMembers || 0) > 0
                  ? "text-amber-600 dark:text-amber-400"
                  : undefined
              }
            />
          </CardContent>
        </Card>

        {/* Profession Allocation */}
        <Card className="shadow-brand">
          <CardHeader className="pb-4">
            <CardTitle className="text-brand-gradient text-lg">
              Profession Allocation
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Members with and without profession assignments
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatCard
              variant="row"
              title="Profession Allocated"
              description="Members with profession assigned"
              value={stats?.professionAllocatedMembers || 0}
              icon={Briefcase}
              tone="success"
            />
            <StatCard
              variant="row"
              title="Profession Unallocated"
              description="Members without profession"
              value={stats?.professionUnallocatedMembers || 0}
              icon={AlertTriangle}
              tone={
                (stats?.professionUnallocatedMembers || 0) > 0
                  ? "warning"
                  : "success"
              }
              valueClassName={
                (stats?.professionUnallocatedMembers || 0) > 0
                  ? "text-amber-600 dark:text-amber-400"
                  : undefined
              }
            />
          </CardContent>
        </Card>

        {/* Ministry Allocation */}
        <Card className="shadow-brand">
          <CardHeader className="pb-4">
            <CardTitle className="text-brand-gradient text-lg">
              Ministry Allocation
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Members with and without ministry assignments
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatCard
              variant="row"
              title="Ministry Allocated"
              description="Members in ministries"
              value={stats?.ministryAllocatedMembers || 0}
              icon={Activity}
              tone="success"
            />
            <StatCard
              variant="row"
              title="Ministry Unallocated"
              description="Members not in any ministry"
              value={stats?.ministryUnallocatedMembers || 0}
              icon={AlertTriangle}
              tone={
                (stats?.ministryUnallocatedMembers || 0) > 0
                  ? "warning"
                  : "success"
              }
              valueClassName={
                (stats?.ministryUnallocatedMembers || 0) > 0
                  ? "text-amber-600 dark:text-amber-400"
                  : undefined
              }
              href="/members?no_ministry=1"
              linkLabel="View members"
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role Test Component */}
        {isFullAdmin && <RoleTestComponent />}

        {/* Quick Actions */}
        <Card className="shadow-brand">
          <CardHeader className="pb-4">
            <CardTitle className="text-brand-gradient text-lg">
              Quick Actions
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isFamilyCoordinator
                ? "Jump to family and member management"
                : "Navigate to different management sections"}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Link to="/members">
                <Button className="w-full h-12 bg-brand-gradient hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg">
                  <Users className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Manage Members</div>
                    <div className="text-xs opacity-90">
                      Add, edit, and view members
                    </div>
                  </div>
                </Button>
              </Link>

              <Link to="/families">
                <Button
                  variant="outline"
                  className="w-full h-12 border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <UserCheck className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Manage Families</div>
                    <div className="text-xs opacity-70">
                      Organize family registrations
                    </div>
                  </div>
                </Button>
              </Link>

              {isFamilyCoordinator ? (
                <>
                  <Link to="/family-meetups">
                    <Button
                      variant="outline"
                      className="w-full h-12 border-secondary hover:bg-secondary hover:text-secondary-foreground transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <CalendarCheck className="mr-3 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-semibold">Family Meetups</div>
                        <div className="text-xs opacity-70">
                          Schedule and track meetups
                        </div>
                      </div>
                    </Button>
                  </Link>

                  <Link to="/family-mapping">
                    <Button
                      variant="outline"
                      className="w-full h-12 border-accent hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Network className="mr-3 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-semibold">Member Mapping</div>
                        <div className="text-xs opacity-70">
                          Assign members to families
                        </div>
                      </div>
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/professions">
                    <Button
                      variant="outline"
                      className="w-full h-12 border-secondary hover:bg-secondary hover:text-secondary-foreground transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Briefcase className="mr-3 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-semibold">Manage Professions</div>
                        <div className="text-xs opacity-70">
                          Define profession categories
                        </div>
                      </div>
                    </Button>
                  </Link>

                  <Link to="/locations">
                    <Button
                      variant="outline"
                      className="w-full h-12 border-accent hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <MapPin className="mr-3 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-semibold">Manage Locations</div>
                        <div className="text-xs opacity-70">
                          Set regional coverage areas
                        </div>
                      </div>
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="pt-2 border-t border-border">
              <Link to="/overview">
                <Button
                  variant="outline"
                  className="w-full h-10 border-brand-gradient hover:bg-brand-gradient hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Detailed Overview
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="shadow-brand">
          <CardHeader>
            <CardTitle className="text-brand-gradient">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">System Status</span>
                <Badge className="bg-green-100 text-green-800">
                  <Activity className="mr-1 h-3 w-3" />
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database</span>
                <Badge className="bg-green-100 text-green-800">
                  <Activity className="mr-1 h-3 w-3" />
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">GraphQL API</span>
                <Badge className="bg-green-100 text-green-800">
                  <Activity className="mr-1 h-3 w-3" />
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Members Status</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {stats?.activeMembers || 0} Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Updated</span>
                <span className="text-xs text-muted-foreground flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  Just now
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Members */}
        <Card className="shadow-brand">
          <CardHeader>
            <CardTitle className="text-brand-gradient">
              Recent Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMembers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="h-12 w-12 bg-brand-gradient rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Users className="text-white text-xl" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    No members found
                  </p>
                  <Link to="/members">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Add First Member
                    </Button>
                  </Link>
                </div>
              ) : (
                recentMembers.map((member: Member) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-brand-gradient rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      {getInitials(member.full_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {member.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.family?.name} • {member.profession?.name}
                      </p>
                    </div>
                    <Badge
                      className={`text-xs ${getStatusColor(
                        member.status?.name || "Unknown",
                      )}`}
                    >
                      {member.status?.name || "Unknown"}
                    </Badge>
                  </div>
                ))
              )}
              {recentMembers.length > 0 && (
                <Link to="/members">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    View All Members
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {isFullAdmin && <RecentActivitiesWidget limit={5} />}
    </div>
  );
};

export default Dashboard;
