import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { brandColors } from "@/theme/brand";

export type AttendanceHistoryPoint = {
  id: number;
  date: string;
  label: string;
  isPresent: boolean;
  notes?: string | null;
  context?: string | null;
};

type PersonAttendanceHistoryProps = {
  title?: string;
  emptyLabel?: string;
  loading?: boolean;
  records: AttendanceHistoryPoint[];
  totalCount?: number;
};

function formatShortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function formatFullDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const PersonAttendanceHistory = ({
  title = "Attendance & availability",
  emptyLabel = "No attendance records yet.",
  loading = false,
  records,
  totalCount,
}: PersonAttendanceHistoryProps) => {
  const chronological = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const recentFirst = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const present = records.filter((r) => r.isPresent).length;
  const absent = records.length - present;
  const rate = records.length
    ? Math.round((present / records.length) * 100)
    : 0;

  const chartData = chronological.map((record) => ({
    id: record.id,
    date: formatShortDate(record.date),
    fullDate: formatFullDate(record.date),
    label: record.label,
    value: 1,
    isPresent: record.isPresent,
    status: record.isPresent ? "Present" : "Absent",
    context: record.context,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">
            Presence over recent family meetups or class sessions.
          </p>
        </div>
        {typeof totalCount === "number" && totalCount > records.length ? (
          <Badge variant="secondary" className="text-xs">
            Showing latest {records.length} of {totalCount}
          </Badge>
        ) : null}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Loading attendance...
        </p>
      ) : records.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center border rounded-lg">
          {emptyLabel}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Records</p>
              <p className="text-xl font-semibold">{records.length}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Present</p>
              <p className="text-xl font-semibold text-green-600">{present}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Absent</p>
              <p className="text-xl font-semibold text-red-600">{absent}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Attendance rate</p>
              <p className="text-xl font-semibold">{rate}%</p>
            </div>
          </div>

          <div className="rounded-lg border p-3 sm:p-4">
            <p className="text-sm font-medium mb-3">Availability over time</p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis hide domain={[0, 1]} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const point = payload[0]
                        ?.payload as (typeof chartData)[number];
                      return (
                        <div className="rounded-md border bg-card px-3 py-2 text-xs shadow-sm">
                          <p className="font-medium">{point.label}</p>
                          <p className="text-muted-foreground">
                            {point.fullDate}
                          </p>
                          {point.context ? (
                            <p className="text-muted-foreground">
                              {point.context}
                            </p>
                          ) : null}
                          <p
                            className={
                              point.isPresent
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {point.status}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={28}>
                    {chartData.map((entry) => (
                      <Cell
                        key={entry.id}
                        fill={
                          entry.isPresent
                            ? brandColors.success[500]
                            : brandColors.error[500]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: brandColors.success[500] }}
                />
                Present
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: brandColors.error[500] }}
                />
                Absent
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Recent records</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentFirst.slice(0, 12).map((record) => (
                <div
                  key={record.id}
                  className="flex items-start justify-between gap-3 rounded-lg border px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {record.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFullDate(record.date)}
                      {record.context ? ` · ${record.context}` : ""}
                    </p>
                    {record.notes ? (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {record.notes}
                      </p>
                    ) : null}
                  </div>
                  <Badge
                    className={
                      record.isPresent
                        ? "bg-green-100 text-green-800 shrink-0"
                        : "bg-red-100 text-red-800 shrink-0"
                    }
                  >
                    {record.isPresent ? "Present" : "Absent"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PersonAttendanceHistory;
