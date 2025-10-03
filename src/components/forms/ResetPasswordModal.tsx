import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResetPassword } from "@/hooks/useGraphQL";

interface ResetPasswordModalProps {
  member: {
    id: number;
    full_name: string;
    contact_no: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (password: string) => void;
}

const ResetPasswordModal = ({
  member,
  isOpen,
  onClose,
  onSuccess,
}: ResetPasswordModalProps) => {
  const [isResetting, setIsResetting] = useState(false);
  const { resetPassword } = useResetPassword();

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const result = await resetPassword({
        member_id: member.id,
      });

      if (result?.success) {
        onSuccess(result.password);
        onClose();
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    } finally {
      setIsResetting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-brand-gradient">Reset Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Reset password for <strong>{member.full_name}</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              Contact: {member.contact_no || "N/A"}
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> This will generate a new random 6-digit
              password and invalidate the current password.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The new password will be displayed after
              reset and should be shared securely with the user.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isResetting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReset}
              disabled={isResetting}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isResetting ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordModal;
