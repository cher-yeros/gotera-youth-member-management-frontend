import { TeenAttendanceModal } from "@/components/forms/TeenAttendanceModal";
import CreateClassSessionBatchModal from "@/components/forms/CreateClassSessionBatchModal";
import EditClassSessionBatchModal from "@/components/forms/EditClassSessionBatchModal";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import ListLoadingState from "@/components/shared/ListLoadingState";
import ListEmptyState from "@/components/shared/ListEmptyState";
import ListErrorState from "@/components/shared/ListErrorState";
import ListPagination from "@/components/shared/ListPagination";
import InlineSearchRow from "@/components/shared/InlineSearchRow";
import {
  useDeleteClassSessionBatch,
  useGetClassSessionBatches,
} from "@/hooks/useTeenGraphQL";
import { format, parseISO } from "date-fns";
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Edit,
  MapPin,
  Trash2,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

interface SessionInBatch {
  id: number;
  class_id: number;
  title: string;
  topic?: string | null;
  session_date: string;
  location?: string;
  is_active: boolean;
  teenClass?: {
    id: number;
    name: string;
  };
  attendanceStats?: {
    total: number;
    present: number;
    absent: number;
    attendanceRate: number;
  };
}

interface ClassSessionBatch {
  id: number;
  title: string;
  description?: string;
  session_date: string;
  location?: string;
  is_active: boolean;
  creator?: {
    id: number;
    full_name: string;
  };
  sessions?: SessionInBatch[];
}

const TeenSessionsManagement = () => {
  const [viewedBatchId, setViewedBatchId] = useState<number | null>(null);
  const [classSearchTerm, setClassSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [batchToDelete, setBatchToDelete] = useState<ClassSessionBatch | null>(
    null,
  );

  const { data, loading, error, refetch } = useGetClassSessionBatches(
    undefined,
    {
      page: 1,
      limit: 1000,
    },
  );
  const { deleteClassSessionBatch, loading: deleting } =
    useDeleteClassSessionBatch();

  const batches =
    (data as { classSessionBatches?: { batches: ClassSessionBatch[] } })
      ?.classSessionBatches?.batches || [];

  const viewedBatch = batches.find((b) => b.id === viewedBatchId) || null;

  const formatSessionDate = (sessionDate: string) => {
    try {
      return format(parseISO(sessionDate), "PPP");
    } catch {
      return sessionDate;
    }
  };

  const getBatchStats = (batch: ClassSessionBatch) => {
    const sessions = batch.sessions || [];
    const totals = sessions.reduce(
      (acc, s) => {
        const stats = s.attendanceStats;
        acc.total += stats?.total ?? 0;
        acc.present += stats?.present ?? 0;
        acc.absent += stats?.absent ?? 0;
        return acc;
      },
      { total: 0, present: 0, absent: 0 },
    );
    const attendanceRate =
      totals.total > 0 ? (totals.present / totals.total) * 100 : 0;
    return {
      classCount: sessions.length,
      ...totals,
      attendanceRate,
    };
  };

  const getStatusBadge = (sessionDate: string) => {
    const today = new Date().toISOString().slice(0, 10);
    if (sessionDate === today) {
      return <Badge variant="default">Today</Badge>;
    }
    if (sessionDate < today) {
      return <Badge variant="secondary">Past</Badge>;
    }
    return <Badge variant="outline">Upcoming</Badge>;
  };

  const filteredBatches = useCallback(
    (items: ClassSessionBatch[]) => {
      if (!searchTerm) return items;
      const term = searchTerm.toLowerCase();
      return items.filter(
        (batch) =>
          batch.title.toLowerCase().includes(term) ||
          (batch.location || "").toLowerCase().includes(term) ||
          (batch.description || "").toLowerCase().includes(term),
      );
    },
    [searchTerm],
  );

  const filtered = filteredBatches(batches);
  const paginatedBatches = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const classSessions = useMemo(() => {
    if (!viewedBatch) return [];
    const sessions = [...(viewedBatch.sessions || [])].sort((a, b) =>
      (a.teenClass?.name || "").localeCompare(b.teenClass?.name || ""),
    );
    if (!classSearchTerm) return sessions;
    const term = classSearchTerm.toLowerCase();
    return sessions.filter((s) =>
      (s.teenClass?.name || "").toLowerCase().includes(term),
    );
  }, [viewedBatch, classSearchTerm]);

  const confirmDelete = async () => {
    if (!batchToDelete) return;
    await deleteClassSessionBatch(batchToDelete.id);
    setBatchToDelete(null);
    if (viewedBatchId === batchToDelete.id) {
      setViewedBatchId(null);
    }
  };

  if (viewedBatch) {
    const stats = getBatchStats(viewedBatch);

    return (
      <div className="space-y-6">
        <PageHeader
          title={viewedBatch.title}
          back={{
            label: "Back to batches",
            onClick: () => {
              setViewedBatchId(null);
              setClassSearchTerm("");
            },
          }}
          actions={
            <div className="flex items-center space-x-2 shrink-0">
              <EditClassSessionBatchModal
                batch={viewedBatch}
                trigger={
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Session
                  </Button>
                }
              />
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={() => setBatchToDelete(viewedBatch)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          }
          subtitle={
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatSessionDate(viewedBatch.session_date)}
              </span>
              {viewedBatch.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {viewedBatch.location}
                </span>
              )}
              {getStatusBadge(viewedBatch.session_date)}
              <Badge variant="outline">{stats.classCount} classes</Badge>
              <Badge variant="secondary">
                {stats.attendanceRate.toFixed(1)}% attendance
              </Badge>
            </div>
          }
        />

        <InlineSearchRow
          value={classSearchTerm}
          onChange={setClassSearchTerm}
          placeholder="Search classes..."
        />

        <Card className="shadow-brand">
          <CardHeader>
            <CardTitle className="text-brand-gradient">
              Attendance by Class
            </CardTitle>
          </CardHeader>
          <CardContent>
            {classSessions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {classSearchTerm
                  ? "No classes match your search"
                  : "No class sessions in this batch"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Class</th>
                      <th className="text-left p-3 font-semibold">Title</th>
                      <th className="text-left p-3 font-semibold">Topic</th>
                      <th className="text-left p-3 font-semibold">
                        Attendance
                      </th>
                      <th className="text-left p-3 font-semibold">Status</th>
                      <th className="text-left p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classSessions.map((session) => {
                      const sessionStats = session.attendanceStats || {
                        total: 0,
                        present: 0,
                        absent: 0,
                        attendanceRate: 0,
                      };
                      return (
                        <tr
                          key={session.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-3">
                            <Badge variant="outline">
                              {session.teenClass?.name || "—"}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="font-medium">{session.title}</div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm text-muted-foreground">
                              {session.topic || "—"}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-green-600">
                                  {sessionStats.attendanceRate.toFixed(1)}%
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {sessionStats.present}
                                <XCircle className="h-3 w-3 text-red-600 ml-2" />
                                {sessionStats.absent}
                                <Users className="h-3 w-3 text-muted-foreground ml-2" />
                                {sessionStats.total}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge
                              variant={
                                session.is_active ? "default" : "secondary"
                              }
                            >
                              {session.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <TeenAttendanceModal
                              sessionId={session.id}
                              classId={session.class_id}
                              readOnly
                              trigger={
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <AlertDialog
          open={!!batchToDelete}
          onOpenChange={(open) => !open && setBatchToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Session Batch</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the session batch &quot;
                {batchToDelete?.title}&quot; for all{" "}
                {batchToDelete?.sessions?.length || 0} classes, including
                attendance records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setBatchToDelete(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Batch"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teen Sessions"
        subtitle={`${batches.length} batches`}
        actions={<CreateClassSessionBatchModal />}
      />

      <InlineSearchRow
        value={searchTerm}
        onChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        onClear={() => setCurrentPage(1)}
        placeholder="Search session batches..."
      />

      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">
            Session Day Batches
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ListLoadingState message="Loading batches..." />
          ) : error ? (
            <ListErrorState
              title="Error Loading Batches"
              message={error.message}
              onRetry={() => refetch()}
            />
          ) : paginatedBatches.length === 0 ? (
            <ListEmptyState
              icon="📅"
              title={
                searchTerm
                  ? "No session batches found matching your search"
                  : "No session batches found"
              }
              description={
                searchTerm
                  ? "Try adjusting your search criteria"
                  : "Create a session batch to open attendance for all classes"
              }
              secondaryAction={
                searchTerm
                  ? {
                      label: "Clear Filters",
                      onClick: () => {
                        setSearchTerm("");
                        setCurrentPage(1);
                      },
                    }
                  : undefined
              }
            />
          ) : (
            <div className="space-y-4">
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {paginatedBatches.map((batch) => {
                  const stats = getBatchStats(batch);
                  return (
                    <Card
                      key={batch.id}
                      className="shadow-sm border cursor-pointer"
                      onClick={() => setViewedBatchId(batch.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-semibold text-lg">
                              {batch.title}
                            </div>
                            {getStatusBadge(batch.session_date)}
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {formatSessionDate(batch.session_date)}
                            </div>
                            {batch.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {batch.location}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">
                              {stats.classCount} classes
                            </Badge>
                            <Badge variant="secondary">
                              {stats.attendanceRate.toFixed(1)}% attendance
                            </Badge>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewedBatchId(batch.id);
                              }}
                            >
                              View
                            </Button>
                            <div onClick={(e) => e.stopPropagation()}>
                              <EditClassSessionBatchModal
                                batch={batch}
                                trigger={
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                }
                              />
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                setBatchToDelete(batch);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Session</th>
                      <th className="text-left p-3 font-semibold">Classes</th>
                      <th className="text-left p-3 font-semibold">Date</th>
                      <th className="text-left p-3 font-semibold">Location</th>
                      <th className="text-left p-3 font-semibold">Status</th>
                      <th className="text-left p-3 font-semibold">
                        Attendance
                      </th>
                      <th className="text-left p-3 font-semibold">
                        Created By
                      </th>
                      <th className="text-left p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBatches.map((batch) => {
                      const stats = getBatchStats(batch);
                      return (
                        <tr
                          key={batch.id}
                          className="border-b hover:bg-muted/50 cursor-pointer"
                          onClick={() => setViewedBatchId(batch.id)}
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="font-medium">{batch.title}</div>
                                {batch.description && (
                                  <div className="text-sm text-muted-foreground">
                                    {batch.description}
                                  </div>
                                )}
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline">
                              {stats.classCount} classes
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {formatSessionDate(batch.session_date)}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2 text-sm">
                              {batch.location ? (
                                <>
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  {batch.location}
                                </>
                              ) : (
                                "—"
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            {getStatusBadge(batch.session_date)}
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-green-600">
                                  {stats.attendanceRate.toFixed(1)}%
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {stats.present}
                                <XCircle className="h-3 w-3 text-red-600 ml-2" />
                                {stats.absent}
                                <Users className="h-3 w-3 text-muted-foreground ml-2" />
                                {stats.total}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              {batch.creator?.full_name || "—"}
                            </div>
                          </td>
                          <td className="p-3">
                            <div
                              className="flex items-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <EditClassSessionBatchModal
                                batch={batch}
                                trigger={
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                }
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setBatchToDelete(batch)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <ListPagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={filtered.length}
                onPageChange={(page) => setCurrentPage(page)}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                itemLabel="batches"
                showPageNumbers={false}
                hideWhenSinglePage
                filtered={!!searchTerm}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!batchToDelete}
        onOpenChange={(open) => !open && setBatchToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session Batch</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the session batch &quot;
              {batchToDelete?.title}&quot; for all{" "}
              {batchToDelete?.sessions?.length || 0} classes, including
              attendance records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBatchToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Batch"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeenSessionsManagement;
