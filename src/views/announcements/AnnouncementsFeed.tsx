import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { Bell, CheckCircle2, Megaphone, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GET_MY_ANNOUNCEMENTS } from "@/graphql/operations";
import {
  formatAnnouncementDate,
  formatAnnouncementTargets,
} from "@/lib/announcements";
import { hasAnyRole, ROLE } from "@/lib/roles";
import { useAuth } from "@/redux/useAuth";
import { cn } from "@/lib/utils";

const AnnouncementsFeed: React.FC = () => {
  const { user } = useAuth();
  const canManage = hasAnyRole(user, [ROLE.ADMIN, ROLE.MAIN]);
  const [page, setPage] = useState(1);

  const { data, loading } = useQuery(GET_MY_ANNOUNCEMENTS, {
    variables: { pagination: { page, limit: 20 } },
    fetchPolicy: "cache-and-network",
  });

  const payload = (data as any)?.myAnnouncements;
  const items = payload?.items || [];
  const totalPages = payload?.totalPages || 0;
  const total = payload?.total ?? items.length;
  const unreadCount = items.filter((a: any) => !a.seenByMe).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Megaphone className="h-6 w-6" />
            Announcements
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {total} announcements
            {unreadCount > 0 ? ` · ${unreadCount} unseen` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canManage && (
            <Button asChild variant="default">
              <Link to="/announcements/manage">
                <Settings2 className="h-4 w-4 mr-2" />
                Manage
              </Link>
            </Button>
          )}
        </div>
      </div>

      {loading && items.length === 0 ? (
        <p className="text-muted-foreground">Loading announcements...</p>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-40" />
            No announcements for you yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item: any) => (
            <Link
              key={item.id}
              to={`/announcements/${item.id}`}
              className="block"
            >
              <Card
                className={cn(
                  "transition-colors hover:border-primary/40",
                  !item.seenByMe && "border-primary/50 bg-primary/5",
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg leading-snug">
                      {item.title}
                    </CardTitle>
                    {item.seenByMe ? (
                      <Badge variant="secondary" className="shrink-0 gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Seen
                      </Badge>
                    ) : (
                      <Badge className="shrink-0">New</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.body}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>{formatAnnouncementTargets(item.targets || [])}</span>
                    <span>
                      {formatAnnouncementDate(
                        item.published_at || item.createdAt,
                      )}
                    </span>
                    {item.creator?.full_name && (
                      <span>By {item.creator.full_name}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsFeed;
