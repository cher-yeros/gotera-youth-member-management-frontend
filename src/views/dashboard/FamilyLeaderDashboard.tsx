import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingCard from "@/components/ui/loading-card";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useGetFamilyMembers, useGetFamilyStats } from "@/hooks/useGraphQL";
import { useAuth } from "@/redux/useAuth";
import type { Member } from "@/types/graphql";
import {
  Activity,
  AlertTriangle,
  Briefcase,
  Home,
  MapPin,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import { Link } from "react-router-dom";

const FamilyLeaderDashboard = () => {
  const { user } = useAuth();
  const familyId = user?.member?.family?.id;

  // Fetch family-specific data
  const { data: familyData, loading: familyLoading } = useGetFamilyMembers(
    familyId || 0
  );
  const { loading: statsLoading } = useGetFamilyStats(familyId || 0);

  const family = familyData?.family;
  const members = family?.members || [];
  const isLoading = familyLoading || statsLoading;

  // Calculate family statistics
  const totalMembers = members.length;

  // Status-based statistics
  const activeMembers = members.filter(
    (member: Member) => member.status?.name === "Active"
  ).length;
  const notActiveMembers = members.filter(
    (member: Member) =>
      member.status?.name === "Not Active" || member.status?.name === "Inactive"
  ).length;
  const movedOutMembers = members.filter(
    (member: Member) =>
      member.status?.name === "Moved out" || member.status?.name === "Moved Out"
  ).length;

  // New members (created in the last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newMembers = members.filter((member: Member) => {
    if (!member.createdAt) return false;
    const createdAt = new Date(member.createdAt);
    return createdAt >= thirtyDaysAgo;
  }).length;

  // Location statistics
  const locationAllocated = members.filter(
    (member: Member) => member.location?.id != null
  ).length;
  const locationUnallocated = members.filter(
    (member: Member) => member.location?.id == null
  ).length;

  // Profession statistics
  const professionAllocated = members.filter(
    (member: Member) => member.profession?.id != null
  ).length;
  const professionUnallocated = members.filter(
    (member: Member) => member.profession?.id == null
  ).length;

  // Ministry statistics
  const ministryAllocated = members.filter(
    (member: Member) => member.ministries && member.ministries.length > 0
  ).length;
  const ministryUnallocated = members.filter(
    (member: Member) => !member.ministries || member.ministries.length === 0
  ).length;

  // Get unique professions and locations
  const professions = [
    ...new Set(
      members.map((member: Member) => member.profession?.name).filter(Boolean)
    ),
  ];
  const locations = [
    ...new Set(
      members.map((member: Member) => member.location?.name).filter(Boolean)
    ),
  ];

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
      case "Not Active":
        return "bg-gray-100 text-gray-800";
      case "Moved out":
      case "Moved Out":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "family leader":
        return "bg-blue-100 text-blue-800";
      case "member":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-gradient">
              Family Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome to your family management dashboard
            </p>
          </div>
          <ThemeToggle variant="icon" />
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <LoadingCard
              key={index}
              title="Allocation Statistics"
              subtitle="Loading allocation data"
              variant="detailed"
              skeletonLines={3}
            />
          ))}
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingCard
            title="Family Members"
            subtitle="Manage your family members"
            variant="detailed"
            skeletonLines={6}
          />
          <LoadingCard
            title="Family Overview"
            subtitle="Family statistics and information"
            variant="detailed"
            skeletonLines={5}
          />
        </div>
      </div>
    );
  }

  if (!family) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-gradient">
              Family Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome to your family management dashboard
            </p>
          </div>
          <ThemeToggle variant="icon" />
        </div>

        <Card className="shadow-brand">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-16 w-16 bg-brand-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
              <Home className="text-white text-2xl" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Family Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              You are not associated with any family yet. Please contact an
              administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-gradient">
            {family.name} Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome to your family management dashboard
          </p>
        </div>
        <ThemeToggle variant="icon" />
      </div>

      {/* Status Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-brand-glow transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Active Members
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{activeMembers}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card className="hover-brand-glow transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Not Active Members
              </CardTitle>
              <UserX className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{notActiveMembers}</div>
            <p className="text-xs text-muted-foreground">Inactive members</p>
          </CardContent>
        </Card>

        <Card className="hover-brand-glow transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Moved Out</CardTitle>
              <UserX className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{movedOutMembers}</div>
            <p className="text-xs text-muted-foreground">Moved out members</p>
          </CardContent>
        </Card>

        <Card className="hover-brand-glow transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">New Members</CardTitle>
              <UserPlus className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{newMembers}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-semibold">Location Allocated</div>
                    <div className="text-xs opacity-70">
                      Members with location assigned
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold">{locationAllocated}</div>
              </div>

              <div className="flex items-center justify-between p-4 border-2 border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-950/30 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                  <div className="text-left">
                    <div className="font-semibold text-yellow-900 dark:text-yellow-100">
                      Location Unallocated
                    </div>
                    <div className="text-xs opacity-70 text-yellow-800 dark:text-yellow-200">
                      Members without location
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                  {locationUnallocated}
                </div>
              </div>
            </div>
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-semibold">Profession Allocated</div>
                    <div className="text-xs opacity-70">
                      Members with profession assigned
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold">{professionAllocated}</div>
              </div>

              <div className="flex items-center justify-between p-4 border-2 border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-950/30 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                  <div className="text-left">
                    <div className="font-semibold text-yellow-900 dark:text-yellow-100">
                      Profession Unallocated
                    </div>
                    <div className="text-xs opacity-70 text-yellow-800 dark:text-yellow-200">
                      Members without profession
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                  {professionUnallocated}
                </div>
              </div>
            </div>
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <Activity className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-semibold">Ministry Allocated</div>
                    <div className="text-xs opacity-70">
                      Members in ministries
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold">{ministryAllocated}</div>
              </div>

              <div className="flex items-center justify-between p-4 border-2 border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-950/30 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                  <div className="text-left">
                    <div className="font-semibold text-yellow-900 dark:text-yellow-100">
                      Ministry Unallocated
                    </div>
                    <div className="text-xs opacity-70 text-yellow-800 dark:text-yellow-200">
                      Members not in any ministry
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                  {ministryUnallocated}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Family Members */}
        <Card className="shadow-brand">
          <CardHeader className="pb-4">
            <CardTitle className="text-brand-gradient text-lg">
              Family Members
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage your family members
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.length === 0 ? (
                <div className="text-center py-8">
                  <div className="h-12 w-12 bg-brand-gradient rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Users className="text-white text-xl" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    No members found in your family
                  </p>
                </div>
              ) : (
                members.map((member: Member) => (
                  <div
                    key={member.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-10 w-10 bg-brand-gradient rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials(member.full_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {member.full_name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        {member.profession?.name && (
                          <span className="flex items-center">
                            <Briefcase className="mr-1 h-3 w-3" />
                            {member.profession.name}
                          </span>
                        )}
                        {member.location?.name && (
                          <span className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {member.location.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Badge
                        className={`text-xs ${getStatusColor(
                          member.status?.name || "Unknown"
                        )}`}
                      >
                        {member.status?.name || "Unknown"}
                      </Badge>
                      <Badge
                        className={`text-xs ${getRoleColor(
                          member.role?.name || "Unknown"
                        )}`}
                      >
                        {member.role?.name || "Unknown"}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Family Overview */}
        <Card className="shadow-brand">
          <CardHeader>
            <CardTitle className="text-brand-gradient">
              Family Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Family Name</span>
                <span className="text-sm text-muted-foreground">
                  {family.name}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Members</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {totalMembers} Members
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Members</span>
                <Badge className="bg-green-100 text-green-800">
                  {activeMembers} Active
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Professions</span>
                <span className="text-xs text-muted-foreground">
                  {professions.join(", ") || "None"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Locations</span>
                <span className="text-xs text-muted-foreground">
                  {locations.join(", ") || "None"}
                </span>
              </div>

              <div className="pt-2 border-t border-border">
                <Link to="/families/my-family">
                  <Button
                    variant="outline"
                    className="w-full border-brand-gradient hover:bg-brand-gradient hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    View All Family Members
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity - Family specific */}
      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">
            Family Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <Briefcase className="mr-2 h-4 w-4" />
                Family Professions
              </h4>
              <div className="space-y-2">
                {professions.length > 0 ? (
                  professions.map((profession, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded bg-muted/50"
                    >
                      <span className="text-sm">{profession as string}</span>
                      <Badge variant="secondary" className="text-xs">
                        {
                          members.filter(
                            (m: Member) => m.profession?.name === profession
                          ).length
                        }
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No professions recorded
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Family Locations
              </h4>
              <div className="space-y-2">
                {locations.length > 0 ? (
                  locations.map((location, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded bg-muted/50"
                    >
                      <span className="text-sm">{location as string}</span>
                      <Badge variant="secondary" className="text-xs">
                        {
                          members.filter(
                            (m: Member) => m.location?.name === location
                          ).length
                        }
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No locations recorded
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FamilyLeaderDashboard;
