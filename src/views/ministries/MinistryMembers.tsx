import NewMemberModalForm from "@/components/forms/NewMemberModalForm";
import AddMemberToMinistryForm from "@/components/forms/AddMemberToMinistryForm";
import MemberSearch from "@/components/shared/MemberSearch";
import PageHeader from "@/components/shared/PageHeader";
import ListLoadingState from "@/components/shared/ListLoadingState";
import ListEmptyState from "@/components/shared/ListEmptyState";
import ListErrorState from "@/components/shared/ListErrorState";
import ListPagination from "@/components/shared/ListPagination";
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
import type { MemberFilterInput, Member } from "@/generated/graphql";
import {
  useGetMinistry,
  useGetMinistryMembers,
  useUpdateMember,
} from "@/hooks/useGraphQL";
import { formatMinistryProgram } from "@/lib/ministryProgram";
import { useAuth } from "@/redux/useAuth";
import { CalendarClock, UserPlus, Users } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const MinistryMembers = () => {
  const { ministryId } = useParams<{ ministryId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);
  const [isUpdateMemberModalOpen, setIsUpdateMemberModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Determine if this is a ministry leader accessing their own ministry
  // Check both the route param and the pathname since /ministries/my-ministry doesn't have a param
  const isMinistryLeaderView =
    location.pathname === "/ministries/my-ministry" ||
    ministryId === "my-ministry";

  // ML users lead ministries, so get from ledMinistries instead of ministries
  const effectiveMinistryId = isMinistryLeaderView
    ? user?.member?.ledMinistries?.[0]?.id || user?.member?.ministries?.[0]?.id
    : ministryId
      ? parseInt(ministryId)
      : 0;

  // Debug logging
  console.log("MinistryMembers Debug:", {
    pathname: location.pathname,
    ministryId,
    isMinistryLeaderView,
    effectiveMinistryId,
    ledMinistries: user?.member?.ledMinistries,
  });

  // Fetch ministry data
  const { data: ministryData, loading: ministryLoading } = useGetMinistry(
    effectiveMinistryId || 0,
  );

  // Fetch ministry members
  const { data, loading, error, refetch } = useGetMinistryMembers(
    effectiveMinistryId || 0,
  );
  const { updateMember } = useUpdateMember();

  const members = data?.ministryMembers || [];
  const totalMembers = members.length;
  const totalPages = Math.max(1, Math.ceil(totalMembers / pageSize));
  const paginatedMembers = members.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const ministry = ministryData?.ministry;
  const programLabel = formatMinistryProgram(
    ministry?.program_frequency,
    ministry?.program_day,
  );

  console.log({ effectiveMinistryId });

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
  };

  const handleUpdateMemberCancel = () => {
    setIsUpdateMemberModalOpen(false);
    setSelectedMemberId(null);
  };

  const handleBackToMinistrys = () => {
    if (isMinistryLeaderView) {
      navigate("/ministry-dashboard");
    } else {
      navigate("/ministries");
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (ministryLoading) {
    return (
      <div className="space-y-6">
        <ListLoadingState message="Loading ministry information..." />
      </div>
    );
  }

  if (!ministry) {
    return (
      <div className="space-y-6">
        <ListErrorState
          title="Ministry Not Found"
          message="The requested ministry could not be found."
          onRetry={handleBackToMinistrys}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title={ministry.name} titleClassName="text-2xl sm:text-3xl" />
        <ListErrorState
          layout="page"
          title="Error Loading Members"
          message={error.message || "Failed to load members. Please try again."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={ministry.name}
        titleClassName="text-2xl sm:text-3xl truncate"
        subtitle={`${totalMembers} members`}
        back={{
          label: isMinistryLeaderView
            ? "Back to Dashboard"
            : "Back to Ministries",
          onClick: handleBackToMinistrys,
        }}
        actions={
          <Button
            className="bg-brand-gradient hover:opacity-90 transition-opacity"
            onClick={() => setIsNewMemberModalOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member to Ministry
          </Button>
        }
      />

      {programLabel && (
        <Badge className="w-fit bg-indigo-100 text-indigo-800">
          <CalendarClock className="mr-1 h-3 w-3" />
          {programLabel}
        </Badge>
      )}

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
            <ListLoadingState message="Loading members..." />
          ) : members.length === 0 ? (
            <ListEmptyState
              icon={<Users className="h-8 w-8" />}
              title="No members found in this ministry"
              description={`Add members to the ${ministry.name} ministry to get started.`}
              primaryAction={{
                label: "Add First Member",
                onClick: () => setIsNewMemberModalOpen(true),
              }}
            />
          ) : (
            <div className="space-y-4">
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {paginatedMembers.map((member: Member) => (
                  <Card key={member.id} className="shadow-sm border">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header with name and role */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                member.role?.name === "ML"
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
                                member.role?.name === "ML"
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
                              Gender:
                            </span>
                            <span className="capitalize">
                              {member.gender || "N/A"}
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
                      <th className="text-left p-3 font-semibold">Gender</th>
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
                    {paginatedMembers.map((member: Member) => (
                      <tr
                        key={member.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-3 flex items-center space-x-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              member.role?.name === "ML"
                                ? "bg-green-600"
                                : member.status?.name === "Not Active"
                                  ? "bg-red-500"
                                  : "bg-blue-500"
                            }`}
                          ></div>
                          <Badge
                            className={`px-2 py-1 rounded-full text-xs ${
                              member.role?.name === "ML"
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
                          <div className="text-sm capitalize">
                            {member.gender || "N/A"}
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

              <ListPagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={totalMembers}
                onPageChange={handlePageChange}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                itemLabel="members"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Existing Member to Ministry Modal */}
      <FullscreenModal
        isOpen={isNewMemberModalOpen}
        onClose={handleNewMemberCancel}
        title="Add Member to Ministry"
      >
        <AddMemberToMinistryForm
          ministryId={effectiveMinistryId || 0}
          onSuccess={handleNewMemberSuccess}
          onCancel={handleNewMemberCancel}
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
