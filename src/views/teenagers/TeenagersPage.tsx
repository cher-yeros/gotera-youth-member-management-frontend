import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FullscreenModal from "@/components/ui/fullscreen-modal";
import NewTeenagerModalForm from "@/components/forms/NewTeenagerModalForm";
import TeenagerViewModal from "@/components/forms/TeenagerViewModal";
import TransferTeenagerModal from "@/components/forms/TransferTeenagerModal";
import PromoteTeenagerModal from "@/components/forms/PromoteTeenagerModal";
import { PersonAvatar } from "@/components/shared/PersonAvatar";
import { useDeleteTeenager, useGetTeenagers } from "@/hooks/useTeenGraphQL";
import { getTeenCompleteness } from "@/lib/teenCompleteness";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

const TeenagersPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewTeen, setViewTeen] = useState<any | null>(null);
  const [editTeen, setEditTeen] = useState<any | null>(null);
  const [transferTeen, setTransferTeen] = useState<any | null>(null);
  const [promoteTeen, setPromoteTeen] = useState<any | null>(null);

  const { data, loading } = useGetTeenagers(
    {
      search: search || undefined,
      status: status || undefined,
    },
    { page, limit: 10 },
  );
  const { deleteTeenager } = useDeleteTeenager();

  const payload = (data as any)?.teenagers;
  const teens = payload?.teenagers || [];
  const totalPages = payload?.totalPages || 1;

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-gradient">
            Teenagers
          </h1>
          <p className="text-sm text-muted-foreground">
            {payload?.total != null
              ? `${payload.total} teenagers`
              : "Teen registry"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-brand-gradient hover:opacity-90 transition-opacity"
            onClick={() => setIsCreateOpen(true)}
          >
            Register Teenager
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <CardTitle>All Teenagers ({payload?.total || 0})</CardTitle>
          <div className="flex flex-col gap-2 items-stretch md:items-end">
            <div className="flex gap-2 flex-wrap">
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-48"
              />
              <Button
                type="button"
                variant={showFilters ? "default" : "outline"}
                size="icon"
                onClick={() => setShowFilters((prev) => !prev)}
                aria-label={showFilters ? "Hide filters" : "Show filters"}
                aria-expanded={showFilters}
                className="relative shrink-0"
              >
                <Filter className="h-4 w-4" />
                {status && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1.5 -top-1.5 h-5 min-w-5 rounded-full px-1"
                  >
                    1
                  </Badge>
                )}
              </Button>
            </div>
            {showFilters && (
              <Select
                value={status || "ALL"}
                onValueChange={(v) => {
                  setStatus(v === "ALL" ? undefined : v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All statuses</SelectItem>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="PROMOTED">PROMOTED</SelectItem>
                  <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : teens.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              No teenagers found.
            </p>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {teens.map((t: any) => {
                  const completeness = getTeenCompleteness(t);
                  return (
                    <Card key={t.id} className="shadow-sm border">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center space-x-2 min-w-0">
                              <PersonAvatar
                                name={t.full_name}
                                photoUrl={t.photo_url}
                              />
                              <div
                                className={`h-2 w-2 shrink-0 rounded-full ${
                                  t.status === "ACTIVE"
                                    ? "bg-green-600"
                                    : t.status === "PROMOTED"
                                      ? "bg-blue-500"
                                      : "bg-red-500"
                                }`}
                              />
                              <div className="font-semibold text-lg truncate">
                                {t.full_name}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <Badge>{t.status}</Badge>
                              {completeness.isIncomplete ? (
                                <Badge variant="destructive">Incomplete</Badge>
                              ) : (
                                <Badge variant="secondary">Complete</Badge>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between gap-2">
                              <span className="text-muted-foreground">
                                Class:
                              </span>
                              <span className="text-right">
                                {t.teenClass?.name || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between gap-2">
                              <span className="text-muted-foreground">
                                Contact:
                              </span>
                              <span className="text-right">
                                {t.contact_no ? (
                                  <a
                                    href={`tel:${t.contact_no}`}
                                    className="text-blue-600 hover:underline"
                                  >
                                    {t.contact_no}
                                  </a>
                                ) : (
                                  "N/A"
                                )}
                              </span>
                            </div>
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
                                  Guardian phone:
                                </span>
                                <span className="text-right text-xs">
                                  {t.guardian_relationship
                                    ? `${t.guardian_relationship} · `
                                    : ""}
                                  {t.guardian_contact ? (
                                    <a
                                      href={`tel:${t.guardian_contact}`}
                                      className="text-blue-600 hover:underline"
                                    >
                                      {t.guardian_contact}
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
                              onClick={() => setViewTeen(t)}
                            >
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-blue-600 hover:bg-blue-50 min-w-[80px]"
                              onClick={() => setEditTeen(t)}
                            >
                              Edit
                            </Button>
                            {t.status === "ACTIVE" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-purple-600 hover:bg-purple-50 min-w-[80px]"
                                  onClick={() => setTransferTeen(t)}
                                >
                                  Transfer
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-green-600 hover:bg-green-50 min-w-[80px]"
                                  onClick={() => setPromoteTeen(t)}
                                >
                                  Promote
                                </Button>
                              </>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-red-600 hover:bg-red-50 min-w-[80px]"
                              onClick={async () => {
                                if (confirm(`Delete ${t.full_name}?`)) {
                                  await deleteTeenager(t.id);
                                }
                              }}
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
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-2">Name</th>
                      <th>Class</th>
                      <th>Phone</th>
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
                          <td className="py-3 font-medium">
                            <div className="flex items-center gap-2">
                              <PersonAvatar
                                name={t.full_name}
                                photoUrl={t.photo_url}
                              />
                              <span>{t.full_name}</span>
                            </div>
                          </td>
                          <td>{t.teenClass?.name || "—"}</td>
                          <td>
                            {t.contact_no ? (
                              <a
                                href={`tel:${t.contact_no}`}
                                className="text-blue-600 hover:underline"
                              >
                                {t.contact_no}
                              </a>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td>{t.location?.name || "—"}</td>
                          <td>
                            <div>{t.guardian_name || "—"}</div>
                            {(t.guardian_relationship ||
                              t.guardian_contact) && (
                              <div className="text-xs text-muted-foreground">
                                {t.guardian_relationship
                                  ? `${t.guardian_relationship} · `
                                  : ""}
                                {t.guardian_contact ? (
                                  <a
                                    href={`tel:${t.guardian_contact}`}
                                    className="text-blue-600 hover:underline"
                                  >
                                    {t.guardian_contact}
                                  </a>
                                ) : null}
                              </div>
                            )}
                          </td>
                          <td>
                            <Badge>{t.status}</Badge>
                          </td>
                          <td>
                            {completeness.isIncomplete ? (
                              <Badge variant="destructive">Incomplete</Badge>
                            ) : (
                              <Badge variant="secondary">Complete</Badge>
                            )}
                          </td>
                          <td className="space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setViewTeen(t)}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditTeen(t)}
                            >
                              Edit
                            </Button>
                            {t.status === "ACTIVE" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setTransferTeen(t)}
                                >
                                  Transfer
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => setPromoteTeen(t)}
                                >
                                  Promote
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={async () => {
                                if (confirm(`Delete ${t.full_name}?`)) {
                                  await deleteTeenager(t.id);
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
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
    </div>
  );
};

export default TeenagersPage;
