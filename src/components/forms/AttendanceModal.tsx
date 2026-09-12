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
  BULK_CREATE_ATTENDANCE,
  GET_FAMILY_MEMBERS,
  GET_FAMILY_MEMBER_ATTENDANCES,
  GET_FAMILY_MEETUPS,
} from "@/graphql/operations";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { CheckCircle, Users, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface AttendanceModalProps {
  meetupId: number;
  familyId: number;
  trigger?: React.ReactNode;
}

interface Member {
  id: number;
  full_name: string;
  contact_no?: string;
  role?: {
    id: number;
    name: string;
  };
}

interface AttendanceRecord {
  member_id: number;
  is_present: boolean;
  notes?: string;
  /** True once this member has a saved attendance row */
  recorded: boolean;
}

interface ExistingAttendance {
  id: number;
  member_id: number;
  is_present: boolean;
  notes?: string;
  member: {
    id: number;
    full_name: string;
  };
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({
  meetupId,
  familyId,
  trigger,
}) => {
  const [open, setOpen] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [notes, setNotes] = useState<{ [key: number]: string }>({});
  const [hydrated, setHydrated] = useState(false);
  const client = useApolloClient();

  const { data: familyData, loading: familyLoading } = useQuery(
    GET_FAMILY_MEMBERS,
    {
      variables: { familyId },
      skip: !open,
    },
  );

  const { data: existingAttendanceData, loading: attendanceLoading } = useQuery(
    GET_FAMILY_MEMBER_ATTENDANCES,
    {
      variables: {
        filter: { meetup_id: meetupId },
        pagination: { page: 1, limit: 100 },
      },
      skip: !open,
      fetchPolicy: "network-only",
    },
  );

  const [bulkCreateAttendance] = useMutation(BULK_CREATE_ATTENDANCE);

  // Load once when the modal opens — do not reset after optimistic saves
  useEffect(() => {
    if (!open) {
      setHydrated(false);
      return;
    }
    if (hydrated) return;

    const members = (familyData as { family?: { members: Member[] } })?.family
      ?.members;
    if (!members || attendanceLoading) return;

    const existingAttendances =
      (
        existingAttendanceData as {
          familyMemberAttendances?: { attendances: ExistingAttendance[] };
        }
      )?.familyMemberAttendances?.attendances || [];

    const existingAttendanceMap = new Map(
      existingAttendances.map((att) => [att.member_id, att]),
    );

    setAttendanceRecords(
      members.map((member: Member) => {
        const existingAttendance = existingAttendanceMap.get(member.id);
        return {
          member_id: member.id,
          is_present: existingAttendance?.is_present || false,
          notes: existingAttendance?.notes || "",
          recorded: !!existingAttendance,
        };
      }),
    );

    const notesMap: { [key: number]: string } = {};
    existingAttendances.forEach((att) => {
      notesMap[att.member_id] = att.notes || "";
    });
    setNotes(notesMap);
    setHydrated(true);
  }, [open, hydrated, familyData, existingAttendanceData, attendanceLoading]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    // Refresh meetup list only after closing, without interrupting the modal
    if (!nextOpen) {
      client.refetchQueries({
        include: [GET_FAMILY_MEETUPS],
      });
    }
  };

  const handleAttendanceChange = async (
    memberId: number,
    isPresent: boolean,
  ) => {
    const previous = attendanceRecords.find((r) => r.member_id === memberId);

    // Instant UI flip — API runs in the background
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.member_id === memberId
          ? { ...record, is_present: isPresent, recorded: true }
          : record,
      ),
    );

    try {
      await bulkCreateAttendance({
        variables: {
          input: {
            meetup_id: meetupId,
            attendances: [
              {
                meetup_id: meetupId,
                member_id: memberId,
                is_present: isPresent,
                notes: notes[memberId] || "",
              },
            ],
          },
        },
      });
    } catch (error: unknown) {
      if (previous) {
        setAttendanceRecords((prev) =>
          prev.map((record) =>
            record.member_id === memberId ? previous : record,
          ),
        );
      }
      const message =
        error instanceof Error ? error.message : "Failed to save attendance";
      toast.error(message);
    }
  };

  const handleNotesChange = (memberId: number, note: string) => {
    setNotes((prev) => ({
      ...prev,
      [memberId]: note,
    }));
  };

  const handleNotesBlur = async (memberId: number) => {
    const record = attendanceRecords.find((r) => r.member_id === memberId);
    if (!record?.recorded) return;

    try {
      await bulkCreateAttendance({
        variables: {
          input: {
            meetup_id: meetupId,
            attendances: [
              {
                meetup_id: meetupId,
                member_id: memberId,
                is_present: record.is_present,
                notes: notes[memberId] || "",
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
  const totalCount = attendanceRecords.length;
  const attendanceRate =
    recordedRecords.length > 0
      ? (presentCount / recordedRecords.length) * 100
      : 0;

  if (familyLoading || attendanceLoading || (open && !hydrated)) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {trigger || (
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Record Attendance
            </Button>
          )}
        </DialogTrigger>
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
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Users className="h-4 w-4 mr-2" />
            Record Attendance
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Family Attendance</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Click Present or Absent for each member — changes save
            automatically.
          </p>

          {/* Attendance Summary */}
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
                    Total Members
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

          {/* Member List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Family Members</h3>
            <div className="grid gap-3">
              {(
                familyData as { family?: { members: Member[] } }
              )?.family?.members?.map((member: Member) => {
                const record = attendanceRecords.find(
                  (r) => r.member_id === member.id,
                );
                const isRecorded = record?.recorded || false;
                const isPresent = isRecorded && (record?.is_present || false);
                const isAbsent = isRecorded && !record?.is_present;

                return (
                  <Card key={member.id} className="p-3 sm:p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">
                          {member.full_name}
                        </h4>
                        {member.contact_no && (
                          <p className="text-sm text-muted-foreground">
                            {member.contact_no}
                          </p>
                        )}
                        {member.role && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            {member.role.name}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
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
                            handleAttendanceChange(member.id, true)
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
                            handleAttendanceChange(member.id, false)
                          }
                        >
                          <XCircle className="h-4 w-4 mr-1.5" />
                          Absent
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Label htmlFor={`notes-${member.id}`} className="text-sm">
                        Notes (optional)
                      </Label>
                      <Textarea
                        id={`notes-${member.id}`}
                        value={notes[member.id] || ""}
                        onChange={(e) =>
                          handleNotesChange(member.id, e.target.value)
                        }
                        onBlur={() => handleNotesBlur(member.id)}
                        placeholder="Add notes for this member..."
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
