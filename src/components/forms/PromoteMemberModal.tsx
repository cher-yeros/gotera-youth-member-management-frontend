import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePromoteMember } from "@/hooks/useGraphQL";
import { toast } from "react-toastify";

interface PromoteMemberModalProps {
  member: {
    id: number;
    full_name: string;
    contact_no: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (password: string, role: string) => void;
}

const PromoteMemberModal = ({
  member,
  isOpen,
  onClose,
  onSuccess,
}: PromoteMemberModalProps) => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isPromoting, setIsPromoting] = useState(false);
  const { promoteMember } = usePromoteMember();

  const handlePromote = async () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    setIsPromoting(true);
    try {
      const result = await promoteMember({
        member_id: member.id,
        role: selectedRole,
      });

      if (result?.success) {
        onSuccess(result.password, selectedRole);
        onClose();
        setSelectedRole("");
      }
    } catch (error) {
      console.error("Error promoting member:", error);
    } finally {
      setIsPromoting(false);
    }
  };

  const handleClose = () => {
    setSelectedRole("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-brand-gradient">Promote Member</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Promote <strong>{member.full_name}</strong> to a user account
            </p>
            <p className="text-xs text-muted-foreground">
              Contact: {member.contact_no || "N/A"}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Role</label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as string)}
              disabled={isPromoting}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="FL">FL (Family Leader)</SelectItem>
                <SelectItem value="FM">FM (Family Member)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> A random 6-digit password will be generated
              and displayed after promotion.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isPromoting}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePromote}
              disabled={!selectedRole || isPromoting}
              className="bg-brand-gradient hover:opacity-90 transition-opacity"
            >
              {isPromoting ? "Promoting..." : "Promote Member"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromoteMemberModal;
