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
import { Badge } from "@/components/ui/badge";
import { usePromoteMinistryLeader } from "@/hooks/useGraphQL";
import { toast } from "react-toastify";
import { UserPlus, Users } from "lucide-react";

interface PromoteMinistryLeaderModalProps {
  ministry: {
    id: number;
    name: string;
    members: any[];
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PromoteMinistryLeaderModal = ({
  ministry,
  isOpen,
  onClose,
  onSuccess,
}: PromoteMinistryLeaderModalProps) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [isPromoting, setIsPromoting] = useState(false);
  const { promoteMinistryLeader } = usePromoteMinistryLeader();

  // Filter members who are not already users and don't have TL role
  const eligibleMembers = ministry.members.filter((member) => {
    const hasUserAccount = member.user !== null;
    const isAlreadyTL = member.role?.name === "TL";
    return !hasUserAccount && !isAlreadyTL;
  });

  const handlePromote = async () => {
    if (!selectedMemberId) {
      toast.error("Please select a member to promote");
      return;
    }

    setIsPromoting(true);
    try {
      const result = await promoteMinistryLeader({
        member_id: parseInt(selectedMemberId),
        ministry_id: ministry.id,
      });

      if (result?.success) {
        toast.success(
          `Member promoted to Ministry Leader! Password: ${result.password}`
        );
        onSuccess();
        onClose();
        setSelectedMemberId("");
      } else {
        toast.error(result?.message || "Failed to promote member");
      }
    } catch (error) {
      console.error("Error promoting ministry leader:", error);
      toast.error("Failed to promote ministry leader");
    } finally {
      setIsPromoting(false);
    }
  };

  const handleClose = () => {
    setSelectedMemberId("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-brand-gradient flex items-center">
            <UserPlus className="mr-2 h-5 w-5" />
            Promote Ministry Leader
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Promote a member from <strong>{ministry.name}</strong> to Ministry
              Leader
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="mr-1 h-3 w-3" />
              {eligibleMembers.length} eligible members
            </div>
          </div>

          {eligibleMembers.length === 0 ? (
            <div className="text-center py-6">
              <div className="h-12 w-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Users className="text-gray-400 text-xl" />
              </div>
              <p className="text-sm text-muted-foreground">
                No eligible members found. All members either already have user
                accounts or are already ministry leaders.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Member</label>
                <Select
                  value={selectedMemberId}
                  onValueChange={(value) => setSelectedMemberId(value)}
                  disabled={isPromoting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a member to promote..." />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        <div className="flex items-center justify-between w-full">
                          <span>{member.full_name}</span>
                          <div className="flex items-center space-x-2 ml-2">
                            {member.contact_no && (
                              <Badge variant="secondary" className="text-xs">
                                {member.contact_no}
                              </Badge>
                            )}
                            {member.status?.name && (
                              <Badge
                                className={`text-xs ${
                                  member.status.name === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {member.status.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> A random 6-digit password will be
                  generated and displayed after promotion. The member will be
                  able to log in with their contact number and this password.
                </p>
              </div>
            </>
          )}

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
                !selectedMemberId || isPromoting || eligibleMembers.length === 0
              }
              className="bg-brand-gradient hover:opacity-90 transition-opacity"
            >
              {isPromoting ? "Promoting..." : "Promote to Ministry Leader"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromoteMinistryLeaderModal;
