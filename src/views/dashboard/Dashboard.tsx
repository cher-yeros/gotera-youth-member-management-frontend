import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ui/theme-toggle";
import {
  Briefcase,
  MapPin,
  Users,
  UserCheck,
  Home,
  TrendingUp,
  Activity,
  Clock,
} from "lucide-react";
import { useGetOverviewStats, useGetRecentMembers } from "@/hooks/useGraphQL";

const Dashboard = () => {
  // Fetch dashboard data
  const { data: statsData, loading: statsLoading } = useGetOverviewStats();
  const { data: recentMembersData, loading: recentMembersLoading } =
    useGetRecentMembers(3);

  const stats = statsData?.overviewStats;
  const recentMembers = recentMembersData?.recentMembers || [];
  const isLoading = statsLoading || recentMembersLoading;

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-gradient">
              Gotera Youth Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome to Gotera Youth Member Management System
            </p>
          </div>
          <ThemeToggle variant="icon" />
        </div>
        <Card className="shadow-brand">
          <CardContent>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">
                Loading dashboard data...
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
            Gotera Youth Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome to Gotera Youth Member Management System
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
            <div className="text-2xl font-bold">{stats?.totalMembers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeMembers || 0} active members
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
            <p className="text-xs text-muted-foreground">Registered families</p>
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
            <div className="text-2xl font-bold">
              {stats?.totalLocations || 0}
            </div>
            <p className="text-xs text-muted-foreground">Covered locations</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="shadow-brand">
          <CardHeader className="pb-4">
            <CardTitle className="text-brand-gradient text-lg">
              Quick Actions
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Navigate to different management sections
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Link to="/members">
                <Button className="w-full h-12 bg-brand-gradient hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg">
                  <Users className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Manage Members</div>
                    <div className="text-xs opacity-90">Add, edit, and view members</div>
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
                    <div className="text-xs opacity-70">Organize family registrations</div>
                  </div>
                </Button>
              </Link>
              
              <Link to="/professions">
                <Button
                  variant="outline"
                  className="w-full h-12 border-secondary hover:bg-secondary hover:text-secondary-foreground transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Briefcase className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Manage Professions</div>
                    <div className="text-xs opacity-70">Define profession categories</div>
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
                    <div className="text-xs opacity-70">Set regional coverage areas</div>
                  </div>
                </Button>
              </Link>
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
                recentMembers.map((member: any) => (
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
                        member.status?.name || "Unknown"
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
      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">
                  Dashboard loaded successfully
                </p>
                <p className="text-xs text-muted-foreground">
                  Real-time data connected and ready
                </p>
              </div>
              <span className="text-xs text-muted-foreground">Just now</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-secondary rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">
                  {stats?.totalMembers || 0} members registered
                </p>
                <p className="text-xs text-muted-foreground">
                  {stats?.activeMembers || 0} active members
                </p>
              </div>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-accent rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">
                  {stats?.totalFamilies || 0} families registered
                </p>
                <p className="text-xs text-muted-foreground">
                  Across {stats?.totalLocations || 0} locations
                </p>
              </div>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">
                  System performance optimal
                </p>
                <p className="text-xs text-muted-foreground">
                  All services running smoothly
                </p>
              </div>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
