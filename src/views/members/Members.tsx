import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ThemeToggle from "@/components/ui/theme-toggle";
import FullscreenModal from "@/components/ui/fullscreen-modal";
import NewMemberModalForm from "@/components/forms/NewMemberModalForm";
import PromoteMemberModal from "@/components/forms/PromoteMemberModal";
import ResetPasswordModal from "@/components/forms/ResetPasswordModal";
import PasswordDisplayModal from "@/components/forms/PasswordDisplayModal";
import TransferMemberModal from "@/components/forms/TransferMemberModal";
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
import { useDeleteMember, useGetMembers } from "@/hooks/useGraphQL";
import { useState, useCallback } from "react";
import type { MemberFilterInput, GetMembersQuery } from "@/generated/graphql";
import { Badge } from "@/components/ui/badge";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "react-toastify";

const Members = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);
  const [isUpdateMemberModalOpen, setIsUpdateMemberModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [searchFilters, setSearchFilters] = useState<MemberFilterInput>({});
  const [memberToDelete, setMemberToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [memberToPromote, setMemberToPromote] = useState<{
    id: number;
    full_name: string;
    contact_no: string;
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
  const totalPages = pageSize === 10000 ? 1 : Math.ceil(total / pageSize);

  const handleSearch = useCallback((filters: MemberFilterInput) => {
    setSearchFilters(filters);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchFilters({});
    setCurrentPage(1);
  }, []);

  // const handleDeleteMember = (member: { id: number; full_name: string }) => {
  //   setMemberToDelete({ id: member.id, name: member.full_name });
  // };

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;

    try {
      await deleteMember(memberToDelete.id);
      refetch();
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
    refetch(); // Refresh the members list
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
    refetch(); // Refresh the members list
  };

  const handleUpdateMemberCancel = () => {
    setIsUpdateMemberModalOpen(false);
    setSelectedMemberId(null);
  };

  const handlePromoteMember = (member: {
    id: number;
    full_name: string;
    contact_no?: string | null | undefined;
  }) => {
    if (!member.contact_no) {
      return; // This shouldn't happen since the button is disabled when contact_no is null/undefined
    }
    setMemberToPromote({
      id: member.id,
      full_name: member.full_name,
      contact_no: member.contact_no,
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
    refetch(); // Refresh the members list
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
    filename: string
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
          "No members found to export. Please ensure there are members in the current view."
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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-gradient">Members</h1>
            <p className="text-muted-foreground">
              Manage youth members and their information
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
          <h1 className="text-3xl font-bold text-brand-gradient">Members</h1>
          <p className="text-muted-foreground">
            Manage youth members and their information ({total} total)
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle variant="icon" />
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
      </div>

      <MemberSearch
        onSearch={handleSearch}
        onClear={handleClearSearch}
        isLoading={loading}
      />

      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">Members List</CardTitle>
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
                <span className="text-white text-2xl">
                  {Object.keys(searchFilters).length > 0 ? "🔍" : "👥"}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {Object.keys(searchFilters).length > 0
                  ? "No members found matching your search"
                  : "No members found"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {Object.keys(searchFilters).length > 0
                  ? "Try adjusting your search criteria or clear the filters to see all members."
                  : "Add your first member to get started with the Gotera Youth system."}
              </p>
              {Object.keys(searchFilters).length > 0 ? (
                <Button
                  onClick={handleClearSearch}
                  variant="outline"
                  className="border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Clear Filters
                </Button>
              ) : (
                <Button
                  onClick={() => setIsNewMemberModalOpen(true)}
                  className="bg-brand-gradient hover:opacity-90 transition-opacity"
                >
                  Add First Member
                </Button>
              )}
            </div>
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
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-orange-600 hover:bg-orange-50 min-w-[80px]"
                            onClick={() => handleResetPassword(member)}
                            disabled={!member.contact_no}
                          >
                            Reset PW
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-purple-600 hover:bg-purple-50 min-w-[80px]"
                            onClick={() => handleTransferMember(member)}
                          >
                            Transfer
                          </Button>
                          {/* <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteMember(member)}
                          >
                            Delete
                          </Button> */}
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
                    {data?.members?.members?.map((member) => (
                      <tr
                        key={member.id}
                        className="border-b hover:bg-muted/50"
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
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-orange-600 hover:bg-orange-50"
                              onClick={() => handleResetPassword(member)}
                              disabled={!member.contact_no}
                            >
                              Reset PW
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-purple-600 hover:bg-purple-50"
                              onClick={() => handleTransferMember(member)}
                            >
                              Transfer
                            </Button>
                            {/* <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteMember(member)}
                            >
                              Delete
                            </Button> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mt-6">
                {/* Page size selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Show:</span>
                  <Select
                    value={pageSize === 10000 ? "all" : pageSize.toString()}
                    onValueChange={(value) => {
                      if (value === "all") {
                        setPageSize(10000); // Large number to show all
                      } else {
                        setPageSize(Number(value));
                      }
                      setCurrentPage(1); // Reset to first page when changing page size
                    }}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">
                    per page
                  </span>
                </div>

                {/* Pagination info */}
                <div className="text-sm text-muted-foreground">
                  {pageSize === 10000 ? (
                    // Show all members
                    Object.keys(searchFilters).length > 0 ? (
                      <>Showing all {total} filtered members</>
                    ) : (
                      <>Showing all {total} members</>
                    )
                  ) : // Show paginated info
                  Object.keys(searchFilters).length > 0 ? (
                    <>
                      Showing {(currentPage - 1) * pageSize + 1} to{" "}
                      {Math.min(currentPage * pageSize, total)} of {total}{" "}
                      filtered members
                    </>
                  ) : (
                    <>
                      Showing {(currentPage - 1) * pageSize + 1} to{" "}
                      {Math.min(currentPage * pageSize, total)} of {total}{" "}
                      members
                    </>
                  )}
                </div>

                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </Button>

                    <div className="flex space-x-2">
                      {(() => {
                        const maxVisiblePages = 5;
                        const halfVisible = Math.floor(maxVisiblePages / 2);

                        let startPage = Math.max(1, currentPage - halfVisible);
                        const endPage = Math.min(
                          totalPages,
                          startPage + maxVisiblePages - 1
                        );

                        // Adjust start page if we're near the end
                        if (endPage - startPage + 1 < maxVisiblePages) {
                          startPage = Math.max(
                            1,
                            endPage - maxVisiblePages + 1
                          );
                        }

                        const pages = [];
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(i);
                        }

                        return pages.map((page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={`min-w-[40px] ${
                              currentPage === page
                                ? "bg-brand-gradient text-white"
                                : ""
                            }`}
                          >
                            {page}
                          </Button>
                        ));
                      })()}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
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
              {Object.keys(searchFilters).length > 0
                ? " matching your current search filters"
                : ""}
              .
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
