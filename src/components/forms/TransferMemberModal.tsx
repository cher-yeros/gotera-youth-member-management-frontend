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
import { useTransferMember, useGetFamilies } from "@/hooks/useGraphQL";
import { toast } from "react-toastify";

interface TransferMemberModalProps {
  member: {
    id: number;
    full_name: string;
    family?: {
      id: number;
      name: string;
    } | null;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TransferMemberModal = ({
  member,
  isOpen,
  onClose,
  onSuccess,
}: TransferMemberModalProps) => {
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>("");
  const [isTransferring, setIsTransferring] = useState(false);
  const { transferMember } = useTransferMember();
  const { data: familiesData, loading: familiesLoading } = useGetFamilies();

  const families = familiesData?.families || [];

  // Filter out the current family from the options
  const availableFamilies = families.filter(
    (family) => family.id !== member.family?.id
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedFamilyId("");
    }
  }, [isOpen]);

  const handleTransfer = async () => {
    if (!selectedFamilyId) {
      toast.error("Please select a family");
      return;
    }

    setIsTransferring(true);
    try {
      const result = await transferMember({
        member_id: member.id,
        new_family_id: parseInt(selectedFamilyId),
      });

      if (result?.success) {
        toast.success(result.message);
        onSuccess();
        onClose();
        setSelectedFamilyId("");
      }
    } catch (error) {
      console.error("Error transferring member:", error);
      toast.error("Failed to transfer member. Please try again.");
    } finally {
      setIsTransferring(false);
    }
  };

  const handleClose = () => {
    setSelectedFamilyId("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-brand-gradient">Transfer Member</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Transfer <strong>{member.full_name}</strong> to a different family
            </p>
            <p className="text-xs text-muted-foreground">
              Current Family: {member.family?.name || "No Family"}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select New Family</label>
            <Select
              value={selectedFamilyId}
              onValueChange={(value) => setSelectedFamilyId(value)}
              disabled={isTransferring || familiesLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a family..." />
              </SelectTrigger>
              <SelectContent>
                {familiesLoading ? (
                  <SelectItem value="" disabled>
                    Loading families...
                  </SelectItem>
                ) : availableFamilies.length === 0 ? (
                  <SelectItem value="" disabled>
                    No other families available
                  </SelectItem>
                ) : (
                  availableFamilies.map((family) => (
                    <SelectItem key={family.id} value={family.id.toString()}>
                      {family.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This action will move the member from their
              current family to the selected family. This change will be logged
              in the activity history.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isTransferring}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTransfer}
              disabled={
                !selectedFamilyId ||
                isTransferring ||
                availableFamilies.length === 0
              }
              className="bg-brand-gradient hover:opacity-90 transition-opacity"
            >
              {isTransferring ? "Transferring..." : "Transfer Member"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransferMemberModal;
