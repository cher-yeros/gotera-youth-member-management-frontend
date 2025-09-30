import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import ThemeToggle from "@/components/ui/theme-toggle";
import FullscreenModal from "@/components/ui/fullscreen-modal";
import NewFamilyModalForm from "@/components/forms/NewFamilyModalForm";
import FamilySearch from "@/components/shared/FamilySearch";
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
import { useDeleteFamily, useGetFamilies } from "@/hooks/useGraphQL";
import { useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const FamiliesPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isNewFamilyModalOpen, setIsNewFamilyModalOpen] = useState(false);
  const [isUpdateFamilyModalOpen, setIsUpdateFamilyModalOpen] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState<number | null>(null);
  const [searchFilters, setSearchFilters] = useState<{ search: string }>({
    search: "",
  });
  const [familyToDelete, setFamilyToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Fetch families data
  const { data, loading, refetch } = useGetFamilies();
  const { deleteFamily } = useDeleteFamily();

  const families = data?.families || [];
  const totalFamilies = families.length;

  // Filter families based on search term
  const filteredFamilies = families.filter((family) =>
    family.name
      .toLowerCase()
      .includes((searchFilters.search || "").toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredFamilies.length / pageSize);
  const paginatedFamilies = filteredFamilies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Event handlers
  const handleSearch = useCallback((filters: { search: string }) => {
    setSearchFilters(filters);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchFilters({ search: "" });
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // const handleDeleteFamily = (family: { id: number; name: string }) => {
  //   setFamilyToDelete({ id: family.id, name: family.name });
  // };

  const confirmDeleteFamily = async () => {
    if (!familyToDelete) return;

    try {
      await deleteFamily(familyToDelete.id);
      refetch();
      setFamilyToDelete(null);
    } catch (error) {
      console.error("Error deleting family:", error);
    }
  };

  const cancelDeleteFamily = () => {
    setFamilyToDelete(null);
  };

  const handleNewFamilySuccess = () => {
    setIsNewFamilyModalOpen(false);
    refetch();
  };

  const handleNewFamilyCancel = () => {
    setIsNewFamilyModalOpen(false);
  };

  const handleUpdateFamily = (familyId: number) => {
    setSelectedFamilyId(familyId);
    setIsUpdateFamilyModalOpen(true);
  };

  const handleUpdateFamilySuccess = () => {
    setIsUpdateFamilyModalOpen(false);
    setSelectedFamilyId(null);
    refetch();
  };

  const handleUpdateFamilyCancel = () => {
    setIsUpdateFamilyModalOpen(false);
    setSelectedFamilyId(null);
  };

  const handleViewMembers = (familyId: number) => {
    navigate(`/families/${familyId}/members`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-gradient">Families</h1>
          <p className="text-muted-foreground">
            Manage family registrations and information ({totalFamilies} total)
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle variant="icon" />
          <Button
            className="bg-brand-gradient hover:opacity-90 transition-opacity"
            onClick={() => setIsNewFamilyModalOpen(true)}
          >
            Add New Family
          </Button>
        </div>
      </div>

      <FamilySearch
        onSearch={handleSearch}
        onClear={handleClearSearch}
        isLoading={loading}
      />

      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">Families List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading families...</p>
            </div>
          ) : filteredFamilies.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-brand-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">
                  {Object.keys(searchFilters).length > 0 ? "🔍" : "👥"}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {Object.keys(searchFilters).length > 0
                  ? "No families found matching your search"
                  : "No families found"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {Object.keys(searchFilters).length > 0
                  ? "Try adjusting your search criteria or clear the filters to see all families."
                  : "Add your first family to get started with the Gotera Youth system."}
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
                  onClick={() => setIsNewFamilyModalOpen(true)}
                  className="bg-brand-gradient hover:opacity-90 transition-opacity"
                >
                  Add First Family
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Mobile Card View - Hidden on desktop */}
              <div className="block md:hidden space-y-3">
                {paginatedFamilies.map((family) => (
                  <Card key={family.id} className="shadow-sm border">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header with family name */}
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-lg">
                            {family.name}
                          </div>
                          <Badge className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-900">
                            {family.members?.length || 0} members
                          </Badge>
                        </div>

                        {/* Family details */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Created:
                            </span>
                            <span>
                              {new Date(family.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-green-600 hover:bg-green-50"
                            onClick={() => handleViewMembers(family.id)}
                          >
                            View Members
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-blue-600 hover:bg-blue-50"
                            onClick={() => handleUpdateFamily(family.id)}
                          >
                            Edit
                          </Button>
                          {/* <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteFamily(family)}
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
                      <th className="text-left p-3 font-semibold">
                        Family Name
                      </th>
                      <th className="text-left p-3 font-semibold">Members</th>
                      {/* <th className="text-left p-3 font-semibold">Created</th> */}
                      <th className="text-left p-3 font-semibold">
                        Last Updated
                      </th>
                      <th className="text-left p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFamilies.map((family) => (
                      <tr
                        key={family.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-3">
                          <div className="font-medium">{family.name}</div>
                        </td>
                        <td className="p-3">
                          <Badge className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-900">
                            {family.members?.length || 0} members
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="text-sm text-muted-foreground">
                            {new Date(family.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        {/* <td className="p-3">
                          <div className="text-sm text-muted-foreground">
                            {new Date(family.updatedAt).toLocaleDateString()}
                          </div>
                        </td> */}
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:bg-green-50"
                              onClick={() => handleViewMembers(family.id)}
                            >
                              View Members
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:bg-blue-50"
                              onClick={() => handleUpdateFamily(family.id)}
                            >
                              Edit
                            </Button>
                            {/* <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteFamily(family)}
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
                      {Math.min(
                        currentPage * pageSize,
                        filteredFamilies.length
                      )}{" "}
                      of {filteredFamilies.length} filtered families
                    </>
                  ) : (
                    <>
                      Showing {(currentPage - 1) * pageSize + 1} to{" "}
                      {Math.min(
                        currentPage * pageSize,
                        filteredFamilies.length
                      )}{" "}
                      of {filteredFamilies.length} families
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

      {/* New Family Modal */}
      <FullscreenModal
        isOpen={isNewFamilyModalOpen}
        onClose={handleNewFamilyCancel}
        title="Add New Family"
      >
        <NewFamilyModalForm
          onSuccess={handleNewFamilySuccess}
          onCancel={handleNewFamilyCancel}
          mode="create"
        />
      </FullscreenModal>

      {/* Update Family Modal */}
      <FullscreenModal
        isOpen={isUpdateFamilyModalOpen}
        onClose={handleUpdateFamilyCancel}
        title="Update Family"
      >
        <NewFamilyModalForm
          onSuccess={handleUpdateFamilySuccess}
          onCancel={handleUpdateFamilyCancel}
          familyId={selectedFamilyId || undefined}
          mode="update"
        />
      </FullscreenModal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!familyToDelete}
        onOpenChange={() => setFamilyToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Family</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{familyToDelete?.name}</strong>? This action cannot be
              undone and will permanently remove the family from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteFamily}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteFamily}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Family
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FamiliesPage;
