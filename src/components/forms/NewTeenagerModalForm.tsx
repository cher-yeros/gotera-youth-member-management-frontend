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

interface Props {
  mode?: "create" | "update";
  teenagerId?: number;
  defaultClassId?: number;
  initial?: {
    full_name?: string;
    contact_no?: string | null;
    gender?: string | null;
    birth_date?: string | null;
    location_id?: number | null;
    guardian_name?: string | null;
    guardian_contact?: string | null;
    guardian_relationship?: string | null;
    class_id?: number;
    status?: string;
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
    contact_no: initial?.contact_no || "",
    gender: initial?.gender || "",
    birth_date: initial?.birth_date || "",
    location_id: initial?.location_id || undefined,
    guardian_name: initial?.guardian_name || "",
    guardian_contact: initial?.guardian_contact || "",
    guardian_relationship: initial?.guardian_relationship || "",
    class_id: defaultClassId || initial?.class_id || undefined,
    status: initial?.status || "ACTIVE",
  });

  const { createTeenager, loading: creating } = useCreateTeenager();
  const { updateTeenager, loading: updating } = useUpdateTeenager();
  const loading = creating || updating;
  const classLocked = !!defaultClassId;

  const set = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.class_id) return;

    const payload = {
      full_name: form.full_name.trim(),
      contact_no: form.contact_no || null,
      gender: form.gender || null,
      birth_date: form.birth_date || null,
      location_id: form.location_id || null,
      guardian_name: form.guardian_name || null,
      guardian_contact: form.guardian_contact || null,
      guardian_relationship: form.guardian_relationship || null,
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
          <Input
            value={form.contact_no}
            onChange={(e) => set("contact_no", e.target.value)}
            disabled={loading}
          />
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
          <Label>Birth date</Label>
          <Input
            type="date"
            value={form.birth_date || ""}
            onChange={(e) => set("birth_date", e.target.value)}
            disabled={loading}
          />
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Guardian name</Label>
          <Input
            value={form.guardian_name}
            onChange={(e) => set("guardian_name", e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <Label>Guardian contact</Label>
          <Input
            value={form.guardian_contact}
            onChange={(e) => set("guardian_contact", e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <Label>Guardian relationship</Label>
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
        <Button type="submit" disabled={loading}>
          {mode === "update" ? "Update" : "Register"} Teenager
        </Button>
      </div>
    </form>
  );
};

export default NewTeenagerModalForm;
