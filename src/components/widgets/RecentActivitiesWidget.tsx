import React from "react";
import { useQuery } from "@apollo/client/react";
import { GET_RECENT_ACTIVITIES } from "@/graphql/operations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Skeleton from "@/components/ui/skeleton";
import { Activity, User, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentActivitiesWidgetProps {
  limit?: number;
}

const RecentActivitiesWidget: React.FC<RecentActivitiesWidgetProps> = ({
  limit = 5,
}) => {
  const { data, loading, error } = useQuery(GET_RECENT_ACTIVITIES, {
    variables: { limit },
    fetchPolicy: "cache-and-network",
  });

  const activities = (data as any)?.recentActivities || [];

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>Unable to load recent activities</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center text-gray-500">
            <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No recent activities</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity: any) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                    {getActionIcon(activity.action)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge
                      variant={getActionBadgeVariant(activity.action)}
                      className="text-xs"
                    >
                      {formatAction(activity.action)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {activity.entity_type}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-900 truncate">
                    {activity.description}
                  </p>

                  <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      <span>
                        {activity.user?.member?.full_name ||
                          activity.user?.phone ||
                          "Unknown"}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {formatDistanceToNow(new Date(activity.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivitiesWidget;
