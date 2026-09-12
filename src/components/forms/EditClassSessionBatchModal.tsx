import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUpdateClassSessionBatch } from "@/hooks/useTeenGraphQL";

interface BatchLike {
  id: number;
  title: string;
  description?: string | null;
  session_date: string;
  location?: string | null;
}

interface Props {
  batch: BatchLike;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const EditClassSessionBatchModal = ({ batch, trigger, onSuccess }: Props) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(batch.title);
  const [description, setDescription] = useState(batch.description || "");
  const [sessionDate, setSessionDate] = useState(batch.session_date);
  const [location, setLocation] = useState(batch.location || "");
  const { updateClassSessionBatch, loading } = useUpdateClassSessionBatch();

  useEffect(() => {
    if (!open) return;
    setTitle(batch.title);
    setDescription(batch.description || "");
    setSessionDate(batch.session_date);
    setLocation(batch.location || "");
  }, [open, batch]);

  const handleSubmit = async () => {
    if (!title.trim() || !sessionDate) return;
    await updateClassSessionBatch({
      id: batch.id,
      title: title.trim(),
      description: description || undefined,
      session_date: sessionDate,
      location: location || undefined,
    });
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Edit</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit session day</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Date *</Label>
            <Input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Changing the date updates every class session in this batch.
            </p>
          </div>
          <div>
            <Label>Location</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !sessionDate}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditClassSessionBatchModal;
