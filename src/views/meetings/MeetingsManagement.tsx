import React, { useCallback, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Edit,
  ImagePlus,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EthiopianDatePicker } from "@/components/ui/ethiopian-date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from "@/components/shared/PageHeader";
import ListLoadingState from "@/components/shared/ListLoadingState";
import ListEmptyState from "@/components/shared/ListEmptyState";
import ListPagination from "@/components/shared/ListPagination";
import InlineSearchRow from "@/components/shared/InlineSearchRow";
import {
  CREATE_MEETING,
  DELETE_MEETING,
  GET_MEETINGS,
  UPDATE_MEETING,
} from "@/graphql/operations";
import { resolveMediaUrl } from "@/lib/apiOrigin";
import { uploadPhoto } from "@/lib/uploadPhoto";

interface MeetingItem {
  id: number;
  title: string;
  description?: string | null;
  meeting_at: string;
  location?: string | null;
  notes?: string | null;
  minutes_screenshot_urls: string[];
}

function toDatetimeLocalValue(iso: string | Date) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocalValue(value: string) {
  return new Date(value).toISOString();
}

const emptyForm = {
  title: "",
  description: "",
  meeting_at: "",
  location: "",
  notes: "",
  minutes_screenshot_urls: [] as string[],
};

const MeetingsManagement: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MeetingItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [toDelete, setToDelete] = useState<MeetingItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filter = useMemo(() => {
    const f: { search?: string } = {};
    if (search.trim()) f.search = search.trim();
    return f;
  }, [search]);

  const { data, loading, refetch } = useQuery(GET_MEETINGS, {
    variables: {
      filter,
      pagination: { page, limit: pageSize },
    },
    fetchPolicy: "cache-and-network",
  });

  const [createMeeting, { loading: creating }] = useMutation(CREATE_MEETING);
  const [updateMeeting, { loading: updating }] = useMutation(UPDATE_MEETING);
  const [deleteMeeting, { loading: deleting }] = useMutation(DELETE_MEETING);

  const payload = (data as any)?.meetings;
  const meetings: MeetingItem[] = payload?.items || [];
  const total = payload?.total || 0;

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      meeting_at: toDatetimeLocalValue(new Date()),
    });
    setDialogOpen(true);
  };

  const openEdit = (meeting: MeetingItem) => {
    setEditing(meeting);
    setForm({
      title: meeting.title,
      description: meeting.description || "",
      meeting_at: toDatetimeLocalValue(meeting.meeting_at),
      location: meeting.location || "",
      notes: meeting.notes || "",
      minutes_screenshot_urls: [...(meeting.minutes_screenshot_urls || [])],
    });
    setDialogOpen(true);
  };

  const handleUploadScreenshots = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }
        const url = await uploadPhoto(file);
        urls.push(url);
      }
      if (urls.length) {
        setForm((f) => ({
          ...f,
          minutes_screenshot_urls: [...f.minutes_screenshot_urls, ...urls],
        }));
        toast.success(
          urls.length === 1
            ? "Screenshot uploaded"
            : `${urls.length} screenshots uploaded`,
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeScreenshot = (url: string) => {
    setForm((f) => ({
      ...f,
      minutes_screenshot_urls: f.minutes_screenshot_urls.filter(
        (u) => u !== url,
      ),
    }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.meeting_at) {
      toast.error("Date and time are required");
      return;
    }

    const input = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      meeting_at: fromDatetimeLocalValue(form.meeting_at),
      location: form.location.trim() || null,
      notes: form.notes.trim() || null,
      minutes_screenshot_urls: form.minutes_screenshot_urls,
    };

    try {
      if (editing) {
        await updateMeeting({ variables: { id: editing.id, input } });
        toast.success("Meeting updated");
      } else {
        await createMeeting({ variables: { input } });
        toast.success("Meeting created");
      }
      setDialogOpen(false);
      await refetch();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save meeting");
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteMeeting({ variables: { id: toDelete.id } });
      toast.success("Meeting deleted");
      setToDelete(null);
      await refetch();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete meeting");
    }
  };

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meetings"
        subtitle="Record meetings and upload minutes screenshots"
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Meeting
          </Button>
        }
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All meetings</CardTitle>
          <div className="pt-2">
            <InlineSearchRow
              value={search}
              onChange={handleSearch}
              placeholder="Search meetings..."
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading && meetings.length === 0 ? (
            <ListLoadingState />
          ) : meetings.length === 0 ? (
            <ListEmptyState
              title="No meetings"
              description="Create a meeting and attach minutes screenshots."
              primaryAction={{ label: "New Meeting", onClick: openCreate }}
            />
          ) : (
            <div className="space-y-3">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="rounded-lg border p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <h3 className="font-semibold">{meeting.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(
                          new Date(meeting.meeting_at),
                          "MMM d, yyyy · h:mm a",
                        )}
                        {meeting.location ? ` · ${meeting.location}` : ""}
                      </p>
                      {meeting.description && (
                        <p className="text-sm line-clamp-2">
                          {meeting.description}
                        </p>
                      )}
                      {meeting.notes && (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {meeting.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(meeting)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setToDelete(meeting)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  {(meeting.minutes_screenshot_urls?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {meeting.minutes_screenshot_urls.map((url) => (
                        <a
                          key={url}
                          href={resolveMediaUrl(url)}
                          target="_blank"
                          rel="noreferrer"
                          className="block h-20 w-20 overflow-hidden rounded-md border"
                        >
                          <img
                            src={resolveMediaUrl(url)}
                            alt="Minutes screenshot"
                            className="h-full w-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <ListPagination
                currentPage={page}
                pageSize={pageSize}
                totalItems={total}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
                itemLabel="meetings"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit meeting" : "New meeting"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="meeting-title">Title</Label>
              <Input
                id="meeting-title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-at">Date & time</Label>
              <EthiopianDatePicker
                id="meeting-at"
                mode="datetime"
                value={form.meeting_at}
                onChange={(value) =>
                  setForm((f) => ({ ...f, meeting_at: value }))
                }
                placeholder="Pick date & time"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="meeting-location"
                  className="pl-9"
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-description">Description</Label>
              <Textarea
                id="meeting-description"
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-notes">Notes</Label>
              <Textarea
                id="meeting-notes"
                rows={3}
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Minutes screenshots</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={(e) => handleUploadScreenshots(e.target.files)}
              />
              <div className="flex flex-wrap gap-2">
                {form.minutes_screenshot_urls.map((url) => (
                  <div
                    key={url}
                    className="relative h-20 w-20 overflow-hidden rounded-md border"
                  >
                    <img
                      src={resolveMediaUrl(url)}
                      alt="Minutes"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
                      onClick={() => removeScreenshot(url)}
                      aria-label="Remove screenshot"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <ImagePlus className="h-4 w-4 mr-1" />
                )}
                Upload screenshots
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={creating || updating}>
              {editing ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete meeting?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove “{toDelete?.title}”.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleting}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MeetingsManagement;
