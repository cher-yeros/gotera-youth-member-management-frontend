import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateMinistry,
  useUpdateMinistry,
  useGetMinistry,
} from "@/hooks/useGraphQL";
import {
  MINISTRY_PROGRAM_DAYS,
  MINISTRY_PROGRAM_FREQUENCY_OPTIONS,
  type MinistryProgramDay,
  type MinistryProgramFrequency,
} from "@/lib/ministryProgram";
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
  program_frequency: string;
  program_day: string;
}

const CLEAR_VALUE = "__none__";

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
    program_frequency: CLEAR_VALUE,
    program_day: CLEAR_VALUE,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createMinistry } = useCreateMinistry();
  const { updateMinistry } = useUpdateMinistry();
  const { data: ministryData, loading: ministryLoading } = useGetMinistry(
    ministryId || 0,
  );

  useEffect(() => {
    if (mode === "update" && ministryData?.ministry) {
      setFormData({
        name: ministryData.ministry.name,
        description: ministryData.ministry.description || "",
        is_active: ministryData.ministry.is_active,
        program_frequency:
          ministryData.ministry.program_frequency || CLEAR_VALUE,
        program_day: ministryData.ministry.program_day || CLEAR_VALUE,
      });
    }
  }, [mode, ministryData]);

  const handleInputChange = (
    field: keyof MinistryFormData,
    value: string | boolean,
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

    const clearing =
      formData.program_frequency === CLEAR_VALUE &&
      formData.program_day === CLEAR_VALUE;
    const bothSet =
      formData.program_frequency !== CLEAR_VALUE &&
      formData.program_day !== CLEAR_VALUE;
    if (!clearing && !bothSet) {
      toast.error("Select both program frequency and day, or leave both unset");
      return;
    }

    const schedulePayload = {
      program_frequency: clearing
        ? null
        : (formData.program_frequency as MinistryProgramFrequency),
      program_day: clearing
        ? null
        : (formData.program_day as MinistryProgramDay),
    };

    setIsSubmitting(true);
    try {
      if (mode === "create") {
        await createMinistry({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          is_active: formData.is_active,
          ...schedulePayload,
        });
        toast.success("Ministry created successfully!");
      } else {
        await updateMinistry({
          id: ministryId!,
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          is_active: formData.is_active,
          ...schedulePayload,
        });
        toast.success("Ministry updated successfully!");
      }
      onSuccess();
    } catch (error) {
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} ministry:`,
        error,
      );
      toast.error(
        `Failed to ${mode === "create" ? "create" : "update"} ministry`,
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Program Frequency</Label>
                <Select
                  value={formData.program_frequency}
                  onValueChange={(value) =>
                    handleInputChange("program_frequency", value)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose frequency..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CLEAR_VALUE}>Not set</SelectItem>
                    {MINISTRY_PROGRAM_FREQUENCY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Program Day</Label>
                <Select
                  value={formData.program_day}
                  onValueChange={(value) =>
                    handleInputChange("program_day", value)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose day..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CLEAR_VALUE}>Not set</SelectItem>
                    {MINISTRY_PROGRAM_DAYS.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

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
