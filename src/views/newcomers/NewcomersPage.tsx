import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GraduateFollowUpModal } from "@/components/forms/GraduateFollowUpModal";
import { GET_FOLLOW_UP_CASES } from "@/graphql/operations";
import {
  FOLLOW_UP_STATUS_LABELS,
  followUpPriorityBadgeClass,
  followUpStatusBadgeClass,
} from "@/lib/followUp";
import { hasAnyRole, ROLE } from "@/lib/roles";
import { useAuth } from "@/redux/useAuth";
import { cn } from "@/lib/utils";
import { Phone, Search, UserPlus } from "lucide-react";

const NewcomersPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const canAssignToFamily = hasAnyRole(user, [ROLE.ADMIN, ROLE.MAIN, ROLE.FC]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [noFamilyOnly, setNoFamilyOnly] = useState(
    () => searchParams.get("unassigned") === "1",
  );
  const [graduateOpen, setGraduateOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [selectedFamilyId, setSelectedFamilyId] = useState<number | null>(null);

  const filter = useMemo(
    () => ({
      openOnly: true,
      search: search || undefined,
      noFamilySuggested: noFamilyOnly || undefined,
    }),
    [search, noFamilyOnly],
  );

  const { data, loading, refetch } = useQuery(GET_FOLLOW_UP_CASES, {
    variables: {
      filter,
      pagination: { page, limit: 20 },
    },
    fetchPolicy: "cache-and-network",
  });

  const payload = (data as any)?.followUpCases;
  const items = payload?.items || [];
  const totalPages = payload?.totalPages || 1;
  const total = payload?.total || 0;

  const applyNoFamilyOnly = (checked: boolean) => {
    setNoFamilyOnly(checked);
    setPage(1);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (checked) next.set("unassigned", "1");
        else next.delete("unassigned");
        return next;
      },
      { replace: true },
    );
  };

  const openGraduate = (caseId: number, familyId?: number | null) => {
    setSelectedCaseId(caseId);
    setSelectedFamilyId(familyId ?? null);
    setGraduateOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-gradient">Newcomers</h1>
          <p className="text-muted-foreground">{total} newcomers</p>
        </div>
      </div>

      <Card className="shadow-brand">
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search name or phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex items-center gap-3 rounded-md border px-3 py-2">
              <Switch
                id="no-family-suggested"
                checked={noFamilyOnly}
                onCheckedChange={applyNoFamilyOnly}
              />
              <Label htmlFor="no-family-suggested" className="cursor-pointer">
                No family suggested
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">Newcomers list</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading && !items.length ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading newcomers...
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No open newcomers match this view
            </div>
          ) : (
            <div className="divide-y">
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="p-4 flex flex-col lg:flex-row lg:items-center gap-3 justify-between"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">
                        {item.member?.full_name}
                      </span>
                      <Badge
                        className={cn(followUpStatusBadgeClass(item.status))}
                      >
                        {FOLLOW_UP_STATUS_LABELS[item.status] || item.status}
                      </Badge>
                      {item.priority && (
                        <Badge
                          className={cn(
                            followUpPriorityBadgeClass(item.priority),
                          )}
                        >
                          {item.priority}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 items-center">
                      {item.member?.contact_no ? (
                        <a
                          href={`tel:${item.member.contact_no}`}
                          className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          {item.member.contact_no}
                        </a>
                      ) : (
                        <span>No phone</span>
                      )}
                      <span>
                        Assignee: {item.assignee?.full_name || "Unassigned"}
                      </span>
                      <span>
                        Suggested family: {item.family?.name || "None"}
                      </span>
                    </div>
                  </div>
                  {canAssignToFamily && (
                    <Button
                      size="sm"
                      onClick={() => openGraduate(item.id, item.family_id)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign to family
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <GraduateFollowUpModal
        open={graduateOpen}
        onOpenChange={setGraduateOpen}
        caseId={selectedCaseId}
        defaultFamilyId={selectedFamilyId}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default NewcomersPage;
