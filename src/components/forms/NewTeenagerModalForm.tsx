import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateTeenager,
  useGetTeenClasses,
  useGetMyTeenClasses,
  useUpdateTeenager,
} from "@/hooks/useTeenGraphQL";
import { useGetLocations } from "@/hooks/useGraphQL";
import { useAuth } from "@/redux/useAuth";
import { hasAnyRole, ROLE } from "@/lib/roles";
import { ComboBox } from "@/components/ui/combo-box";
import PhotoCaptureField from "@/components/forms/PhotoCaptureField";
import PhoneExistsNotice from "@/components/forms/PhoneExistsNotice";
import { sanitizeLocalPhone, toE164Phone, toLocalPhone } from "@/lib/phone";
import { formatPhoneOwner, usePhoneLookup } from "@/hooks/usePhoneLookup";
import { toast } from "react-toastify";

/** Father & Mother first for quick selection. */
const GUARDIAN_RELATIONSHIPS = [
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Uncle",
  "Aunt",
  "Grandparent",
  "Guardian",
  "Other",
];

const SCHOOL_GRADES = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

interface Props {
  mode?: "create" | "update";
  teenagerId?: number;
  defaultClassId?: number;
  initial?: {
    full_name?: string;
    contact_no?: string | null;
    gender?: string | null;
    grade?: string | null;
    photo_url?: string | null;
    birth_date?: string | null;
    location_id?: number | null;
    guardian_name?: string | null;
    guardian_contact?: string | null;
    guardian_relationship?: string | null;
    guardian2_name?: string | null;
    guardian2_contact?: string | null;
    guardian2_relationship?: string | null;
    class_id?: number;
    status?: string | null;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

const NewTeenagerModalForm = ({
  mode = "create",
  teenagerId,
  defaultClassId,
  initial,
  onSuccess,
  onCancel,
}: Props) => {
  const { user } = useAuth();
  const isAdmin = hasAnyRole(user, [ROLE.ADMIN, ROLE.MAIN]);
  const { data: adminClasses } = useGetTeenClasses();
  const { data: myClasses } = useGetMyTeenClasses();
  const { data: locationsData, loading: locationsLoading } = useGetLocations();
  const classes = isAdmin
    ? (adminClasses as any)?.teenClasses || []
    : (myClasses as any)?.myTeenClasses || [];
  const locations = (locationsData as any)?.locations || [];

  const [form, setForm] = useState({
    full_name: initial?.full_name || "",
    contact_no: toLocalPhone(initial?.contact_no),
    gender: initial?.gender || "",
    grade: initial?.grade || "",
    photo_url: (initial?.photo_url ?? null) as string | null,
    birth_date: initial?.birth_date || "",
    location_id: initial?.location_id || undefined,
    guardian_name: initial?.guardian_name || "",
    guardian_contact: toLocalPhone(initial?.guardian_contact),
    guardian_relationship: initial?.guardian_relationship || "",
    guardian2_name: initial?.guardian2_name || "",
    guardian2_contact: toLocalPhone(initial?.guardian2_contact),
    guardian2_relationship: initial?.guardian2_relationship || "",
    class_id: defaultClassId || initial?.class_id || undefined,
    status: initial?.status || "ACTIVE",
  });

  const { createTeenager, loading: creating } = useCreateTeenager();
  const { updateTeenager, loading: updating } = useUpdateTeenager();
  const loading = creating || updating;
  const classLocked = !!defaultClassId;

  const {
    matches: phoneMatches,
    loading: phoneChecking,
    exists: phoneExists,
    primary: existingPhoneOwner,
  } = usePhoneLookup({
    localPhone: form.contact_no,
    excludeTeenagerId: mode === "update" ? teenagerId : undefined,
  });

  const set = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.class_id) return;
    if (phoneExists && existingPhoneOwner) {
      toast.error(
        `Phone already registered to ${formatPhoneOwner(existingPhoneOwner)}`,
      );
      return;
    }

    const payload = {
      full_name: form.full_name.trim(),
      contact_no: toE164Phone(form.contact_no),
      gender: form.gender || null,
      grade: form.grade || null,
      photo_url: form.photo_url || null,
      birth_date: form.birth_date || null,
      location_id: form.location_id || null,
      guardian_name: form.guardian_name || null,
      guardian_contact: toE164Phone(form.guardian_contact),
      guardian_relationship: form.guardian_relationship || null,
      guardian2_name: form.guardian2_name || null,
      guardian2_contact: toE164Phone(form.guardian2_contact),
      guardian2_relationship: form.guardian2_relationship || null,
      class_id: form.class_id,
      status: form.status,
    };

    if (mode === "update" && teenagerId) {
      const { class_id, ...rest } = payload;
      await updateTeenager({ id: teenagerId, ...rest });
    } else {
      await createTeenager(payload);
    }
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <PhotoCaptureField
        value={form.photo_url}
        onChange={(url) => set("photo_url", url)}
        disabled={loading}
        name={form.full_name}
      />
      <div>
        <Label>Full name *</Label>
        <Input
          value={form.full_name}
          onChange={(e) => set("full_name", e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Contact</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium pointer-events-none">
              +251
            </span>
            <Input
              type="tel"
              placeholder="9xxxxxxxx"
              value={form.contact_no}
              onChange={(e) =>
                set("contact_no", sanitizeLocalPhone(e.target.value))
              }
              className="pl-14"
              disabled={loading}
            />
          </div>
          <PhoneExistsNotice matches={phoneMatches} loading={phoneChecking} />
        </div>
        <div>
          <Label>Gender</Label>
          <Select
            value={form.gender}
            onValueChange={(v) => set("gender", v)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Grade</Label>
          <Select
            value={form.grade || undefined}
            onValueChange={(v) => set("grade", v)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              {SCHOOL_GRADES.map((g) => (
                <SelectItem key={g} value={g}>
                  Grade {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Birth date</Label>
          <Input
            type="date"
            value={form.birth_date || ""}
            onChange={(e) => set("birth_date", e.target.value)}
            disabled={loading}
          />
        </div>
      </div>
      <div>
        <Label>Address</Label>
        <ComboBox
          options={locations.map((l: any) => ({
            value: l.id,
            label: l.name,
          }))}
          value={form.location_id}
          onValueChange={(value) =>
            set("location_id", value ? Number(value) : undefined)
          }
          placeholder="Select address"
          loading={locationsLoading}
          loadingText="Loading addresses..."
          disabled={loading}
        />
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Guardian 1</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Name</Label>
            <Input
              value={form.guardian_name}
              onChange={(e) => set("guardian_name", e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <Label>Contact</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium pointer-events-none">
                +251
              </span>
              <Input
                type="tel"
                placeholder="9xxxxxxxx"
                value={form.guardian_contact}
                onChange={(e) =>
                  set("guardian_contact", sanitizeLocalPhone(e.target.value))
                }
                className="pl-14"
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <Label>Relationship</Label>
            <Select
              value={form.guardian_relationship || undefined}
              onValueChange={(v) => set("guardian_relationship", v)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {GUARDIAN_RELATIONSHIPS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          Guardian 2 (optional)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Name</Label>
            <Input
              value={form.guardian2_name}
              onChange={(e) => set("guardian2_name", e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <Label>Contact</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium pointer-events-none">
                +251
              </span>
              <Input
                type="tel"
                placeholder="9xxxxxxxx"
                value={form.guardian2_contact}
                onChange={(e) =>
                  set("guardian2_contact", sanitizeLocalPhone(e.target.value))
                }
                className="pl-14"
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <Label>Relationship</Label>
            <Select
              value={form.guardian2_relationship || undefined}
              onValueChange={(v) => set("guardian2_relationship", v)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {GUARDIAN_RELATIONSHIPS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div>
        <Label>Class *</Label>
        <Select
          value={form.class_id ? String(form.class_id) : undefined}
          onValueChange={(v) => set("class_id", parseInt(v))}
          disabled={loading || classLocked || mode === "update"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((c: any) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || phoneExists || phoneChecking}
          className="bg-brand-gradient hover:opacity-90 transition-opacity"
        >
          {mode === "update" ? "Update" : "Register"} Teenager
        </Button>
      </div>
    </form>
  );
};

export default NewTeenagerModalForm;
