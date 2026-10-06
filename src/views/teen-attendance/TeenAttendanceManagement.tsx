import { TeenAttendanceModal } from "@/components/forms/TeenAttendanceModal";
import SessionTopicModal from "@/components/forms/SessionTopicModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import ListLoadingState from "@/components/shared/ListLoadingState";
import ListEmptyState from "@/components/shared/ListEmptyState";
import ListErrorState from "@/components/shared/ListErrorState";
import ListPagination from "@/components/shared/ListPagination";
import InlineSearchRow from "@/components/shared/InlineSearchRow";
import {
  useGetClassSessions,
  useGetMyTeenClasses,
} from "@/hooks/useTeenGraphQL";
import { hasAnyRole, ROLE } from "@/lib/roles";
import { useAuth } from "@/redux/useAuth";
import { format, parseISO } from "date-fns";
import {
  CheckCircle,
  Eye,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import React, { useCallback, useState } from "react";

interface ClassSession {
  id: number;
  class_id: number;
  title: string;
  description?: string;
  topic?: string | null;
  session_date: string;
  location?: string;
  is_active: boolean;
  teenClass?: {
    id: number;
    name: string;
  };
  creator?: {
    id: number;
    full_name: string;
  };
  attendanceStats?: {
    total: number;
    present: number;
    absent: number;
    attendanceRate: number;
  };
}

const TeenAttendanceManagement: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = hasAnyRole(user, [ROLE.ADMIN, ROLE.MAIN]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: classesData, loading: classesLoading } = useGetMyTeenClasses();
  const myClasses =
    (classesData as { myTeenClasses?: unknown[] })?.myTeenClasses || [];

  const { data, loading, error } = useGetClassSessions(
    { is_active: true },
    { page: 1, limit: 200 },
  );

  const sessions =
    (data as { classSessions?: { sessions: ClassSession[] } })?.classSessions
      ?.sessions || [];

  const today = new Date().toISOString().slice(0, 10);

  const isSessionToday = (sessionDate: string) => sessionDate === today;

  const bySessionDateAsc = (a: ClassSession, b: ClassSession) =>
    a.session_date.localeCompare(b.session_date);
  const bySessionDateDesc = (a: ClassSession, b: ClassSession) =>
    b.session_date.localeCompare(a.session_date);

  const upcomingSessions = sessions
    .filter((s) => s.session_date >= today)
    .sort(bySessionDateAsc);

  const pastSessions = sessions
    .filter((s) => s.session_date < today)
    .sort(bySessionDateDesc);

  const formatSessionDate = (sessionDate: string) => {
    try {
      return format(parseISO(sessionDate), "PPP");
    } catch {
      return sessionDate;
    }
  };

  const filteredSessions = useCallback(
    (list: ClassSession[]) => {
      if (!searchTerm) return list;
      const term = searchTerm.toLowerCase();
      return list.filter(
        (session) =>
          session.title.toLowerCase().includes(term) ||
          (session.location || "").toLowerCase().includes(term) ||
          (session.description || "").toLowerCase().includes(term) ||
          (session.teenClass?.name || "").toLowerCase().includes(term),
      );
    },
    [searchTerm],
  );

  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1) setCurrentPage(page);
  };

  const getAttendanceStats = (session: ClassSession) => {
    const stats = session.attendanceStats;
    return {
      total: stats?.total ?? 0,
      present: stats?.present ?? 0,
      absent: stats?.absent ?? 0,
      attendanceRate: stats?.attendanceRate ?? 0,
    };
  };

  const getStatusBadge = (session: ClassSession) => {
    if (session.session_date === today) {
      return <Badge variant="default">Today</Badge>;
    }
    if (session.session_date < today) {
      return <Badge variant="secondary">Past</Badge>;
    }
    return <Badge variant="outline">Upcoming</Badge>;
  };

  const renderSessionAction = (
    session: ClassSession,
    options: { fullWidth?: boolean },
  ) => {
    const canRecord = isSessionToday(session.session_date);
    // Admins can always view teacher-filled attendance; teachers record today only
    const canView = isAdmin || !canRecord;

    const attendanceAction = (() => {
      if (canRecord) {
        return (
          <TeenAttendanceModal
            sessionId={session.id}
            classId={session.class_id}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className={
                  options.fullWidth
                    ? "flex-1 text-green-600 hover:bg-green-50"
                    : "text-green-600 hover:bg-green-50"
                }
              >
                <Users className="h-4 w-4 mr-1" />
                {options.fullWidth ? "Record Attendance" : "Record"}
              </Button>
            }
          />
        );
      }

      if (canView) {
        return (
          <TeenAttendanceModal
            sessionId={session.id}
            classId={session.class_id}
            readOnly
            trigger={
              <Button
                variant="outline"
                size="sm"
                className={options.fullWidth ? "flex-1" : ""}
              >
                <Eye className="h-4 w-4 mr-1" />
                {options.fullWidth ? "View Attendance" : "View"}
              </Button>
            }
          />
        );
      }

      return (
        <Button
          variant="outline"
          size="sm"
          disabled
          className={options.fullWidth ? "flex-1" : ""}
          title="Attendance can only be recorded on the session day"
        >
          <Users className="h-4 w-4 mr-1" />
          {options.fullWidth ? "Record Attendance" : "Record"}
        </Button>
      );
    })();

    return (
      <div
        className={
          options.fullWidth
            ? "flex flex-col sm:flex-row gap-2 w-full"
            : "flex items-center gap-2"
        }
      >
        {attendanceAction}
        <SessionTopicModal
          sessionId={session.id}
          currentTopic={session.topic}
          trigger={
            <Button
              variant="outline"
              size="sm"
              className={options.fullWidth ? "flex-1" : ""}
            >
              {session.topic ? "Edit Topic" : "Add Topic"}
            </Button>
          }
        />
      </div>
    );
  };

  const renderMobileCards = (
    list: ClassSession[],
    options: { showActions: boolean; finalLabel?: boolean },
  ) => {
    const paginated = list.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
    );

    return (
      <div className="block md:hidden space-y-3">
        {paginated.map((session) => {
          const stats = getAttendanceStats(session);
          return (
            <Card key={session.id} className="shadow-sm border">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-lg">{session.title}</div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(session)}
                      <Badge className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-900">
                        {stats.total} teens
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Class:</span>
                      <span>{session.teenClass?.name || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{formatSessionDate(session.session_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{session.location || "—"}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground shrink-0">
                        Topic:
                      </span>
                      <span className="text-right">
                        {session.topic || "Not set"}
                      </span>
                    </div>
                    {session.creator?.full_name && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Created by:
                        </span>
                        <span>{session.creator.full_name}</span>
                      </div>
                    )}
                  </div>

                  {stats.total > 0 && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">
                          {options.finalLabel
                            ? "Final Attendance"
                            : "Attendance"}
                        </h4>
                        <span className="text-sm font-medium text-green-600">
                          {stats.attendanceRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>{stats.present} Present</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <XCircle className="h-3 w-3 text-red-600" />
                          <span>{stats.absent} Absent</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>{stats.total} Total</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {options.showActions && (
                    <div className="flex space-x-2 pt-2">
                      {renderSessionAction(session, { fullWidth: true })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderDesktopTable = (
    list: ClassSession[],
    options: { showActions: boolean; finalLabel?: boolean },
  ) => {
    const paginated = list.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
    );

    return (
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-semibold">Session</th>
              <th className="text-left p-3 font-semibold">Class</th>
              <th className="text-left p-3 font-semibold">Topic</th>
              <th className="text-left p-3 font-semibold">Date</th>
              <th className="text-left p-3 font-semibold">Location</th>
              <th className="text-left p-3 font-semibold">Status</th>
              <th className="text-left p-3 font-semibold">
                {options.finalLabel ? "Final Attendance" : "Attendance"}
              </th>
              {options.showActions && (
                <th className="text-left p-3 font-semibold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginated.map((session) => {
              const stats = getAttendanceStats(session);
              return (
                <tr key={session.id} className="border-b hover:bg-muted/50">
                  <td className="p-3">
                    <div className="font-medium">{session.title}</div>
                    {session.description && (
                      <div className="text-sm text-muted-foreground">
                        {session.description}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="text-sm">
                      {session.teenClass?.name || "—"}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm text-muted-foreground max-w-[12rem] truncate">
                      {session.topic || "—"}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm">
                      {formatSessionDate(session.session_date)}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm">{session.location || "—"}</div>
                  </td>
                  <td className="p-3">{getStatusBadge(session)}</td>
                  <td className="p-3">
                    <div className="text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-green-600">
                          {stats.attendanceRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {stats.present}/{stats.total} present
                      </div>
                    </div>
                  </td>
                  {options.showActions && (
                    <td className="p-3">
                      {renderSessionAction(session, { fullWidth: false })}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  if (!classesLoading && myClasses.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Attendance Management"
          subtitle="Class sessions"
        />
        <ListErrorState
          layout="page"
          title={isAdmin ? "No Teen Classes" : "No Classes Assigned"}
          message={
            isAdmin
              ? "Create teen classes and session days before attendance can be recorded."
              : "You need to be assigned as a teacher to a teen class to manage attendance."
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Management"
        subtitle={`${sessions.length} sessions`}
      />

      <InlineSearchRow
        value={searchTerm}
        onChange={handleSearch}
        onClear={handleClearSearch}
        placeholder="Search sessions..."
      />

      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">Class Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              setCurrentPage(1);
            }}
          >
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
              <TabsTrigger value="past">Past Sessions</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4 mt-4">
              {loading ? (
                <ListLoadingState message="Loading sessions..." />
              ) : error ? (
                <ListErrorState
                  title="Error Loading Sessions"
                  message={error.message}
                  onRetry={() => window.location.reload()}
                />
              ) : filteredSessions(upcomingSessions).length === 0 ? (
                <ListEmptyState
                  icon="📅"
                  title={
                    searchTerm
                      ? "No upcoming sessions found matching your search"
                      : "No upcoming sessions found"
                  }
                  description={
                    searchTerm
                      ? "Try adjusting your search criteria or clear the filters to see all sessions."
                      : isAdmin
                        ? "Create a session day from Teen Sessions to open attendance for all classes."
                        : "No sessions have been scheduled yet. Contact an admin to create a session day."
                  }
                  secondaryAction={
                    searchTerm
                      ? { label: "Clear Filters", onClick: handleClearSearch }
                      : undefined
                  }
                />
              ) : (
                <div className="space-y-4">
                  {renderMobileCards(filteredSessions(upcomingSessions), {
                    showActions: true,
                  })}
                  {renderDesktopTable(filteredSessions(upcomingSessions), {
                    showActions: true,
                  })}
                  <ListPagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalItems={filteredSessions(upcomingSessions).length}
                    onPageChange={handlePageChange}
                    onPageSizeChange={(size) => {
                      setPageSize(size);
                      setCurrentPage(1);
                    }}
                    itemLabel="upcoming sessions"
                    showPageNumbers={false}
                    hideWhenSinglePage
                    filtered={!!searchTerm}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4 mt-4">
              {filteredSessions(pastSessions).length === 0 ? (
                <ListEmptyState
                  icon="📅"
                  title={
                    searchTerm
                      ? "No past sessions found matching your search"
                      : "No past sessions found"
                  }
                  description={
                    searchTerm
                      ? "Try adjusting your search criteria or clear the filters to see all sessions."
                      : "Past sessions will appear here once they are completed."
                  }
                  secondaryAction={
                    searchTerm
                      ? { label: "Clear Filters", onClick: handleClearSearch }
                      : undefined
                  }
                />
              ) : (
                <div className="space-y-4">
                  {renderMobileCards(filteredSessions(pastSessions), {
                    showActions: true,
                    finalLabel: true,
                  })}
                  {renderDesktopTable(filteredSessions(pastSessions), {
                    showActions: true,
                    finalLabel: true,
                  })}
                  <ListPagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalItems={filteredSessions(pastSessions).length}
                    onPageChange={handlePageChange}
                    onPageSizeChange={(size) => {
                      setPageSize(size);
                      setCurrentPage(1);
                    }}
                    itemLabel="past sessions"
                    showPageNumbers={false}
                    hideWhenSinglePage
                    filtered={!!searchTerm}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeenAttendanceManagement;
