import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetTeenClasses,
  useGetMyTeenClasses,
  useTransferTeenager,
} from "@/hooks/useTeenGraphQL";
import { useAuth } from "@/redux/useAuth";
import { hasAnyRole, ROLE } from "@/lib/roles";

interface Props {
  teenager: {
    id: number;
    full_name: string;
    class_id: number;
    teenClass?: { id: number; name: string } | null;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const TransferTeenagerModal = ({
  teenager,
  isOpen,
  onClose,
  onSuccess,
}: Props) => {
  const { user } = useAuth();
  const isAdmin = hasAnyRole(user, [ROLE.ADMIN, ROLE.MAIN]);
  const { data: adminClasses } = useGetTeenClasses();
  const { data: myClasses } = useGetMyTeenClasses();
  const classes = (
    isAdmin
      ? (adminClasses as any)?.teenClasses
      : (myClasses as any)?.myTeenClasses
  )?.filter((c: any) => c.id !== teenager.class_id) || [];

  const [toClassId, setToClassId] = useState<number | undefined>();
  const [note, setNote] = useState("");
  const { transferTeenager, loading } = useTransferTeenager();

  const handleSubmit = async () => {
    if (!toClassId) return;
    await transferTeenager({
      teenager_id: teenager.id,
      to_class_id: toClassId,
      note: note || undefined,
    });
    onSuccess?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer {teenager.full_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Current class: {teenager.teenClass?.name || "—"}
          </p>
          <div>
            <Label>New class</Label>
            <Select
              value={toClassId ? String(toClassId) : undefined}
              onValueChange={(v) => setToClassId(parseInt(v))}
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
          <div>
            <Label>Note</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!toClassId || loading}>
            Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransferTeenagerModal;
