import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FullscreenModal from "@/components/ui/fullscreen-modal";
import NewLocationModalForm from "@/components/forms/NewLocationModalForm";
import LocationSearch from "@/components/shared/LocationSearch";
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
import { useDeleteLocation, useGetLocations } from "@/hooks/useGraphQL";
import { useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";

const LocationsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isNewLocationModalOpen, setIsNewLocationModalOpen] = useState(false);
  const [isUpdateLocationModalOpen, setIsUpdateLocationModalOpen] =
    useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null,
  );
  const [searchFilters, setSearchFilters] = useState<{ search: string }>({
    search: "",
  });
  const [locationToDelete, setLocationToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Fetch locations data
  const { data, loading } = useGetLocations();
  const { deleteLocation } = useDeleteLocation();

  const locations = data?.locations || [];
  const totalLocations = locations.length;

  // Filter locations based on search term
  const filteredLocations = locations.filter((location) =>
    location.name
      .toLowerCase()
      .includes((searchFilters.search || "").toLowerCase()),
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredLocations.length / pageSize);
  const paginatedLocations = filteredLocations.slice(
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

  // const handleDeleteLocation = (location: { id: number; name: string }) => {
  //   setLocationToDelete({ id: location.id, name: location.name });
  // };

  const confirmDeleteLocation = async () => {
    if (!locationToDelete) return;

    try {
      await deleteLocation(locationToDelete.id);
      setLocationToDelete(null);
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  const cancelDeleteLocation = () => {
    setLocationToDelete(null);
  };

  const handleNewLocationSuccess = () => {
    setIsNewLocationModalOpen(false);
  };

  const handleNewLocationCancel = () => {
    setIsNewLocationModalOpen(false);
  };

  const handleUpdateLocation = (locationId: number) => {
    setSelectedLocationId(locationId);
    setIsUpdateLocationModalOpen(true);
  };

  const handleUpdateLocationSuccess = () => {
    setIsUpdateLocationModalOpen(false);
    setSelectedLocationId(null);
  };

  const handleUpdateLocationCancel = () => {
    setIsUpdateLocationModalOpen(false);
    setSelectedLocationId(null);
  };

  const hasActiveFilters = Boolean(searchFilters.search?.trim());

  return (
    <div className="space-y-6">
      <PageHeader
        title="Locations"
        subtitle={`${totalLocations} locations`}
        actions={
          <Button
            className="bg-brand-gradient hover:opacity-90 transition-opacity"
            onClick={() => setIsNewLocationModalOpen(true)}
          >
            Add New Location
          </Button>
        }
      />

      <LocationSearch
        onSearch={handleSearch}
        onClear={handleClearSearch}
        isLoading={loading}
      />

      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">Locations List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ListLoadingState message="Loading locations..." />
          ) : filteredLocations.length === 0 ? (
            <ListEmptyState
              icon={hasActiveFilters ? "🔍" : "📍"}
              title={
                hasActiveFilters
                  ? "No locations found matching your search"
                  : "No locations found"
              }
              description={
                hasActiveFilters
                  ? "Try adjusting your search criteria or clear the filters to see all locations."
                  : "Add your first location to get started with the Gotera Youth system."
              }
              secondaryAction={
                hasActiveFilters
                  ? { label: "Clear Filters", onClick: handleClearSearch }
                  : undefined
              }
              primaryAction={
                !hasActiveFilters
                  ? {
                      label: "Add First Location",
                      onClick: () => setIsNewLocationModalOpen(true),
                    }
                  : undefined
              }
            />
          ) : (
            <div className="space-y-4">
              {/* Mobile Card View - Hidden on desktop */}
              <div className="block md:hidden space-y-3">
                {paginatedLocations.map((location) => (
                  <Card key={location.id} className="shadow-sm border">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header with location name */}
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-lg">
                            {location.name}
                          </div>
                          <Badge className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-900">
                            {location.members?.length || 0} members
                          </Badge>
                        </div>

                        {/* Location details */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Created:
                            </span>
                            <span>
                              {new Date(
                                location.createdAt,
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
                            onClick={() => handleUpdateLocation(location.id)}
                          >
                            Edit
                          </Button>
                          {/* <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteLocation(location)}
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
                        Location Name
                      </th>
                      <th className="text-left p-3 font-semibold">Members</th>
                      <th className="text-left p-3 font-semibold">Created</th>
                      <th className="text-left p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLocations.map((location) => (
                      <tr
                        key={location.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-3">
                          <div className="font-medium">{location.name}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm text-muted-foreground">
                            {location.members?.length || 0} members
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm text-muted-foreground">
                            {new Date(location.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:bg-blue-50"
                              onClick={() => handleUpdateLocation(location.id)}
                            >
                              Edit
                            </Button>
                            {/* <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteLocation(location)}
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
                totalItems={filteredLocations.length}
                onPageChange={handlePageChange}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                itemLabel="locations"
                filtered={hasActiveFilters}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Location Modal */}
      <FullscreenModal
        isOpen={isNewLocationModalOpen}
        onClose={handleNewLocationCancel}
        title="Add New Location"
      >
        <NewLocationModalForm
          onSuccess={handleNewLocationSuccess}
          onCancel={handleNewLocationCancel}
          mode="create"
        />
      </FullscreenModal>

      {/* Update Location Modal */}
      <FullscreenModal
        isOpen={isUpdateLocationModalOpen}
        onClose={handleUpdateLocationCancel}
        title="Update Location"
      >
        <NewLocationModalForm
          onSuccess={handleUpdateLocationSuccess}
          onCancel={handleUpdateLocationCancel}
          locationId={selectedLocationId || undefined}
          mode="update"
        />
      </FullscreenModal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!locationToDelete}
        onOpenChange={() => setLocationToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Location</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{locationToDelete?.name}</strong>? This action cannot be
              undone and will permanently remove the location from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteLocation}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteLocation}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Location
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LocationsPage;
