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
import { usePromoteMember, usePromoteMinistryLeader } from "@/hooks/useGraphQL";
import { toast } from "react-toastify";
import {
  ROLE,
  ROLE_LABELS,
  getMemberRoleNames,
  type RoleCode,
} from "@/lib/roles";

interface PromoteMemberModalProps {
  member: {
    id: number;
    full_name: string;
    contact_no: string;
    role?: { name?: string | null } | null;
    roles?: Array<{ name?: string | null }> | null;
    ministries?: Array<{ id: number; name: string }> | null;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (password: string, role: string) => void;
}

const ASSIGNABLE_ROLES: RoleCode[] = [
  ROLE.ADMIN,
  ROLE.MAIN,
  ROLE.FC,
  ROLE.FL,
  ROLE.FUL,
  ROLE.ML,
  ROLE.TT,
  ROLE.FM,
];

const ASSIGNABLE_ROLE_SET = new Set<string>(ASSIGNABLE_ROLES);

const PromoteMemberModal = ({
  member,
  isOpen,
  onClose,
  onSuccess,
}: PromoteMemberModalProps) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedMinistryId, setSelectedMinistryId] = useState<number | null>(
    null,
  );
  const [isPromoting, setIsPromoting] = useState(false);
  const { promoteMember } = usePromoteMember();
  const { promoteMinistryLeader } = usePromoteMinistryLeader();

  const memberMinistries = member.ministries ?? [];
  const needsMinistry = selectedRoles.includes(ROLE.ML);

  // Auto-fill currently assigned roles when the modal opens
  useEffect(() => {
    if (!isOpen) return;

    const existing = getMemberRoleNames(member).filter((role) =>
      ASSIGNABLE_ROLE_SET.has(role),
    );
    setSelectedRoles(existing);
    setSelectedMinistryId(null);
  }, [isOpen, member.id]);

  // Keep ministry selection in sync with ML role; auto-pick if only one ministry
  useEffect(() => {
    if (!needsMinistry) {
      setSelectedMinistryId(null);
      return;
    }
    if (memberMinistries.length === 1) {
      setSelectedMinistryId(memberMinistries[0].id);
    }
  }, [needsMinistry, member.id]);

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handlePromote = async () => {
    if (selectedRoles.length === 0) {
      toast.error("Please select at least one role");
      return;
    }

    if (needsMinistry && !selectedMinistryId) {
      toast.error("Please select a ministry for Ministry Leader role");
      return;
    }

    setIsPromoting(true);
    try {
      const result = await promoteMember({
        member_id: member.id,
        roles: selectedRoles,
      });

      if (!result?.success) {
        if (result?.message) toast.error(result.message);
        return;
      }

      // Link ministry leadership when ML is among the assigned roles
      if (needsMinistry && selectedMinistryId) {
        const mlResult = await promoteMinistryLeader({
          member_id: member.id,
          ministry_id: selectedMinistryId,
        });
        if (mlResult && !mlResult.success && mlResult.message) {
          toast.error(mlResult.message);
        }
      }

      onSuccess(result.password, selectedRoles.join(", "));
      onClose();
      setSelectedRoles([]);
      setSelectedMinistryId(null);
    } catch (error: any) {
      console.error("Error promoting member:", error);
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
    setSelectedRoles([]);
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
              Assign roles for <strong>{member.full_name}</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              Contact: {member.contact_no || "N/A"}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Role(s)</label>
            {selectedRoles.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Existing roles are pre-selected. Uncheck to remove or add more.
              </p>
            )}
            <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto border rounded-md p-3">
              {ASSIGNABLE_ROLES.map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedRoles.includes(role)}
                    onChange={() => toggleRole(role)}
                    disabled={isPromoting}
                  />
                  <span>
                    <span className="font-medium">{role}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      — {ROLE_LABELS[role]}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {needsMinistry && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Ministry *</label>
              {memberMinistries.length === 0 ? (
                <p className="text-sm text-muted-foreground border rounded-md p-3">
                  This member is not assigned to any ministry. Assign them to a
                  ministry before promoting to Ministry Leader.
                </p>
              ) : (
                <Select
                  value={selectedMinistryId?.toString() || ""}
                  onValueChange={(value) =>
                    setSelectedMinistryId(parseInt(value))
                  }
                  disabled={isPromoting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a ministry..." />
                  </SelectTrigger>
                  <SelectContent>
                    {memberMinistries.map((ministry) => (
                      <SelectItem
                        key={ministry.id}
                        value={ministry.id.toString()}
                      >
                        {ministry.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <p className="text-xs text-muted-foreground">
                Only ministries this member is already assigned to are shown
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> A random 6-digit password will be generated
              for new accounts and displayed after promotion.
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
                selectedRoles.length === 0 ||
                isPromoting ||
                (needsMinistry && !selectedMinistryId)
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
