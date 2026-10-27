import React, { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import Kenat from "kenat";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import { format, isSameDay, isToday } from "date-fns";
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
  CREATE_PROGRAM,
  DELETE_PROGRAM,
  GET_PROGRAMS,
  UPDATE_PROGRAM,
} from "@/graphql/operations";
import {
  ETHIOPIAN_MONTH_NAMES_EN,
  dateToGregorianString,
  daysInEthiopianMonth,
  ethiopianToGregorian,
  formatEthiopianDisplay,
  formatGregorianHint,
  gregorianToEthiopian,
  todayEthiopian,
  type EthiopianYmd,
} from "@/lib/ethiopian-date";
import { cn } from "@/lib/utils";

const PROGRAM_STATUSES = ["SCHEDULED", "COMPLETED", "CANCELLED"] as const;

type ProgramStatus = (typeof PROGRAM_STATUSES)[number];

interface ProgramItem {
  id: number;
  title: string;
  description?: string | null;
  scheduled_at: string;
  location?: string | null;
  status: string;
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

function parseAppDate(value: string | Date | null | undefined): Date | null {
  if (value == null || value === "") return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const trimmed = value.trim();
  // ISO with timezone or ms → native parse
  if (/[zZ]|[+-]\d{2}:?\d{2}$|\.\d{1,3}/.test(trimmed)) {
    const d = new Date(trimmed);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  // datetime-local / MySQL "YYYY-MM-DD HH:mm:ss" → local wall time
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
  if (!d) {
    throw new Error("Invalid date and time");
  }
  return d.toISOString();
}

function dayKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function dateToEthiopian(date: Date): EthiopianYmd {
  return gregorianToEthiopian({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  });
}

function ethiopianToLocalDate(eth: EthiopianYmd): Date {
  const g = ethiopianToGregorian(eth);
  return new Date(g.year, g.month - 1, g.day, 12, 0, 0, 0);
}

function sameEthiopianDay(a: EthiopianYmd, b: EthiopianYmd) {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

function formatProgramEthiopianDate(
  value: string | Date | null | undefined,
  options?: { showWeekday?: boolean },
) {
  const d = parseAppDate(value);
  if (!d) return "—";
  return formatEthiopianDisplay(dateToEthiopian(d), options);
}

type CalendarGridDay = {
  ethiopian: EthiopianYmd;
  gregorian: { year: number; month: number; day: number; display?: string };
  isToday?: boolean;
} | null;

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const emptyProgramForm = {
  title: "",
  description: "",
  scheduled_at: "",
  location: "",
  status: "SCHEDULED" as ProgramStatus,
};

const ProgramsManagement: React.FC = () => {
  const initialEth = todayEthiopian();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [calendarEthMonth, setCalendarEthMonth] = useState({
    year: initialEth.year,
    month: initialEth.month,
  });
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

  const calendarMonthBounds = useMemo(() => {
    const first = ethiopianToGregorian({
      year: calendarEthMonth.year,
      month: calendarEthMonth.month,
      day: 1,
    });
    const lastDayNum = daysInEthiopianMonth(
      calendarEthMonth.year,
      calendarEthMonth.month,
    );
    const last = ethiopianToGregorian({
      year: calendarEthMonth.year,
      month: calendarEthMonth.month,
      day: lastDayNum,
    });
    const dateFrom = new Date(
      first.year,
      first.month - 1,
      first.day,
      0,
      0,
      0,
      0,
    ).toISOString();
    const dateTo = new Date(
      last.year,
      last.month - 1,
      last.day,
      23,
      59,
      59,
      999,
    ).toISOString();
    return { dateFrom, dateTo };
  }, [calendarEthMonth.year, calendarEthMonth.month]);

  const filter = useMemo(() => {
    const f: {
      search?: string;
      status?: string;
    } = {};
    if (search.trim()) f.search = search.trim();
    if (statusFilter !== "all") f.status = statusFilter;
    return f;
  }, [search, statusFilter]);

  const {
    data,
    loading,
    refetch: refetchList,
  } = useQuery(GET_PROGRAMS, {
    variables: {
      filter,
      pagination: { page, limit: pageSize },
    },
    fetchPolicy: "cache-and-network",
  });

  const { data: calendarData, refetch: refetchCalendar } = useQuery(
    GET_PROGRAMS,
    {
      variables: {
        filter: {
          dateFrom: calendarMonthBounds.dateFrom,
          dateTo: calendarMonthBounds.dateTo,
        },
        pagination: { page: 1, limit: 100 },
      },
      fetchPolicy: "cache-and-network",
    },
  );

  const refetch = useCallback(async () => {
    await Promise.all([refetchList(), refetchCalendar()]);
  }, [refetchList, refetchCalendar]);

  const [createProgram, { loading: creating }] = useMutation(CREATE_PROGRAM);
  const [updateProgram, { loading: updating }] = useMutation(UPDATE_PROGRAM);
  const [deleteProgram, { loading: deleting }] = useMutation(DELETE_PROGRAM);

  const payload = (data as any)?.programs;
  const programs: ProgramItem[] = payload?.items || [];
  const total = payload?.total || 0;

  const calendarPrograms: ProgramItem[] =
    (calendarData as any)?.programs?.items || [];

  const programCountByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of calendarPrograms) {
      const d = parseAppDate(p.scheduled_at);
      if (!d) continue;
      const key = dayKey(d);
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  }, [calendarPrograms]);

  const monthCalendar = useMemo(() => {
    try {
      return Kenat.getMonthCalendar(
        calendarEthMonth.year,
        calendarEthMonth.month,
        {
          useGeez: false,
          weekdayLang: "english",
        },
      );
    } catch {
      return null;
    }
  }, [calendarEthMonth.year, calendarEthMonth.month]);

  const weekdayLabels = useMemo(() => {
    const headers = monthCalendar?.headers as string[] | undefined;
    if (!headers?.length) return WEEKDAY_LABELS;
    return headers.map((h) => h.slice(0, 2));
  }, [monthCalendar]);

  const monthGridDays = useMemo(
    () => (monthCalendar?.days as CalendarGridDay[] | undefined) ?? [],
    [monthCalendar],
  );

  const selectedEth = useMemo(
    () => (selectedDate ? dateToEthiopian(selectedDate) : null),
    [selectedDate],
  );

  const programsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return calendarPrograms
      .filter((p) => {
        const d = parseAppDate(p.scheduled_at);
        return d != null && isSameDay(d, selectedDate);
      })
      .sort((a, b) => {
        const da = parseAppDate(a.scheduled_at)?.getTime() ?? 0;
        const db = parseAppDate(b.scheduled_at)?.getTime() ?? 0;
        return da - db;
      });
  }, [calendarPrograms, selectedDate]);

  const goPrevEthMonth = () => {
    setCalendarEthMonth((m) =>
      m.month <= 1
        ? { year: m.year - 1, month: 13 }
        : { year: m.year, month: m.month - 1 },
    );
  };

  const goNextEthMonth = () => {
    setCalendarEthMonth((m) =>
      m.month >= 13
        ? { year: m.year + 1, month: 1 }
        : { year: m.year, month: m.month + 1 },
    );
  };

  const focusProgramOnCalendar = (program: ProgramItem) => {
    setSelectedProgramId(program.id);
    const d = parseAppDate(program.scheduled_at);
    if (!d) return;
    setSelectedDate(d);
    const eth = dateToEthiopian(d);
    setCalendarEthMonth({ year: eth.year, month: eth.month });
  };

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

    let scheduledAtIso: string;
    try {
      scheduledAtIso = fromDatetimeLocalValue(programForm.scheduled_at);
    } catch {
      toast.error("Invalid date and time");
      return;
    }

    const input = {
      title: programForm.title.trim(),
      description: programForm.description.trim() || null,
      scheduled_at: scheduledAtIso,
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

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Programs"
        subtitle="Schedule programs and view them on the calendar"
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
                onClick={goPrevEthMonth}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="text-base text-brand-gradient">
                {ETHIOPIAN_MONTH_NAMES_EN[calendarEthMonth.month - 1] ??
                  calendarEthMonth.month}{" "}
                {calendarEthMonth.year}
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Next month"
                onClick={goNextEthMonth}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-center text-[11px] text-muted-foreground">
              Ethiopian calendar
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Month grid — tiled days with event density bars */}
            <div>
              <div className="mb-2 grid grid-cols-7 gap-1.5 sm:gap-2">
                {weekdayLabels.map((label, i) => (
                  <div
                    key={`${label}-${i}`}
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
                {monthGridDays.map((day, index) => {
                  if (!day) {
                    return (
                      <div key={`empty-${index}`} className="aspect-square" />
                    );
                  }

                  const localDate = ethiopianToLocalDate(day.ethiopian);
                  const inMonth =
                    day.ethiopian.month === calendarEthMonth.month &&
                    day.ethiopian.year === calendarEthMonth.year;
                  const selected =
                    !!selectedEth &&
                    sameEthiopianDay(day.ethiopian, selectedEth);
                  const today = day.isToday || isToday(localDate);
                  const count = programCountByDay.get(dayKey(localDate)) || 0;
                  const bars = Math.min(count, 3);
                  const isSunday = localDate.getDay() === 0;

                  return (
                    <button
                      key={`${day.ethiopian.year}-${day.ethiopian.month}-${day.ethiopian.day}`}
                      type="button"
                      onClick={() => {
                        setSelectedDate(localDate);
                        if (!inMonth) {
                          setCalendarEthMonth({
                            year: day.ethiopian.year,
                            month: day.ethiopian.month,
                          });
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
                        {day.ethiopian.day}
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

            {/* Selected day programs — large date + timed list + add CTA */}
            <div className="border-t pt-4 space-y-4">
              {selectedDate && selectedEth ? (
                <>
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-bold leading-none tracking-tight text-foreground sm:text-5xl">
                      {selectedEth.day}
                    </span>
                    <div className="min-w-0 pb-0.5">
                      <p className="text-sm font-medium leading-tight">
                        {format(selectedDate, "EEEE")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatEthiopianDisplay(selectedEth)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatGregorianHint(
                          dateToGregorianString(selectedDate),
                        )}{" "}
                        (Gregorian)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1">
                    {programsOnSelectedDate.length === 0 ? (
                      <p className="py-4 text-sm text-muted-foreground">
                        No programs scheduled this day
                      </p>
                    ) : (
                      programsOnSelectedDate.map((p) => (
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
                              {formatAppDate(p.scheduled_at, "h:mm")}
                            </span>
                            <span className="mt-0.5 text-[10px] uppercase text-muted-foreground">
                              {formatAppDate(p.scheduled_at, "a")}
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
                              {formatAppDate(p.scheduled_at, "h:mm a")}
                              {p.location ? ` · ${p.location}` : ""}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    className="h-11 w-full justify-between rounded-xl px-4"
                    onClick={openCreateProgram}
                  >
                    <span>
                      Add on{" "}
                      {ETHIOPIAN_MONTH_NAMES_EN[selectedEth.month - 1]?.slice(
                        0,
                        3,
                      ) ?? selectedEth.month}{" "}
                      {selectedEth.day}
                    </span>
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
                  description="Create a program or adjust search and status filters."
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
                      onClick={() => focusProgramOnCalendar(program)}
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
                            {formatProgramEthiopianDate(program.scheduled_at)}
                            {" · "}
                            {formatAppDate(program.scheduled_at, "h:mm a")}
                            {program.location ? ` · ${program.location}` : ""}
                          </p>
                          {program.description && (
                            <p className="text-sm line-clamp-2">
                              {program.description}
                            </p>
                          )}
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

      <AlertDialog
        open={!!programToDelete}
        onOpenChange={(open) => !open && setProgramToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete program?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove “{programToDelete?.title}”.
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
    </div>
  );
};

export default ProgramsManagement;
