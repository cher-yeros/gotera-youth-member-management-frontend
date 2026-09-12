import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateTeenClass,
  useUpdateTeenClass,
} from "@/hooks/useTeenGraphQL";

interface Props {
  mode?: "create" | "update";
  classId?: number;
  initial?: { name?: string; description?: string | null };
  onSuccess?: () => void;
  onCancel?: () => void;
}

const NewTeenClassModalForm = ({
  mode = "create",
  classId,
  initial,
  onSuccess,
  onCancel,
}: Props) => {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const { createTeenClass, loading: creating } = useCreateTeenClass();
  const { updateTeenClass, loading: updating } = useUpdateTeenClass();
  const loading = creating || updating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (mode === "update" && classId) {
      await updateTeenClass({ id: classId, name: name.trim(), description });
    } else {
      await createTeenClass({ name: name.trim(), description });
    }
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <Label htmlFor="name">Class name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {mode === "update" ? "Update" : "Create"} Class
        </Button>
      </div>
    </form>
  );
};

export default NewTeenClassModalForm;
