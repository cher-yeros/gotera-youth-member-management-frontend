import NewMemberModalForm from "@/components/forms/NewMemberModalForm";
import MemberSearch from "@/components/shared/MemberSearch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FullscreenModal from "@/components/ui/fullscreen-modal";
import ThemeToggle from "@/components/ui/theme-toggle";
import type { MemberFilterInput, Member } from "@/generated/graphql";
import {
  useGetMinistry,
  useGetMinistryMembers,
  useUpdateMember,
} from "@/hooks/useGraphQL";
import { useAuth } from "@/redux/useAuth";
import { ArrowLeft, UserPlus, Users } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const MinistryMembers = () => {
  const { ministryId } = useParams<{ ministryId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);
  const [isUpdateMemberModalOpen, setIsUpdateMemberModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Determine if this is a ministry leader accessing their own ministry
  const isMinistryLeaderView = ministryId === "my-ministry";
  const effectiveMinistryId = isMinistryLeaderView
    ? user?.member?.ministries?.[0]?.id
    : ministryId
    ? parseInt(ministryId)
    : 0;

  // Fetch ministry data
  const { data: ministryData, loading: ministryLoading } = useGetMinistry(
    effectiveMinistryId || 0
  );

  // Fetch ministry members
  const { data, loading, error, refetch } = useGetMinistryMembers(
    effectiveMinistryId || 0
  );
  const { updateMember } = useUpdateMember();

  const members = data?.ministryMembers || [];
  const ministry = ministryData?.ministry;

  console.log({ ministryData });

  const handleSearch = useCallback((filters: MemberFilterInput) => {
    // Search functionality can be implemented here if needed
    console.log("Search filters:", filters);
  }, []);

  const handleClearSearch = useCallback(() => {
    // Clear search functionality can be implemented here if needed
    console.log("Clear search");
  }, []);

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      await updateMember({
        id: memberToRemove.id,
        ministry_ids: [],
      });
      refetch();
      setMemberToRemove(null);
    } catch (error) {
      console.error("Error removing member from ministry:", error);
    }
  };

  const cancelRemoveMember = () => {
    setMemberToRemove(null);
  };

  const handleNewMemberSuccess = () => {
    setIsNewMemberModalOpen(false);
    refetch();
  };

  const handleNewMemberCancel = () => {
    setIsNewMemberModalOpen(false);
  };

  const handleUpdateMember = (memberId: number) => {
    setSelectedMemberId(memberId);
    setIsUpdateMemberModalOpen(true);
  };

  const handleUpdateMemberSuccess = () => {
    setIsUpdateMemberModalOpen(false);
    setSelectedMemberId(null);
    refetch();
  };

  const handleUpdateMemberCancel = () => {
    setIsUpdateMemberModalOpen(false);
    setSelectedMemberId(null);
  };

  const handleBackToMinistrys = () => {
    if (isMinistryLeaderView) {
      navigate("/ministry-dashboard");
    } else {
      navigate("/ministrys");
    }
  };

  if (ministryLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading ministry information...
          </p>
        </div>
      </div>
    );
  }

  if (!ministry) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="h-16 w-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-red-600">
            Ministry Not Found
          </h3>
          <p className="text-muted-foreground mb-4">
            The requested ministry could not be found.
          </p>
          <Button
            onClick={handleBackToMinistrys}
            className="bg-brand-gradient hover:opacity-90 transition-opacity"
          >
            Back to Ministrys
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-gradient">
              {ministry.name} Ministry Members
            </h1>
            <p className="text-muted-foreground">
              Members of the {ministry.name} ministry
            </p>
          </div>
          <ThemeToggle variant="icon" />
        </div>
        <Card className="shadow-brand">
          <CardContent>
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-red-600">
                Error Loading Members
              </h3>
              <p className="text-muted-foreground mb-4">
                {error.message || "Failed to load members. Please try again."}
              </p>
              <Button
                onClick={() => refetch()}
                className="bg-brand-gradient hover:opacity-90 transition-opacity"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-gradient">
            {isMinistryLeaderView
              ? `${ministry.name} Ministry Members`
              : `${ministry.name} Ministry Members`}
          </h1>
          <p className="text-muted-foreground">
            {isMinistryLeaderView
              ? `Members of your ministry (${members.length} total)`
              : `Members of the ${ministry.name} ministry (${members.length} total)`}
          </p>
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToMinistrys}
              className="text-sm"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              {isMinistryLeaderView ? "Back to Dashboard" : "Back to Ministrys"}
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle variant="icon" />
          <Button
            className="bg-brand-gradient hover:opacity-90 transition-opacity"
            onClick={() => setIsNewMemberModalOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member to Ministry
          </Button>
        </div>
      </div>

      <MemberSearch
        onSearch={handleSearch}
        onClear={handleClearSearch}
        isLoading={loading}
      />

      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">
            Ministry Members List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading members...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-brand-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No members found in this ministry
              </h3>
              <p className="text-muted-foreground mb-4">
                Add members to the {ministry.name} ministry to get started.
              </p>
              <Button
                onClick={() => setIsNewMemberModalOpen(true)}
                className="bg-brand-gradient hover:opacity-90 transition-opacity"
              >
                Add First Member
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {members.map((member: Member) => (
                  <Card key={member.id} className="shadow-sm border">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header with name and role */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                member.role?.name === "TL"
                                  ? "bg-green-600"
                                  : member.status?.name === "Not Active"
                                  ? "bg-red-500"
                                  : "bg-blue-500"
                              }`}
                            ></div>
                            <div className="font-semibold text-lg">
                              {member.full_name}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={`px-2 py-1 rounded-full text-xs ${
                                member.role?.name === "TL"
                                  ? "bg-green-100 text-green-900"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {member.role?.name || "N/A"}
                            </Badge>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                member.status?.name === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : member.status?.name === "Not Active"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {member.status?.name || "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* Member details */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Contact:
                            </span>
                            <span>
                              {member.contact_no ? (
                                <a
                                  href={`tel:${member.contact_no}`}
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {member.contact_no}
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Profession:
                            </span>
                            <span>
                              {member.profession?.name ||
                                member.profession_name ||
                                "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Location:
                            </span>
                            <span>
                              {member.location?.name ||
                                member.location_name ||
                                "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-blue-600 hover:bg-blue-50"
                            onClick={() => handleUpdateMember(member.id)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 hover:bg-red-50"
                            onClick={() =>
                              setMemberToRemove({
                                id: member.id,
                                name: member.full_name,
                              })
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Name</th>
                      <th className="text-left p-3 font-semibold">Contact</th>
                      <th className="text-left p-3 font-semibold">Role</th>
                      <th className="text-left p-3 font-semibold">Status</th>
                      <th className="text-left p-3 font-semibold">
                        Profession
                      </th>
                      <th className="text-left p-3 font-semibold">Location</th>
                      <th className="text-left p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member: Member) => (
                      <tr
                        key={member.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-3 flex items-center space-x-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              member.role?.name === "TL"
                                ? "bg-green-600"
                                : member.status?.name === "Not Active"
                                ? "bg-red-500"
                                : "bg-blue-500"
                            }`}
                          ></div>
                          <Badge
                            className={`px-2 py-1 rounded-full text-xs ${
                              member.role?.name === "TL"
                                ? "bg-green-100 text-green-900"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {member.role?.name || "N/A"}
                          </Badge>
                          <div className="font-medium">{member.full_name}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm text-muted-foreground">
                            {member.contact_no ? (
                              <a
                                href={`tel:${member.contact_no}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {member.contact_no}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm">
                            {member.role?.name || "N/A"}
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              member.status?.name === "Active"
                                ? "bg-green-100 text-green-800"
                                : member.status?.name === "Not Active"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {member.status?.name || "N/A"}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="text-sm">
                            {member.profession?.name ||
                              member.profession_name ||
                              "N/A"}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm">
                            {member.location?.name ||
                              member.location_name ||
                              "N/A"}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:bg-blue-50"
                              onClick={() => handleUpdateMember(member.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() =>
                                setMemberToRemove({
                                  id: member.id,
                                  name: member.full_name,
                                })
                              }
                            >
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Member Modal */}
      <FullscreenModal
        isOpen={isNewMemberModalOpen}
        onClose={handleNewMemberCancel}
        title="Add Member to Ministry"
      >
        <NewMemberModalForm
          onSuccess={handleNewMemberSuccess}
          onCancel={handleNewMemberCancel}
          mode="create"
          defaultMinistryId={effectiveMinistryId || undefined}
        />
      </FullscreenModal>

      {/* Update Member Modal */}
      <FullscreenModal
        isOpen={isUpdateMemberModalOpen}
        onClose={handleUpdateMemberCancel}
        title="Update Member"
      >
        <NewMemberModalForm
          onSuccess={handleUpdateMemberSuccess}
          onCancel={handleUpdateMemberCancel}
          memberId={selectedMemberId || undefined}
          mode="update"
        />
      </FullscreenModal>

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={() => setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member from Ministry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <strong>{memberToRemove?.name}</strong> from the {ministry.name}{" "}
              ministry? This will not delete the member, only remove them from
              this ministry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRemoveMember}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveMember}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Remove from Ministry
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MinistryMembers;
