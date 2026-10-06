import { useNavigate } from "react-router-dom";
import StatCard from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LoadingCard from "@/components/ui/loading-card";
import PageHeader from "@/components/shared/PageHeader";
import {
  useGetMyTeenClasses,
  useGetClassSessions,
} from "@/hooks/useTeenGraphQL";
import { BookOpen, CalendarCheck, GraduationCap, Users } from "lucide-react";

type TeenClassItem = {
  id: number;
  name: string;
  teenCount?: number | null;
  teacherCount?: number | null;
};

type ClassSession = {
  id: number;
  class_id: number;
  title: string;
  session_date: string;
  teenClass?: { id: number; name: string } | null;
};

const TeenTeacherDashboard = () => {
  const navigate = useNavigate();
  const { data: classesData, loading: classesLoading } = useGetMyTeenClasses();
  const classes: TeenClassItem[] =
    (classesData as { myTeenClasses?: TeenClassItem[] })?.myTeenClasses || [];

  const { data: sessionsData, loading: sessionsLoading } = useGetClassSessions(
    { is_active: true },
    { page: 1, limit: 50 },
  );

  const today = new Date().toISOString().slice(0, 10);
  const classIds = new Set(classes.map((c) => c.id));
  const todaySessions: ClassSession[] = (
    (sessionsData as { classSessions?: { sessions: ClassSession[] } })
      ?.classSessions?.sessions || []
  ).filter((s) => classIds.has(s.class_id) && s.session_date === today);

  const totalTeens = classes.reduce((sum, c) => sum + (c.teenCount || 0), 0);

  const isLoading = classesLoading || sessionsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Teen Teacher Dashboard"
          subtitle="Loading dashboard..."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <LoadingCard
              key={index}
              variant="minimal"
              className="hover-brand-glow transition-all duration-300"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teen Teacher Dashboard"
        subtitle={`${classes.length} classes${
          todaySessions.length > 0
            ? ` · ${todaySessions.length} session${todaySessions.length === 1 ? "" : "s"} today`
            : ""
        }`}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="My Classes"
          value={classes.length}
          icon={BookOpen}
          tone="primary"
        />
        <StatCard
          title="Teenagers"
          value={totalTeens}
          icon={GraduationCap}
          tone="secondary"
        />
        <StatCard
          title="Today's Sessions"
          value={todaySessions.length}
          icon={CalendarCheck}
          tone="accent"
        />
      </div>

      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            className="bg-brand-gradient hover:opacity-90 transition-opacity"
            onClick={() => navigate("/teen-classes/my-classes")}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Open My Classes
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/teen-attendance")}
          >
            <Users className="h-4 w-4 mr-2" />
            Record Attendance
          </Button>
        </CardContent>
      </Card>

      {todaySessions.length > 0 && (
        <Card className="shadow-brand">
          <CardHeader>
            <CardTitle className="text-brand-gradient">
              Today&apos;s Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todaySessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between border rounded-lg p-3"
              >
                <div>
                  <div className="font-medium">{session.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {session.teenClass?.name || "Class"}
                  </div>
                </div>
                <Badge variant="default">Today</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">Classes</CardTitle>
        </CardHeader>
        <CardContent>
          {classes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                You are not assigned to any classes yet.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {classes.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between border rounded-lg p-3 hover:bg-muted/50"
                >
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {c.teenCount || 0} teens
                      {c.teacherCount != null
                        ? ` · ${c.teacherCount} teachers`
                        : ""}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 hover:bg-green-50"
                    onClick={() => navigate(`/teen-classes/${c.id}`)}
                  >
                    Open
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeenTeacherDashboard;
