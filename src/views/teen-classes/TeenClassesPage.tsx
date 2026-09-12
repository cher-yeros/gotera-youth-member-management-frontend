import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeToggle from "@/components/ui/theme-toggle";
import FullscreenModal from "@/components/ui/fullscreen-modal";
import NewTeenClassModalForm from "@/components/forms/NewTeenClassModalForm";
import {
  useDeleteTeenClass,
  useGetTeenClasses,
} from "@/hooks/useTeenGraphQL";
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

const TeenClassesPage = () => {
  const navigate = useNavigate();
  const { data, loading, refetch } = useGetTeenClasses();
  const { deleteTeenClass } = useDeleteTeenClass();
  const classes = (data as any)?.teenClasses || [];
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editClass, setEditClass] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [search, setSearch] = useState("");

  const filtered = classes.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Teen Classes</h1>
          <p className="text-muted-foreground text-sm">
            Manage teenager classes and teachers
          </p>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <Button onClick={() => setIsCreateOpen(true)}>New Class</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Classes ({filtered.length})</CardTitle>
          <input
            className="border rounded px-3 py-1.5 text-sm"
            placeholder="Search classes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Name</th>
                    <th>Teens</th>
                    <th>Teachers</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c: any) => (
                    <tr key={c.id} className="border-b">
                      <td className="py-3 font-medium">{c.name}</td>
                      <td>
                        <Badge variant="secondary">{c.teenCount || 0}</Badge>
                      </td>
                      <td>
                        <Badge variant="outline">{c.teacherCount || 0}</Badge>
                      </td>
                      <td className="space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/teen-classes/${c.id}`)}
                        >
                          Open
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditClass(c)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteTarget(c)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <p className="text-muted-foreground py-6 text-center">
                  No classes yet.
                </p>
              )}
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
            refetch();
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
              refetch();
            }}
            onCancel={() => setEditClass(null)}
          />
        )}
      </FullscreenModal>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete class?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deleteTarget?.name}. Classes with
              teenagers cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deleteTarget) {
                  await deleteTeenClass(deleteTarget.id);
                  setDeleteTarget(null);
                  refetch();
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeenClassesPage;
