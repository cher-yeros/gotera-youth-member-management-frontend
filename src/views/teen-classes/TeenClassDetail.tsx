import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ui/theme-toggle";
import FullscreenModal from "@/components/ui/fullscreen-modal";
import NewTeenagerModalForm from "@/components/forms/NewTeenagerModalForm";
import AssignClassTeacherModal from "@/components/forms/AssignClassTeacherModal";
import TransferTeenagerModal from "@/components/forms/TransferTeenagerModal";
import PromoteTeenagerModal from "@/components/forms/PromoteTeenagerModal";
import {
  useGetMyTeenClasses,
  useGetTeenClass,
  useRemoveClassTeacher,
} from "@/hooks/useTeenGraphQL";
import { getTeenCompleteness } from "@/lib/teenCompleteness";
import { useAuth } from "@/redux/useAuth";
import { hasAnyRole, ROLE } from "@/lib/roles";

const TeenClassDetail = () => {
  const { classId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = hasAnyRole(user, [ROLE.ADMIN, ROLE.MAIN]);
  const isMyClasses = location.pathname === "/teen-classes/my-classes";

  const { data: myClassesData } = useGetMyTeenClasses();
  const myClasses = (myClassesData as any)?.myTeenClasses || [];
  const [selectedMyClassId, setSelectedMyClassId] = useState<number | null>(
    null,
  );

  const effectiveClassId = isMyClasses
    ? selectedMyClassId || myClasses[0]?.id || 0
    : classId
      ? parseInt(classId)
      : 0;

  const { data, loading, refetch } = useGetTeenClass(effectiveClassId);
  const teenClass = (data as any)?.teenClass;
  const { removeClassTeacher } = useRemoveClassTeacher();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTeen, setEditTeen] = useState<any | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [transferTeen, setTransferTeen] = useState<any | null>(null);
  const [promoteTeen, setPromoteTeen] = useState<any | null>(null);

  const teens = teenClass?.teenagers || [];
  const teachers = teenClass?.teachers || [];

  const incompleteCount = useMemo(
    () => teens.filter((t: any) => getTeenCompleteness(t).isIncomplete).length,
    [teens],
  );

  if (isMyClasses && myClasses.length > 1 && !selectedMyClassId) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">My Classes</h1>
        <div className="grid gap-3 md:grid-cols-2">
          {myClasses.map((c: any) => (
            <Card
              key={c.id}
              className="cursor-pointer hover:border-primary"
              onClick={() => setSelectedMyClassId(c.id)}
            >
              <CardHeader>
                <CardTitle>{c.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {c.teenCount || 0} teens · {c.teacherCount || 0} teachers
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <h1 className="text-2xl font-bold">
            {teenClass?.name || "Class"} Roster
          </h1>
          <p className="text-sm text-muted-foreground">
            {teens.length} teenagers
            {incompleteCount > 0 ? ` · ${incompleteCount} incomplete` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <Button onClick={() => setIsCreateOpen(true)}>Add Teenager</Button>
          {isAdmin && (
            <Button variant="outline" onClick={() => setAssignOpen(true)}>
              Assign Teacher
            </Button>
          )}
        </div>
      </div>

      {isMyClasses && myClasses.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {myClasses.map((c: any) => (
            <Button
              key={c.id}
              size="sm"
              variant={c.id === effectiveClassId ? "default" : "outline"}
              onClick={() => setSelectedMyClassId(c.id)}
            >
              {c.name}
            </Button>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Teachers</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {teachers.map((t: any) => (
            <Badge key={t.id} variant="secondary" className="gap-2 py-1.5">
              {t.member?.full_name}
              {isAdmin && (
                <button
                  className="text-destructive ml-1"
                  onClick={async () => {
                    await removeClassTeacher({
                      class_id: effectiveClassId,
                      member_id: t.member_id,
                    });
                    refetch();
                  }}
                >
                  ×
                </button>
              )}
            </Badge>
          ))}
          {teachers.length === 0 && (
            <span className="text-sm text-muted-foreground">No teachers</span>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teenagers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : teens.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              No teenagers in this class.
            </p>
          ) : (
            <>
              <div className="block md:hidden space-y-3">
                {teens.map((t: any) => {
                  const completeness = getTeenCompleteness(t);
                  return (
                    <Card key={t.id} className="shadow-sm border">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-semibold text-lg truncate">
                              {t.full_name}
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <Badge>{t.status}</Badge>
                              {completeness.isIncomplete ? (
                                <Badge variant="destructive">
                                  Missing {completeness.missing.length}
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Complete</Badge>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between gap-2">
                              <span className="text-muted-foreground">
                                Address:
                              </span>
                              <span className="text-right">
                                {t.location?.name || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between gap-2">
                              <span className="text-muted-foreground">
                                Guardian:
                              </span>
                              <span className="text-right">
                                {t.guardian_name || "N/A"}
                              </span>
                            </div>
                            {(t.guardian_relationship ||
                              t.guardian_contact) && (
                              <div className="flex justify-between gap-2">
                                <span className="text-muted-foreground">
                                  Guardian info:
                                </span>
                                <span className="text-right text-xs">
                                  {[t.guardian_relationship, t.guardian_contact]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-blue-600 hover:bg-blue-50 min-w-[80px]"
                              onClick={() => setEditTeen(t)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-purple-600 hover:bg-purple-50 min-w-[80px]"
                              onClick={() => setTransferTeen(t)}
                            >
                              Transfer
                            </Button>
                            {isAdmin && t.status === "ACTIVE" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-green-600 hover:bg-green-50 min-w-[80px]"
                                onClick={() => setPromoteTeen(t)}
                              >
                                Promote
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-2">Name</th>
                      <th>Address</th>
                      <th>Guardian</th>
                      <th>Status</th>
                      <th>Profile</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teens.map((t: any) => {
                      const completeness = getTeenCompleteness(t);
                      return (
                        <tr key={t.id} className="border-b">
                          <td className="py-3 font-medium">{t.full_name}</td>
                          <td>{t.location?.name || "—"}</td>
                          <td>
                            <div>{t.guardian_name || "—"}</div>
                            <div className="text-xs text-muted-foreground">
                              {[t.guardian_relationship, t.guardian_contact]
                                .filter(Boolean)
                                .join(" · ") || ""}
                            </div>
                          </td>
                          <td>
                            <Badge>{t.status}</Badge>
                          </td>
                          <td>
                            {completeness.isIncomplete ? (
                              <Badge variant="destructive">
                                Missing {completeness.missing.length}
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Complete</Badge>
                            )}
                          </td>
                          <td className="space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditTeen(t)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setTransferTeen(t)}
                            >
                              Transfer
                            </Button>
                            {isAdmin && t.status === "ACTIVE" && (
                              <Button
                                size="sm"
                                onClick={() => setPromoteTeen(t)}
                              >
                                Promote
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <FullscreenModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Register Teenager"
      >
        <NewTeenagerModalForm
          defaultClassId={effectiveClassId}
          onSuccess={() => {
            setIsCreateOpen(false);
            refetch();
          }}
          onCancel={() => setIsCreateOpen(false)}
        />
      </FullscreenModal>

      <FullscreenModal
        isOpen={!!editTeen}
        onClose={() => setEditTeen(null)}
        title="Update Teenager"
      >
        {editTeen && (
          <NewTeenagerModalForm
            mode="update"
            teenagerId={editTeen.id}
            defaultClassId={effectiveClassId}
            initial={editTeen}
            onSuccess={() => {
              setEditTeen(null);
              refetch();
            }}
            onCancel={() => setEditTeen(null)}
          />
        )}
      </FullscreenModal>

      {teenClass && (
        <AssignClassTeacherModal
          classId={effectiveClassId}
          className={teenClass.name}
          existingTeacherIds={teachers.map((t: any) => t.member_id)}
          isOpen={assignOpen}
          onClose={() => setAssignOpen(false)}
          onSuccess={() => refetch()}
        />
      )}

      {transferTeen && (
        <TransferTeenagerModal
          teenager={{
            ...transferTeen,
            teenClass: teenClass
              ? { id: teenClass.id, name: teenClass.name }
              : null,
          }}
          isOpen={!!transferTeen}
          onClose={() => setTransferTeen(null)}
          onSuccess={() => refetch()}
        />
      )}

      {promoteTeen && (
        <PromoteTeenagerModal
          teenager={promoteTeen}
          isOpen={!!promoteTeen}
          onClose={() => setPromoteTeen(null)}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
};

export default TeenClassDetail;
