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
  GET_FAMILIES,
  GET_FOLLOW_UP_COORDINATORS,
  GET_FOLLOW_UP_DASHBOARD,
  GET_LOCATIONS,
  INTAKE_NEWCOMER,
} from "@/graphql/operations";
import {
  FOLLOW_UP_PRIORITY,
  FOLLOW_UP_SOURCE,
  FOLLOW_UP_SOURCE_LABELS,
} from "@/lib/followUp";
import { hasAnyRole, ROLE } from "@/lib/roles";
import { useAuth } from "@/redux/useAuth";
import { toast } from "react-toastify";

interface IntakeNewcomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const emptyForm = {
  full_name: "",
  contact_no: "",
  gender: "",
  source: FOLLOW_UP_SOURCE.SUNDAY_SERVICE,
  first_visit_date: "",
  notes: "",
  assigned_to: "",
  priority: FOLLOW_UP_PRIORITY.NORMAL,
  next_follow_up_at: "",
  family_id: "",
  location_id: "",
};

export const IntakeNewcomerModal: React.FC<IntakeNewcomerModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { user } = useAuth();
  const isAdmin = hasAnyRole(user, [ROLE.ADMIN, ROLE.MAIN]);
  const [form, setForm] = useState(emptyForm);

  const { data: familiesData } = useQuery(GET_FAMILIES, { skip: !open });
  const { data: locationsData } = useQuery(GET_LOCATIONS, { skip: !open });
  const { data: coordinatorsData } = useQuery(GET_FOLLOW_UP_COORDINATORS, {
    skip: !open || !isAdmin,
    fetchPolicy: "network-only",
  });

  const [intake, { loading }] = useMutation(INTAKE_NEWCOMER, {
    refetchQueries: [
      { query: GET_FOLLOW_UP_DASHBOARD },
      "GetFollowUpCases",
      "GetMyFollowUpCases",
    ],
    onCompleted: () => {
      toast.success("Newcomer intake created");
      onOpenChange(false);
      setForm(emptyForm);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message.replace("CombinedGraphQLErrors: ", ""));
    },
  });

  const families = (familiesData as any)?.families || [];
  const locations = (locationsData as any)?.locations || [];
  const members = (coordinatorsData as any)?.followUpCoordinators || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) {
      toast.error("Full name is required");
      return;
    }

    await intake({
      variables: {
        input: {
          full_name: form.full_name.trim(),
          contact_no: form.contact_no || null,
          gender: form.gender || null,
          source: form.source,
          first_visit_date: form.first_visit_date || null,
          notes: form.notes || null,
          assigned_to: form.assigned_to
            ? Number(form.assigned_to)
            : isAdmin
              ? null
              : user?.member?.id || null,
          priority: form.priority,
          next_follow_up_at: form.next_follow_up_at || null,
          family_id: form.family_id ? Number(form.family_id) : null,
          location_id: form.location_id ? Number(form.location_id) : null,
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Intake Newcomer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full name *</Label>
            <Input
              id="full_name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="contact_no">Phone</Label>
              <Input
                id="contact_no"
                value={form.contact_no}
                onChange={(e) =>
                  setForm({ ...form, contact_no: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={form.gender || undefined}
                onValueChange={(v) => setForm({ ...form, gender: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Select
              value={form.location_id || undefined}
              onValueChange={(v) => setForm({ ...form, location_id: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Optional" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc: any) => (
                  <SelectItem key={loc.id} value={String(loc.id)}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Source</Label>
              <Select
                value={form.source}
                onValueChange={(v) => setForm({ ...form, source: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FOLLOW_UP_SOURCE_LABELS).map(([k, label]) => (
                    <SelectItem key={k} value={k}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm({ ...form, priority: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={FOLLOW_UP_PRIORITY.LOW}>Low</SelectItem>
                  <SelectItem value={FOLLOW_UP_PRIORITY.NORMAL}>
                    Normal
                  </SelectItem>
                  <SelectItem value={FOLLOW_UP_PRIORITY.HIGH}>High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="first_visit_date">First visit</Label>
              <Input
                id="first_visit_date"
                type="date"
                value={form.first_visit_date}
                onChange={(e) =>
                  setForm({ ...form, first_visit_date: e.target.value })
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
          </div>
          <div className="space-y-2">
            <Label>Suggested family</Label>
            <Select
              value={form.family_id || undefined}
              onValueChange={(v) => setForm({ ...form, family_id: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Optional" />
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
          {isAdmin && (
            <div className="space-y-2">
              <Label>Assign to FUL</Label>
              <Select
                value={form.assigned_to || undefined}
                onValueChange={(v) => setForm({ ...form, assigned_to: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Leave unassigned" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m: any) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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
              {loading ? "Saving..." : "Create intake"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
