import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CLOSE_FOLLOW_UP_CASE,
  GET_FAMILIES,
  GRADUATE_FOLLOW_UP_CASE,
} from "@/graphql/operations";
import { CLOSE_STATUSES, FOLLOW_UP_STATUS_LABELS } from "@/lib/followUp";
import { toast } from "react-toastify";

interface GraduateFollowUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: number | null;
  defaultFamilyId?: number | null;
  onSuccess?: () => void;
}

export const GraduateFollowUpModal: React.FC<GraduateFollowUpModalProps> = ({
  open,
  onOpenChange,
  caseId,
  defaultFamilyId,
  onSuccess,
}) => {
  const [familyId, setFamilyId] = useState(
    defaultFamilyId ? String(defaultFamilyId) : "",
  );
  const [notes, setNotes] = useState("");

  const { data: familiesData } = useQuery(GET_FAMILIES, { skip: !open });
  const families = (familiesData as any)?.families || [];

  const [graduate, { loading }] = useMutation(GRADUATE_FOLLOW_UP_CASE, {

    onCompleted: () => {
      toast.success("Newcomer promoted to family");
      onOpenChange(false);
      setNotes("");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message.replace("CombinedGraphQLErrors: ", ""));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId || !familyId) {
      toast.error("Family is required");
      return;
    }
    await graduate({
      variables: {
        input: {
          case_id: caseId,
          family_id: Number(familyId),
          outcome_notes: notes || null,
          assignFamilyMemberRole: true,
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Promote to Family</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Family *</Label>
            <Select
              value={familyId || undefined}
              onValueChange={setFamilyId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select family" />
              </SelectTrigger>
              <SelectContent>
                {families.map((f: any) => (
                  <SelectItem key={f.id} value={String(f.id)}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Promote to Family"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface CloseFollowUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: number | null;
  onSuccess?: () => void;
}

export const CloseFollowUpModal: React.FC<CloseFollowUpModalProps> = ({
  open,
  onOpenChange,
  caseId,
  onSuccess,
}) => {
  const [status, setStatus] = useState(CLOSE_STATUSES[0]);
  const [notes, setNotes] = useState("");

  const [closeCase, { loading }] = useMutation(CLOSE_FOLLOW_UP_CASE, {

    onCompleted: () => {
      toast.success("Case closed");
      onOpenChange(false);
      setNotes("");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message.replace("CombinedGraphQLErrors: ", ""));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId) return;
    await closeCase({
      variables: {
        input: {
          case_id: caseId,
          status,
          outcome_notes: notes || null,
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Close follow-up case</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Outcome</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CLOSE_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {FOLLOW_UP_STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={loading}>
              {loading ? "Saving..." : "Close case"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
