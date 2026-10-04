import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useGetFamilies, useGetMinistries } from "@/hooks/useGraphQL";
import { usePromoteTeenagerToMember } from "@/hooks/useTeenGraphQL";
import PasswordDisplayModal from "@/components/forms/PasswordDisplayModal";
import { sanitizeLocalPhone, toE164Phone, toLocalPhone } from "@/lib/phone";
import { ROLE } from "@/lib/roles";

interface Props {
  teenager: {
    id: number;
    full_name: string;
    contact_no?: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PromoteTeenagerModal = ({
  teenager,
  isOpen,
  onClose,
  onSuccess,
}: Props) => {
  const { data: familiesData } = useGetFamilies();
  const { data: ministriesData } = useGetMinistries();
  const families = (familiesData as any)?.families || [];
  const ministries = (ministriesData as any)?.ministries || [];

  const [familyId, setFamilyId] = useState<number | undefined>();
  const [ministryId, setMinistryId] = useState<number | undefined>();
  const [contactNo, setContactNo] = useState(toLocalPhone(teenager.contact_no));
  const [createLogin, setCreateLogin] = useState(false);
  const [password, setPassword] = useState<string | null>(null);
  const { promoteTeenagerToMember, loading } = usePromoteTeenagerToMember();

  const handleSubmit = async () => {
    const result = await promoteTeenagerToMember({
      teenager_id: teenager.id,
      family_id: familyId,
      ministry_ids: ministryId ? [ministryId] : [],
      roles: [ROLE.FM],
      contact_no: toE164Phone(contactNo) || undefined,
      create_login: createLogin,
    });
    if (result?.password) {
      setPassword(result.password);
    } else {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen && !password} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Promote {teenager.full_name} to Youth</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Contact number</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium pointer-events-none">
                  +251
                </span>
                <Input
                  type="tel"
                  placeholder="9xxxxxxxx"
                  value={contactNo}
                  onChange={(e) =>
                    setContactNo(sanitizeLocalPhone(e.target.value))
                  }
                  className="pl-14"
                />
              </div>
            </div>
            <div>
              <Label>Family</Label>
              <Select
                value={familyId ? String(familyId) : undefined}
                onValueChange={(v) => setFamilyId(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select family" />
                </SelectTrigger>
                <SelectContent>
                  {families.map((f: any) => (
                    <SelectItem key={f.id} value={String(f.id)}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Ministry</Label>
              <Select
                value={ministryId ? String(ministryId) : undefined}
                onValueChange={(v) => setMinistryId(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ministry" />
                </SelectTrigger>
                <SelectContent>
                  {ministries.map((m: any) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="create_login"
                checked={createLogin}
                onCheckedChange={(v) => setCreateLogin(!!v)}
              />
              <Label htmlFor="create_login">Create login account</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="bg-brand-gradient hover:opacity-90 transition-opacity"
              onClick={handleSubmit}
              disabled={loading}
            >
              Promote to Youth Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {password && (
        <PasswordDisplayModal
          isOpen={!!password}
          password={password}
          memberName={teenager.full_name}
          role={ROLE.FM}
          onClose={() => {
            setPassword(null);
            onSuccess?.();
            onClose();
          }}
        />
      )}
    </>
  );
};

export default PromoteTeenagerModal;
