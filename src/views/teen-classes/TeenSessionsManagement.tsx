import { TeenAttendanceModal } from "@/components/forms/TeenAttendanceModal";
import CreateClassSessionBatchModal from "@/components/forms/CreateClassSessionBatchModal";
import EditClassSessionBatchModal from "@/components/forms/EditClassSessionBatchModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/ui/theme-toggle";
import {
  useDeleteClassSessionBatch,
  useGetClassSessionBatches,
} from "@/hooks/useTeenGraphQL";
import { format, parseISO } from "date-fns";
import {
  ArrowLeft,
  CheckCircle,
  Edit,
  Eye,
  Search,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

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
  const { data, loading, refetch } = useGetClassSessionBatches(undefined, {
    page: 1,
    limit: 50,
  });
  const { deleteClassSessionBatch } = useDeleteClassSessionBatch();
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

  if (viewedBatch) {
    const stats = getBatchStats(viewedBatch);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="px-0 hover:bg-transparent"
              onClick={() => {
                setViewedBatchId(null);
                setClassSearchTerm("");
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to batches
            </Button>
            <h1 className="text-3xl font-bold text-brand-gradient">
              {viewedBatch.title}
            </h1>
            {viewedBatch.description && (
              <p className="text-muted-foreground">{viewedBatch.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>{formatSessionDate(viewedBatch.session_date)}</span>
              {viewedBatch.location && <span>· {viewedBatch.location}</span>}
              <Badge variant="outline">{stats.classCount} classes</Badge>
              <Badge variant="secondary">
                {stats.attendanceRate.toFixed(1)}% attendance
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <ThemeToggle variant="icon" />
            <EditClassSessionBatchModal
              batch={viewedBatch}
              onSuccess={() => refetch()}
              trigger={
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Session
                </Button>
              }
            />
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search classes..."
            value={classSearchTerm}
            onChange={(e) => setClassSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

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
                                  <Eye className="h-4 w-4 mr-1" />
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
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-brand-gradient">
            Teen Sessions
          </h1>
          <p className="text-sm text-muted-foreground">
            Create attendance days and review teacher-filled attendance
          </p>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <CreateClassSessionBatchModal onSuccess={() => refetch()} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Batches ({batches.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading && <p>Loading...</p>}
          {batches.map((b) => {
            const stats = getBatchStats(b);
            return (
              <div
                key={b.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-2 border rounded-lg p-3"
              >
                <div>
                  <div className="font-medium">{b.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatSessionDate(b.session_date)}
                    {b.location ? ` · ${b.location}` : ""}
                  </div>
                  <div className="text-xs mt-1 flex flex-wrap items-center gap-2">
                    <span>{stats.classCount} class sessions</span>
                    <span>·</span>
                    <span className="text-green-600 font-medium">
                      {stats.attendanceRate.toFixed(1)}% attendance
                    </span>
                    <span>
                      ({stats.present}/{stats.total} present)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={b.is_active ? "secondary" : "outline"}>
                    {b.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setViewedBatchId(b.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Attendance
                  </Button>
                  <EditClassSessionBatchModal
                    batch={b}
                    onSuccess={() => refetch()}
                    trigger={
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    }
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      if (confirm(`Delete batch "${b.title}"?`)) {
                        await deleteClassSessionBatch(b.id);
                        refetch();
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
          {!loading && batches.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No session batches yet. Create one to open attendance for all
              classes.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeenSessionsManagement;
