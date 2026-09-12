import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMembers } from "@/hooks/useGraphQL";
import { useAssignClassTeacher } from "@/hooks/useTeenGraphQL";
import PasswordDisplayModal from "@/components/forms/PasswordDisplayModal";
import { ROLE, ROLE_LABELS } from "@/lib/roles";

interface Props {
  classId: number;
  className: string;
  existingTeacherIds?: number[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AssignClassTeacherModal = ({
  classId,
  className,
  existingTeacherIds = [],
  isOpen,
  onClose,
  onSuccess,
}: Props) => {
  const { data, loading: membersLoading } = useGetMembers(
    { role_name: ROLE.TT },
    { page: 1, limit: 100 },
    { skip: !isOpen },
  );
  const members = ((data as any)?.members?.members || []).filter(
    (m: any) => !existingTeacherIds.includes(m.id),
  );
  const [memberId, setMemberId] = useState<number | undefined>();
  const [password, setPassword] = useState<string | null>(null);
  const { assignClassTeacher, loading } = useAssignClassTeacher();

  const selected = useMemo(
    () => members.find((m: any) => m.id === memberId),
    [members, memberId],
  );

  const handleSubmit = async () => {
    if (!memberId) return;
    const result = await assignClassTeacher({
      class_id: classId,
      member_id: memberId,
    });
    if (result?.password) {
      setPassword(result.password);
    } else {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <>
      <Dialog
        open={isOpen && !password}
        onOpenChange={(o) => {
          if (!o) {
            setMemberId(undefined);
            onClose();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign teacher to {className}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Teenager Teacher</Label>
            <Select
              value={memberId ? String(memberId) : undefined}
              onValueChange={(v) => setMemberId(parseInt(v))}
              disabled={membersLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    membersLoading
                      ? "Loading teenager teachers..."
                      : "Select a teenager teacher"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {members.map((m: any) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.full_name}
                    {m.contact_no ? ` (${m.contact_no})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!membersLoading && members.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No available teenager teachers. Promote a member to Teenager
                Teacher first, then assign them here.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!memberId || loading || members.length === 0}
            >
              Assign Teacher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {password && (
        <PasswordDisplayModal
          isOpen={!!password}
          password={password}
          memberName={selected?.full_name || "Teacher"}
          role={ROLE_LABELS.TT}
          onClose={() => {
            setPassword(null);
            setMemberId(undefined);
            onSuccess?.();
            onClose();
          }}
        />
      )}
    </>
  );
};

export default AssignClassTeacherModal;
