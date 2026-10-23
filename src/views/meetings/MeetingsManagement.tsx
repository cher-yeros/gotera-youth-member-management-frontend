import React, { useCallback, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Edit,
  ImagePlus,
  ListOrdered,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
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
  CREATE_AGENDA,
  CREATE_MEETING,
  DELETE_AGENDA,
  DELETE_MEETING,
  GET_AGENDAS_BY_MEETING,
  GET_MEETINGS,
  UPDATE_AGENDA,
  UPDATE_MEETING,
} from "@/graphql/operations";
import { resolveMediaUrl } from "@/lib/apiOrigin";
import { uploadPhoto } from "@/lib/uploadPhoto";
import { cn } from "@/lib/utils";

interface AgendaItem {
  id: number;
  meeting_id: number;
  title: string;
  body?: string | null;
  sort_order: number;
}

interface MeetingItem {
  id: number;
  title: string;
  description?: string | null;
  meeting_at: string;
  location?: string | null;
  notes?: string | null;
  minutes_screenshot_urls: string[];
  agendas?: AgendaItem[];
}

function parseAppDate(value: string | Date | null | undefined): Date | null {
  if (value == null || value === "") return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const trimmed = value.trim();
  if (/[zZ]|[+-]\d{2}:?\d{2}$|\.\d{1,3}/.test(trimmed)) {
    const d = new Date(trimmed);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const localMatch =
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(
      trimmed,
    );
  if (localMatch) {
    const d = new Date(
      Number(localMatch[1]),
      Number(localMatch[2]) - 1,
      Number(localMatch[3]),
      Number(localMatch[4] || 0),
      Number(localMatch[5] || 0),
      Number(localMatch[6] || 0),
    );
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(trimmed);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatAppDate(
  value: string | Date | null | undefined,
  pattern: string,
  fallback = "—",
) {
  const d = parseAppDate(value);
  if (!d) return fallback;
  return format(d, pattern);
}

function toDatetimeLocalValue(iso: string | Date) {
  const d = parseAppDate(iso);
  if (!d) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocalValue(value: string) {
  const d = parseAppDate(value);
  if (!d) throw new Error("Invalid date and time");
  return d.toISOString();
}

const emptyForm = {
  title: "",
  description: "",
  meeting_at: "",
  location: "",
  notes: "",
  minutes_screenshot_urls: [] as string[],
};

const emptyAgendaForm = {
  title: "",
  body: "",
  sort_order: "",
};

const MeetingsManagement: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MeetingItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [toDelete, setToDelete] = useState<MeetingItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [agendaDialogOpen, setAgendaDialogOpen] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState<AgendaItem | null>(null);
  const [agendaForm, setAgendaForm] = useState(emptyAgendaForm);
  const [agendaToDelete, setAgendaToDelete] = useState<AgendaItem | null>(null);

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

  const { data: agendasData, refetch: refetchAgendas } = useQuery(
    GET_AGENDAS_BY_MEETING,
    {
      variables: { meetingId: selectedMeetingId },
      skip: !selectedMeetingId,
      fetchPolicy: "cache-and-network",
    },
  );

  const [createMeeting, { loading: creating }] = useMutation(CREATE_MEETING);
  const [updateMeeting, { loading: updating }] = useMutation(UPDATE_MEETING);
  const [deleteMeeting, { loading: deleting }] = useMutation(DELETE_MEETING);
  const [createAgenda, { loading: creatingAgenda }] =
    useMutation(CREATE_AGENDA);
  const [updateAgenda, { loading: updatingAgenda }] =
    useMutation(UPDATE_AGENDA);
  const [deleteAgenda, { loading: deletingAgenda }] =
    useMutation(DELETE_AGENDA);

  const payload = (data as any)?.meetings;
  const meetings: MeetingItem[] = payload?.items || [];
  const total = payload?.total || 0;
  const agendas: AgendaItem[] = (agendasData as any)?.agendasByMeeting || [];
  const selectedMeeting =
    meetings.find((m) => m.id === selectedMeetingId) || null;

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

    let meetingAtIso: string;
    try {
      meetingAtIso = fromDatetimeLocalValue(form.meeting_at);
    } catch {
      toast.error("Invalid date and time");
      return;
    }

    const input = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      meeting_at: meetingAtIso,
      location: form.location.trim() || null,
      notes: form.notes.trim() || null,
      minutes_screenshot_urls: form.minutes_screenshot_urls,
    };

    try {
      if (editing) {
        await updateMeeting({ variables: { id: editing.id, input } });
        toast.success("Meeting updated");
      } else {
        const result = await createMeeting({ variables: { input } });
        const created = (result.data as any)?.createMeeting;
        if (created?.id) setSelectedMeetingId(created.id);
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
      if (selectedMeetingId === toDelete.id) setSelectedMeetingId(null);
      toast.success("Meeting deleted");
      setToDelete(null);
      await refetch();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete meeting");
    }
  };

  const openCreateAgenda = () => {
    if (!selectedMeetingId) {
      toast.error("Select a meeting first");
      return;
    }
    setEditingAgenda(null);
    setAgendaForm(emptyAgendaForm);
    setAgendaDialogOpen(true);
  };

  const openEditAgenda = (agenda: AgendaItem) => {
    setEditingAgenda(agenda);
    setAgendaForm({
      title: agenda.title,
      body: agenda.body || "",
      sort_order: String(agenda.sort_order),
    });
    setAgendaDialogOpen(true);
  };

  const handleSaveAgenda = async () => {
    if (!selectedMeetingId) return;
    if (!agendaForm.title.trim()) {
      toast.error("Agenda title is required");
      return;
    }

    try {
      if (editingAgenda) {
        await updateAgenda({
          variables: {
            id: editingAgenda.id,
            input: {
              title: agendaForm.title.trim(),
              body: agendaForm.body.trim() || null,
              sort_order: agendaForm.sort_order
                ? Number(agendaForm.sort_order)
                : editingAgenda.sort_order,
            },
          },
        });
        toast.success("Agenda updated");
      } else {
        await createAgenda({
          variables: {
            input: {
              meeting_id: selectedMeetingId,
              title: agendaForm.title.trim(),
              body: agendaForm.body.trim() || null,
              sort_order: agendaForm.sort_order
                ? Number(agendaForm.sort_order)
                : undefined,
            },
          },
        });
        toast.success("Agenda added");
      }
      setAgendaDialogOpen(false);
      await refetchAgendas();
      await refetch();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save agenda");
    }
  };

  const confirmDeleteAgenda = async () => {
    if (!agendaToDelete) return;
    try {
      await deleteAgenda({ variables: { id: agendaToDelete.id } });
      toast.success("Agenda deleted");
      setAgendaToDelete(null);
      await refetchAgendas();
      await refetch();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete agenda");
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
        subtitle="Record meetings, agendas, and minutes screenshots"
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Meeting
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(280px,380px)]">
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
                    className={cn(
                      "rounded-lg border p-4 space-y-3 cursor-pointer transition-colors hover:bg-muted/40",
                      selectedMeetingId === meeting.id &&
                        "border-sky-500 bg-sky-50/60",
                    )}
                    onClick={() => setSelectedMeetingId(meeting.id)}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <h3 className="font-semibold">{meeting.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatAppDate(
                            meeting.meeting_at,
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
                        <p className="text-xs text-muted-foreground">
                          {(meeting.agendas?.length ??
                            (selectedMeetingId === meeting.id
                              ? agendas.length
                              : 0)) ||
                            0}{" "}
                          agenda item
                          {(meeting.agendas?.length ?? 0) === 1 ? "" : "s"}
                        </p>
                      </div>
                      <div
                        className="flex gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
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
                            onClick={(e) => e.stopPropagation()}
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

        <Card className="h-fit lg:sticky lg:top-4">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ListOrdered className="h-4 w-4" />
                Agendas
                {selectedMeeting ? (
                  <span className="font-normal text-muted-foreground">
                    · {selectedMeeting.title}
                  </span>
                ) : null}
              </CardTitle>
              <Button
                size="sm"
                onClick={openCreateAgenda}
                disabled={!selectedMeetingId}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!selectedMeetingId ? (
              <p className="text-sm text-muted-foreground">
                Select a meeting to view and edit its agendas.
              </p>
            ) : agendas.length === 0 ? (
              <ListEmptyState
                title="No agendas yet"
                description="Add agenda items for this meeting."
              />
            ) : (
              <div className="space-y-2">
                {agendas.map((agenda) => (
                  <div
                    key={agenda.id}
                    className="flex items-start justify-between gap-3 rounded-md border px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">
                          #{agenda.sort_order}
                        </Badge>
                        <span className="font-medium">{agenda.title}</span>
                      </div>
                      {agenda.body && (
                        <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                          {agenda.body}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditAgenda(agenda)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setAgendaToDelete(agenda)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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

      <Dialog open={agendaDialogOpen} onOpenChange={setAgendaDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingAgenda ? "Edit agenda" : "Add agenda"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="agenda-title">Title</Label>
              <Input
                id="agenda-title"
                value={agendaForm.title}
                onChange={(e) =>
                  setAgendaForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agenda-order">Sort order</Label>
              <Input
                id="agenda-order"
                type="number"
                value={agendaForm.sort_order}
                onChange={(e) =>
                  setAgendaForm((f) => ({ ...f, sort_order: e.target.value }))
                }
                placeholder="Auto if empty"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agenda-body">Details</Label>
              <Textarea
                id="agenda-body"
                rows={4}
                value={agendaForm.body}
                onChange={(e) =>
                  setAgendaForm((f) => ({ ...f, body: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAgendaDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAgenda}
              disabled={creatingAgenda || updatingAgenda}
            >
              {editingAgenda ? "Save" : "Add"}
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
              This will remove “{toDelete?.title}” and its agendas.
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

      <AlertDialog
        open={!!agendaToDelete}
        onOpenChange={(open) => !open && setAgendaToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete agenda?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove “{agendaToDelete?.title}”.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAgenda}
              disabled={deletingAgenda}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MeetingsManagement;
