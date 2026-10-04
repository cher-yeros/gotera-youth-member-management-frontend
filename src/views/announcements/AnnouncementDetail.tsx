import React from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { ArrowLeft, CheckCircle2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GET_ANNOUNCEMENT, MARK_ANNOUNCEMENT_SEEN } from "@/graphql/operations";
import {
  formatAnnouncementDate,
  formatAnnouncementTargets,
} from "@/lib/announcements";
import { hasAnyRole, ROLE } from "@/lib/roles";
import { useAuth } from "@/redux/useAuth";

const AnnouncementDetail: React.FC = () => {
  const { id } = useParams();
  const announcementId = Number(id);
  const { user } = useAuth();
  const canManage = hasAnyRole(user, [ROLE.ADMIN, ROLE.MAIN]);

  const { data, loading } = useQuery(GET_ANNOUNCEMENT, {
    variables: { id: announcementId },
    skip: !announcementId,
    fetchPolicy: "cache-and-network",
  });

  const [markSeen, { loading: marking }] = useMutation(MARK_ANNOUNCEMENT_SEEN);

  const item = (data as any)?.announcement;

  if (loading && !item) {
    return (
      <div className="p-8 text-muted-foreground">Loading announcement...</div>
    );
  }

  if (!item) {
    return (
      <div className="space-y-4">
        <Button variant="outline" asChild>
          <Link to="/announcements">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <p>Announcement not found.</p>
      </div>
    );
  }

  const handleMarkSeen = async () => {
    await markSeen({ variables: { id: announcementId } });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" asChild>
          <Link to="/announcements">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to announcements
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          {canManage && (
            <Button variant="secondary" asChild>
              <Link to="/announcements/manage">Manage</Link>
            </Button>
          )}        </div>
      </div>

      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {item.seenByMe ? (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Seen
              </Badge>
            ) : (
              <Badge>Needs confirmation</Badge>
            )}
            <Badge variant="outline">
              {formatAnnouncementTargets(item.targets || [])}
            </Badge>
          </div>
          <CardTitle className="text-2xl leading-tight">{item.title}</CardTitle>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>
              Published{" "}
              {formatAnnouncementDate(item.published_at || item.createdAt)}
            </span>
            {item.creator?.full_name && (
              <span>By {item.creator.full_name}</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="whitespace-pre-wrap text-base leading-relaxed">
            {item.body}
          </div>

          {item.seenByMe ? (
            <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              You confirmed this on {formatAnnouncementDate(item.seenAt)}.
            </div>
          ) : (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
              <p className="text-sm">
                Please confirm that you have read this announcement.
              </p>
              <Button onClick={handleMarkSeen} disabled={marking}>
                <Eye className="h-4 w-4 mr-2" />
                {marking ? "Saving..." : "I have seen this"}
              </Button>
            </div>
          )}

          {canManage &&
            typeof item.seenCount === "number" &&
            typeof item.expectedCount === "number" && (
              <p className="text-sm text-muted-foreground">
                Read receipts: {item.seenCount} / {item.expectedCount} seen.{" "}
                <Link
                  className="underline underline-offset-2"
                  to="/announcements/manage"
                >
                  View in Manage
                </Link>
              </p>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementDetail;
