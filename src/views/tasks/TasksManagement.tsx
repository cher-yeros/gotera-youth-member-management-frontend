import React, { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { CheckCircle2, Edit, Plus, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageHeader from "@/components/shared/PageHeader";
import ListLoadingState from "@/components/shared/ListLoadingState";
import ListEmptyState from "@/components/shared/ListEmptyState";
import ListPagination from "@/components/shared/ListPagination";
import InlineSearchRow from "@/components/shared/InlineSearchRow";
import {
  CREATE_TASK,
  DELETE_TASK,
  GET_TASK_ASSIGNEES,
  GET_TASKS,
  MARK_TASK_DONE,
  UPDATE_TASK,
} from "@/graphql/operations";
import { ROLE_LABELS } from "@/lib/roles";
import { useAuth } from "@/redux/useAuth";
import { cn } from "@/lib/utils";

const TASK_STATUSES = ["OPEN", "IN_PROGRESS", "DONE", "CANCELLED"] as const;
type TaskStatus = (typeof TASK_STATUSES)[number];

interface TaskMember {
  id: number;
  full_name: string;
  contact_no?: string | null;
  role?: { id: number; name: string } | null;
  roles?: { id: number; name: string }[] | null;
}

interface TaskItem {
  id: number;
  title: string;
  description?: string | null;
  status: string;
  due_at?: string | null;
  assigned_to?: number | null;
  created_by: number;
  completed_at?: string | null;
  assignee?: TaskMember | null;
  creator?: TaskMember | null;
}

type TabKey = "mine" | "unassigned" | "all";

const TABS: { key: TabKey; label: string }[] = [
  { key: "mine", label: "My tasks" },
  { key: "unassigned", label: "Unassigned" },
  { key: "all", label: "All tasks" },
];

const UNASSIGNED_VALUE = "unassigned";

function statusBadgeClass(status: string) {
  switch (status) {
    case "DONE":
      return "bg-emerald-100 text-emerald-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "IN_PROGRESS":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-sky-100 text-sky-800";
  }
}

function statusLabel(status: string) {
  return status.replace(/_/g, " ");
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

function toDateInputValue(iso: string | Date | null | undefined) {
  const d = parseAppDate(iso);
  if (!d) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function fromDateInputValue(value: string) {
  if (!value.trim()) return null;
  const d = parseAppDate(`${value.trim()}T12:00:00`);
  if (!d) throw new Error("Invalid due date");
  return d.toISOString();
}

function memberRoleLabel(member?: TaskMember | null) {
  const names = new Set<string>();
  if (member?.role?.name) names.add(member.role.name);
  for (const role of member?.roles || []) {
    if (role?.name) names.add(role.name);
  }
  if (names.has("ADMIN")) return ROLE_LABELS.ADMIN;
  if (names.has("MAIN")) return ROLE_LABELS.MAIN;
  return null;
}

const emptyForm = {
  title: "",
  description: "",
  due_at: "",
  assigned_to: "",
  status: "OPEN" as TaskStatus,
};

const TasksManagement: React.FC = () => {
  const { user } = useAuth();
  const myMemberId = user?.member?.id;

  const [tab, setTab] = useState<TabKey>("mine");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TaskItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [toDelete, setToDelete] = useState<TaskItem | null>(null);

  const filter = useMemo(() => {
    const f: {
      search?: string;
      status?: string;
      assigned_to_me?: boolean;
      unassigned?: boolean;
      openOnly?: boolean;
    } = {};
    if (search.trim()) f.search = search.trim();
    if (statusFilter !== "all") f.status = statusFilter;
    if (tab === "mine") {
      f.assigned_to_me = true;
      if (statusFilter === "all") f.openOnly = true;
    } else if (tab === "unassigned") {
      f.unassigned = true;
      if (statusFilter === "all") f.openOnly = true;
    }
    return f;
  }, [search, statusFilter, tab]);

  const { data, loading, refetch } = useQuery(GET_TASKS, {
    variables: {
      filter,
      pagination: { page, limit: pageSize },
    },
    fetchPolicy: "cache-and-network",
  });

  const { data: assigneesData } = useQuery(GET_TASK_ASSIGNEES, {
    fetchPolicy: "cache-and-network",
  });

  const [createTask, { loading: creating }] = useMutation(CREATE_TASK);
  const [updateTask, { loading: updating }] = useMutation(UPDATE_TASK);
  const [markTaskDone, { loading: markingDone }] = useMutation(MARK_TASK_DONE);
  const [deleteTask, { loading: deleting }] = useMutation(DELETE_TASK);

  const payload = (data as any)?.tasks;
  const tasks: TaskItem[] = payload?.items || [];
  const total = payload?.total || 0;
  const assignees: TaskMember[] = (assigneesData as any)?.taskAssignees || [];
  const saving = creating || updating;

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      assigned_to:
        tab === "unassigned"
          ? UNASSIGNED_VALUE
          : myMemberId
            ? String(myMemberId)
            : UNASSIGNED_VALUE,
    });
    setDialogOpen(true);
  };

  const openEdit = (task: TaskItem) => {
    setEditing(task);
    setForm({
      title: task.title,
      description: task.description || "",
      due_at: toDateInputValue(task.due_at),
      assigned_to: task.assigned_to
        ? String(task.assigned_to)
        : UNASSIGNED_VALUE,
      status: (TASK_STATUSES.includes(task.status as TaskStatus)
        ? task.status
        : "OPEN") as TaskStatus,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    const assignedTo =
      !form.assigned_to || form.assigned_to === UNASSIGNED_VALUE
        ? null
        : Number(form.assigned_to);
    if (assignedTo != null && !assignedTo) {
      toast.error("Select an assignee");
      return;
    }

    let dueAt: string | null = null;
    try {
      dueAt = fromDateInputValue(form.due_at);
    } catch {
      toast.error("Invalid due date");
      return;
    }

    const input = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      due_at: dueAt,
      assigned_to: assignedTo,
      status: form.status,
    };

    try {
      if (editing) {
        await updateTask({ variables: { id: editing.id, input } });
        toast.success("Task updated");
      } else {
        await createTask({ variables: { input } });
        toast.success(assignedTo ? "Task assigned" : "Task created");
      }
      setDialogOpen(false);
      await refetch();
    } catch (err: any) {
      toast.error(
        err?.message?.replace("CombinedGraphQLErrors: ", "") ||
          "Failed to save task",
      );
    }
  };

  const handleMarkDone = async (task: TaskItem) => {
    try {
      await markTaskDone({ variables: { id: task.id } });
      toast.success("Task marked done");
      await refetch();
    } catch (err: any) {
      toast.error(
        err?.message?.replace("CombinedGraphQLErrors: ", "") ||
          "Failed to mark done",
      );
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteTask({ variables: { id: toDelete.id } });
      toast.success("Task deleted");
      setToDelete(null);
      await refetch();
    } catch (err: any) {
      toast.error(
        err?.message?.replace("CombinedGraphQLErrors: ", "") ||
          "Failed to delete task",
      );
    }
  };

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        subtitle="Assign work between main leaders and mark it done"
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Button
            key={t.key}
            variant={tab === t.key ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setTab(t.key);
              setPage(1);
            }}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {tab === "mine"
              ? "My tasks"
              : tab === "unassigned"
                ? "Unassigned"
                : "All tasks"}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <div className="min-w-[200px] flex-1">
              <InlineSearchRow
                value={search}
                onChange={handleSearch}
                placeholder="Search tasks..."
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {tab === "all" ? "All statuses" : "Open only"}
                </SelectItem>
                {TASK_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {statusLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading && tasks.length === 0 ? (
            <ListLoadingState />
          ) : tasks.length === 0 ? (
            <ListEmptyState
              title={
                tab === "mine"
                  ? "No tasks assigned to you"
                  : tab === "unassigned"
                    ? "No unassigned tasks"
                    : "No tasks"
              }
              description={
                tab === "unassigned"
                  ? "Create a task without an assignee for someone to pick up."
                  : "Create a task and assign it to a main leader or admin."
              }
              primaryAction={{ label: "New Task", onClick: openCreate }}
            />
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => {
                const isDone = task.status === "DONE";
                const isMine =
                  myMemberId != null && task.assigned_to === myMemberId;
                const isUnassigned = !task.assigned_to;
                return (
                  <div
                    key={task.id}
                    className={cn(
                      "rounded-lg border p-4 space-y-3",
                      isDone && "bg-muted/30",
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={cn(
                              "font-semibold",
                              isDone && "line-through text-muted-foreground",
                            )}
                          >
                            {task.title}
                          </h3>
                          <Badge className={statusBadgeClass(task.status)}>
                            {statusLabel(task.status)}
                          </Badge>
                          {isUnassigned && !isDone && (
                            <Badge variant="outline">Unassigned</Badge>
                          )}
                          {isMine && !isDone && (
                            <Badge variant="outline">Yours</Badge>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-sm line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          To{" "}
                          {task.assignee?.full_name ||
                            (isUnassigned ? "Unassigned" : "—")}
                          {memberRoleLabel(task.assignee)
                            ? ` (${memberRoleLabel(task.assignee)})`
                            : ""}
                          {" · "}
                          From {task.creator?.full_name || "—"}
                          {task.due_at
                            ? ` · Due ${formatAppDate(task.due_at, "MMM d, yyyy")}`
                            : ""}
                          {task.completed_at
                            ? ` · Done ${formatAppDate(task.completed_at, "MMM d, yyyy")}`
                            : ""}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {!isDone && task.status !== "CANCELLED" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Mark done"
                            disabled={markingDone}
                            onClick={() => handleMarkDone(task)}
                          >
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(task)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setToDelete(task)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <ListPagination
                currentPage={page}
                pageSize={pageSize}
                totalItems={total}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
                itemLabel="tasks"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit task" : "New task"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="What needs to be done?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Optional details"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Assign to</Label>
              <Select
                value={form.assigned_to || UNASSIGNED_VALUE}
                onValueChange={(v) =>
                  setForm((prev) => ({ ...prev, assigned_to: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select main leader or admin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNASSIGNED_VALUE}>Unassigned</SelectItem>
                  {assignees.map((member) => (
                    <SelectItem key={member.id} value={String(member.id)}>
                      {member.full_name}
                      {memberRoleLabel(member)
                        ? ` · ${memberRoleLabel(member)}`
                        : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Due date</Label>
                <EthiopianDatePicker
                  value={form.due_at}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, due_at: value }))
                  }
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((prev) => ({
                      ...prev,
                      status: v as TaskStatus,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {statusLabel(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {editing
                ? "Save changes"
                : form.assigned_to && form.assigned_to !== UNASSIGNED_VALUE
                  ? "Assign task"
                  : "Create task"}
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
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>
              “{toDelete?.title}” will be removed from the list.
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

export default TasksManagement;
