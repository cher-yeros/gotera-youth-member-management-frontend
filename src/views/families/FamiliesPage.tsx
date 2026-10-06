import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import FullscreenModal from "@/components/ui/fullscreen-modal";
import NewFamilyModalForm from "@/components/forms/NewFamilyModalForm";
import FamilySearch from "@/components/shared/FamilySearch";
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
import {
  useDeleteFamily,
  useGetFamilies,
  useGetFamilyPlacementNeeds,
  useGetFamilySummaries,
} from "@/hooks/useGraphQL";
import { useState, useCallback, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { UPDATE_FOLLOW_UP_CASE } from "@/graphql/operations";
import { toast } from "react-toastify";
import {
  formatGenderCounts,
  genderSkewLabel,
  type FamilyPlacementNeed,
} from "@/lib/familyPlacement";

type FamilyCompletenessSummary = {
  id: number;
  memberCount: number;
  completeMemberCount: number;
  incompleteMemberCount: number;
};

const getActiveCompletionPercent = (
  summary?: FamilyCompletenessSummary,
): number | null => {
  if (!summary || summary.memberCount <= 0) return null;
  return Math.round((summary.completeMemberCount / summary.memberCount) * 100);
};

const completionBadgeClass = (percent: number) => {
  if (percent >= 80) return "bg-green-100 text-green-900";
  if (percent >= 50) return "bg-amber-100 text-amber-900";
  return "bg-red-100 text-red-900";
};

const FamiliesPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isNewFamilyModalOpen, setIsNewFamilyModalOpen] = useState(false);
  const [isUpdateFamilyModalOpen, setIsUpdateFamilyModalOpen] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState<number | null>(null);
  const [needsMembersOnly, setNeedsMembersOnly] = useState(false);
  const [suggestingCaseId, setSuggestingCaseId] = useState<number | null>(null);
  const [searchFilters, setSearchFilters] = useState<{ search: string }>({
    search: "",
  });
  const [familyToDelete, setFamilyToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { data, loading } = useGetFamilies();
  const {
    data: placementData,
    loading: placementLoading,
    refetch: refetchPlacement,
  } = useGetFamilyPlacementNeeds();
  // limit 0 = all families (same completeness logic as dashboard)
  const { data: summariesData, loading: summariesLoading } =
    useGetFamilySummaries(0);
  const { deleteFamily } = useDeleteFamily();

  const [updateFollowUpCase] = useMutation(UPDATE_FOLLOW_UP_CASE, {
    onCompleted: () => {
      toast.success("Suggested family saved on follow-up case");
      setSuggestingCaseId(null);
      refetchPlacement();
    },
    onError: (error) => {
      toast.error(error.message.replace("CombinedGraphQLErrors: ", ""));
      setSuggestingCaseId(null);
    },
  });

  const families = data?.families || [];
  const totalFamilies = families.length;

  const placementById = useMemo(() => {
    const map = new Map<number, FamilyPlacementNeed>();
    for (const need of placementData?.familyPlacementNeeds || []) {
      map.set(need.id, need);
    }
    return map;
  }, [placementData]);

  const completenessById = useMemo(() => {
    const map = new Map<number, FamilyCompletenessSummary>();
    for (const summary of summariesData?.familySummaries || []) {
      map.set(summary.id, summary);
    }
    return map;
  }, [summariesData]);

  const needsMembersCount = useMemo(
    () =>
      (placementData?.familyPlacementNeeds || []).filter((n) => n.needsMembers)
        .length,
    [placementData],
  );

  const filteredFamilies = useMemo(() => {
    const search = (searchFilters.search || "").toLowerCase();
    let list = families.filter((family) =>
      family.name.toLowerCase().includes(search),
    );

    if (needsMembersOnly) {
      list = list.filter(
        (family) => placementById.get(family.id)?.needsMembers,
      );
    }

    // Pin families that need members first, then by name
    return [...list].sort((a, b) => {
      const aNeeds = placementById.get(a.id)?.needsMembers ? 1 : 0;
      const bNeeds = placementById.get(b.id)?.needsMembers ? 1 : 0;
      if (aNeeds !== bNeeds) return bNeeds - aNeeds;
      return a.name.localeCompare(b.name);
    });
  }, [families, searchFilters.search, needsMembersOnly, placementById]);

  const totalPages = Math.ceil(filteredFamilies.length / pageSize);
  const paginatedFamilies = filteredFamilies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleSearch = useCallback((filters: { search: string }) => {
    setSearchFilters(filters);
    setCurrentPage(1);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchFilters({ search: "" });
    setNeedsMembersOnly(false);
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const confirmDeleteFamily = async () => {
    if (!familyToDelete) return;

    try {
      await deleteFamily(familyToDelete.id);
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
  };

  const handleUpdateFamilyCancel = () => {
    setIsUpdateFamilyModalOpen(false);
    setSelectedFamilyId(null);
  };

  const handleViewMembers = (familyId: number) => {
    navigate(`/families/${familyId}/members`);
  };

  const handleSuggestFamily = async (
    followUpCaseId: number,
    familyId: number,
  ) => {
    setSuggestingCaseId(followUpCaseId);
    await updateFollowUpCase({
      variables: {
        input: {
          id: followUpCaseId,
          family_id: familyId,
        },
      },
    });
  };

  const renderPlacementBadges = (placement?: FamilyPlacementNeed) => {
    if (!placement) return null;
    return (
      <div className="flex flex-wrap gap-1.5 items-center">
        <Badge className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-900">
          {placement.activeMemberCount} Active
        </Badge>
        <Badge variant="outline" className="px-2 py-1 rounded-full text-xs">
          {formatGenderCounts(
            placement.maleCount,
            placement.femaleCount,
            placement.unknownGenderCount,
          )}
        </Badge>
        {placement.needsMembers && (
          <Badge
            className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-900"
            title={placement.needReasons.join("; ")}
          >
            Needs members
          </Badge>
        )}
      </div>
    );
  };

  const renderSuggestions = (
    familyId: number,
    placement?: FamilyPlacementNeed,
  ) => {
    if (!placement?.needsMembers) {
      return <span className="text-xs text-muted-foreground">—</span>;
    }
    if (!placement.suggestedNewcomers.length) {
      return (
        <span className="text-xs text-muted-foreground">No open newcomers</span>
      );
    }

    return (
      <div className="space-y-2 min-w-[180px]">
        {placement.suggestedNewcomers.map((suggestion) => (
          <div
            key={suggestion.followUpCaseId}
            className="rounded border border-border/60 p-2 space-y-1"
          >
            <button
              type="button"
              className="text-sm font-medium text-left text-primary hover:underline"
              onClick={() =>
                navigate(`/follow-up/${suggestion.followUpCaseId}`)
              }
            >
              {suggestion.fullName}
            </button>
            <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              disabled={suggestingCaseId === suggestion.followUpCaseId}
              onClick={() =>
                handleSuggestFamily(suggestion.followUpCaseId, familyId)
              }
            >
              {suggestingCaseId === suggestion.followUpCaseId
                ? "Saving…"
                : "Suggest family"}
            </Button>
          </div>
        ))}
      </div>
    );
  };

  const renderCompletion = (familyId: number) => {
    const summary = completenessById.get(familyId);
    const percent = getActiveCompletionPercent(summary);

    if (percent === null) {
      return (
        <span className="text-xs text-muted-foreground">No active members</span>
      );
    }

    return (
      <div className="space-y-1">
        <Badge
          className={`px-2 py-1 rounded-full text-xs ${completionBadgeClass(percent)}`}
          title={`${summary!.completeMemberCount} of ${summary!.memberCount} active members complete`}
        >
          {percent}%
        </Badge>
        <p className="text-xs text-muted-foreground">
          {summary!.completeMemberCount}/{summary!.memberCount} active complete
        </p>
      </div>
    );
  };

  const isLoading = loading || placementLoading || summariesLoading;
  const hasActiveFilters = !!(searchFilters.search || needsMembersOnly);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Families"
        subtitle={`${totalFamilies} families${
          needsMembersCount > 0 ? ` · ${needsMembersCount} need members` : ""
        }`}
        actions={
          <Button
            className="bg-brand-gradient hover:opacity-90 transition-opacity"
            onClick={() => setIsNewFamilyModalOpen(true)}
          >
            Add New Family
          </Button>
        }
      />

      <FamilySearch
        onSearch={handleSearch}
        onClear={handleClearSearch}
        isLoading={isLoading}
        extraFiltersActive={needsMembersOnly}
        extraFilters={
          <div className="flex items-center gap-3">
            <Switch
              id="needs-members-only"
              checked={needsMembersOnly}
              onCheckedChange={(checked) => {
                setNeedsMembersOnly(checked);
                setCurrentPage(1);
              }}
            />
            <Label htmlFor="needs-members-only" className="cursor-pointer">
              Needs members only
            </Label>
          </div>
        }
      />

      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">Families List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ListLoadingState message="Loading families..." />
          ) : filteredFamilies.length === 0 ? (
            <ListEmptyState
              icon={hasActiveFilters ? "🔍" : "👥"}
              title={
                hasActiveFilters
                  ? "No families found matching your filters"
                  : "No families found"
              }
              description={
                hasActiveFilters
                  ? "Try adjusting your search or clear the needs-members filter."
                  : "Add your first family to get started with the Gotera Youth system."
              }
              secondaryAction={
                hasActiveFilters
                  ? { label: "Clear Filters", onClick: handleClearSearch }
                  : undefined
              }
              primaryAction={
                !hasActiveFilters
                  ? {
                      label: "Add First Family",
                      onClick: () => setIsNewFamilyModalOpen(true),
                    }
                  : undefined
              }
            />
          ) : (
            <div className="space-y-4">
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {paginatedFamilies.map((family) => {
                  const placement = placementById.get(family.id);
                  return (
                    <Card key={family.id} className="shadow-sm border">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-semibold text-lg">
                              {family.name}
                            </div>
                            <Badge className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-900 shrink-0">
                              {family.members?.length || 0} total
                            </Badge>
                          </div>

                          {renderPlacementBadges(placement)}

                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                              Active members completion
                            </p>
                            {renderCompletion(family.id)}
                          </div>

                          {placement?.needsMembers &&
                            placement.needReasons.length > 0 && (
                              <p className="text-xs text-amber-800 dark:text-amber-200">
                                {placement.needReasons.join(" · ")}
                              </p>
                            )}

                          {placement?.genderSkew &&
                            placement.genderSkew !== "BALANCED" && (
                              <p className="text-xs text-muted-foreground">
                                {genderSkewLabel(placement.genderSkew)}
                              </p>
                            )}

                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                              Suggested newcomers
                            </p>
                            {renderSuggestions(family.id, placement)}
                          </div>

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
                      <th className="text-left p-3 font-semibold">
                        Family Name
                      </th>
                      <th className="text-left p-3 font-semibold">
                        Active / Gender
                      </th>
                      <th className="text-left p-3 font-semibold">
                        Active completion
                      </th>
                      <th className="text-left p-3 font-semibold">
                        Suggested newcomers
                      </th>
                      <th className="text-left p-3 font-semibold">
                        Last Updated
                      </th>
                      <th className="text-left p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFamilies.map((family) => {
                      const placement = placementById.get(family.id);
                      return (
                        <tr
                          key={family.id}
                          className="border-b hover:bg-muted/50 align-top"
                        >
                          <td className="p-3">
                            <div className="font-medium">{family.name}</div>
                            {placement?.needsMembers &&
                              placement.needReasons.length > 0 && (
                                <p className="text-xs text-amber-800 dark:text-amber-200 mt-1 max-w-xs">
                                  {placement.needReasons.join(" · ")}
                                </p>
                              )}
                          </td>
                          <td className="p-3">
                            {renderPlacementBadges(placement) || (
                              <Badge className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-900">
                                {family.members?.length || 0} members
                              </Badge>
                            )}
                          </td>
                          <td className="p-3">{renderCompletion(family.id)}</td>
                          <td className="p-3">
                            {renderSuggestions(family.id, placement)}
                          </td>
                          <td className="p-3">
                            <div className="text-sm text-muted-foreground">
                              {new Date(family.createdAt).toLocaleDateString()}
                            </div>
                          </td>
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
                totalItems={filteredFamilies.length}
                onPageChange={handlePageChange}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                itemLabel="families"
                filtered={hasActiveFilters}
              />
            </div>
          )}
        </CardContent>
      </Card>

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
