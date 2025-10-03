import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingCard from "@/components/ui/loading-card";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useGetFamilyMembers, useGetFamilyStats } from "@/hooks/useGraphQL";
import { useAuth } from "@/redux/useAuth";
import type { Member } from "@/types/graphql";
import {
  Briefcase,
  Home,
  MapPin,
  UserCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const FamilyLeaderDashboard = () => {
  const { user } = useAuth();
  const familyId = user?.member?.family?.id;

  // Fetch family-specific data
  const { data: familyData, loading: familyLoading } = useGetFamilyMembers(
    familyId || 0
  );
  const { loading: statsLoading } = useGetFamilyStats(
    familyId || 0
  );

  const family = familyData?.family;
  const members = family?.members || [];
  const isLoading = familyLoading || statsLoading;

  // Calculate family statistics
  const totalMembers = members.length;
  const activeMembers = members.filter(
    (member: Member) => member.status?.name === "Active"
  ).length;
  const inactiveMembers = members.filter(
    (member: Member) => member.status?.name === "Inactive"
  ).length;

  // Get unique professions and locations
  const professions = [
    ...new Set(
      members.map((member: Member) => member.profession?.name).filter(Boolean)
    ),
  ];
  const locations = [
    ...new Set(members.map((member: Member) => member.location?.name).filter(Boolean)),
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
        return "bg-gray-100 text-gray-800";
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-brand-glow transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Total Members
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              {activeMembers} active members
            </p>
          </CardContent>
        </Card>

        <Card className="hover-brand-glow transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Active Members
              </CardTitle>
              <UserCheck className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{activeMembers}</div>
            <p className="text-xs text-muted-foreground">
              {inactiveMembers} inactive
            </p>
          </CardContent>
        </Card>

        <Card className="hover-brand-glow transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Professions</CardTitle>
              <Briefcase className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{professions.length}</div>
            <p className="text-xs text-muted-foreground">
              Different professions
            </p>
          </CardContent>
        </Card>

        <Card className="hover-brand-glow transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Locations</CardTitle>
              <MapPin className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{locations.length}</div>
            <p className="text-xs text-muted-foreground">Covered locations</p>
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
                          members.filter((m: Member) => m.location?.name === location)
                            .length
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
