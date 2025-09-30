import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import ThemeToggle from "@/components/ui/theme-toggle";
import FullscreenModal from "@/components/ui/fullscreen-modal";
import NewMemberModalForm from "@/components/forms/NewMemberModalForm";
import PromoteMemberModal from "@/components/forms/PromoteMemberModal";
import PasswordDisplayModal from "@/components/forms/PasswordDisplayModal";
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
import type { MemberFilterInput } from "@/generated/graphql";
import { Badge } from "@/components/ui/badge";

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
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [promotedMemberData, setPromotedMemberData] = useState<{
    name: string;
    password: string;
    role: string;
  } | null>(null);

  // Fetch members with pagination and filters
  const { data, loading, error, refetch } = useGetMembers(searchFilters, {
    page: currentPage,
    limit: pageSize,
  });

  const { deleteMember } = useDeleteMember();

  const members = data?.members?.members || [];
  const totalPages = data?.members?.totalPages || 0;
  const total = data?.members?.total || 0;

  const handleSearch = useCallback((filters: MemberFilterInput) => {
    setSearchFilters(filters);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchFilters({});
    setCurrentPage(1);
  }, []);

  const handleDeleteMember = (member: { id: number; full_name: string }) => {
    setMemberToDelete({ id: member.id, name: member.full_name });
  };

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

  const handlePasswordModalClose = () => {
    setIsPasswordModalOpen(false);
    setPromotedMemberData(null);
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
                            <Badge
                              className={`px-2 py-1 rounded-full text-xs ${
                                member.role?.name === "FL"
                                  ? "bg-green-100 text-green-900"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {member.role?.name || "N/A"}
                            </Badge>
                            <div className="font-semibold text-lg">
                              {member.full_name}
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              member.status?.name === "Active"
                                ? "bg-green-100 text-green-800"
                                : member.status?.name === "Inactive"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {member.status?.name || "N/A"}
                          </span>
                        </div>

                        {/* Member details */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Contact:
                            </span>
                            <span>{member.contact_no || "N/A"}</span>
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
                            className="flex-1 text-green-600 hover:bg-green-50"
                            onClick={() => handlePromoteMember(member)}
                            disabled={!member.contact_no}
                          >
                            Promote
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
                            {member.contact_no || "N/A"}
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
                                : member.status?.name === "Inactive"
                                ? "bg-gray-100 text-gray-800"
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
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      setCurrentPage(1); // Reset to first page when changing page size
                    }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </Select>
                  <span className="text-sm text-muted-foreground">
                    per page
                  </span>
                </div>

                {/* Pagination info */}
                <div className="text-sm text-muted-foreground">
                  {Object.keys(searchFilters).length > 0 ? (
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

                    <div className="flex space-x-1">
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
                            className={
                              currentPage === page
                                ? "bg-brand-gradient text-white"
                                : ""
                            }
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

      {/* Password Display Modal */}
      <PasswordDisplayModal
        isOpen={isPasswordModalOpen}
        onClose={handlePasswordModalClose}
        memberName={promotedMemberData?.name || ""}
        password={promotedMemberData?.password || ""}
        role={promotedMemberData?.role || ""}
      />
    </div>
  );
};

export default Members;
