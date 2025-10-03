import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  useCreateMinistry,
  useUpdateMinistry,
  useGetMinistry,
} from "@/hooks/useGraphQL";
import { toast } from "react-toastify";

interface NewMinistryModalFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  ministryId?: number;
  mode: "create" | "update";
}

interface MinistryFormData {
  name: string;
  description: string;
  is_active: boolean;
}

const NewMinistryModalForm = ({
  onSuccess,
  onCancel,
  ministryId,
  mode,
}: NewMinistryModalFormProps) => {
  const [formData, setFormData] = useState<MinistryFormData>({
    name: "",
    description: "",
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createMinistry } = useCreateMinistry();
  const { updateMinistry } = useUpdateMinistry();
  const { data: ministryData, loading: ministryLoading } = useGetMinistry(
    ministryId || 0
  );

  // Load ministry data for update mode
  useEffect(() => {
    if (mode === "update" && ministryData?.ministry) {
      setFormData({
        name: ministryData.ministry.name,
        description: ministryData.ministry.description || "",
        is_active: ministryData.ministry.is_active,
      });
    }
  }, [mode, ministryData]);

  const handleInputChange = (
    field: keyof MinistryFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Ministry name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "create") {
        await createMinistry({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          is_active: formData.is_active,
        });
        toast.success("Ministry created successfully!");
      } else {
        await updateMinistry({
          id: ministryId!,
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          is_active: formData.is_active,
        });
        toast.success("Ministry updated successfully!");
      }
      onSuccess();
    } catch (error) {
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} ministry:`,
        error
      );
      toast.error(
        `Failed to ${mode === "create" ? "create" : "update"} ministry`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === "update" && ministryLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-4 text-muted-foreground">Loading ministry data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">
            {mode === "create" ? "Create New Ministry" : "Update Ministry"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ministry Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Ministry Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter ministry name"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Ministry Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter ministry description (optional)"
                rows={4}
                disabled={isSubmitting}
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  handleInputChange("is_active", checked)
                }
                disabled={isSubmitting}
              />
              <Label htmlFor="is_active">Ministry is active</Label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-brand-gradient hover:opacity-90 transition-opacity"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "create"
                  ? "Create Ministry"
                  : "Update Ministry"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewMinistryModalForm;
