import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUpdateClassSession } from "@/hooks/useTeenGraphQL";
import { BookOpen } from "lucide-react";

interface Props {
  sessionId: number;
  currentTopic?: string | null;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const SessionTopicModal = ({
  sessionId,
  currentTopic,
  trigger,
  onSuccess,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState(currentTopic || "");
  const { updateClassSession, loading } = useUpdateClassSession();

  useEffect(() => {
    if (open) setTopic(currentTopic || "");
  }, [open, currentTopic]);

  const handleSubmit = async () => {
    await updateClassSession({
      id: sessionId,
      topic: topic.trim() || null,
    });
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <BookOpen className="h-4 w-4 mr-1" />
            {currentTopic ? "Edit Topic" : "Add Topic"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentTopic ? "Edit taught topic" : "Add taught topic"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="session-topic">Topic taught</Label>
            <Textarea
              id="session-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Faith and obedience — James 1"
              rows={3}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Record what you taught in this class session.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Save Topic
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionTopicModal;
