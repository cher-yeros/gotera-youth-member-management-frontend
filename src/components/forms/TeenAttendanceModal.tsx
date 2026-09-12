import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BULK_CREATE_TEEN_ATTENDANCE,
  GET_CLASS_SESSION,
  GET_CLASS_SESSIONS,
  GET_TEENAGERS,
} from "@/graphql/operations";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { CheckCircle, Users, XCircle } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

interface TeenAttendanceModalProps {
  sessionId: number;
  classId: number;
  trigger?: React.ReactNode;
  /** When true, show recorded attendance without editing */
  readOnly?: boolean;
}

interface Teenager {
  id: number;
  full_name: string;
  contact_no?: string;
  guardian_name?: string;
}

interface AttendanceRecord {
  teenager_id: number;
  is_present: boolean;
  notes?: string;
  recorded: boolean;
  recorder_name?: string;
}

interface ExistingAttendance {
  id: number;
  teenager_id: number;
  is_present: boolean;
  notes?: string;
  teenager?: {
    id: number;
    full_name: string;
    contact_no?: string;
  };
  recorder?: {
    id: number;
    full_name: string;
  };
}

export const TeenAttendanceModal: React.FC<TeenAttendanceModalProps> = ({
  sessionId,
  classId,
  trigger,
  readOnly = false,
}) => {
  const [open, setOpen] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [notes, setNotes] = useState<{ [key: number]: string }>({});
  const [hydrated, setHydrated] = useState(false);
  const client = useApolloClient();

  const { data: teensData, loading: teensLoading } = useQuery(GET_TEENAGERS, {
    variables: {
      filter: { class_id: classId, status: "ACTIVE" },
      pagination: { page: 1, limit: 100 },
    },
    skip: !open,
  });

  const { data: sessionData, loading: sessionLoading } = useQuery(
    GET_CLASS_SESSION,
    {
      variables: { id: sessionId },
      skip: !open,
      fetchPolicy: "network-only",
    },
  );

  const [bulkCreateTeenAttendance] = useMutation(BULK_CREATE_TEEN_ATTENDANCE);

  const teens = useMemo(() => {
    const active =
      (teensData as { teenagers?: { teenagers: Teenager[] } })?.teenagers
        ?.teenagers || [];
    const existing =
      (
        sessionData as {
          classSession?: { attendances: ExistingAttendance[] };
        }
      )?.classSession?.attendances || [];

    const byId = new Map(active.map((t) => [t.id, t]));
    for (const att of existing) {
      if (!byId.has(att.teenager_id) && att.teenager) {
        byId.set(att.teenager_id, {
          id: att.teenager.id,
          full_name: att.teenager.full_name,
          contact_no: att.teenager.contact_no,
        });
      }
    }
    return Array.from(byId.values()).sort((a, b) =>
      a.full_name.localeCompare(b.full_name),
    );
  }, [teensData, sessionData]);

  useEffect(() => {
    if (!open) {
      setHydrated(false);
      return;
    }
    if (hydrated || teensLoading || sessionLoading) return;
    if (!teensData || !sessionData) return;

    const existingAttendances =
      (
        sessionData as {
          classSession?: { attendances: ExistingAttendance[] };
        }
      )?.classSession?.attendances || [];

    const existingMap = new Map(
      existingAttendances.map((att) => [att.teenager_id, att]),
    );

    setAttendanceRecords(
      teens.map((teen) => {
        const existing = existingMap.get(teen.id);
        return {
          teenager_id: teen.id,
          is_present: existing?.is_present || false,
          notes: existing?.notes || "",
          recorded: !!existing,
          recorder_name: existing?.recorder?.full_name,
        };
      }),
    );

    const notesMap: { [key: number]: string } = {};
    existingAttendances.forEach((att) => {
      notesMap[att.teenager_id] = att.notes || "";
    });
    setNotes(notesMap);
    setHydrated(true);
  }, [
    open,
    hydrated,
    teensLoading,
    sessionLoading,
    teensData,
    sessionData,
    teens,
  ]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      client.refetchQueries({
        include: [GET_CLASS_SESSIONS],
      });
    }
  };

  const handleAttendanceChange = async (
    teenagerId: number,
    isPresent: boolean,
  ) => {
    if (readOnly) return;

    const previous = attendanceRecords.find(
      (r) => r.teenager_id === teenagerId,
    );

    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.teenager_id === teenagerId
          ? { ...record, is_present: isPresent, recorded: true }
          : record,
      ),
    );

    try {
      await bulkCreateTeenAttendance({
        variables: {
          input: {
            session_id: sessionId,
            attendances: [
              {
                teenager_id: teenagerId,
                is_present: isPresent,
                notes: notes[teenagerId] || "",
              },
            ],
          },
        },
      });
    } catch (error: unknown) {
      if (previous) {
        setAttendanceRecords((prev) =>
          prev.map((record) =>
            record.teenager_id === teenagerId ? previous : record,
          ),
        );
      }
      const message =
        error instanceof Error ? error.message : "Failed to save attendance";
      toast.error(message);
    }
  };

  const handleNotesChange = (teenagerId: number, note: string) => {
    if (readOnly) return;
    setNotes((prev) => ({
      ...prev,
      [teenagerId]: note,
    }));
  };

  const handleNotesBlur = async (teenagerId: number) => {
    if (readOnly) return;
    const record = attendanceRecords.find((r) => r.teenager_id === teenagerId);
    if (!record?.recorded) return;

    try {
      await bulkCreateTeenAttendance({
        variables: {
          input: {
            session_id: sessionId,
            attendances: [
              {
                teenager_id: teenagerId,
                is_present: record.is_present,
                notes: notes[teenagerId] || "",
              },
            ],
          },
        },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to save notes";
      toast.error(message);
    }
  };

  const recordedRecords = attendanceRecords.filter((r) => r.recorded);
  const presentCount = recordedRecords.filter((r) => r.is_present).length;
  const absentCount = recordedRecords.filter((r) => !r.is_present).length;
  const totalCount = Math.max(attendanceRecords.length, teens.length);
  const attendanceRate =
    recordedRecords.length > 0
      ? (presentCount / recordedRecords.length) * 100
      : 0;

  const defaultTrigger = (
    <Button>
      <Users className="h-4 w-4 mr-2" />
      {readOnly ? "View Attendance" : "Record Attendance"}
    </Button>
  );

  if (teensLoading || sessionLoading || (open && !hydrated)) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">Loading...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {readOnly ? "View Class Attendance" : "Record Class Attendance"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            {readOnly
              ? "Attendance recorded by class teachers."
              : "Click Present or Absent for each teenager — changes save automatically."}
          </p>

          {(
            sessionData as {
              classSession?: { topic?: string | null };
            }
          )?.classSession?.topic && (
            <div className="rounded-lg border bg-muted/30 px-3 py-2 text-sm">
              <span className="font-medium">Topic taught: </span>
              <span className="text-muted-foreground">
                {
                  (
                    sessionData as {
                      classSession?: { topic?: string | null };
                    }
                  ).classSession?.topic
                }
              </span>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Attendance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {presentCount}
                  </div>
                  <div className="text-sm text-muted-foreground">Present</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {absentCount}
                  </div>
                  <div className="text-sm text-muted-foreground">Absent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalCount}</div>
                  <div className="text-sm text-muted-foreground">
                    Total Teenagers
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {attendanceRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Attendance Rate
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Class Teenagers</h3>
            {teens.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {readOnly
                  ? "No attendance has been recorded for this session yet."
                  : "No active teenagers in this class."}
              </p>
            ) : (
              <div className="grid gap-3">
                {teens.map((teen) => {
                  const record = attendanceRecords.find(
                    (r) => r.teenager_id === teen.id,
                  );
                  const isRecorded = record?.recorded || false;
                  const isPresent = isRecorded && (record?.is_present || false);
                  const isAbsent = isRecorded && !record?.is_present;

                  return (
                    <Card key={teen.id} className="p-3 sm:p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">
                            {teen.full_name}
                          </h4>
                          {teen.contact_no && (
                            <p className="text-sm text-muted-foreground">
                              {teen.contact_no}
                            </p>
                          )}
                          {teen.guardian_name && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              Guardian: {teen.guardian_name}
                            </Badge>
                          )}
                          {readOnly && record?.recorder_name && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Recorded by {record.recorder_name}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {readOnly ? (
                            !isRecorded ? (
                              <Badge variant="outline">Not recorded</Badge>
                            ) : isPresent ? (
                              <Badge className="bg-green-600 hover:bg-green-600 text-white">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Present
                              </Badge>
                            ) : (
                              <Badge className="bg-red-600 hover:bg-red-600 text-white">
                                <XCircle className="h-3 w-3 mr-1" />
                                Absent
                              </Badge>
                            )
                          ) : (
                            <>
                              <Button
                                type="button"
                                size="sm"
                                variant={isPresent ? "default" : "outline"}
                                className={
                                  isPresent
                                    ? "bg-green-600 hover:bg-green-700 text-white min-w-[5.75rem] h-9 text-sm transition-colors"
                                    : "min-w-[5.75rem] h-9 text-sm transition-colors"
                                }
                                onClick={() =>
                                  handleAttendanceChange(teen.id, true)
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-1.5" />
                                Present
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant={isAbsent ? "default" : "outline"}
                                className={
                                  isAbsent
                                    ? "bg-red-600 hover:bg-red-700 text-white min-w-[5.75rem] h-9 text-sm transition-colors"
                                    : "min-w-[5.75rem] h-9 text-sm transition-colors"
                                }
                                onClick={() =>
                                  handleAttendanceChange(teen.id, false)
                                }
                              >
                                <XCircle className="h-4 w-4 mr-1.5" />
                                Absent
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {(readOnly ? !!(notes[teen.id] || "").trim() : true) && (
                        <div className="mt-3">
                          <Label
                            htmlFor={`teen-notes-${teen.id}`}
                            className="text-sm"
                          >
                            Notes{readOnly ? "" : " (optional)"}
                          </Label>
                          {readOnly ? (
                            <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                              {notes[teen.id]}
                            </p>
                          ) : (
                            <Textarea
                              id={`teen-notes-${teen.id}`}
                              value={notes[teen.id] || ""}
                              onChange={(e) =>
                                handleNotesChange(teen.id, e.target.value)
                              }
                              onBlur={() => handleNotesBlur(teen.id)}
                              placeholder="Add notes for this teenager..."
                              rows={2}
                              className="mt-1"
                            />
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              {readOnly ? "Close" : "Done"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeenAttendanceModal;
