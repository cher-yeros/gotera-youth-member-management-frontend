import React, { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  MapPin,
  Plus,
  Trash2,
  ListOrdered,
} from "lucide-react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
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
  CREATE_AGENDA,
  CREATE_PROGRAM,
  DELETE_AGENDA,
  DELETE_PROGRAM,
  GET_AGENDAS_BY_PROGRAM,
  GET_PROGRAMS,
  UPDATE_AGENDA,
  UPDATE_PROGRAM,
} from "@/graphql/operations";
import { cn } from "@/lib/utils";

const PROGRAM_STATUSES = ["SCHEDULED", "COMPLETED", "CANCELLED"] as const;

type ProgramStatus = (typeof PROGRAM_STATUSES)[number];

interface AgendaItem {
  id: number;
  program_id: number;
  title: string;
  body?: string | null;
  sort_order: number;
}

interface ProgramItem {
  id: number;
  title: string;
  description?: string | null;
  scheduled_at: string;
  location?: string | null;
  status: string;
  agendas?: AgendaItem[];
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-sky-100 text-sky-800";
  }
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

function dayKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function getMonthGridDays(month: Date) {
  const start = startOfWeek(startOfMonth(month));
  const end = endOfWeek(endOfMonth(month));
  return eachDayOfInterval({ start, end });
}

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const emptyProgramForm = {
  title: "",
  description: "",
  scheduled_at: "",
  location: "",
  status: "SCHEDULED" as ProgramStatus,
};

const emptyAgendaForm = {
  title: "",
  body: "",
  sort_order: "",
};

const ProgramsManagement: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(
    null,
  );

  const [programDialogOpen, setProgramDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(
    null,
  );
  const [programForm, setProgramForm] = useState(emptyProgramForm);
  const [programToDelete, setProgramToDelete] = useState<ProgramItem | null>(
    null,
  );

  const [agendaDialogOpen, setAgendaDialogOpen] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState<AgendaItem | null>(null);
  const [agendaForm, setAgendaForm] = useState(emptyAgendaForm);
  const [agendaToDelete, setAgendaToDelete] = useState<AgendaItem | null>(null);

  const dateFrom = startOfMonth(calendarMonth).toISOString();
  const dateTo = endOfMonth(calendarMonth).toISOString();

  const filter = useMemo(() => {
    const f: {
      search?: string;
      status?: string;
      dateFrom?: string;
      dateTo?: string;
    } = {
      dateFrom,
      dateTo,
    };
    if (search.trim()) f.search = search.trim();
    if (statusFilter !== "all") f.status = statusFilter;
    return f;
  }, [search, statusFilter, dateFrom, dateTo]);

  const { data, loading, refetch } = useQuery(GET_PROGRAMS, {
    variables: {
      filter,
      pagination: { page, limit: pageSize },
    },
    fetchPolicy: "cache-and-network",
  });

  const { data: calendarData } = useQuery(GET_PROGRAMS, {
    variables: {
      filter: { dateFrom, dateTo },
      pagination: { page: 1, limit: 100 },
    },
    fetchPolicy: "cache-and-network",
  });

  const { data: agendasData, refetch: refetchAgendas } = useQuery(
    GET_AGENDAS_BY_PROGRAM,
    {
      variables: { programId: selectedProgramId },
      skip: !selectedProgramId,
      fetchPolicy: "cache-and-network",
    },
  );

  const [createProgram, { loading: creating }] = useMutation(CREATE_PROGRAM);
  const [updateProgram, { loading: updating }] = useMutation(UPDATE_PROGRAM);
  const [deleteProgram, { loading: deleting }] = useMutation(DELETE_PROGRAM);
  const [createAgenda, { loading: creatingAgenda }] =
    useMutation(CREATE_AGENDA);
  const [updateAgenda, { loading: updatingAgenda }] =
    useMutation(UPDATE_AGENDA);
  const [deleteAgenda, { loading: deletingAgenda }] =
    useMutation(DELETE_AGENDA);

  const payload = (data as any)?.programs;
  const programs: ProgramItem[] = payload?.items || [];
  const total = payload?.total || 0;

  const calendarPrograms: ProgramItem[] =
    (calendarData as any)?.programs?.items || [];

  const programCountByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of calendarPrograms) {
      const d = new Date(p.scheduled_at);
      if (Number.isNaN(d.getTime())) continue;
      const key = dayKey(d);
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  }, [calendarPrograms]);

  const monthGridDays = useMemo(
    () => getMonthGridDays(calendarMonth),
    [calendarMonth],
  );

  const programsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return calendarPrograms
      .filter((p) => {
        const d = new Date(p.scheduled_at);
        return !Number.isNaN(d.getTime()) && isSameDay(d, selectedDate);
      })
      .sort(
        (a, b) =>
          new Date(a.scheduled_at).getTime() -
          new Date(b.scheduled_at).getTime(),
      );
  }, [calendarPrograms, selectedDate]);

  const agendas: AgendaItem[] = (agendasData as any)?.agendasByProgram || [];

  const selectedProgram =
    programs.find((p) => p.id === selectedProgramId) ||
    calendarPrograms.find((p) => p.id === selectedProgramId) ||
    null;

  const openCreateProgram = () => {
    setEditingProgram(null);
    const base = selectedDate || new Date();
    setProgramForm({
      ...emptyProgramForm,
      scheduled_at: toDatetimeLocalValue(base),
    });
    setProgramDialogOpen(true);
  };

  const openEditProgram = (program: ProgramItem) => {
    setEditingProgram(program);
    setProgramForm({
      title: program.title,
      description: program.description || "",
      scheduled_at: toDatetimeLocalValue(program.scheduled_at),
      location: program.location || "",
      status: (PROGRAM_STATUSES.includes(program.status as ProgramStatus)
        ? program.status
        : "SCHEDULED") as ProgramStatus,
    });
    setProgramDialogOpen(true);
  };

  const handleSaveProgram = async () => {
    if (!programForm.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!programForm.scheduled_at) {
      toast.error("Date and time are required");
      return;
    }

    const input = {
      title: programForm.title.trim(),
      description: programForm.description.trim() || null,
      scheduled_at: fromDatetimeLocalValue(programForm.scheduled_at),
      location: programForm.location.trim() || null,
      status: programForm.status,
    };

    try {
      if (editingProgram) {
        await updateProgram({
          variables: { id: editingProgram.id, input },
        });
        toast.success("Program updated");
      } else {
        const result = await createProgram({ variables: { input } });
        const created = (result.data as any)?.createProgram;
        if (created?.id) setSelectedProgramId(created.id);
        toast.success("Program created");
      }
      setProgramDialogOpen(false);
      await refetch();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save program");
    }
  };

  const confirmDeleteProgram = async () => {
    if (!programToDelete) return;
    try {
      await deleteProgram({ variables: { id: programToDelete.id } });
      if (selectedProgramId === programToDelete.id) {
        setSelectedProgramId(null);
      }
      toast.success("Program deleted");
      setProgramToDelete(null);
      await refetch();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete program");
    }
  };

  const openCreateAgenda = () => {
    if (!selectedProgramId) {
      toast.error("Select a program first");
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
    if (!selectedProgramId) return;
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
              program_id: selectedProgramId,
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
        title="Programs"
        subtitle="Schedule programs, view the calendar, and manage agendas"
        actions={
          <Button onClick={openCreateProgram}>
            <Plus className="h-4 w-4 mr-2" />
            New Program
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Previous month"
                onClick={() => setCalendarMonth((m) => subMonths(m, 1))}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="text-base text-brand-gradient">
                {format(calendarMonth, "MMMM yyyy")}
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Next month"
                onClick={() => setCalendarMonth((m) => addMonths(m, 1))}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Month grid — tiled days with event density bars */}
            <div>
              <div className="mb-2 grid grid-cols-7 gap-1.5 sm:gap-2">
                {WEEKDAY_LABELS.map((label, i) => (
                  <div
                    key={label}
                    className={cn(
                      "text-center text-[11px] font-medium sm:text-xs",
                      i === 0 ? "text-rose-500/80" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {monthGridDays.map((day) => {
                  const inMonth = isSameMonth(day, calendarMonth);
                  const selected = selectedDate && isSameDay(day, selectedDate);
                  const today = isToday(day);
                  const count = programCountByDay.get(dayKey(day)) || 0;
                  const bars = Math.min(count, 3);
                  const isSunday = day.getDay() === 0;

                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => {
                        setSelectedDate(day);
                        if (!isSameMonth(day, calendarMonth)) {
                          setCalendarMonth(startOfMonth(day));
                        }
                      }}
                      className={cn(
                        "flex aspect-square flex-col items-center justify-center rounded-xl border bg-muted/40 px-0.5 py-1 transition-colors",
                        "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        !inMonth && "opacity-40",
                        today &&
                          !selected &&
                          "border-transparent bg-primary/15 text-primary",
                        selected &&
                          "border-primary bg-background ring-2 ring-primary/40",
                        !today && !selected && "border-transparent",
                      )}
                    >
                      <span
                        className={cn(
                          "text-sm font-semibold leading-none sm:text-base",
                          isSunday && inMonth && !selected && !today
                            ? "text-rose-500"
                            : "",
                          today && !selected ? "text-primary" : "",
                        )}
                      >
                        {format(day, "d")}
                      </span>
                      <div className="mt-1 flex h-2.5 w-[55%] flex-col justify-end gap-0.5">
                        {Array.from({ length: bars }).map((_, i) => (
                          <span
                            key={i}
                            className={cn(
                              "h-0.5 w-full rounded-full",
                              selected || today
                                ? "bg-primary/50"
                                : "bg-muted-foreground/35",
                            )}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected day agenda — large date + timed list + add CTA */}
            <div className="border-t pt-4 space-y-4">
              {selectedDate ? (
                <>
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-bold leading-none tracking-tight text-foreground sm:text-5xl">
                      {format(selectedDate, "d")}
                    </span>
                    <div className="min-w-0 pb-0.5">
                      <p className="text-sm font-medium leading-tight">
                        {format(selectedDate, "EEEE")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(selectedDate, "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1">
                    {programsOnSelectedDate.length === 0 ? (
                      <p className="py-4 text-sm text-muted-foreground">
                        No programs scheduled this day
                      </p>
                    ) : (
                      programsOnSelectedDate.map((p) => {
                        const start = new Date(p.scheduled_at);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setSelectedProgramId(p.id)}
                            className={cn(
                              "flex w-full items-stretch gap-3 rounded-lg px-1 py-2.5 text-left transition-colors hover:bg-muted/50",
                              selectedProgramId === p.id && "bg-primary/5",
                            )}
                          >
                            <div className="flex w-12 shrink-0 flex-col items-end justify-center sm:w-14">
                              <span className="text-sm font-semibold tabular-nums leading-none">
                                {format(start, "h:mm")}
                              </span>
                              <span className="mt-0.5 text-[10px] uppercase text-muted-foreground">
                                {format(start, "a")}
                              </span>
                            </div>
                            <div
                              className={cn(
                                "w-1 shrink-0 self-stretch rounded-full",
                                selectedProgramId === p.id
                                  ? "bg-primary"
                                  : "bg-primary/40",
                              )}
                            />
                            <div className="min-w-0 flex-1 py-0.5">
                              <p className="font-medium leading-snug line-clamp-2">
                                {p.title}
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {format(start, "h:mm a")}
                                {p.location ? ` · ${p.location}` : ""}
                              </p>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    className="h-11 w-full justify-between rounded-xl px-4"
                    onClick={openCreateProgram}
                  >
                    <span>Add on {format(selectedDate, "MMM d")}</span>
                    <Plus className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select a date to see programs
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-base">Program list</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <Select
                    value={statusFilter}
                    onValueChange={(v) => {
                      setStatusFilter(v);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      {PROGRAM_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="pt-2">
                <InlineSearchRow
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search programs..."
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading && programs.length === 0 ? (
                <ListLoadingState />
              ) : programs.length === 0 ? (
                <ListEmptyState
                  title="No programs"
                  description="Create a program or adjust filters for this month."
                />
              ) : (
                <div className="space-y-3">
                  {programs.map((program) => (
                    <div
                      key={program.id}
                      className={cn(
                        "rounded-lg border p-4 cursor-pointer transition-colors hover:bg-muted/40",
                        selectedProgramId === program.id &&
                          "border-sky-500 bg-sky-50/60",
                      )}
                      onClick={() => setSelectedProgramId(program.id)}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">{program.title}</h3>
                            <Badge
                              className={statusBadgeClass(program.status)}
                              variant="secondary"
                            >
                              {program.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {format(
                              new Date(program.scheduled_at),
                              "MMM d, yyyy · h:mm a",
                            )}
                            {program.location ? ` · ${program.location}` : ""}
                          </p>
                          {program.description && (
                            <p className="text-sm line-clamp-2">
                              {program.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {(program.agendas?.length ?? 0) ||
                              (selectedProgramId === program.id
                                ? agendas.length
                                : 0)}{" "}
                            agenda item
                            {(program.agendas?.length ?? 0) === 1 ? "" : "s"}
                          </p>
                        </div>
                        <div
                          className="flex gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditProgram(program)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setProgramToDelete(program)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
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
                    itemLabel="programs"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ListOrdered className="h-4 w-4" />
                  Agendas
                  {selectedProgram ? (
                    <span className="font-normal text-muted-foreground">
                      · {selectedProgram.title}
                    </span>
                  ) : null}
                </CardTitle>
                <Button
                  size="sm"
                  onClick={openCreateAgenda}
                  disabled={!selectedProgramId}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add agenda
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!selectedProgramId ? (
                <p className="text-sm text-muted-foreground">
                  Select a program to view and edit its agendas.
                </p>
              ) : agendas.length === 0 ? (
                <ListEmptyState
                  title="No agendas yet"
                  description="Add agenda items for this program."
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
      </div>

      <Dialog open={programDialogOpen} onOpenChange={setProgramDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingProgram ? "Edit program" : "New program"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="program-title">Title</Label>
              <Input
                id="program-title"
                value={programForm.title}
                onChange={(e) =>
                  setProgramForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program-scheduled">Date & time</Label>
              <EthiopianDatePicker
                id="program-scheduled"
                mode="datetime"
                value={programForm.scheduled_at}
                onChange={(value) =>
                  setProgramForm((f) => ({
                    ...f,
                    scheduled_at: value,
                  }))
                }
                placeholder="Pick date & time"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program-location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="program-location"
                  className="pl-9"
                  value={programForm.location}
                  onChange={(e) =>
                    setProgramForm((f) => ({ ...f, location: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={programForm.status}
                onValueChange={(v) =>
                  setProgramForm((f) => ({
                    ...f,
                    status: v as ProgramStatus,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROGRAM_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="program-description">Description</Label>
              <Textarea
                id="program-description"
                rows={3}
                value={programForm.description}
                onChange={(e) =>
                  setProgramForm((f) => ({
                    ...f,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProgramDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProgram} disabled={creating || updating}>
              {editingProgram ? "Save" : "Create"}
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
        open={!!programToDelete}
        onOpenChange={(open) => !open && setProgramToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete program?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove “{programToDelete?.title}” and its agendas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProgram}
              disabled={deleting}
            >
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

export default ProgramsManagement;
