import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Phone,
  Plus,
  Search,
  UserPlus,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/ui/theme-toggle";
import { IntakeNewcomerModal } from "@/components/forms/IntakeNewcomerModal";
import { AssignFollowUpModal } from "@/components/forms/AssignFollowUpModal";
import { LogFollowUpContactModal } from "@/components/forms/LogFollowUpContactModal";
import {
  CloseFollowUpModal,
  GraduateFollowUpModal,
} from "@/components/forms/GraduateFollowUpModal";
import {
  GET_FOLLOW_UP_CASES,
  GET_FOLLOW_UP_DASHBOARD,
  GET_MY_FOLLOW_UP_CASES,
} from "@/graphql/operations";
import {
  FOLLOW_UP_STATUS,
  FOLLOW_UP_STATUS_LABELS,
  formatFollowUpDate,
  followUpPriorityBadgeClass,
  followUpStatusBadgeClass,
  isFollowUpOverdue,
} from "@/lib/followUp";
import { hasAnyRole, isFollowUpCoordinator, ROLE } from "@/lib/roles";
import { useAuth } from "@/redux/useAuth";
import { cn } from "@/lib/utils";

type TabKey = "all" | "unassigned" | "mine" | "overdue" | "closed";

const FollowUpManagement: React.FC = () => {
  const { user } = useAuth();
  const canCoordinate = isFollowUpCoordinator(user);
  // Only Follow Up Coordinators (Admin/Main/FUC) may assign or reassign cases
  const canAssignFollowUp = canCoordinate;
  // Promote to Family is admin/main only — not FUL or FUC
  const canPromoteToFamily = hasAnyRole(user, [ROLE.ADMIN, ROLE.MAIN]);
  const myMemberId = user?.member?.id;
  const [tab, setTab] = useState<TabKey>("mine");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [reassign, setReassign] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [graduateOpen, setGraduateOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [selectedFamilyId, setSelectedFamilyId] = useState<number | null>(null);

  const filter = useMemo(() => {
    const base: any = { search: search || undefined };
    if (tab === "unassigned") {
      base.unassigned = true;
      base.openOnly = true;
    } else if (tab === "overdue") {
      base.overdue = true;
    } else if (tab === "closed") {
      base.statuses = [
        FOLLOW_UP_STATUS.JOINED,
        FOLLOW_UP_STATUS.NOT_INTERESTED,
        FOLLOW_UP_STATUS.UNREACHABLE,
        FOLLOW_UP_STATUS.MOVED_OUT,
      ];
    } else if (tab === "all" || tab === "mine") {
      base.openOnly = true;
    }
    return base;
  }, [tab, search]);

  const useMineQuery = tab === "mine";
  const { data, loading } = useQuery(
    useMineQuery ? GET_MY_FOLLOW_UP_CASES : GET_FOLLOW_UP_CASES,
    {
      variables: {
        filter,
        pagination: { page, limit: 20 },
      },
      fetchPolicy: "cache-and-network",
    },
  );

  const { data: dashData } = useQuery(GET_FOLLOW_UP_DASHBOARD, {
    fetchPolicy: "cache-and-network",
  });

  const payload = useMineQuery
    ? (data as any)?.myFollowUpCases
    : (data as any)?.followUpCases;
  const items = payload?.items || [];
  const totalPages = payload?.totalPages || 1;
  const dashboard = (dashData as any)?.followUpDashboard;

  const tabs: { key: TabKey; label: string }[] = [
    { key: "mine", label: "My cases" },
    { key: "all", label: "All open" },
    { key: "unassigned", label: "Unassigned" },
    { key: "overdue", label: "Overdue" },
    { key: "closed", label: "Closed" },
  ];

  const openAssign = (id: number, isReassign = false) => {
    setSelectedCaseId(id);
    setReassign(isReassign);
    setAssignOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-gradient">Follow-up</h1>
          <p className="text-muted-foreground">
            Intake newcomers, assign coordinators, and track calls
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle variant="icon" />
          <Button onClick={() => setIntakeOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Intake newcomer
          </Button>
        </div>
      </div>

      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <UserPlus className="h-4 w-4" /> New
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.newCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" /> Assigned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboard.assignedCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" /> In progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboard.inProgressCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" /> Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">
                {dashboard.overdueCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Promoted this month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboard.joinedThisMonth}
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Coordinator workload
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboard.coordinatorWorkload?.length ? (
                <div className="flex flex-wrap gap-2">
                  {dashboard.coordinatorWorkload.map((c: any) => (
                    <Badge
                      key={c.member_id}
                      variant="outline"
                      className="gap-1"
                    >
                      {c.full_name}: {c.openCases} open
                      {c.overdueCases > 0 && (
                        <span className="text-red-600">
                          ({c.overdueCases} overdue)
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No open load</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Button
            key={t.key}
            variant={tab === t.key ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setTab(t.key);
              setPage(1);
            }}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <div className="relative max-w-md">
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

      <Card>
        <CardContent className="p-0">
          {loading && !items.length ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading cases...
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No follow-up cases in this view
            </div>
          ) : (
            <div className="divide-y">
              {items.map((item: any) => {
                const overdue = isFollowUpOverdue(
                  item.next_follow_up_at,
                  item.status,
                );
                return (
                  <div
                    key={item.id}
                    className="p-4 flex flex-col lg:flex-row lg:items-center gap-3 justify-between"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/follow-up/${item.id}`}
                          className="font-semibold hover:underline"
                        >
                          {item.member?.full_name}
                        </Link>
                        <Badge
                          className={cn(followUpStatusBadgeClass(item.status))}
                        >
                          {FOLLOW_UP_STATUS_LABELS[item.status] || item.status}
                        </Badge>
                        <Badge
                          className={cn(
                            followUpPriorityBadgeClass(item.priority),
                          )}
                        >
                          {item.priority}
                        </Badge>
                        {overdue && (
                          <Badge className="bg-red-100 text-red-800">
                            Overdue
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 items-center">
                        {item.member?.contact_no ? (
                          <a
                            href={`tel:${item.member.contact_no}`}
                            className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone className="h-3.5 w-3.5" />
                            {item.member.contact_no}
                          </a>
                        ) : (
                          <span>No phone</span>
                        )}
                        {(item.member?.location?.name ||
                          item.member?.location_name) && (
                          <span>
                            {item.member?.location?.name ||
                              item.member?.location_name}
                          </span>
                        )}
                        <span>
                          Assignee: {item.assignee?.full_name || "Unassigned"}
                        </span>
                        {item.next_follow_up_at && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Due {formatFollowUpDate(item.next_follow_up_at)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.member?.contact_no && (
                        <Button size="sm" variant="default" asChild>
                          <a href={`tel:${item.member.contact_no}`}>
                            <Phone className="h-4 w-4 mr-1.5" />
                            Call
                          </a>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/follow-up/${item.id}`}>Open</Link>
                      </Button>
                      {item.status !== FOLLOW_UP_STATUS.JOINED &&
                        ![
                          FOLLOW_UP_STATUS.NOT_INTERESTED,
                          FOLLOW_UP_STATUS.UNREACHABLE,
                          FOLLOW_UP_STATUS.MOVED_OUT,
                        ].includes(item.status) &&
                        (() => {
                          const canManage =
                            canCoordinate ||
                            (!!item.assigned_to &&
                              item.assigned_to === myMemberId);
                          return (
                            <>
                              {canAssignFollowUp && !item.assigned_to && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => openAssign(item.id, false)}
                                >
                                  Assign
                                </Button>
                              )}
                              {canAssignFollowUp && item.assigned_to && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => openAssign(item.id, true)}
                                >
                                  Reassign
                                </Button>
                              )}
                              {canManage && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedCaseId(item.id);
                                      setContactOpen(true);
                                    }}
                                  >
                                    Log contact
                                  </Button>
                                  {canPromoteToFamily && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedCaseId(item.id);
                                        setSelectedFamilyId(
                                          item.family_id ||
                                            item.family?.id ||
                                            null,
                                        );
                                        setGraduateOpen(true);
                                      }}
                                    >
                                      Promote to Family
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedCaseId(item.id);
                                      setCloseOpen(true);
                                    }}
                                  >
                                    Close
                                  </Button>
                                </>
                              )}
                            </>
                          );
                        })()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm self-center">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <IntakeNewcomerModal
        open={intakeOpen}
        onOpenChange={setIntakeOpen}
      />
      <AssignFollowUpModal
        open={assignOpen}
        onOpenChange={setAssignOpen}
        caseId={selectedCaseId}
        isReassign={reassign}
      />
      <LogFollowUpContactModal
        open={contactOpen}
        onOpenChange={setContactOpen}
        caseId={selectedCaseId}
      />
      <GraduateFollowUpModal
        open={graduateOpen}
        onOpenChange={setGraduateOpen}
        caseId={selectedCaseId}
        defaultFamilyId={selectedFamilyId}
      />
      <CloseFollowUpModal
        open={closeOpen}
        onOpenChange={setCloseOpen}
        caseId={selectedCaseId}
      />
    </div>
  );
};

export default FollowUpManagement;
