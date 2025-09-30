import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import ThemeToggle from "@/components/ui/theme-toggle";
import FullscreenModal from "@/components/ui/fullscreen-modal";
import NewProfessionModalForm from "@/components/forms/NewProfessionModalForm";
import ProfessionSearch from "@/components/shared/ProfessionSearch";
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
import { useDeleteProfession, useGetProfessions } from "@/hooks/useGraphQL";
import { useState, useCallback } from "react";

const ProfessionsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isNewProfessionModalOpen, setIsNewProfessionModalOpen] =
    useState(false);
  const [isUpdateProfessionModalOpen, setIsUpdateProfessionModalOpen] =
    useState(false);
  const [selectedProfessionId, setSelectedProfessionId] = useState<
    number | null
  >(null);
  const [searchFilters, setSearchFilters] = useState<{ search: string }>({
    search: "",
  });
  const [professionToDelete, setProfessionToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Fetch professions data
  const { data, loading, refetch } = useGetProfessions();
  const { deleteProfession } = useDeleteProfession();

  const professions = data?.professions || [];
  const totalProfessions = professions.length;

  // Filter professions based on search term
  const filteredProfessions = professions.filter((profession) =>
    profession.name
      .toLowerCase()
      .includes((searchFilters.search || "").toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredProfessions.length / pageSize);
  const paginatedProfessions = filteredProfessions.slice(
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

  // const handleDeleteProfession = (profession: { id: number; name: string }) => {
  //   setProfessionToDelete({ id: profession.id, name: profession.name });
  // };

  const confirmDeleteProfession = async () => {
    if (!professionToDelete) return;

    try {
      await deleteProfession(professionToDelete.id);
      refetch();
      setProfessionToDelete(null);
    } catch (error) {
      console.error("Error deleting profession:", error);
    }
  };

  const cancelDeleteProfession = () => {
    setProfessionToDelete(null);
  };

  const handleNewProfessionSuccess = () => {
    setIsNewProfessionModalOpen(false);
    refetch();
  };

  const handleNewProfessionCancel = () => {
    setIsNewProfessionModalOpen(false);
  };

  const handleUpdateProfession = (professionId: number) => {
    setSelectedProfessionId(professionId);
    setIsUpdateProfessionModalOpen(true);
  };

  const handleUpdateProfessionSuccess = () => {
    setIsUpdateProfessionModalOpen(false);
    setSelectedProfessionId(null);
    refetch();
  };

  const handleUpdateProfessionCancel = () => {
    setIsUpdateProfessionModalOpen(false);
    setSelectedProfessionId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-gradient">
            Professions
          </h1>
          <p className="text-muted-foreground">
            Manage member professions and categories ({totalProfessions} total)
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle variant="icon" />
          <Button
            className="bg-brand-gradient hover:opacity-90 transition-opacity"
            onClick={() => setIsNewProfessionModalOpen(true)}
          >
            Add New Profession
          </Button>
        </div>
      </div>

      <ProfessionSearch
        onSearch={handleSearch}
        onClear={handleClearSearch}
        isLoading={loading}
      />

      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">
            Professions List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">
                Loading professions...
              </p>
            </div>
          ) : filteredProfessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-brand-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">
                  {Object.keys(searchFilters).length > 0 ? "🔍" : "💼"}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {Object.keys(searchFilters).length > 0
                  ? "No professions found matching your search"
                  : "No professions found"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {Object.keys(searchFilters).length > 0
                  ? "Try adjusting your search criteria or clear the filters to see all professions."
                  : "Add your first profession to get started with the Gotera Youth system."}
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
                  onClick={() => setIsNewProfessionModalOpen(true)}
                  className="bg-brand-gradient hover:opacity-90 transition-opacity"
                >
                  Add First Profession
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Professions Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">
                        Profession Name
                      </th>
                      <th className="text-left p-3 font-semibold">Created</th>
                      <th className="text-left p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProfessions.map((profession) => (
                      <tr
                        key={profession.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-3">
                          <div className="font-medium">{profession.name}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm text-muted-foreground">
                            {new Date(
                              profession.createdAt
                            ).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:bg-blue-50"
                              onClick={() =>
                                handleUpdateProfession(profession.id)
                              }
                            >
                              Edit
                            </Button>
                            {/* <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteProfession(profession)}
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
                        filteredProfessions.length
                      )}{" "}
                      of {filteredProfessions.length} filtered professions
                    </>
                  ) : (
                    <>
                      Showing {(currentPage - 1) * pageSize + 1} to{" "}
                      {Math.min(
                        currentPage * pageSize,
                        filteredProfessions.length
                      )}{" "}
                      of {filteredProfessions.length} professions
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

      {/* New Profession Modal */}
      <FullscreenModal
        isOpen={isNewProfessionModalOpen}
        onClose={handleNewProfessionCancel}
        title="Add New Profession"
      >
        <NewProfessionModalForm
          onSuccess={handleNewProfessionSuccess}
          onCancel={handleNewProfessionCancel}
          mode="create"
        />
      </FullscreenModal>

      {/* Update Profession Modal */}
      <FullscreenModal
        isOpen={isUpdateProfessionModalOpen}
        onClose={handleUpdateProfessionCancel}
        title="Update Profession"
      >
        <NewProfessionModalForm
          onSuccess={handleUpdateProfessionSuccess}
          onCancel={handleUpdateProfessionCancel}
          professionId={selectedProfessionId || undefined}
          mode="update"
        />
      </FullscreenModal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!professionToDelete}
        onOpenChange={() => setProfessionToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profession</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{professionToDelete?.name}</strong>? This action cannot be
              undone and will permanently remove the profession from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteProfession}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProfession}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Profession
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfessionsPage;
