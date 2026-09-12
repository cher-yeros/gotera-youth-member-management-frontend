import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateMinistry } from "@/hooks/useGraphQL";
import {
  MINISTRY_PROGRAM_DAYS,
  MINISTRY_PROGRAM_FREQUENCY_OPTIONS,
  type MinistryProgramDay,
  type MinistryProgramFrequency,
} from "@/lib/ministryProgram";
import { CalendarClock } from "lucide-react";
import { toast } from "react-toastify";

interface SetMinistryProgramModalProps {
  ministry: {
    id: number;
    name: string;
    program_frequency?: string | null;
    program_day?: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CLEAR_VALUE = "__none__";

const SetMinistryProgramModal = ({
  ministry,
  isOpen,
  onClose,
  onSuccess,
}: SetMinistryProgramModalProps) => {
  const [frequency, setFrequency] = useState<string>(CLEAR_VALUE);
  const [day, setDay] = useState<string>(CLEAR_VALUE);
  const [isSaving, setIsSaving] = useState(false);
  const { updateMinistry } = useUpdateMinistry();

  useEffect(() => {
    if (!isOpen) return;
    setFrequency(ministry.program_frequency || CLEAR_VALUE);
    setDay(ministry.program_day || CLEAR_VALUE);
  }, [isOpen, ministry.program_frequency, ministry.program_day]);

  const handleSave = async () => {
    const clearing = frequency === CLEAR_VALUE && day === CLEAR_VALUE;
    const bothSet = frequency !== CLEAR_VALUE && day !== CLEAR_VALUE;

    if (!clearing && !bothSet) {
      toast.error("Select both frequency and day, or clear both");
      return;
    }

    setIsSaving(true);
    try {
      await updateMinistry({
        id: ministry.id,
        program_frequency: clearing
          ? null
          : (frequency as MinistryProgramFrequency),
        program_day: clearing ? null : (day as MinistryProgramDay),
      });
      toast.success(
        clearing
          ? "Regular program schedule cleared"
          : "Regular program schedule saved",
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating ministry program:", error);
      toast.error("Failed to update program schedule");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-brand-gradient flex items-center">
            <CalendarClock className="mr-2 h-5 w-5" />
            Regular Program Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Set the regular program day for <strong>{ministry.name}</strong>.
            This is visible to admins and main leaders.
          </p>

          <div className="space-y-2">
            <label className="text-sm font-medium">Frequency</label>
            <Select
              value={frequency}
              onValueChange={setFrequency}
              disabled={isSaving}
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
            <label className="text-sm font-medium">Program Day</label>
            <Select value={day} onValueChange={setDay} disabled={isSaving}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose day..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CLEAR_VALUE}>Not set</SelectItem>
                {MINISTRY_PROGRAM_DAYS.map((programDay) => (
                  <SelectItem key={programDay} value={programDay}>
                    {programDay}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-brand-gradient hover:opacity-90 transition-opacity"
            >
              {isSaving ? "Saving..." : "Save Schedule"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetMinistryProgramModal;
