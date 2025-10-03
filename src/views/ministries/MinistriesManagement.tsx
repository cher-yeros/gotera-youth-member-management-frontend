import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ui/theme-toggle";
import FullscreenModal from "@/components/ui/fullscreen-modal";
import NewMinistryModalForm from "@/components/forms/NewMinistryModalForm";
import PromoteMinistryLeaderModal from "@/components/forms/PromoteMinistryLeaderModal";
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
  useGetMinistries,
  useGetMinistryStats,
  useDeleteMinistry,
} from "@/hooks/useGraphQL";
import { Users, UserPlus, Settings, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const MinistriesManagement = () => {
  const [isNewMinistryModalOpen, setIsNewMinistryModalOpen] = useState(false);
  const [isUpdateMinistryModalOpen, setIsUpdateMinistryModalOpen] =
    useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [selectedMinistryId, setSelectedMinistryId] = useState<number | null>(
    null
  );
  const [ministryToDelete, setMinistryToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [ministryToPromote, setMinistryToPromote] = useState<{
    id: number;
    name: string;
    members: unknown[];
  } | null>(null);

  // Fetch ministries and stats
  const { data, loading, error, refetch } = useGetMinistries();
  const {
    data: statsData,
    loading: statsLoading,
    refetch: refetchStats,
  } = useGetMinistryStats();
  const { deleteMinistry } = useDeleteMinistry();

  const ministries = data?.ministries || [];
  const ministryStats = statsData?.ministryStats || [];

  const handleNewMinistrySuccess = () => {
    setIsNewMinistryModalOpen(false);
    refetch();
    refetchStats();
  };

  const handleNewMinistryCancel = () => {
    setIsNewMinistryModalOpen(false);
  };

  const handleUpdateMinistry = (ministryId: number) => {
    setSelectedMinistryId(ministryId);
    setIsUpdateMinistryModalOpen(true);
  };

  const handleUpdateMinistrySuccess = () => {
    setIsUpdateMinistryModalOpen(false);
    setSelectedMinistryId(null);
    refetch();
    refetchStats();
  };

  const handleUpdateMinistryCancel = () => {
    setIsUpdateMinistryModalOpen(false);
    setSelectedMinistryId(null);
  };

  const handleDeleteMinistry = (ministry: { id: number; name: string }) => {
    setMinistryToDelete({ id: ministry.id, name: ministry.name });
  };

  const confirmDeleteMinistry = async () => {
    if (!ministryToDelete) return;

    try {
      await deleteMinistry(ministryToDelete.id);
      refetch();
      refetchStats();
      setMinistryToDelete(null);
    } catch (error) {
      console.error("Error deleting ministry:", error);
    }
  };

  const cancelDeleteMinistry = () => {
    setMinistryToDelete(null);
  };

  const handlePromoteMinistryLeader = (ministry: {
    id: number;
    name: string;
  }) => {
    setMinistryToPromote({
      id: ministry.id,
      name: ministry.name,
      members: [], // Will be fetched separately in the modal
    });
    setIsPromoteModalOpen(true);
  };

  const handlePromoteSuccess = () => {
    setIsPromoteModalOpen(false);
    setMinistryToPromote(null);
    refetch();
    refetchStats();
  };

  const handlePromoteCancel = () => {
    setIsPromoteModalOpen(false);
    setMinistryToPromote(null);
  };

  // Since we're not fetching members in the main query anymore,
  // we'll show placeholder stats or fetch them separately when needed
  // For now, we'll show "N/A" or use a separate query for stats

  const getMinistryStats = (ministryId: number) => {
    const stats = ministryStats.find(
      (stat: {
        id: number;
        totalMembers: number;
        totalLeaders: number;
        activeMembers: number;
      }) => stat.id === ministryId
    );
    return stats || { totalMembers: 0, totalLeaders: 0, activeMembers: 0 };
  };

  if (loading || statsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-gradient">
              Ministries Management
            </h1>
            <p className="text-muted-foreground">
              Manage ministries and ministry leaders
            </p>
          </div>
          <ThemeToggle variant="icon" />
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading ministries...</p>
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
              Ministries Management
            </h1>
            <p className="text-muted-foreground">
              Manage ministries and ministry leaders
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
                Error Loading Ministries
              </h3>
              <p className="text-muted-foreground mb-4">
                {error.message ||
                  "Failed to load ministries. Please try again."}
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
            Ministries Management
          </h1>
          <p className="text-muted-foreground">
            Manage ministries and promote ministry leaders ({ministries.length}{" "}
            ministries)
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle variant="icon" />
          <Button
            className="bg-brand-gradient hover:opacity-90 transition-opacity"
            onClick={() => setIsNewMinistryModalOpen(true)}
          >
            <Users className="mr-2 h-4 w-4" />
            Create New Ministry
          </Button>
        </div>
      </div>

      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">Ministries List</CardTitle>
        </CardHeader>
        <CardContent>
          {ministries.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-brand-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No ministries found
              </h3>
              <p className="text-muted-foreground mb-4">
                Create your first ministry to get started with ministry
                management.
              </p>
              <Button
                onClick={() => setIsNewMinistryModalOpen(true)}
                className="bg-brand-gradient hover:opacity-90 transition-opacity"
              >
                Create First Ministry
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ministries.map((ministry: unknown) => {
                const ministryData = ministry as {
                  id: number;
                  name: string;
                  description?: string;
                  is_active: boolean;
                };
                const stats = getMinistryStats(ministryData.id);
                return (
                  <Card
                    key={ministryData.id}
                    className="hover-brand-glow transition-all duration-300"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {ministryData.name}
                        </CardTitle>
                        <Badge
                          className={`px-2 py-1 rounded-full text-xs ${
                            ministryData.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {ministryData.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {ministryData.description && (
                        <p className="text-sm text-muted-foreground">
                          {ministryData.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Ministry Stats */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-blue-50 rounded-lg p-2">
                            <div className="text-lg font-bold text-blue-600">
                              {stats.totalMembers}
                            </div>
                            <div className="text-xs text-blue-600">Members</div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-2">
                            <div className="text-lg font-bold text-green-600">
                              {stats.totalLeaders}
                            </div>
                            <div className="text-xs text-green-600">
                              Leaders
                            </div>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-2">
                            <div className="text-lg font-bold text-purple-600">
                              {stats.activeMembers}
                            </div>
                            <div className="text-xs text-purple-600">
                              Active
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-blue-600 hover:bg-blue-50"
                            onClick={() =>
                              handleUpdateMinistry(ministryData.id)
                            }
                          >
                            <Settings className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-green-600 hover:bg-green-50"
                            onClick={() =>
                              handlePromoteMinistryLeader(ministryData)
                            }
                            disabled={stats.totalMembers === 0}
                          >
                            <UserPlus className="mr-1 h-3 w-3" />
                            Promote
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteMinistry(ministryData)}
                            disabled={stats.totalMembers > 0}
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </div>

                        {/* View Members Link */}
                        <Link to={`/ministries/${ministryData.id}/members`}>
                          <Button
                            variant="outline"
                            className="w-full flex-1 text-purple-600 hover:bg-purple-50 min-w-[80px]"
                          >
                            <Users className="mr-2 h-4 w-4" />
                            View Members
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Ministry Modal */}
      <FullscreenModal
        isOpen={isNewMinistryModalOpen}
        onClose={handleNewMinistryCancel}
        title="Create New Ministry"
      >
        <NewMinistryModalForm
          onSuccess={handleNewMinistrySuccess}
          onCancel={handleNewMinistryCancel}
          mode="create"
        />
      </FullscreenModal>

      {/* Update Ministry Modal */}
      <FullscreenModal
        isOpen={isUpdateMinistryModalOpen}
        onClose={handleUpdateMinistryCancel}
        title="Update Ministry"
      >
        <NewMinistryModalForm
          onSuccess={handleUpdateMinistrySuccess}
          onCancel={handleUpdateMinistryCancel}
          ministryId={selectedMinistryId || undefined}
          mode="update"
        />
      </FullscreenModal>

      {/* Promote Ministry Leader Modal */}
      {ministryToPromote && (
        <PromoteMinistryLeaderModal
          ministry={ministryToPromote}
          isOpen={isPromoteModalOpen}
          onClose={handlePromoteCancel}
          onSuccess={handlePromoteSuccess}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!ministryToDelete}
        onOpenChange={() => setMinistryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Ministry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{ministryToDelete?.name}</strong>? This action cannot be
              undone and will permanently remove the ministry from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteMinistry}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMinistry}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Ministry
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MinistriesManagement;
