import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
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
import { LOG_FOLLOW_UP_CONTACT } from "@/graphql/operations";
import {
  FOLLOW_UP_CONTACT_OUTCOMES,
  FOLLOW_UP_CONTACT_TYPES,
} from "@/lib/followUp";
import { toast } from "react-toastify";

interface LogFollowUpContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: number | null;
  onSuccess?: () => void;
}

export const LogFollowUpContactModal: React.FC<
  LogFollowUpContactModalProps
> = ({ open, onOpenChange, caseId, onSuccess }) => {
  const [form, setForm] = useState<{
    contact_type: string;
    outcome: string;
    notes: string;
    contacted_at: string;
    next_follow_up_at: string;
  }>({
    contact_type: FOLLOW_UP_CONTACT_TYPES.CALL,
    outcome: FOLLOW_UP_CONTACT_OUTCOMES.REACHED,
    notes: "",
    contacted_at: "",
    next_follow_up_at: "",
  });

  const [logContact, { loading }] = useMutation(LOG_FOLLOW_UP_CONTACT, {

    onCompleted: () => {
      toast.success("Contact logged");
      onOpenChange(false);
      setForm({
        contact_type: FOLLOW_UP_CONTACT_TYPES.CALL,
        outcome: FOLLOW_UP_CONTACT_OUTCOMES.REACHED,
        notes: "",
        contacted_at: "",
        next_follow_up_at: "",
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message.replace("CombinedGraphQLErrors: ", ""));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId) return;
    await logContact({
      variables: {
        input: {
          case_id: caseId,
          contact_type: form.contact_type,
          outcome: form.outcome,
          notes: form.notes || null,
          contacted_at: form.contacted_at
            ? new Date(form.contacted_at).toISOString()
            : null,
          next_follow_up_at: form.next_follow_up_at
            ? new Date(form.next_follow_up_at).toISOString()
            : null,
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log contact</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={form.contact_type}
                onValueChange={(v) => setForm({ ...form, contact_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(FOLLOW_UP_CONTACT_TYPES).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Outcome</Label>
              <Select
                value={form.outcome}
                onValueChange={(v) => setForm({ ...form, outcome: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(FOLLOW_UP_CONTACT_OUTCOMES).map((o) => (
                    <SelectItem key={o} value={o}>
                      {o.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contacted_at">Contacted at</Label>
            <Input
              id="contacted_at"
              type="datetime-local"
              value={form.contacted_at}
              onChange={(e) =>
                setForm({ ...form, contacted_at: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="next_follow_up_at">Next follow-up</Label>
            <Input
              id="next_follow_up_at"
              type="datetime-local"
              value={form.next_follow_up_at}
              onChange={(e) =>
                setForm({ ...form, next_follow_up_at: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
              {loading ? "Saving..." : "Log contact"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
