import { useState } from "react";
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
import { useCreateClassSessionBatch } from "@/hooks/useTeenGraphQL";

interface Props {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const CreateClassSessionBatchModal = ({ trigger, onSuccess }: Props) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [location, setLocation] = useState("");
  const { createClassSessionBatch, loading } = useCreateClassSessionBatch();

  const handleSubmit = async () => {
    if (!title.trim() || !sessionDate) return;
    await createClassSessionBatch({
      title: title.trim(),
      description: description || undefined,
      session_date: sessionDate,
      location: location || undefined,
    });
    setOpen(false);
    setTitle("");
    setDescription("");
    setSessionDate("");
    setLocation("");
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-brand-gradient hover:opacity-90 transition-opacity">
            Create Session Day
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create class session for all classes</DialogTitle>
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
            className="bg-brand-gradient hover:opacity-90 transition-opacity"
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !sessionDate}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassSessionBatchModal;
