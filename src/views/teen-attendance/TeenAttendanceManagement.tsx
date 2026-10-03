import { TeenAttendanceModal } from "@/components/forms/TeenAttendanceModal";
import SessionTopicModal from "@/components/forms/SessionTopicModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "@/components/ui/theme-toggle";
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
  Search,
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

  const renderPagination = (list: ClassSession[], label: string) => {
    const totalPages = Math.ceil(list.length / pageSize);
    if (totalPages <= 1) return null;

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mt-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Show:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setCurrentPage(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </Select>
          <span className="text-sm text-muted-foreground">per page</span>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, list.length)} of {list.length}{" "}
          {label}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>

          <div className="flex space-x-1">
            {(() => {
              const maxVisiblePages = 5;
              const halfVisible = Math.floor(maxVisiblePages / 2);
              let startPage = Math.max(1, currentPage - halfVisible);
              const endPage = Math.min(
                totalPages,
                startPage + maxVisiblePages - 1,
              );
              if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
              }
              const pages = [];
              for (let i = startPage; i <= endPage; i++) pages.push(i);
              return pages.map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={
                    currentPage === page ? "bg-brand-gradient text-white" : ""
                  }
                >
                  {page}
                </Button>
              ));
            })()}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-gradient">
              Attendance Management
            </h1>
            <p className="text-muted-foreground">
              {isAdmin
                ? "Review attendance recorded by teen class teachers"
                : "Manage class sessions and track teenager attendance"}
            </p>
          </div>
          <ThemeToggle variant="icon" />
        </div>
        <Card className="shadow-brand">
          <CardContent>
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-red-600">
                {isAdmin ? "No Teen Classes" : "No Classes Assigned"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {isAdmin
                  ? "Create teen classes and session days before attendance can be recorded."
                  : "You need to be assigned as a teacher to a teen class to manage attendance."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-gradient">
            Attendance Management
          </h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? `Review attendance recorded by teachers (${sessions.length} sessions)`
              : `Manage class sessions and track teenager attendance (${sessions.length} total)`}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle variant="icon" />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchTerm && (
          <Button
            onClick={handleClearSearch}
            variant="outline"
            className="border-primary hover:bg-primary hover:text-primary-foreground"
          >
            Clear
          </Button>
        )}
      </div>

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
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                  <p className="mt-4 text-muted-foreground">
                    Loading sessions...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="h-16 w-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-red-600">
                    Error Loading Sessions
                  </h3>
                  <p className="text-muted-foreground mb-4">{error.message}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-brand-gradient hover:opacity-90 transition-opacity"
                  >
                    Retry
                  </Button>
                </div>
              ) : filteredSessions(upcomingSessions).length === 0 ? (
                <div className="text-center py-12">
                  <div className="h-16 w-16 bg-brand-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl">📅</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm
                      ? "No upcoming sessions found matching your search"
                      : "No upcoming sessions found"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "Try adjusting your search criteria or clear the filters to see all sessions."
                      : isAdmin
                        ? "Create a session day from Teen Sessions to open attendance for all classes."
                        : "No sessions have been scheduled yet. Contact an admin to create a session day."}
                  </p>
                  {searchTerm && (
                    <Button
                      onClick={handleClearSearch}
                      variant="outline"
                      className="border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {renderMobileCards(filteredSessions(upcomingSessions), {
                    showActions: true,
                  })}
                  {renderDesktopTable(filteredSessions(upcomingSessions), {
                    showActions: true,
                  })}
                  {renderPagination(
                    filteredSessions(upcomingSessions),
                    "upcoming sessions",
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4 mt-4">
              {filteredSessions(pastSessions).length === 0 ? (
                <div className="text-center py-12">
                  <div className="h-16 w-16 bg-brand-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl">📅</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm
                      ? "No past sessions found matching your search"
                      : "No past sessions found"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "Try adjusting your search criteria or clear the filters to see all sessions."
                      : "Past sessions will appear here once they are completed."}
                  </p>
                  {searchTerm && (
                    <Button
                      onClick={handleClearSearch}
                      variant="outline"
                      className="border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
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
                  {renderPagination(
                    filteredSessions(pastSessions),
                    "past sessions",
                  )}
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
