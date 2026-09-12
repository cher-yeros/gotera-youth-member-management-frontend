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
import { hasAnyRole, ROLE } from "@/lib/roles";
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
  const isAdmin = hasAnyRole(user, [ROLE.ADMIN, ROLE.MAIN]);
  // FUL can pick another FUL when reassigning; claim still self-assigns
  const canPickAssignee = isAdmin || isReassign;
  const [assignedTo, setAssignedTo] = useState("");
  const [reason, setReason] = useState("");
  const [nextFollowUp, setNextFollowUp] = useState("");

  const { data: coordinatorsData, loading: coordinatorsLoading } = useQuery(
    GET_FOLLOW_UP_COORDINATORS,
    {
      skip: !open || !canPickAssignee,
      fetchPolicy: "network-only",
    },
  );

  const members = (coordinatorsData as any)?.followUpCoordinators || [];

  const [assign, { loading }] = useMutation(
    isReassign ? REASSIGN_FOLLOW_UP_CASE : ASSIGN_FOLLOW_UP_CASE,
    {
      refetchQueries: [
        "GetFollowUpCases",
        "GetMyFollowUpCases",
        "GetFollowUpCase",
        "GetFollowUpDashboard",
      ],
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

    const targetId = canPickAssignee ? Number(assignedTo) : user?.member?.id;

    if (!targetId) {
      toast.error("Select a coordinator");
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
            {isReassign ? "Reassign to another FUL" : "Assign / claim case"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {canPickAssignee ? (
            <div className="space-y-2">
              <Label>Coordinator</Label>
              <Select
                value={assignedTo || undefined}
                onValueChange={setAssignedTo}
                disabled={coordinatorsLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      coordinatorsLoading
                        ? "Loading coordinators..."
                        : members.length
                          ? "Select FUL"
                          : "No coordinators found"
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
          ) : (
            <p className="text-sm text-muted-foreground">
              This case will be assigned to you.
            </p>
          )}
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
            <Button
              type="submit"
              disabled={loading || (canPickAssignee && !assignedTo)}
            >
              {loading ? "Saving..." : isReassign ? "Reassign" : "Assign"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
