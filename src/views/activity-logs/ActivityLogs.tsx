import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_ACTIVITIES } from "@/graphql/operations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Skeleton from "@/components/ui/skeleton";
import {
  Activity,
  Filter,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { GetActivitiesQuery } from "@/generated/graphql";

type ActivityLogsProps = Record<string, never>;

const ActivityLogs: React.FC<ActivityLogsProps> = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState({
    action: "all",
    entity_type: "all",
    search: "",
  });

  const { data, loading, error, refetch } = useQuery(GET_ACTIVITIES, {
    variables: {
      filter: {
        action: filters.action === "all" ? undefined : filters.action,
        entity_type:
          filters.entity_type === "all" ? undefined : filters.entity_type,
      },
      pagination: {
        page: currentPage,
        limit: pageSize,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const activities = (data as GetActivitiesQuery)?.activities?.activities || [];
  const totalPages = (data as GetActivitiesQuery)?.activities?.totalPages || 0;
  const total = (data as GetActivitiesQuery)?.activities?.total || 0;

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    refetch();
  };

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("CREATE")) return "default";
    if (action.includes("UPDATE")) return "secondary";
    if (action.includes("DELETE")) return "destructive";
    if (action.includes("LOGIN")) return "outline";
    if (action.includes("LOGOUT")) return "outline";
    return "default";
  };

  const getActionIcon = (action: string) => {
    if (action.includes("CREATE")) return "➕";
    if (action.includes("UPDATE")) return "✏️";
    if (action.includes("DELETE")) return "🗑️";
    if (action.includes("LOGIN")) return "🔑";
    if (action.includes("LOGOUT")) return "🚪";
    return "📝";
  };

  const formatAction = (action: string) => {
    return action
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
            <p className="text-gray-600 mt-2">
              Track all user activities in the system
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
            <p className="text-gray-600 mt-2">
              Track all user activities in the system
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading activity logs</p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-600 mt-2">
            Track all user activities in the system
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Action Type
              </label>
              <Select
                value={filters.action}
                onValueChange={(value) => handleFilterChange("action", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  <SelectItem value="CREATE_MEMBER">Create Member</SelectItem>
                  <SelectItem value="UPDATE_MEMBER">Update Member</SelectItem>
                  <SelectItem value="DELETE_MEMBER">Delete Member</SelectItem>
                  <SelectItem value="CREATE_FAMILY">Create Family</SelectItem>
                  <SelectItem value="UPDATE_FAMILY">Update Family</SelectItem>
                  <SelectItem value="DELETE_FAMILY">Delete Family</SelectItem>
                  <SelectItem value="LOGIN">Login</SelectItem>
                  <SelectItem value="LOGOUT">Logout</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Entity Type
              </label>
              <Select
                value={filters.entity_type}
                onValueChange={(value) =>
                  handleFilterChange("entity_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All entities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All entities</SelectItem>
                  <SelectItem value="MEMBER">Member</SelectItem>
                  <SelectItem value="FAMILY">Family</SelectItem>
                  <SelectItem value="PROFESSION">Profession</SelectItem>
                  <SelectItem value="LOCATION">Location</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Page Size
              </label>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => setPageSize(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Activities
                </p>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Current Page
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentPage}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pages</p>
                <p className="text-2xl font-bold text-gray-900">{totalPages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {activities.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No activities found</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          activities.map((activity) => (
            <Card
              key={activity.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg">
                        {getActionIcon(activity.action)}
                      </span>
                      <Badge variant={getActionBadgeVariant(activity.action)}>
                        {formatAction(activity.action)}
                      </Badge>
                      <Badge variant="outline">{activity.entity_type}</Badge>
                    </div>

                    <p className="text-gray-900 font-medium mb-2">
                      {activity.description}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>
                          {activity.user?.member?.full_name ||
                            activity.user?.phone ||
                            "Unknown User"}
                        </span>
                      </div>

                      {activity.user?.member && (
                        <div className="flex items-center">
                          <span className="mr-1">👤</span>
                          <span>{activity.user.member.full_name}</span>
                        </div>
                      )}

                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {formatDistanceToNow(new Date(activity.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>

                      {activity.ip_address &&
                        activity.ip_address !== "unknown" && (
                          <div className="flex items-center">
                            <span className="mr-1">🌐</span>
                            <span>{activity.ip_address}</span>
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="text-right text-sm text-gray-500">
                    <p>{new Date(activity.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, total)} of {total} activities
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActivityLogs;
