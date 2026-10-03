import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Archive,
  ArrowLeft,
  Eye,
  Megaphone,
  Plus,
  Send,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ThemeToggle from "@/components/ui/theme-toggle";
import {
  ARCHIVE_ANNOUNCEMENT,
  CREATE_ANNOUNCEMENT,
  GET_ANNOUNCEMENT_READS,
  GET_MANAGED_ANNOUNCEMENTS,
  PUBLISH_ANNOUNCEMENT,
} from "@/graphql/operations";
import {
  ANNOUNCEMENT_STATUS,
  ANNOUNCEMENT_STATUS_LABELS,
  ANNOUNCEMENT_TARGET_ROLES,
  ANNOUNCEMENT_TARGET_TYPE,
  announcementStatusBadgeClass,
  formatAnnouncementDate,
  formatAnnouncementTargets,
} from "@/lib/announcements";
import { ROLE_LABELS } from "@/lib/roles";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "DRAFT" | "PUBLISHED" | "ARCHIVED";

const ManageAnnouncements: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [everyone, setEveryone] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [receiptId, setReceiptId] = useState<number | null>(null);

  const filter = useMemo(() => {
    const f: { status?: string; search?: string } = {};
    if (statusFilter !== "all") f.status = statusFilter;
    if (search.trim()) f.search = search.trim();
    return f;
  }, [statusFilter, search]);

  const { data, loading } = useQuery(GET_MANAGED_ANNOUNCEMENTS, {
    variables: {
      filter,
      pagination: { page, limit: 20 },
    },
    fetchPolicy: "cache-and-network",
  });

  const { data: readsData, loading: readsLoading } = useQuery(
    GET_ANNOUNCEMENT_READS,
    {
      variables: { announcementId: receiptId },
      skip: !receiptId,
      fetchPolicy: "cache-and-network",
    },
  );

  const [createAnnouncement, { loading: creating }] =
    useMutation(CREATE_ANNOUNCEMENT);
  const [publishAnnouncement, { loading: publishing }] =
    useMutation(PUBLISH_ANNOUNCEMENT);
  const [archiveAnnouncement, { loading: archiving }] =
    useMutation(ARCHIVE_ANNOUNCEMENT);

  const payload = (data as any)?.managedAnnouncements;
  const items = payload?.items || [];
  const totalPages = payload?.totalPages || 0;
  const reads = (readsData as any)?.announcementReads;

  const toggleRole = (role: string) => {
    setEveryone(false);
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const resetForm = () => {
    setTitle("");
    setBody("");
    setEveryone(false);
    setSelectedRoles([]);
    setFormError(null);
    setShowCreate(false);
  };

  const buildTargets = () => {
    if (everyone) {
      return [{ target_type: ANNOUNCEMENT_TARGET_TYPE.ALL, target_value: "" }];
    }
    return selectedRoles.map((role) => ({
      target_type: ANNOUNCEMENT_TARGET_TYPE.ROLE,
      target_value: role,
    }));
  };

  const handleCreate = async (publish: boolean) => {
    setFormError(null);
    if (!title.trim() || !body.trim()) {
      setFormError("Title and body are required.");
      return;
    }
    if (!everyone && selectedRoles.length === 0) {
      setFormError("Select Everyone or at least one role group.");
      return;
    }

    try {
      await createAnnouncement({
        variables: {
          input: {
            title: title.trim(),
            body: body.trim(),
            targets: buildTargets(),
            publish,
          },
        },
      });
      resetForm();
    } catch (err: any) {
      setFormError(err?.message || "Failed to create announcement");
    }
  };

  const handlePublish = async (id: number) => {
    await publishAnnouncement({ variables: { id } });
  };

  const handleArchive = async (id: number) => {
    await archiveAnnouncement({ variables: { id } });
    if (receiptId === id) setReceiptId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <Link to="/announcements">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Feed
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Megaphone className="h-6 w-6" />
            Manage Announcements
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Publish to role groups or everyone, and track who has seen them
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowCreate((v) => !v)}>
            <Plus className="h-4 w-4 mr-2" />
            {showCreate ? "Close form" : "New announcement"}
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create announcement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Announcement title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Body</label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write the announcement..."
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Audience</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={everyone ? "default" : "outline"}
                  onClick={() => {
                    setEveryone(true);
                    setSelectedRoles([]);
                  }}
                >
                  Everyone
                </Button>
                {ANNOUNCEMENT_TARGET_ROLES.map((role) => (
                  <Button
                    key={role}
                    type="button"
                    size="sm"
                    variant={
                      !everyone && selectedRoles.includes(role)
                        ? "default"
                        : "outline"
                    }
                    onClick={() => toggleRole(role)}
                  >
                    {ROLE_LABELS[role]}
                  </Button>
                ))}
              </div>
            </div>
            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => handleCreate(true)} disabled={creating}>
                <Send className="h-4 w-4 mr-2" />
                {creating ? "Publishing..." : "Publish now"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleCreate(false)}
                disabled={creating}
              >
                Save as draft
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search announcements..."
          className="sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {(["all", "PUBLISHED", "DRAFT", "ARCHIVED"] as StatusFilter[]).map(
            (key) => (
              <Button
                key={key}
                size="sm"
                variant={statusFilter === key ? "default" : "outline"}
                onClick={() => {
                  setStatusFilter(key);
                  setPage(1);
                }}
              >
                {key === "all" ? "All" : ANNOUNCEMENT_STATUS_LABELS[key]}
              </Button>
            ),
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-3">
          {loading && items.length === 0 ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : items.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No announcements match this filter.
              </CardContent>
            </Card>
          ) : (
            items.map((item: any) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <CardTitle className="text-lg leading-snug">
                        <Link
                          to={`/announcements/${item.id}`}
                          className="hover:underline"
                        >
                          {item.title}
                        </Link>
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          className={cn(
                            announcementStatusBadgeClass(item.status),
                          )}
                        >
                          {ANNOUNCEMENT_STATUS_LABELS[item.status] ||
                            item.status}
                        </Badge>
                        <Badge variant="outline">
                          {formatAnnouncementTargets(item.targets || [])}
                        </Badge>
                      </div>
                    </div>
                    {typeof item.seenCount === "number" &&
                      typeof item.expectedCount === "number" &&
                      item.status === ANNOUNCEMENT_STATUS.PUBLISHED && (
                        <Badge variant="secondary" className="shrink-0 gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {item.seenCount}/{item.expectedCount}
                        </Badge>
                      )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.body}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatAnnouncementDate(
                      item.published_at || item.createdAt,
                    )}
                    {item.creator?.full_name
                      ? ` · ${item.creator.full_name}`
                      : ""}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.status === ANNOUNCEMENT_STATUS.PUBLISHED && (
                      <Button
                        size="sm"
                        variant={receiptId === item.id ? "default" : "outline"}
                        onClick={() =>
                          setReceiptId((prev) =>
                            prev === item.id ? null : item.id,
                          )
                        }
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Who has seen
                      </Button>
                    )}
                    {item.status === ANNOUNCEMENT_STATUS.DRAFT && (
                      <Button
                        size="sm"
                        onClick={() => handlePublish(item.id)}
                        disabled={publishing}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Publish
                      </Button>
                    )}
                    {item.status !== ANNOUNCEMENT_STATUS.ARCHIVED && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleArchive(item.id)}
                        disabled={archiving}
                      >
                        <Archive className="h-4 w-4 mr-1" />
                        Archive
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
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

        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Read receipts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!receiptId ? (
                <p className="text-sm text-muted-foreground">
                  Select “Who has seen” on a published announcement to view
                  confirmations.
                </p>
              ) : readsLoading && !reads ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : !reads ? (
                <p className="text-sm text-muted-foreground">
                  Could not load receipts.
                </p>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm font-medium">
                    {reads.seenCount} / {reads.expectedCount} have confirmed
                  </p>
                  {reads.readers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No one has confirmed yet.
                    </p>
                  ) : (
                    <ul className="space-y-2 max-h-[28rem] overflow-y-auto">
                      {reads.readers.map((reader: any) => (
                        <li
                          key={reader.id}
                          className="rounded-md border px-3 py-2 text-sm"
                        >
                          <div className="font-medium">
                            {reader.member?.full_name ||
                              `Member #${reader.member_id}`}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatAnnouncementDate(reader.read_at)}
                            {reader.member?.contact_no
                              ? ` · ${reader.member.contact_no}`
                              : ""}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManageAnnouncements;
