import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { toast } from "react-toastify";

interface PasswordDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  password: string;
  role: string;
}

const PasswordDisplayModal = ({
  isOpen,
  onClose,
  memberName,
  password,
  role,
}: PasswordDisplayModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPassword = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast.success("Password copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy password:", error);
      toast.error("Failed to copy password");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-brand-gradient">
            Promotion Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {memberName} has been promoted to {role}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Here are the login credentials:
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <p className="text-sm text-gray-900 font-mono">{memberName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-900 font-mono bg-white px-2 py-1 border rounded flex-1">
                  {password || "Password already provided !"}
                </p>

                {password && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyPassword}
                    className="flex items-center space-x-1"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {password && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Please save this password securely.
                It will not be shown again.
              </p>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              onClick={onClose}
              className="bg-brand-gradient hover:opacity-90 transition-opacity"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordDisplayModal;
