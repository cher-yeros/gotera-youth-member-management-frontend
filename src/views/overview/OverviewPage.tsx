import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ui/theme-toggle";
import {
  Users,
  Briefcase,
  MapPin,
  Home,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import {
  useGetOverviewStats,
  useGetRecentMembers,
  useGetFamilySummaries,
  useGetProfessionSummaries,
  useGetLocationSummaries,
} from "@/hooks/useGraphQL";
import { useNavigate } from "react-router-dom";

const OverviewPage = () => {
  const navigate = useNavigate();

  // Fetch overview data
  const { data: statsData, loading: statsLoading } = useGetOverviewStats();
  const { data: recentMembersData, loading: recentMembersLoading } =
    useGetRecentMembers(5);
  const { data: familySummariesData, loading: familySummariesLoading } =
    useGetFamilySummaries(5);
  const { data: professionSummariesData, loading: professionSummariesLoading } =
    useGetProfessionSummaries(5);
  const { data: locationSummariesData, loading: locationSummariesLoading } =
    useGetLocationSummaries(5);

  const stats = statsData?.overviewStats;
  const recentMembers = recentMembersData?.recentMembers || [];
  const familySummaries = familySummariesData?.familySummaries || [];
  const professionSummaries =
    professionSummariesData?.professionSummaries || [];
  const locationSummaries = locationSummariesData?.locationSummaries || [];

  const isLoading =
    statsLoading ||
    recentMembersLoading ||
    familySummariesLoading ||
    professionSummariesLoading ||
    locationSummariesLoading;

  const handleNavigateTo = (path: string) => {
    navigate(path);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-gradient">
              Gotera Youth Overview
            </h1>
            <p className="text-muted-foreground">
              Manage families, professions, members, and locations
            </p>
          </div>
          <ThemeToggle variant="icon" />
        </div>
        <Card className="shadow-brand">
          <CardContent>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">
                Loading overview data...
              </p>
            </div>
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
            Gotera Youth Overview
          </h1>
          <p className="text-muted-foreground">
            Manage families, professions, members, and locations
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle variant="icon" />
          <Button
            className="bg-brand-gradient hover:opacity-90 transition-opacity"
            onClick={() => handleNavigateTo("/members")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Member
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-brand-glow transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Members</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{stats?.totalMembers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeMembers || 0} active
            </p>
          </CardContent>
        </Card>

        <Card className="hover-brand-glow transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Families</CardTitle>
              <Home className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">
              {stats?.totalFamilies || 0}
            </div>
            <p className="text-xs text-muted-foreground">Registered</p>
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
            <div className="text-2xl font-bold">
              {stats?.totalProfessions || 0}
            </div>
            <p className="text-xs text-muted-foreground">Types</p>
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
            <div className="text-2xl font-bold">
              {stats?.totalLocations || 0}
            </div>
            <p className="text-xs text-muted-foreground">Covered</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <Card className="shadow-brand">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-brand-gradient text-lg">
                Recent Members
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigateTo("/members")}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMembers.length === 0 ? (
              <div className="text-center py-8">
                <div className="h-12 w-12 bg-brand-gradient rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Users className="text-white text-xl" />
                </div>
                <p className="text-muted-foreground text-sm">
                  No members found
                </p>
              </div>
            ) : (
              recentMembers.map((member: any) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="h-10 w-10 bg-brand-gradient rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials(member.full_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {member.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.family?.name} • {member.profession?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge
                      variant={
                        member.status?.name === "Active"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {member.status?.name || "Unknown"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {member.location?.name || "No location"}
                    </span>
                  </div>
                </div>
              ))
            )}
            <Button
              variant="outline"
              className="w-full border-primary hover:bg-primary hover:text-primary-foreground mt-3"
              onClick={() => handleNavigateTo("/members")}
            >
              View All Members
            </Button>
          </CardContent>
        </Card>

        {/* Families */}
        <Card className="shadow-brand">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-brand-gradient text-lg">
                Families
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigateTo("/families")}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {familySummaries.length === 0 ? (
              <div className="text-center py-8">
                <div className="h-12 w-12 bg-secondary rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Home className="text-white text-xl" />
                </div>
                <p className="text-muted-foreground text-sm">
                  No families found
                </p>
              </div>
            ) : (
              familySummaries.map((family: any) => (
                <div
                  key={family.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center text-white font-semibold">
                      <Home className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {family.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {family.memberCount} members
                      </p>
                    </div>
                  </div>
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                </div>
              ))
            )}
            <Button
              variant="outline"
              className="w-full border-secondary hover:bg-secondary hover:text-secondary-foreground mt-3"
              onClick={() => handleNavigateTo("/families")}
            >
              View All Families
            </Button>
          </CardContent>
        </Card>

        {/* Professions */}
        <Card className="shadow-brand">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-brand-gradient text-lg">
                Professions
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigateTo("/professions")}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {professionSummaries.length === 0 ? (
              <div className="text-center py-8">
                <div className="h-12 w-12 bg-accent rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Briefcase className="text-white text-xl" />
                </div>
                <p className="text-muted-foreground text-sm">
                  No professions found
                </p>
              </div>
            ) : (
              professionSummaries.map((profession: any) => (
                <div
                  key={profession.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="h-10 w-10 bg-accent rounded-full flex items-center justify-center text-white font-semibold">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {profession.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Professional field
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-accent text-accent-foreground text-xs"
                  >
                    {profession.memberCount}
                  </Badge>
                </div>
              ))
            )}
            <Button
              variant="outline"
              className="w-full border-accent hover:bg-accent hover:text-accent-foreground mt-3"
              onClick={() => handleNavigateTo("/professions")}
            >
              View All Professions
            </Button>
          </CardContent>
        </Card>

        {/* Locations */}
        <Card className="shadow-brand">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-brand-gradient text-lg">
                Locations
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigateTo("/locations")}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {locationSummaries.length === 0 ? (
              <div className="text-center py-8">
                <div className="h-12 w-12 bg-primary rounded-full mx-auto mb-3 flex items-center justify-center">
                  <MapPin className="text-white text-xl" />
                </div>
                <p className="text-muted-foreground text-sm">
                  No locations found
                </p>
              </div>
            ) : (
              locationSummaries.map((location: any) => (
                <div
                  key={location.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {location.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Regional location
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {location.memberCount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {location.familyCount} families
                    </p>
                  </div>
                </div>
              ))
            )}
            <Button
              variant="outline"
              className="w-full border-primary hover:bg-primary hover:text-primary-foreground mt-3"
              onClick={() => handleNavigateTo("/locations")}
            >
              View All Locations
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;
