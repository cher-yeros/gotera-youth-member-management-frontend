import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
} from "@/graphql/operations";
import { useMutation, useQuery } from "@apollo/client/react";
import { CheckCircle, Save, Users, XCircle } from "lucide-react";
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
  const [isEditing, setIsEditing] = useState(false);

  const { data: familyData, loading: familyLoading } = useQuery(
    GET_FAMILY_MEMBERS,
    {
      variables: { familyId },
      skip: !open,
    }
  );

  const { data: existingAttendanceData, loading: attendanceLoading } = useQuery(
    GET_FAMILY_MEMBER_ATTENDANCES,
    {
      variables: {
        filter: { meetup_id: meetupId },
        pagination: { page: 1, limit: 100 },
      },
      skip: !open,
    }
  );

  const [bulkCreateAttendance, { loading: saving }] = useMutation(
    BULK_CREATE_ATTENDANCE,
    {
      onCompleted: () => {
        toast.success(
          isEditing
            ? "Attendance updated successfully!"
            : "Attendance recorded successfully!"
        );
        setOpen(false);
        setAttendanceRecords([]);
        setNotes({});
        setIsEditing(false);
      },
      onError: (error) => {
        toast.error(
          `Error ${isEditing ? "updating" : "recording"} attendance: ${
            error.message
          }`
        );
      },
    }
  );

  useEffect(() => {
    if ((familyData as { family?: { members: Member[] } })?.family?.members) {
      const members = (familyData as { family: { members: Member[] } }).family
        .members;
      const existingAttendances =
        (
          existingAttendanceData as {
            familyMemberAttendances?: { attendances: ExistingAttendance[] };
          }
        )?.familyMemberAttendances?.attendances || [];

      // Check if we have existing attendance records
      const hasExistingAttendance = existingAttendances.length > 0;
      setIsEditing(hasExistingAttendance);

      // Create a map of existing attendance for quick lookup
      const existingAttendanceMap = new Map(
        existingAttendances.map((att) => [att.member_id, att])
      );

      const initialRecords: AttendanceRecord[] = members.map(
        (member: Member) => {
          const existingAttendance = existingAttendanceMap.get(member.id);
          return {
            member_id: member.id,
            is_present: existingAttendance?.is_present || false,
            notes: existingAttendance?.notes || "",
          };
        }
      );

      setAttendanceRecords(initialRecords);

      // Set notes from existing attendance
      const notesMap: { [key: number]: string } = {};
      existingAttendances.forEach((att) => {
        notesMap[att.member_id] = att.notes || "";
      });
      setNotes(notesMap);
    }
  }, [familyData, existingAttendanceData]);

  const handleAttendanceChange = (memberId: number, isPresent: boolean) => {
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.member_id === memberId
          ? { ...record, is_present: isPresent }
          : record
      )
    );
  };

  const handleNotesChange = (memberId: number, note: string) => {
    setNotes((prev) => ({
      ...prev,
      [memberId]: note,
    }));
  };

  const handleSave = async () => {
    const attendanceData = attendanceRecords.map((record) => ({
      meetup_id: meetupId,
      member_id: record.member_id,
      is_present: record.is_present,
      notes: notes[record.member_id] || "",
    }));

    try {
      await bulkCreateAttendance({
        variables: {
          input: {
            meetup_id: meetupId,
            attendances: attendanceData,
          },
        },
      });
    } catch (error) {
      console.error("Error saving attendance:", error);
    }
  };

  const presentCount = attendanceRecords.filter((r) => r.is_present).length;
  const totalCount = attendanceRecords.length;
  const attendanceRate = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;

  if (familyLoading || attendanceLoading) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
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
    <Dialog open={open} onOpenChange={setOpen}>
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
          <DialogTitle>
            {isEditing ? "Edit Family Attendance" : "Record Family Attendance"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
                    {totalCount - presentCount}
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
                  (r) => r.member_id === member.id
                );
                const isPresent = record?.is_present || false;

                return (
                  <Card key={member.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <h4 className="font-medium">{member.full_name}</h4>
                            {member.contact_no && (
                              <p className="text-sm text-muted-foreground">
                                {member.contact_no}
                              </p>
                            )}
                            {member.role && (
                              <Badge variant="secondary" className="text-xs">
                                {member.role.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`present-${member.id}`}
                            checked={isPresent}
                            onCheckedChange={(checked) =>
                              handleAttendanceChange(
                                member.id,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`present-${member.id}`}
                            className="flex items-center gap-2"
                          >
                            {isPresent ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            {isPresent ? "Present" : "Absent"}
                          </Label>
                        </div>
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

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving
                ? isEditing
                  ? "Updating..."
                  : "Saving..."
                : isEditing
                ? "Update Attendance"
                : "Save Attendance"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
