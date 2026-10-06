import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FullscreenModal from "@/components/ui/fullscreen-modal";
import NewMemberModalForm from "@/components/forms/NewMemberModalForm";
import MemberSearch from "@/components/shared/MemberSearch";
import PageHeader from "@/components/shared/PageHeader";
import ListLoadingState from "@/components/shared/ListLoadingState";
import ListEmptyState from "@/components/shared/ListEmptyState";
import ListErrorState from "@/components/shared/ListErrorState";
import ListPagination from "@/components/shared/ListPagination";
import ProfileCompletenessBadge, { CompletenessPageSummary } from "@/components/shared/ProfileCompletenessBadge";
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
import {
  useDeleteMember,
  useGetMembers,
  useGetFamily,
  useGetFamilyMembers,
  useGetStatuses,
} from "@/hooks/useGraphQL";
import {
  ACTIVE_STATUS_NAME,
  getMemberCompleteness,
} from "@/lib/memberCompleteness";
import {
  daysUntilLabel,
  formatBirthdayMonthDay,
  getUpcomingBirthdays,
  UPCOMING_BIRTHDAY_DAYS,
} from "@/lib/upcomingBirthdays";
import { useState, useCallback, useEffect, useMemo } from "react";
import type { MemberFilterInput } from "@/generated/graphql";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/redux/useAuth";
import { Cake } from "lucide-react";

const FamilyMembers = () => {
  const { familyId } = useParams<{ familyId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);
  const [isUpdateMemberModalOpen, setIsUpdateMemberModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [includeNonActive, setIncludeNonActive] = useState(false);
  const [searchFilters, setSearchFilters] = useState<MemberFilterInput>({});
  const [memberToDelete, setMemberToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Determine if this is a family leader accessing their own family
  const isFamilyLeaderView = location.pathname === "/families/my-family";
  const effectiveFamilyId = isFamilyLeaderView
    ? user?.member?.family?.id
    : familyId
      ? parseInt(familyId)
      : 0;

  const { data: statusesData } = useGetStatuses();
  const activeStatusId = useMemo(
    () =>
      statusesData?.statuses?.find((s) => s.name === ACTIVE_STATUS_NAME)?.id,
    [statusesData],
  );

  // Fetch family data
  const { data: familyData, loading: familyLoading } = useGetFamily(
    effectiveFamilyId || 0,
  );

  // Full family roster for FL birthday suggestions (not limited by list pagination)
  const { data: familyMembersData } = useGetFamilyMembers(
    isFamilyLeaderView ? effectiveFamilyId || 0 : 0,
  );

  const upcomingBirthdays = useMemo(() => {
    if (!isFamilyLeaderView) return [];
    return getUpcomingBirthdays(
      familyMembersData?.family?.members || [],
      UPCOMING_BIRTHDAY_DAYS,
    );
  }, [isFamilyLeaderView, familyMembersData]);

  // Initialize filters with family + Active (unless include non-active)
  useEffect(() => {
    if (!effectiveFamilyId) return;
    setSearchFilters({
      family_id: effectiveFamilyId,
      status_id:
        !includeNonActive && activeStatusId ? activeStatusId : undefined,
    });
  }, [effectiveFamilyId, activeStatusId, includeNonActive]);

  // Fetch members with pagination and filters
  const { data, loading, error, refetch } = useGetMembers(searchFilters, {
    page: currentPage,
    limit: pageSize,
  });

  const { deleteMember } = useDeleteMember();

  const members = data?.members?.members || [];
  const totalPages = data?.members?.totalPages || 0;
  const total = data?.members?.total || 0;
  const family = familyData?.family;

  const incompleteOnPage = members.filter(
    (member) => getMemberCompleteness(member).isIncomplete,
  ).length;

  const handleSearch = useCallback(
    (filters: MemberFilterInput) => {
      setSearchFilters({
        ...filters,
        family_id: effectiveFamilyId || undefined,
        status_id: includeNonActive
          ? filters.status_id
          : activeStatusId || filters.status_id,
      });
      setCurrentPage(1);
    },
    [effectiveFamilyId, includeNonActive, activeStatusId],
  );

  const handleClearSearch = useCallback(() => {
    setIncludeNonActive(false);
    setSearchFilters({
      family_id: effectiveFamilyId || undefined,
      status_id: activeStatusId,
    });
    setCurrentPage(1);
  }, [effectiveFamilyId, activeStatusId]);

  const applyIncludeNonActive = (checked: boolean) => {
    setIncludeNonActive(checked);
    setSearchFilters((prev) => ({
      ...prev,
      family_id: effectiveFamilyId || undefined,
      status_id: checked ? undefined : activeStatusId,
    }));
    setCurrentPage(1);
  };

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;

    try {
      await deleteMember(memberToDelete.id);
      setMemberToDelete(null);
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const cancelDeleteMember = () => {
    setMemberToDelete(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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

  const handleBackToFamilies = () => {
    if (isFamilyLeaderView) {
      navigate("/dashboard");
    } else {
      navigate("/families");
    }
  };

  if (familyLoading) {
    return (
      <div className="space-y-6">
        <ListLoadingState message="Loading family information..." />
      </div>
    );
  }

  if (!family) {
    return (
      <div className="space-y-6">
        <ListErrorState
          title="Family Not Found"
          message="The requested family could not be found."
          onRetry={handleBackToFamilies}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title={family.name} titleClassName="text-2xl sm:text-3xl" />
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
        title={family.name}
        titleClassName="text-2xl sm:text-3xl truncate"
        subtitle={`${total} members`}
        back={{
          label: isFamilyLeaderView ? "Back to Dashboard" : "Back to Families",
          onClick: handleBackToFamilies,
        }}
        actions={
          <Button
            className="bg-brand-gradient hover:opacity-90 transition-opacity"
            onClick={() => setIsNewMemberModalOpen(true)}
          >
            Add New Member
          </Button>
        }
      />

      {isFamilyLeaderView && upcomingBirthdays.length > 0 && (
        <Card className="border-2 border-pink-500/40 bg-pink-50 dark:bg-pink-950/20 shadow-brand">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center shrink-0">
                <Cake className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <div className="flex-1 space-y-3 min-w-0">
                <div>
                  <h3 className="text-lg font-semibold text-pink-900 dark:text-pink-100">
                    Upcoming birthdays
                  </h3>
                  <p className="text-sm text-pink-800 dark:text-pink-200">
                    {upcomingBirthdays.length === 1
                      ? "1 family member has a birthday in the next week."
                      : `${upcomingBirthdays.length} family members have birthdays in the next week.`}
                  </p>
                </div>
                <ul className="space-y-2">
                  {upcomingBirthdays.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-white/70 dark:bg-black/20 px-3 py-2"
                    >
                      <span className="font-medium text-pink-950 dark:text-pink-50">
                        {item.full_name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-pink-800 dark:text-pink-200">
                          {formatBirthdayMonthDay(item.nextBirthday)}
                        </span>
                        <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200">
                          {daysUntilLabel(item.daysUntil)}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <MemberSearch
        onSearch={handleSearch}
        onClear={handleClearSearch}
        isLoading={loading}
        hideFamilyFilter
        extraFiltersActive={includeNonActive}
        extraFiltersLabel="Include non-active"
        extraFilters={
          <div className="flex items-center gap-3">
            <Switch
              id="include-non-active"
              checked={includeNonActive}
              onCheckedChange={applyIncludeNonActive}
            />
            <Label htmlFor="include-non-active" className="cursor-pointer">
              Include non-active
            </Label>
          </div>
        }
      />

      <Card className="shadow-brand">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-brand-gradient">
              Family Members List
            </CardTitle>
            {!loading && members.length > 0 && (
              <CompletenessPageSummary
                incompleteCount={incompleteOnPage}
                totalOnPage={members.length}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ListLoadingState message="Loading members..." />
          ) : members.length === 0 ? (
            <ListEmptyState
              icon="👥"
              title="No members found in this family"
              description={`Add the first member to the ${isFamilyLeaderView ? "your" : family.name} family to get started.`}
              primaryAction={{
                label: "Add First Member",
                onClick: () => setIsNewMemberModalOpen(true),
              }}
            />
          ) : (
            <div className="space-y-4">
              {/* Mobile Card View - Hidden on desktop */}
              <div className="block md:hidden space-y-3">
                {members.map((member) => (
                  <Card key={member.id} className="shadow-sm border">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header with name and role */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                member.role?.name === "FL"
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
                                member.role?.name === "FL"
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

                        <ProfileCompletenessBadge
                          completeness={getMemberCompleteness(member)}
                        />

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
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop Table View - Hidden on mobile */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Name</th>
                      <th className="text-left p-3 font-semibold">Info</th>
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
                    {members.map((member) => {
                      const completeness = getMemberCompleteness(member);
                      return (
                        <tr
                          key={member.id}
                          className={`border-b hover:bg-muted/50 ${
                            completeness.isFullyIncomplete
                              ? "bg-red-50/40 dark:bg-red-950/10"
                              : completeness.isIncomplete
                                ? "bg-yellow-50/30 dark:bg-yellow-950/10"
                                : ""
                          }`}
                        >
                          <td className="p-3 flex items-center space-x-2">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                member.role?.name === "FL"
                                  ? "bg-green-600"
                                  : member.status?.name === "Not Active"
                                    ? "bg-red-500"
                                    : "bg-blue-500"
                              }`}
                            ></div>
                            <Badge
                              className={`px-2 py-1 rounded-full text-xs ${
                                member.role?.name === "FL"
                                  ? "bg-green-100 text-green-900"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {member.role?.name || "N/A"}
                            </Badge>
                            <div className="font-medium">
                              {member.full_name}
                            </div>
                          </td>
                          <td className="p-3 max-w-[180px]">
                            <ProfileCompletenessBadge
                              completeness={completeness}
                            />
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
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <ListPagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={total}
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

      {/* New Member Modal */}
      <FullscreenModal
        isOpen={isNewMemberModalOpen}
        onClose={handleNewMemberCancel}
        title="Add New Member"
      >
        <NewMemberModalForm
          onSuccess={handleNewMemberSuccess}
          onCancel={handleNewMemberCancel}
          mode="create"
          defaultFamilyId={effectiveFamilyId || undefined}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!memberToDelete}
        onOpenChange={() => setMemberToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{memberToDelete?.name}</strong>? This action cannot be
              undone and will permanently remove the member from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteMember}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMember}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FamilyMembers;
