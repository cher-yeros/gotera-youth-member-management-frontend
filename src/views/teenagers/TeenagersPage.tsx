import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FullscreenModal from "@/components/ui/fullscreen-modal";
import NewTeenagerModalForm from "@/components/forms/NewTeenagerModalForm";
import TeenagerViewModal from "@/components/forms/TeenagerViewModal";
import TransferTeenagerModal from "@/components/forms/TransferTeenagerModal";
import PromoteTeenagerModal from "@/components/forms/PromoteTeenagerModal";
import TeenagerSearch from "@/components/shared/TeenagerSearch";
import { PersonAvatar } from "@/components/shared/PersonAvatar";
import PageHeader from "@/components/shared/PageHeader";
import ListLoadingState from "@/components/shared/ListLoadingState";
import ListEmptyState from "@/components/shared/ListEmptyState";
import ListErrorState from "@/components/shared/ListErrorState";
import ListPagination, { LIST_PAGE_SIZE_ALL } from "@/components/shared/ListPagination";
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
import { useDeleteTeenager, useGetTeenagers } from "@/hooks/useTeenGraphQL";
import { getTeenCompleteness } from "@/lib/teenCompleteness";
import { useState, useCallback } from "react";
import type {
  GetTeenagersQuery,
  TeenagerFilterInput,
} from "@/generated/graphql";

type TeenListItem = GetTeenagersQuery["teenagers"]["teenagers"][number];

const statusBadgeClass = (status?: string | null) => {
  if (status === "ACTIVE") return "bg-green-100 text-green-800";
  if (status === "PROMOTED") return "bg-blue-100 text-blue-800";
  if (status === "INACTIVE") return "bg-red-100 text-red-800";
  return "bg-yellow-100 text-yellow-800";
};

const statusDotClass = (status?: string | null) => {
  if (status === "ACTIVE") return "bg-green-600";
  if (status === "PROMOTED") return "bg-blue-500";
  return "bg-red-500";
};

const TeenagersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchFilters, setSearchFilters] = useState<TeenagerFilterInput>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewTeen, setViewTeen] = useState<TeenListItem | null>(null);
  const [editTeen, setEditTeen] = useState<TeenListItem | null>(null);
  const [transferTeen, setTransferTeen] = useState<TeenListItem | null>(null);
  const [promoteTeen, setPromoteTeen] = useState<TeenListItem | null>(null);
  const [teenToDelete, setTeenToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { data, loading, error, refetch } = useGetTeenagers(searchFilters, {
    page: currentPage,
    limit: pageSize,
  });
  const { deleteTeenager } = useDeleteTeenager();

  const payload = data?.teenagers;
  const teens = payload?.teenagers || [];
  const total = payload?.total || 0;
  const totalPages = pageSize === LIST_PAGE_SIZE_ALL ? 1 : Math.ceil(total / pageSize);

  const incompleteOnPage = teens.filter(
    (teen) => getTeenCompleteness(teen).isIncomplete,
  ).length;

  const handleSearch = useCallback((filters: TeenagerFilterInput) => {
    setSearchFilters(filters);
    setCurrentPage(1);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchFilters({});
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const confirmDeleteTeen = async () => {
    if (!teenToDelete) return;
    try {
      await deleteTeenager(teenToDelete.id);
      setTeenToDelete(null);
    } catch (err) {
      console.error("Error deleting teenager:", err);
    }
  };

  const hasActiveFilters = Object.values(searchFilters).some(
    (value) => value !== undefined && value !== "" && value !== null,
  );

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Teenagers" />
        <ListErrorState
          layout="page"
          title="Error Loading Teenagers"
          message={error.message || "Failed to load teenagers. Please try again."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teenagers"
        subtitle={`${total} teenagers`}
        actions={
          <Button
            className="bg-brand-gradient hover:opacity-90 transition-opacity"
            onClick={() => setIsCreateOpen(true)}
          >
            Register Teenager
          </Button>
        }
      />

      <TeenagerSearch
        onSearch={handleSearch}
        onClear={handleClearSearch}
        isLoading={loading}
      />

      <Card className="shadow-brand">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-brand-gradient">
              Teenagers List
            </CardTitle>
            {!loading && teens.length > 0 && (
              <CompletenessPageSummary
                incompleteCount={incompleteOnPage}
                totalOnPage={teens.length}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ListLoadingState message="Loading teenagers..." />
          ) : teens.length === 0 ? (
            <ListEmptyState
              icon={hasActiveFilters ? "🔍" : "👥"}
              title={
                hasActiveFilters
                  ? "No teenagers found matching your search"
                  : "No teenagers found"
              }
              description={
                hasActiveFilters
                  ? "Try adjusting your search criteria or clear the filters to see all teenagers."
                  : "Register your first teenager to get started."
              }
              secondaryAction={
                hasActiveFilters
                  ? { label: "Clear Filters", onClick: handleClearSearch }
                  : undefined
              }
              primaryAction={
                !hasActiveFilters
                  ? {
                      label: "Register First Teenager",
                      onClick: () => setIsCreateOpen(true),
                    }
                  : undefined
              }
            />
          ) : (
            <div className="space-y-4">
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {teens.map((teen) => {
                  const c = getTeenCompleteness(teen);
                  return (
                    <Card key={teen.id} className="shadow-sm border">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 min-w-0">
                              <PersonAvatar
                                name={teen.full_name}
                                photoUrl={teen.photo_url}
                              />
                              <div
                                className={`h-2 w-2 shrink-0 rounded-full ${statusDotClass(teen.status)}`}
                              />
                              <div className="font-semibold text-lg truncate">
                                {teen.full_name}
                              </div>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${statusBadgeClass(teen.status)}`}
                            >
                              {teen.status || "N/A"}
                            </span>
                          </div>

                          <div>
                            <ProfileCompletenessBadge
                              completeness={{
                                applicable: true,
                                isIncomplete: c.isIncomplete,
                                isFullyIncomplete: c.isFullyIncomplete,
                                missingFields: c.missing,
                              }}
                            />
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Class:
                              </span>
                              <span>{teen.teenClass?.name || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Contact:
                              </span>
                              <span>
                                {teen.contact_no ? (
                                  <a
                                    href={`tel:${teen.contact_no}`}
                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                    {teen.contact_no}
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
                                {teen.gender || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Location:
                              </span>
                              <span>{teen.location?.name || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Guardian:
                              </span>
                              <span>{teen.guardian_name || "N/A"}</span>
                            </div>
                            {(teen.guardian_relationship ||
                              teen.guardian_contact) && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Guardian phone:
                                </span>
                                <span className="text-right text-xs">
                                  {teen.guardian_relationship
                                    ? `${teen.guardian_relationship} · `
                                    : ""}
                                  {teen.guardian_contact ? (
                                    <a
                                      href={`tel:${teen.guardian_contact}`}
                                      className="text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                      {teen.guardian_contact}
                                    </a>
                                  ) : (
                                    "N/A"
                                  )}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-slate-700 hover:bg-slate-50 min-w-[80px]"
                              onClick={() => setViewTeen(teen)}
                            >
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-blue-600 hover:bg-blue-50 min-w-[80px]"
                              onClick={() => setEditTeen(teen)}
                            >
                              Edit
                            </Button>
                            {teen.status === "ACTIVE" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-green-600 hover:bg-green-50 min-w-[80px]"
                                  onClick={() => setPromoteTeen(teen)}
                                >
                                  Promote
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-purple-600 hover:bg-purple-50 min-w-[80px]"
                                  onClick={() => setTransferTeen(teen)}
                                >
                                  Transfer
                                </Button>
                              </>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-red-600 hover:bg-red-50 min-w-[80px]"
                              onClick={() =>
                                setTeenToDelete({
                                  id: teen.id,
                                  name: teen.full_name,
                                })
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Name</th>
                      <th className="text-left p-3 font-semibold">Info</th>
                      <th className="text-left p-3 font-semibold">Class</th>
                      <th className="text-left p-3 font-semibold">Contact</th>
                      <th className="text-left p-3 font-semibold">Gender</th>
                      <th className="text-left p-3 font-semibold">Location</th>
                      <th className="text-left p-3 font-semibold">Guardian</th>
                      <th className="text-left p-3 font-semibold">Status</th>
                      <th className="text-left p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teens.map((teen) => {
                      const completeness = getTeenCompleteness(teen);
                      return (
                        <tr
                          key={teen.id}
                          className={`border-b hover:bg-muted/50 ${
                            completeness.isFullyIncomplete
                              ? "bg-red-50/40 dark:bg-red-950/10"
                              : completeness.isIncomplete
                                ? "bg-yellow-50/30 dark:bg-yellow-950/10"
                                : ""
                          }`}
                        >
                          <td className="p-3">
                            <div className="flex items-center space-x-2">
                              <PersonAvatar
                                name={teen.full_name}
                                photoUrl={teen.photo_url}
                              />
                              <div
                                className={`h-2 w-2 rounded-full ${statusDotClass(teen.status)}`}
                              />
                              <div className="font-medium">
                                {teen.full_name}
                              </div>
                            </div>
                          </td>
                          <td className="p-3 max-w-[180px]">
                            <ProfileCompletenessBadge
                              completeness={{
                                applicable: true,
                                isIncomplete: completeness.isIncomplete,
                                isFullyIncomplete: completeness.isFullyIncomplete,
                                missingFields: completeness.missing,
                              }}
                            />
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              {teen.teenClass?.name || "N/A"}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm text-muted-foreground">
                              {teen.contact_no ? (
                                <a
                                  href={`tel:${teen.contact_no}`}
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {teen.contact_no}
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm capitalize">
                              {teen.gender || "N/A"}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              {teen.location?.name || "N/A"}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              {teen.guardian_name || "N/A"}
                            </div>
                            {(teen.guardian_relationship ||
                              teen.guardian_contact) && (
                              <div className="text-xs text-muted-foreground">
                                {teen.guardian_relationship
                                  ? `${teen.guardian_relationship} · `
                                  : ""}
                                {teen.guardian_contact ? (
                                  <a
                                    href={`tel:${teen.guardian_contact}`}
                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                    {teen.guardian_contact}
                                  </a>
                                ) : null}
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${statusBadgeClass(teen.status)}`}
                            >
                              {teen.status || "N/A"}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-slate-700 hover:bg-slate-50"
                                onClick={() => setViewTeen(teen)}
                              >
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:bg-blue-50"
                                onClick={() => setEditTeen(teen)}
                              >
                                Edit
                              </Button>
                              {teen.status === "ACTIVE" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-green-600 hover:bg-green-50"
                                    onClick={() => setPromoteTeen(teen)}
                                  >
                                    Promote
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-purple-600 hover:bg-purple-50"
                                    onClick={() => setTransferTeen(teen)}
                                  >
                                    Transfer
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() =>
                                  setTeenToDelete({
                                    id: teen.id,
                                    name: teen.full_name,
                                  })
                                }
                              >
                                Delete
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
                itemLabel="teenagers"
                allowShowAll
                filtered={hasActiveFilters}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <FullscreenModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Register Teenager"
      >
        <NewTeenagerModalForm
          onSuccess={() => {
            setIsCreateOpen(false);
          }}
          onCancel={() => setIsCreateOpen(false)}
        />
      </FullscreenModal>

      <TeenagerViewModal
        isOpen={!!viewTeen}
        onClose={() => setViewTeen(null)}
        teenager={viewTeen}
      />

      <FullscreenModal
        isOpen={!!editTeen}
        onClose={() => setEditTeen(null)}
        title="Update Teenager"
      >
        {editTeen && (
          <NewTeenagerModalForm
            mode="update"
            teenagerId={editTeen.id}
            initial={editTeen}
            onSuccess={() => {
              setEditTeen(null);
            }}
            onCancel={() => setEditTeen(null)}
          />
        )}
      </FullscreenModal>

      {transferTeen && (
        <TransferTeenagerModal
          teenager={transferTeen}
          isOpen={!!transferTeen}
          onClose={() => setTransferTeen(null)}
        />
      )}

      {promoteTeen && (
        <PromoteTeenagerModal
          teenager={promoteTeen}
          isOpen={!!promoteTeen}
          onClose={() => setPromoteTeen(null)}
        />
      )}

      <AlertDialog
        open={!!teenToDelete}
        onOpenChange={() => setTeenToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Teenager</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{teenToDelete?.name}</strong>? This action cannot be
              undone and will permanently remove the teenager from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTeenToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTeen}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Teenager
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeenagersPage;
