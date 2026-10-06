import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FullscreenModal from "@/components/ui/fullscreen-modal";
import NewProfessionModalForm from "@/components/forms/NewProfessionModalForm";
import ProfessionSearch from "@/components/shared/ProfessionSearch";
import PageHeader from "@/components/shared/PageHeader";
import ListLoadingState from "@/components/shared/ListLoadingState";
import ListEmptyState from "@/components/shared/ListEmptyState";
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
  const { data, loading } = useGetProfessions();
  const { deleteProfession } = useDeleteProfession();

  const professions = data?.professions || [];
  const totalProfessions = professions.length;

  // Filter professions based on search term
  const filteredProfessions = professions.filter((profession) =>
    profession.name
      .toLowerCase()
      .includes((searchFilters.search || "").toLowerCase()),
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredProfessions.length / pageSize);
  const paginatedProfessions = filteredProfessions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
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
  };

  const handleUpdateProfessionCancel = () => {
    setIsUpdateProfessionModalOpen(false);
    setSelectedProfessionId(null);
  };

  const hasActiveFilters = Boolean(searchFilters.search?.trim());

  return (
    <div className="space-y-6">
      <PageHeader
        title="Professions"
        subtitle={`${totalProfessions} professions`}
        actions={
          <Button
            className="bg-brand-gradient hover:opacity-90 transition-opacity"
            onClick={() => setIsNewProfessionModalOpen(true)}
          >
            Add New Profession
          </Button>
        }
      />

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
            <ListLoadingState message="Loading professions..." />
          ) : filteredProfessions.length === 0 ? (
            <ListEmptyState
              icon={hasActiveFilters ? "🔍" : "💼"}
              title={
                hasActiveFilters
                  ? "No professions found matching your search"
                  : "No professions found"
              }
              description={
                hasActiveFilters
                  ? "Try adjusting your search criteria or clear the filters to see all professions."
                  : "Add your first profession to get started with the Gotera Youth system."
              }
              secondaryAction={
                hasActiveFilters
                  ? { label: "Clear Filters", onClick: handleClearSearch }
                  : undefined
              }
              primaryAction={
                !hasActiveFilters
                  ? {
                      label: "Add First Profession",
                      onClick: () => setIsNewProfessionModalOpen(true),
                    }
                  : undefined
              }
            />
          ) : (
            <div className="space-y-4">
              {/* Mobile Card View - Hidden on desktop */}
              <div className="block md:hidden space-y-3">
                {paginatedProfessions.map((profession) => (
                  <Card key={profession.id} className="shadow-sm border">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header with profession name */}
                        <div className="font-semibold text-lg">
                          {profession.name}
                        </div>

                        {/* Profession details */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Created:
                            </span>
                            <span>
                              {new Date(
                                profession.createdAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-blue-600 hover:bg-blue-50"
                            onClick={() =>
                              handleUpdateProfession(profession.id)
                            }
                          >
                            Edit
                          </Button>
                          {/* <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteProfession(profession)}
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
                              profession.createdAt,
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

              <ListPagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={filteredProfessions.length}
                onPageChange={handlePageChange}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                itemLabel="professions"
                filtered={hasActiveFilters}
              />
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
