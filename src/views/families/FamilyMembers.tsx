import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import ThemeToggle from "@/components/ui/theme-toggle";
import FullscreenModal from "@/components/ui/fullscreen-modal";
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
import {
  useDeleteMember,
  useGetMembers,
  useGetFamily,
} from "@/hooks/useGraphQL";
import { useState, useCallback, useEffect } from "react";
import type { MemberFilterInput } from "@/generated/graphql";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/redux/useAuth";

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

  // Fetch family data
  const { data: familyData, loading: familyLoading } = useGetFamily(
    effectiveFamilyId || 0
  );

  // Initialize filters with family filter
  useEffect(() => {
    if (effectiveFamilyId) {
      setSearchFilters({
        family_id: effectiveFamilyId,
      });
    }
  }, [effectiveFamilyId]);

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

  const handleSearch = useCallback(
    (filters: MemberFilterInput) => {
      setSearchFilters({
        ...filters,
        family_id: effectiveFamilyId || undefined,
      });
      setCurrentPage(1); // Reset to first page when searching
    },
    [effectiveFamilyId]
  );

  const handleClearSearch = useCallback(() => {
    setSearchFilters({
      family_id: effectiveFamilyId || undefined,
    });
    setCurrentPage(1);
  }, [effectiveFamilyId]);

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
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading family information...
          </p>
        </div>
      </div>
    );
  }

  if (!family) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="h-16 w-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-red-600">
            Family Not Found
          </h3>
          <p className="text-muted-foreground mb-4">
            The requested family could not be found.
          </p>
          <Button
            onClick={handleBackToFamilies}
            className="bg-brand-gradient hover:opacity-90 transition-opacity"
          >
            {isFamilyLeaderView ? "Back to Dashboard" : "Back to Families"}
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
              {family.name} Family Members
            </h1>
            <p className="text-muted-foreground">
              Members of the {family.name} family
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
            {isFamilyLeaderView
              ? `${family.name} Family Members`
              : `${family.name} Family Members`}
          </h1>
          <p className="text-muted-foreground">
            {isFamilyLeaderView
              ? `Members of your family (${total} total)`
              : `Members of the ${family.name} family (${total} total)`}
          </p>
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToFamilies}
              className="text-sm"
            >
              ← {isFamilyLeaderView ? "Back to Dashboard" : "Back to Families"}
            </Button>
          </div>
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
          <CardTitle className="text-brand-gradient">
            Family Members List
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
                <span className="text-white text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No members found in this family
              </h3>
              <p className="text-muted-foreground mb-4">
                Add the first member to the{" "}
                {isFamilyLeaderView ? "your" : family.name} family to get
                started.
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
              {/* Members Table */}
              <div className="overflow-x-auto">
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
                    {members.map((member) => (
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
                            {member.role?.name || "N/A"}
                          </div>
                        </td>
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
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, total)} of {total} members
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
