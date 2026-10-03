import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  ASSIGN_FOLLOW_UP_CASE,
  GET_FOLLOW_UP_COORDINATORS,
  REASSIGN_FOLLOW_UP_CASE,
} from "@/graphql/operations";
import { isFollowUpCoordinator, ROLE_LABELS } from "@/lib/roles";
import { useAuth } from "@/redux/useAuth";
import { toast } from "react-toastify";

interface AssignFollowUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: number | null;
  isReassign?: boolean;
  onSuccess?: () => void;
}

export const AssignFollowUpModal: React.FC<AssignFollowUpModalProps> = ({
  open,
  onOpenChange,
  caseId,
  isReassign = false,
  onSuccess,
}) => {
  const { user } = useAuth();
  const canAssign = isFollowUpCoordinator(user);
  const [assignedTo, setAssignedTo] = useState("");
  const [reason, setReason] = useState("");
  const [nextFollowUp, setNextFollowUp] = useState("");

  const { data: coordinatorsData, loading: coordinatorsLoading } = useQuery(
    GET_FOLLOW_UP_COORDINATORS,
    {
      skip: !open || !canAssign,
      fetchPolicy: "network-only",
    },
  );

  const members = (coordinatorsData as any)?.followUpCoordinators || [];

  const [assign, { loading }] = useMutation(
    isReassign ? REASSIGN_FOLLOW_UP_CASE : ASSIGN_FOLLOW_UP_CASE,
    {

      onCompleted: () => {
        toast.success(isReassign ? "Case reassigned" : "Case assigned");
        onOpenChange(false);
        setAssignedTo("");
        setReason("");
        setNextFollowUp("");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message.replace("CombinedGraphQLErrors: ", ""));
      },
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId) return;

    if (!canAssign) {
      toast.error("Only Follow Up Coordinators can assign cases");
      return;
    }

    const targetId = Number(assignedTo);
    if (!targetId) {
      toast.error(`Select a ${ROLE_LABELS.FUL}`);
      return;
    }

    await assign({
      variables: {
        input: {
          case_id: caseId,
          assigned_to: targetId,
          reason: reason || null,
          next_follow_up_at: nextFollowUp
            ? new Date(nextFollowUp).toISOString()
            : null,
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isReassign
              ? `Reassign to another ${ROLE_LABELS.FUL}`
              : `Assign to ${ROLE_LABELS.FUL}`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{ROLE_LABELS.FUL}</Label>
            <Select
              value={assignedTo || undefined}
              onValueChange={setAssignedTo}
              disabled={coordinatorsLoading || !canAssign}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    coordinatorsLoading
                      ? `Loading ${ROLE_LABELS.FUL}...`
                      : members.length
                        ? `Select ${ROLE_LABELS.FUL}`
                        : `No ${ROLE_LABELS.FUL} found`
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {members.map((m: any) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.full_name}
                    {m.id === user?.member?.id ? " (you)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="next">Next follow-up</Label>
            <Input
              id="next"
              type="datetime-local"
              value={nextFollowUp}
              onChange={(e) => setNextFollowUp(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
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
            <Button type="submit" disabled={loading || !assignedTo}>
              {loading ? "Saving..." : isReassign ? "Reassign" : "Assign"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
