import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useGetMyTeenClasses,
  useGetClassSessions,
} from "@/hooks/useTeenGraphQL";

const TeenTeacherDashboard = () => {
  const navigate = useNavigate();
  const { data: classesData } = useGetMyTeenClasses();
  const classes = (classesData as any)?.myTeenClasses || [];
  const { data: sessionsData } = useGetClassSessions(
    { is_active: true },
    { page: 1, limit: 20 },
  );
  const today = new Date().toISOString().slice(0, 10);
  const classIds = new Set(classes.map((c: any) => c.id));
  const todaySessions = (
    (sessionsData as any)?.classSessions?.sessions || []
  ).filter(
    (s: any) => classIds.has(s.class_id) && s.session_date === today,
  );

  const totalTeens = classes.reduce(
    (sum: number, c: any) => sum + (c.teenCount || 0),
    0,
  );

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Teen Teacher Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {classes.length} classes
            {todaySessions.length > 0
              ? ` · ${todaySessions.length} today`
              : ""}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">My Classes</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {classes.length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Teenagers</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{totalTeens}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Today&apos;s Sessions</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {todaySessions.length}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={() => navigate("/teen-classes/my-classes")}>
            Open My Classes
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/teen-attendance")}
          >
            Record Attendance
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {classes.map((c: any) => (
            <div
              key={c.id}
              className="flex items-center justify-between border rounded p-3"
            >
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-muted-foreground">
                  {c.teenCount || 0} teens
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/teen-classes/${c.id}`)}
              >
                Open
              </Button>
            </div>
          ))}
          {classes.length === 0 && (
            <p className="text-sm text-muted-foreground">
              You are not assigned to any classes yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeenTeacherDashboard;
