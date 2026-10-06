import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FullscreenModal from "@/components/ui/fullscreen-modal";
import NewTeenClassModalForm from "@/components/forms/NewTeenClassModalForm";
import TeenClassSearch from "@/components/shared/TeenClassSearch";
import PageHeader from "@/components/shared/PageHeader";
import ListLoadingState from "@/components/shared/ListLoadingState";
import ListEmptyState from "@/components/shared/ListEmptyState";
import ListErrorState from "@/components/shared/ListErrorState";
import ListPagination from "@/components/shared/ListPagination";
import { useDeleteTeenClass, useGetTeenClasses } from "@/hooks/useTeenGraphQL";
import { Badge } from "@/components/ui/badge";
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
import { BookOpen, Users } from "lucide-react";

type TeenClassItem = {
  id: number;
  name: string;
  description?: string | null;
  teenCount?: number | null;
  teacherCount?: number | null;
};

const TeenClassesPage = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useGetTeenClasses();
  const { deleteTeenClass } = useDeleteTeenClass();
  const classes: TeenClassItem[] =
    (data as { teenClasses?: TeenClassItem[] })?.teenClasses || [];

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editClass, setEditClass] = useState<TeenClassItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeenClassItem | null>(null);
  const [searchFilters, setSearchFilters] = useState<{ search: string }>({
    search: "",
  });

  const filtered = useMemo(() => {
    const search = (searchFilters.search || "").toLowerCase();
    return classes
      .filter((c) => c.name.toLowerCase().includes(search))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [classes, searchFilters.search]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleSearch = useCallback((filters: { search: string }) => {
    setSearchFilters(filters);
    setCurrentPage(1);
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

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Teen Classes" />
        <ListErrorState
          layout="page"
          title="Error Loading Classes"
          message={error.message || "Failed to load classes. Please try again."}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teen Classes"
        subtitle={`${classes.length} classes`}
        actions={
          <Button
            className="bg-brand-gradient hover:opacity-90 transition-opacity"
            onClick={() => setIsCreateOpen(true)}
          >
            New Class
          </Button>
        }
      />

      <TeenClassSearch
        onSearch={handleSearch}
        onClear={handleClearSearch}
        isLoading={loading}
      />

      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">Classes List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ListLoadingState message="Loading classes..." />
          ) : filtered.length === 0 ? (
            <ListEmptyState
              icon={<BookOpen className="h-8 w-8" />}
              title={
                searchFilters.search
                  ? "No classes found matching your search"
                  : "No classes found"
              }
              description={
                searchFilters.search
                  ? "Try adjusting your search criteria or clear the filters."
                  : "Create your first teen class to get started."
              }
              secondaryAction={
                searchFilters.search
                  ? { label: "Clear Filters", onClick: handleClearSearch }
                  : undefined
              }
              primaryAction={
                !searchFilters.search
                  ? { label: "Create First Class", onClick: () => setIsCreateOpen(true) }
                  : undefined
              }
            />
          ) : (
            <div className="space-y-4">
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {paginated.map((teenClass) => (
                  <Card key={teenClass.id} className="shadow-sm border">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-semibold text-lg">
                            {teenClass.name}
                          </div>
                          <Badge className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-900 shrink-0">
                            {teenClass.teenCount || 0} teens
                          </Badge>
                        </div>
                        {teenClass.description && (
                          <p className="text-sm text-muted-foreground">
                            {teenClass.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">
                            <Users className="h-3 w-3 mr-1" />
                            {teenClass.teenCount || 0} teenagers
                          </Badge>
                          <Badge variant="outline">
                            {teenClass.teacherCount || 0} teachers
                          </Badge>
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-green-600 hover:bg-green-50"
                            onClick={() =>
                              navigate(`/teen-classes/${teenClass.id}`)
                            }
                          >
                            Open
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-blue-600 hover:bg-blue-50"
                            onClick={() => setEditClass(teenClass)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 hover:bg-red-50"
                            onClick={() => setDeleteTarget(teenClass)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">
                        Class Name
                      </th>
                      <th className="text-left p-3 font-semibold">Teenagers</th>
                      <th className="text-left p-3 font-semibold">Teachers</th>
                      <th className="text-left p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((teenClass) => (
                      <tr
                        key={teenClass.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-3">
                          <div className="font-medium">{teenClass.name}</div>
                          {teenClass.description && (
                            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                              {teenClass.description}
                            </p>
                          )}
                        </td>
                        <td className="p-3">
                          <Badge className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-900">
                            {teenClass.teenCount || 0}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">
                            {teenClass.teacherCount || 0}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:bg-green-50"
                              onClick={() =>
                                navigate(`/teen-classes/${teenClass.id}`)
                              }
                            >
                              Open
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:bg-blue-50"
                              onClick={() => setEditClass(teenClass)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => setDeleteTarget(teenClass)}
                            >
                              Delete
                            </Button>
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
                totalItems={filtered.length}
                onPageChange={handlePageChange}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                itemLabel="classes"
                filtered={!!searchFilters.search}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <FullscreenModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Teen Class"
      >
        <NewTeenClassModalForm
          onSuccess={() => {
            setIsCreateOpen(false);
          }}
          onCancel={() => setIsCreateOpen(false)}
        />
      </FullscreenModal>

      <FullscreenModal
        isOpen={!!editClass}
        onClose={() => setEditClass(null)}
        title="Update Teen Class"
      >
        {editClass && (
          <NewTeenClassModalForm
            mode="update"
            classId={editClass.id}
            initial={editClass}
            onSuccess={() => {
              setEditClass(null);
            }}
            onCancel={() => setEditClass(null)}
          />
        )}
      </FullscreenModal>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Class</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.name}</strong>? Classes with teenagers
              cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deleteTarget) {
                  await deleteTeenClass(deleteTarget.id);
                  setDeleteTarget(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Class
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeenClassesPage;
