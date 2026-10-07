import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FullscreenModal from "@/components/ui/fullscreen-modal";
import NewMemberModalForm from "@/components/forms/NewMemberModalForm";
import MemberViewModal from "@/components/forms/MemberViewModal";
import PromoteMemberModal from "@/components/forms/PromoteMemberModal";
import ResetPasswordModal from "@/components/forms/ResetPasswordModal";
import PasswordDisplayModal from "@/components/forms/PasswordDisplayModal";
import TransferMemberModal from "@/components/forms/TransferMemberModal";
import MemberSearch from "@/components/shared/MemberSearch";
import { PersonAvatar } from "@/components/shared/PersonAvatar";
import PageHeader from "@/components/shared/PageHeader";
import ListLoadingState from "@/components/shared/ListLoadingState";
import ListEmptyState from "@/components/shared/ListEmptyState";
import ListErrorState from "@/components/shared/ListErrorState";
import ListPagination, {
  LIST_PAGE_SIZE_ALL,
} from "@/components/shared/ListPagination";
import ProfileCompletenessBadge, {
  CompletenessPageSummary,
} from "@/components/shared/ProfileCompletenessBadge";
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
import { useDeleteMember, useGetMembers } from "@/hooks/useGraphQL";
import { getMemberCompleteness } from "@/lib/memberCompleteness";
import { useState, useCallback, useEffect } from "react";
import type { MemberFilterInput, GetMembersQuery } from "@/generated/graphql";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { hasAnyRole, ROLE } from "@/lib/roles";
import { useAuth } from "@/redux/useAuth";
import { useSearchParams } from "react-router-dom";

type MemberListItem = GetMembersQuery["members"]["members"][number];

const Members = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const canResetPassword = hasAnyRole(user, [ROLE.ADMIN, ROLE.MAIN]);
  const canFilterUnassigned = hasAnyRole(user, [
    ROLE.ADMIN,
    ROLE.MAIN,
    ROLE.FC,
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);
  const [isUpdateMemberModalOpen, setIsUpdateMemberModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [viewMember, setViewMember] = useState<MemberListItem | null>(null);
  const [unassignedOnly, setUnassignedOnly] = useState(
    () => searchParams.get("unassigned") === "1",
  );
  const [noMinistryOnly, setNoMinistryOnly] = useState(
    () => searchParams.get("no_ministry") === "1",
  );
  const [notEmployedOnly, setNotEmployedOnly] = useState(
    () => searchParams.get("not_employed") === "1",
  );
  const [searchFilters, setSearchFilters] = useState<MemberFilterInput>(() => {
    const initial: MemberFilterInput = {};
    if (searchParams.get("unassigned") === "1") initial.unassigned = true;
    if (searchParams.get("no_ministry") === "1") initial.no_ministry = true;
    if (searchParams.get("not_employed") === "1") initial.not_employed = true;
    return initial;
  });
  const [memberToDelete, setMemberToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [memberToPromote, setMemberToPromote] = useState<{
    id: number;
    full_name: string;
    contact_no: string;
    role?: { name?: string | null } | null;
    roles?: Array<{ name?: string | null }> | null;
    ministries?: Array<{ id: number; name: string }> | null;
  } | null>(null);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [memberToResetPassword, setMemberToResetPassword] = useState<{
    id: number;
    full_name: string;
    contact_no: string;
  } | null>(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [promotedMemberData, setPromotedMemberData] = useState<{
    name: string;
    password: string;
    role: string;
  } | null>(null);
  const [memberToTransfer, setMemberToTransfer] = useState<{
    id: number;
    full_name: string;
    family?: {
      id: number;
      name: string;
    } | null;
  } | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch members with pagination and filters
  const { data, loading, error, refetch } = useGetMembers(searchFilters, {
    page: currentPage,
    limit: pageSize, // Backend now handles 10000 as "all" option
  });

  const { deleteMember } = useDeleteMember();

  const members = data?.members?.members || [];
  const total = data?.members?.total || 0;
  // Calculate totalPages on frontend to handle "All" option properly
  const totalPages =
    pageSize === LIST_PAGE_SIZE_ALL ? 1 : Math.ceil(total / pageSize);

  const incompleteOnPage = members.filter(
    (member) => getMemberCompleteness(member).isIncomplete,
  ).length;

  useEffect(() => {
    const fromUrl = searchParams.get("unassigned") === "1";
    if (fromUrl !== unassignedOnly && canFilterUnassigned) {
      setUnassignedOnly(fromUrl);
      setSearchFilters((prev) => ({
        ...prev,
        unassigned: fromUrl || undefined,
        family_id: fromUrl ? undefined : prev.family_id,
      }));
      setCurrentPage(1);
    }
    // Only sync when the URL changes, not when local toggle flips (handled below)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, canFilterUnassigned]);

  useEffect(() => {
    const fromUrl = searchParams.get("no_ministry") === "1";
    if (fromUrl !== noMinistryOnly) {
      setNoMinistryOnly(fromUrl);
      setSearchFilters((prev) => ({
        ...prev,
        no_ministry: fromUrl || undefined,
        ministry_id: fromUrl ? undefined : prev.ministry_id,
        ministry_ids: fromUrl ? undefined : prev.ministry_ids,
      }));
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const fromUrl = searchParams.get("not_employed") === "1";
    if (fromUrl !== notEmployedOnly) {
      setNotEmployedOnly(fromUrl);
      setSearchFilters((prev) => ({
        ...prev,
        not_employed: fromUrl || undefined,
        profession_id: fromUrl ? undefined : prev.profession_id,
      }));
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const applyUnassignedOnly = useCallback(
    (checked: boolean) => {
      setUnassignedOnly(checked);
      setSearchFilters((prev) => ({
        ...prev,
        unassigned: checked || undefined,
        family_id: checked ? undefined : prev.family_id,
      }));
      setCurrentPage(1);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (checked) next.set("unassigned", "1");
          else next.delete("unassigned");
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handleSearch = useCallback(
    (filters: MemberFilterInput) => {
      const nextNoMinistry = filters.no_ministry === true;
      const nextNotEmployed = filters.not_employed === true;
      setNoMinistryOnly(nextNoMinistry);
      setNotEmployedOnly(nextNotEmployed);
      setSearchFilters({
        ...filters,
        unassigned: unassignedOnly || undefined,
        family_id: unassignedOnly ? undefined : filters.family_id,
        no_ministry: nextNoMinistry || undefined,
        ministry_id: nextNoMinistry ? undefined : filters.ministry_id,
        not_employed: nextNotEmployed || undefined,
        profession_id: nextNotEmployed ? undefined : filters.profession_id,
      });
      setCurrentPage(1);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (nextNoMinistry) next.set("no_ministry", "1");
          else next.delete("no_ministry");
          if (nextNotEmployed) next.set("not_employed", "1");
          else next.delete("not_employed");
          return next;
        },
        { replace: true },
      );
    },
    [unassignedOnly, setSearchParams],
  );

  const handleClearSearch = useCallback(() => {
    setUnassignedOnly(false);
    setNoMinistryOnly(false);
    setNotEmployedOnly(false);
    setSearchFilters({});
    setCurrentPage(1);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("unassigned");
        next.delete("no_ministry");
        next.delete("not_employed");
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

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

  const handleViewMember = (member: MemberListItem) => {
    setViewMember(member);
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

  const handlePromoteMember = (member: MemberListItem) => {
    if (!member.contact_no) {
      return; // This shouldn't happen since the button is disabled when contact_no is null/undefined
    }
    setMemberToPromote({
      id: member.id,
      full_name: member.full_name,
      contact_no: member.contact_no,
      role: member.role,
      roles: member.roles,
      ministries: member.ministries ?? [],
    });
    setIsPromoteModalOpen(true);
  };

  const handlePromoteSuccess = (password: string, role: string) => {
    if (memberToPromote) {
      setPromotedMemberData({
        name: memberToPromote.full_name,
        password: password,
        role: role,
      });
      setIsPasswordModalOpen(true);
      setMemberToPromote(null);
    }
  };

  const handlePromoteCancel = () => {
    setIsPromoteModalOpen(false);
    setMemberToPromote(null);
  };

  const handleResetPassword = (member: {
    id: number;
    full_name: string;
    contact_no?: string | null | undefined;
  }) => {
    if (!member.contact_no) {
      return; // This shouldn't happen since the button is disabled when contact_no is null/undefined
    }
    setMemberToResetPassword({
      id: member.id,
      full_name: member.full_name,
      contact_no: member.contact_no,
    });
    setIsResetPasswordModalOpen(true);
  };

  const handleResetPasswordSuccess = (password: string) => {
    if (memberToResetPassword) {
      setPromotedMemberData({
        name: memberToResetPassword.full_name,
        password: password,
        role: "Password Reset",
      });
      setIsPasswordModalOpen(true);
      setMemberToResetPassword(null);
    }
  };

  const handleResetPasswordCancel = () => {
    setIsResetPasswordModalOpen(false);
    setMemberToResetPassword(null);
  };

  const handlePasswordModalClose = () => {
    setIsPasswordModalOpen(false);
    setPromotedMemberData(null);
  };

  const handleTransferMember = (member: {
    id: number;
    full_name: string;
    family?: {
      id: number;
      name: string;
    } | null;
  }) => {
    setMemberToTransfer({
      id: member.id,
      full_name: member.full_name,
      family: member.family,
    });
    setIsTransferModalOpen(true);
  };

  const handleTransferSuccess = () => {
    setIsTransferModalOpen(false);
    setMemberToTransfer(null);
  };

  const handleTransferCancel = () => {
    setIsTransferModalOpen(false);
    setMemberToTransfer(null);
  };

  // Export utility functions
  const convertToCSV = (data: GetMembersQuery["members"]["members"]) => {
    if (!data || data.length === 0) return "";

    const headers = [
      "ID",
      "Full Name",
      "Contact Number",
      "Gender",
      "Family",
      "Role",
      "Status",
      "Profession",
      "Location",
      "Created At",
      "Updated At",
    ];

    const rows = data.map((member) => [
      member.id,
      member.full_name || "",
      member.contact_no || "",
      member.gender || "",
      member.family?.name || "",
      member.role?.name || "",
      member.status?.name || "",
      member.profession?.name || member.profession_name || "",
      member.location?.name || member.location_name || "",
      member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "",
      member.updatedAt ? new Date(member.updatedAt).toLocaleDateString() : "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    return csvContent;
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = (
    data: GetMembersQuery["members"]["members"],
    filename: string,
  ) => {
    // For Excel export, we'll use a simple CSV format that Excel can open
    // In a real application, you might want to use a library like xlsx
    const csvContent = convertToCSV(data);
    const excelFilename = filename.replace(".csv", ".xlsx");
    downloadCSV(csvContent, excelFilename);
  };

  const handleExport = async (format: "csv" | "excel") => {
    setIsExporting(true);
    try {
      // Use current members data for export
      const allMembers = members;

      if (allMembers.length === 0) {
        toast.warning(
          "No members found to export. Please ensure there are members in the current view.",
        );
        return;
      }

      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `gotera-youth-members-${timestamp}`;

      if (format === "csv") {
        const csvContent = convertToCSV(allMembers);
        downloadCSV(csvContent, `${filename}.csv`);
        toast.success(`Exported ${allMembers.length} members to CSV`);
      } else {
        downloadExcel(allMembers, `${filename}.xlsx`);
        toast.success(`Exported ${allMembers.length} members to Excel`);
      }

      setIsExportModalOpen(false);
    } catch (error) {
      console.error("Error exporting members:", error);
      toast.error("Failed to export members. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportModalClose = () => {
    setIsExportModalOpen(false);
  };

  const hasActiveFilters = Object.keys(searchFilters).length > 0;

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Members" />
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
        title="Members"
        subtitle={`${total} members`}
        actions={
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="border-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => setIsExportModalOpen(true)}
              disabled={isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Export"}
            </Button>
            <Button
              className="bg-brand-gradient hover:opacity-90 transition-opacity"
              onClick={() => setIsNewMemberModalOpen(true)}
            >
              Add New Member
            </Button>
          </div>
        }
      />

      <MemberSearch
        onSearch={handleSearch}
        onClear={handleClearSearch}
        isLoading={loading}
        hideFamilyFilter={unassignedOnly}
        initialNoMinistry={noMinistryOnly}
        initialNotEmployed={notEmployedOnly}
        extraFiltersActive={unassignedOnly}
        extraFiltersLabel="Unassigned only"
        extraFilters={
          canFilterUnassigned ? (
            <div className="flex items-center gap-3">
              <Switch
                id="unassigned-only"
                checked={unassignedOnly}
                onCheckedChange={applyUnassignedOnly}
              />
              <Label htmlFor="unassigned-only" className="cursor-pointer">
                Unassigned only
              </Label>
            </div>
          ) : undefined
        }
      />

      <Card className="shadow-brand">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-brand-gradient">Members List</CardTitle>
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
              icon={hasActiveFilters ? "🔍" : "👥"}
              title={
                hasActiveFilters
                  ? "No members found matching your search"
                  : "No members found"
              }
              description={
                hasActiveFilters
                  ? "Try adjusting your search criteria or clear the filters to see all members."
                  : "Add your first member to get started with the Gotera Youth system."
              }
              secondaryAction={
                hasActiveFilters
                  ? { label: "Clear Filters", onClick: handleClearSearch }
                  : undefined
              }
              primaryAction={
                !hasActiveFilters
                  ? {
                      label: "Add First Member",
                      onClick: () => setIsNewMemberModalOpen(true),
                    }
                  : undefined
              }
            />
          ) : (
            <div className="space-y-4">
              {/* Mobile Card View - Hidden on desktop */}
              <div className="block md:hidden space-y-3">
                {data?.members?.members?.map((member) => (
                  <Card key={member.id} className="shadow-sm border">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header with name and role */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 min-w-0">
                            <PersonAvatar
                              name={member.full_name}
                              photoUrl={member.photo_url}
                            />
                            <div
                              className={`h-2 w-2 shrink-0 rounded-full ${
                                member.role?.name === "FL"
                                  ? "bg-green-600"
                                  : member.status?.name === "Not Active"
                                    ? "bg-red-500"
                                    : "bg-blue-500"
                              }`}
                            ></div>
                            <div className="font-semibold text-lg truncate">
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
                              Family:
                            </span>
                            <span>{member.family?.name || "N/A"}</span>
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
                        <div className="flex flex-wrap gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-slate-700 hover:bg-slate-50 min-w-[80px]"
                            onClick={() => handleViewMember(member)}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-blue-600 hover:bg-blue-50 min-w-[80px]"
                            onClick={() => handleUpdateMember(member.id)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-green-600 hover:bg-green-50 min-w-[80px]"
                            onClick={() => handlePromoteMember(member)}
                            disabled={!member.contact_no}
                          >
                            Promote
                          </Button>
                          {canResetPassword && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-orange-600 hover:bg-orange-50 min-w-[80px]"
                              onClick={() => handleResetPassword(member)}
                              disabled={!member.contact_no}
                            >
                              Reset PW
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-purple-600 hover:bg-purple-50 min-w-[80px]"
                            onClick={() => handleTransferMember(member)}
                          >
                            Transfer
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
                      <th className="text-left p-3 font-semibold">Family</th>
                      {/* <th className="text-left p-3 font-semibold">Role</th> */}
                      <th className="text-left p-3 font-semibold">Status</th>
                      <th className="text-left p-3 font-semibold">
                        Profession
                      </th>
                      <th className="text-left p-3 font-semibold">Location</th>
                      <th className="text-left p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.members?.members?.map((member) => {
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
                            <PersonAvatar
                              name={member.full_name}
                              photoUrl={member.photo_url}
                            />
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
                              {member.family?.name || "N/A"}
                            </div>
                          </td>
                          {/* <td className="p-3">
                          <div className="text-sm">
                            {member.role?.name || "N/A"}
                          </div>
                        </td> */}
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
                                className="text-slate-700 hover:bg-slate-50"
                                onClick={() => handleViewMember(member)}
                              >
                                View
                              </Button>
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
                                className="text-green-600 hover:bg-green-50"
                                onClick={() => handlePromoteMember(member)}
                                disabled={!member.contact_no}
                              >
                                Promote
                              </Button>
                              {canResetPassword && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-orange-600 hover:bg-orange-50"
                                  onClick={() => handleResetPassword(member)}
                                  disabled={!member.contact_no}
                                >
                                  Reset PW
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-purple-600 hover:bg-purple-50"
                                onClick={() => handleTransferMember(member)}
                              >
                                Transfer
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
                allowShowAll
                filtered={hasActiveFilters}
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

      <MemberViewModal
        isOpen={!!viewMember}
        onClose={() => setViewMember(null)}
        member={viewMember}
      />

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

      {/* Promote Member Modal */}
      <PromoteMemberModal
        member={memberToPromote || { id: 0, full_name: "", contact_no: "" }}
        isOpen={isPromoteModalOpen}
        onClose={handlePromoteCancel}
        onSuccess={handlePromoteSuccess}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        member={
          memberToResetPassword || { id: 0, full_name: "", contact_no: "" }
        }
        isOpen={isResetPasswordModalOpen}
        onClose={handleResetPasswordCancel}
        onSuccess={handleResetPasswordSuccess}
      />

      {/* Password Display Modal */}
      <PasswordDisplayModal
        isOpen={isPasswordModalOpen}
        onClose={handlePasswordModalClose}
        memberName={promotedMemberData?.name || ""}
        password={promotedMemberData?.password || ""}
        role={promotedMemberData?.role || ""}
      />

      {/* Transfer Member Modal */}
      <TransferMemberModal
        member={memberToTransfer || { id: 0, full_name: "", family: null }}
        isOpen={isTransferModalOpen}
        onClose={handleTransferCancel}
        onSuccess={handleTransferSuccess}
      />

      {/* Export Modal */}
      <AlertDialog
        open={isExportModalOpen}
        onOpenChange={handleExportModalClose}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Export Members</AlertDialogTitle>
            <AlertDialogDescription>
              Choose the format to export members data. This will export all
              members
              {hasActiveFilters ? " matching your current search filters" : ""}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleExport("csv")}
              disabled={isExporting}
            >
              <FileText className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleExport("excel")}
              disabled={isExporting}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export as Excel
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleExportModalClose}>
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Members;
