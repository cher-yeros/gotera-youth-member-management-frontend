import { useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FullscreenModal from "@/components/ui/fullscreen-modal";
import NewTeenagerModalForm from "@/components/forms/NewTeenagerModalForm";
import AssignClassTeacherModal from "@/components/forms/AssignClassTeacherModal";
import TransferTeenagerModal from "@/components/forms/TransferTeenagerModal";
import PromoteTeenagerModal from "@/components/forms/PromoteTeenagerModal";
import { PersonAvatar } from "@/components/shared/PersonAvatar";
import PageHeader from "@/components/shared/PageHeader";
import ListLoadingState from "@/components/shared/ListLoadingState";
import ListEmptyState from "@/components/shared/ListEmptyState";
import ListErrorState from "@/components/shared/ListErrorState";
import ListPagination from "@/components/shared/ListPagination";
import ProfileCompletenessBadge, { CompletenessPageSummary } from "@/components/shared/ProfileCompletenessBadge";
import {
  useGetMyTeenClasses,
  useGetTeenClass,
  useRemoveClassTeacher,
} from "@/hooks/useTeenGraphQL";
import { getTeenCompleteness } from "@/lib/teenCompleteness";
import { useAuth } from "@/redux/useAuth";
import { hasAnyRole, ROLE } from "@/lib/roles";
import { BookOpen } from "lucide-react";

type TeenItem = {
  id: number;
  full_name: string;
  contact_no?: string | null;
  gender?: string | null;
  photo_url?: string | null;
  birth_date?: string | null;
  location_id?: number | null;
  guardian_name?: string | null;
  guardian_contact?: string | null;
  guardian_relationship?: string | null;
  class_id: number;
  status?: string | null;
  location?: { id: number; name: string } | null;
};

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

const TeenClassDetail = () => {
  const { classId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = hasAnyRole(user, [ROLE.ADMIN, ROLE.MAIN]);
  const isMyClasses = location.pathname === "/teen-classes/my-classes";

  const { data: myClassesData } = useGetMyTeenClasses();
  const myClasses =
    (myClassesData as { myTeenClasses?: Array<{ id: number; name: string; teenCount?: number; teacherCount?: number }> })
      ?.myTeenClasses || [];
  const [selectedMyClassId, setSelectedMyClassId] = useState<number | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const effectiveClassId = isMyClasses
    ? selectedMyClassId || myClasses[0]?.id || 0
    : classId
      ? parseInt(classId)
      : 0;

  const { data, loading, error, refetch } = useGetTeenClass(effectiveClassId);
  const teenClass = (data as { teenClass?: {
    id: number;
    name: string;
    teenagers?: TeenItem[];
    teachers?: Array<{
      id: number;
      member_id: number;
      member?: { full_name?: string | null } | null;
    }>;
  } })?.teenClass;
  const { removeClassTeacher } = useRemoveClassTeacher();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTeen, setEditTeen] = useState<TeenItem | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [transferTeen, setTransferTeen] = useState<TeenItem | null>(null);
  const [promoteTeen, setPromoteTeen] = useState<TeenItem | null>(null);

  const teens = teenClass?.teenagers || [];
  const teachers = teenClass?.teachers || [];

  const incompleteCount = useMemo(
    () => teens.filter((t) => getTeenCompleteness(t).isIncomplete).length,
    [teens],
  );

  const totalPages = Math.ceil(teens.length / pageSize) || 1;
  const paginatedTeens = teens.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const incompleteOnPage = paginatedTeens.filter(
    (teen) => getTeenCompleteness(teen).isIncomplete,
  ).length;

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  if (isMyClasses && myClasses.length > 1 && !selectedMyClassId) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Classes"
          subtitle={`${myClasses.length} classes assigned`}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {myClasses.map((c) => (
            <Card
              key={c.id}
              className="shadow-brand cursor-pointer hover-brand-glow transition-all duration-300"
              onClick={() => {
                setSelectedMyClassId(c.id);
                setCurrentPage(1);
              }}
            >
              <CardHeader>
                <CardTitle className="text-brand-gradient">{c.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-100 text-blue-900">
                    {c.teenCount || 0} teens
                  </Badge>
                  <Badge variant="outline">
                    {c.teacherCount || 0} teachers
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title={isMyClasses ? "My Classes" : "Teen Class"} />
        <ListErrorState
          layout="page"
          title="Error Loading Class"
          message={error.message}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={teenClass?.name || "Class"}
        subtitle={`${teens.length} teenagers${incompleteCount > 0 ? ` · ${incompleteCount} incomplete` : ""}`}
        back={
          !isMyClasses
            ? { label: "Back to classes", onClick: () => navigate("/teen-classes") }
            : undefined
        }
        actions={
          <div className="flex items-center space-x-2">
            <Button
              className="bg-brand-gradient hover:opacity-90 transition-opacity"
              onClick={() => setIsCreateOpen(true)}
            >
              Add Teenager
            </Button>
            {isAdmin && (
              <Button variant="outline" onClick={() => setAssignOpen(true)}>
                Assign Teacher
              </Button>
            )}
          </div>
        }
      />

      {isMyClasses && myClasses.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {myClasses.map((c) => (
            <Button
              key={c.id}
              size="sm"
              variant={c.id === effectiveClassId ? "default" : "outline"}
              className={
                c.id === effectiveClassId ? "bg-brand-gradient text-white" : ""
              }
              onClick={() => {
                setSelectedMyClassId(c.id);
                setCurrentPage(1);
              }}
            >
              {c.name}
            </Button>
          ))}
        </div>
      )}

      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">Teachers</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {teachers.map((t) => (
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

      <Card className="shadow-brand">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-brand-gradient">
              Teenagers List
            </CardTitle>
            {!loading && teens.length > 0 && (
              <CompletenessPageSummary
                incompleteCount={incompleteOnPage}
                totalOnPage={paginatedTeens.length}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ListLoadingState message="Loading teenagers..." />
          ) : teens.length === 0 ? (
            <ListEmptyState
              icon={<BookOpen className="h-8 w-8" />}
              title="No teenagers in this class"
              description="Register the first teenager for this class."
              primaryAction={{
                label: "Add Teenager",
                onClick: () => setIsCreateOpen(true),
              }}
            />
          ) : (
            <div className="space-y-4">
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {paginatedTeens.map((teen) => {
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
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-blue-600 hover:bg-blue-50 min-w-[80px]"
                              onClick={() => setEditTeen(teen)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-purple-600 hover:bg-purple-50 min-w-[80px]"
                              onClick={() => setTransferTeen(teen)}
                            >
                              Transfer
                            </Button>
                            {isAdmin && teen.status === "ACTIVE" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-green-600 hover:bg-green-50 min-w-[80px]"
                                onClick={() => setPromoteTeen(teen)}
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

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Name</th>
                      <th className="text-left p-3 font-semibold">Info</th>
                      <th className="text-left p-3 font-semibold">Contact</th>
                      <th className="text-left p-3 font-semibold">Location</th>
                      <th className="text-left p-3 font-semibold">Guardian</th>
                      <th className="text-left p-3 font-semibold">Status</th>
                      <th className="text-left p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTeens.map((teen) => {
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
                                className="text-blue-600 hover:bg-blue-50"
                                onClick={() => setEditTeen(teen)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-purple-600 hover:bg-purple-50"
                                onClick={() => setTransferTeen(teen)}
                              >
                                Transfer
                              </Button>
                              {isAdmin && teen.status === "ACTIVE" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-600 hover:bg-green-50"
                                  onClick={() => setPromoteTeen(teen)}
                                >
                                  Promote
                                </Button>
                              )}
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
                totalItems={teens.length}
                onPageChange={handlePageChange}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                itemLabel="teenagers"
                showPageNumbers={false}
                hideWhenSinglePage
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
          defaultClassId={effectiveClassId}
          onSuccess={() => {
            setIsCreateOpen(false);
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
            }}
            onCancel={() => setEditTeen(null)}
          />
        )}
      </FullscreenModal>

      {teenClass && (
        <AssignClassTeacherModal
          classId={effectiveClassId}
          className={teenClass.name}
          existingTeacherIds={teachers.map((t) => t.member_id)}
          isOpen={assignOpen}
          onClose={() => setAssignOpen(false)}
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
        />
      )}

      {promoteTeen && (
        <PromoteTeenagerModal
          teenager={promoteTeen}
          isOpen={!!promoteTeen}
          onClose={() => setPromoteTeen(null)}
        />
      )}
    </div>
  );
};

export default TeenClassDetail;
