import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePromoteMember, usePromoteMinistryLeader, useGetMinistries } from "@/hooks/useGraphQL";
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
  const [selectedMinistryId, setSelectedMinistryId] = useState<number | null>(null);
  const [isPromoting, setIsPromoting] = useState(false);
  const { promoteMember } = usePromoteMember();
  const { promoteMinistryLeader } = usePromoteMinistryLeader();
  const { data: ministriesData } = useGetMinistries();

  // Reset ministry selection when role changes
  useEffect(() => {
    if (selectedRole !== "ml") {
      setSelectedMinistryId(null);
    }
  }, [selectedRole]);

  const handlePromote = async () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    // If ML is selected, ministry is required
    if (selectedRole === "ml" && !selectedMinistryId) {
      toast.error("Please select a ministry for Ministry Leader role");
      return;
    }

    setIsPromoting(true);
    try {
      let result;
      
      if (selectedRole === "ml") {
        // Use promoteMinistryLeader mutation for ML role
        result = await promoteMinistryLeader({
          member_id: member.id,
          ministry_id: selectedMinistryId!,
        });
      } else {
        // Use promoteMember mutation for other roles
        result = await promoteMember({
          member_id: member.id,
          role: selectedRole.toUpperCase(), // Convert to uppercase (admin, FL, FM)
        });
      }

      if (result?.success) {
        onSuccess(result.password, selectedRole === "ml" ? "ML" : selectedRole.toUpperCase());
        onClose();
        setSelectedRole("");
        setSelectedMinistryId(null);
      } else if (result?.message) {
        // Show error message from backend (e.g., "Member does not belong to the specified ministry")
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("Error promoting member:", error);
      // Show error message if available
      if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to promote member. Please try again.");
      }
    } finally {
      setIsPromoting(false);
    }
  };

  const handleClose = () => {
    setSelectedRole("");
    setSelectedMinistryId(null);
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
                <SelectItem value="fl">FL (Family Leader)</SelectItem>
                <SelectItem value="fm">FM (Family Member)</SelectItem>
                <SelectItem value="ml">ML (Ministry Leader)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedRole === "ml" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Ministry *</label>
              <Select
                value={selectedMinistryId?.toString() || ""}
                onValueChange={(value) => setSelectedMinistryId(parseInt(value))}
                disabled={isPromoting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a ministry..." />
                </SelectTrigger>
                <SelectContent>
                  {ministriesData?.ministries?.map((ministry: any) => (
                    <SelectItem key={ministry.id} value={ministry.id.toString()}>
                      {ministry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The member will be automatically added to the selected ministry if not already a member
              </p>
            </div>
          )}

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
              disabled={
                !selectedRole || 
                isPromoting || 
                (selectedRole === "ml" && !selectedMinistryId)
              }
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
