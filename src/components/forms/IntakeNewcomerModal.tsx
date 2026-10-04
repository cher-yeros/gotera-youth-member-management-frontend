import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ComboBoxOption } from "@/components/ui/combo-box";
import { ComboBox } from "@/components/ui/combo-box";
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
  GET_FOLLOW_UP_COORDINATORS,
  GET_LOCATIONS,
  INTAKE_NEWCOMER,
} from "@/graphql/operations";
import {
  FOLLOW_UP_PRIORITY,
  FOLLOW_UP_SOURCE,
  FOLLOW_UP_SOURCE_LABELS,
} from "@/lib/followUp";
import { isFollowUpCoordinator, ROLE_LABELS } from "@/lib/roles";
import { useAuth } from "@/redux/useAuth";
import { toast } from "react-toastify";
import PhotoCaptureField from "@/components/forms/PhotoCaptureField";
import { sanitizeLocalPhone, toE164Phone } from "@/lib/phone";

interface IntakeNewcomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type FollowUpSource = (typeof FOLLOW_UP_SOURCE)[keyof typeof FOLLOW_UP_SOURCE];
type FollowUpPriority =
  (typeof FOLLOW_UP_PRIORITY)[keyof typeof FOLLOW_UP_PRIORITY];

const emptyForm = {
  full_name: "",
  contact_no: "",
  gender: "",
  photo_url: null as string | null,
  source: FOLLOW_UP_SOURCE.SUNDAY_SERVICE as FollowUpSource,
  first_visit_date: "",
  notes: "",
  assigned_to: "",
  priority: FOLLOW_UP_PRIORITY.NORMAL as FollowUpPriority,
  next_follow_up_at: "",
  location_id: "",
  location_name: "",
};

export const IntakeNewcomerModal: React.FC<IntakeNewcomerModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { user } = useAuth();
  // Admin / Main / FUC — only they may assign
  const canAssign = isFollowUpCoordinator(user);
  const [form, setForm] = useState(emptyForm);

  const { data: locationsData, loading: locationsLoading } = useQuery(
    GET_LOCATIONS,
    { skip: !open },
  );
  const { data: coordinatorsData } = useQuery(GET_FOLLOW_UP_COORDINATORS, {
    skip: !open || !canAssign,
    fetchPolicy: "network-only",
  });

  const [intake, { loading }] = useMutation(INTAKE_NEWCOMER, {
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

  const locationOptions: ComboBoxOption[] = (
    (locationsData as any)?.locations || []
  ).map((loc: { id: number; name: string }) => ({
    value: loc.id,
    label: loc.name,
  }));
  const members = (coordinatorsData as any)?.followUpCoordinators || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) {
      toast.error("Full name is required");
      return;
    }

    const locationName = form.location_name.trim();
    if (!form.location_id && !locationName) {
      toast.error("Location is required. Select one or type a custom name.");
      return;
    }

    await intake({
      variables: {
        input: {
          full_name: form.full_name.trim(),
          contact_no: toE164Phone(form.contact_no),
          gender: form.gender || null,
          photo_url: form.photo_url || null,
          source: form.source,
          first_visit_date: form.first_visit_date || null,
          notes: form.notes || null,
          // Only Follow Up Coordinators may assign; others leave unassigned
          assigned_to:
            canAssign && form.assigned_to ? Number(form.assigned_to) : null,
          priority: form.priority,
          next_follow_up_at: form.next_follow_up_at || null,
          family_id: null,
          location_id: form.location_id ? Number(form.location_id) : null,
          location_name: locationName || null,
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
          <PhotoCaptureField
            value={form.photo_url}
            onChange={(url) => setForm({ ...form, photo_url: url })}
            disabled={loading}
            name={form.full_name}
          />
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
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium pointer-events-none">
                  +251
                </span>
                <Input
                  id="contact_no"
                  type="tel"
                  placeholder="9xxxxxxxx"
                  value={form.contact_no}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contact_no: sanitizeLocalPhone(e.target.value),
                    })
                  }
                  className="pl-14"
                />
              </div>
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
            <Label>Location *</Label>
            <ComboBox
              options={locationOptions}
              value={form.location_id ? Number(form.location_id) : undefined}
              onValueChange={(value) =>
                setForm({
                  ...form,
                  location_id: value != null ? String(value) : "",
                  // Selecting from the list clears a typed custom name
                  location_name: value != null ? "" : form.location_name,
                })
              }
              placeholder="Search location"
              searchPlaceholder="Search locations..."
              emptyText="No location found. Type a custom name below."
              loading={locationsLoading}
              loadingText="Loading locations..."
              disabled={loading}
            />
            <Input
              id="location_name"
              value={form.location_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  location_name: e.target.value,
                  // Typing a custom name clears the list selection
                  location_id: e.target.value.trim() ? "" : form.location_id,
                })
              }
              placeholder="Or type location if not in the list"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Select from the list, or type a custom location name.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Source</Label>
              <Select
                value={form.source}
                onValueChange={(v) =>
                  setForm({ ...form, source: v as FollowUpSource })
                }
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
                onValueChange={(v) =>
                  setForm({ ...form, priority: v as FollowUpPriority })
                }
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
          {canAssign && (
            <div className="space-y-2">
              <Label>Assign to {ROLE_LABELS.FUL}</Label>
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
