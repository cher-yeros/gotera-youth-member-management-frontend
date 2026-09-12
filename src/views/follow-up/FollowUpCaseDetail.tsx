import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { ArrowLeft, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeToggle from "@/components/ui/theme-toggle";
import { AssignFollowUpModal } from "@/components/forms/AssignFollowUpModal";
import { LogFollowUpContactModal } from "@/components/forms/LogFollowUpContactModal";
import {
  CloseFollowUpModal,
  GraduateFollowUpModal,
} from "@/components/forms/GraduateFollowUpModal";
import { GET_FOLLOW_UP_CASE } from "@/graphql/operations";
import {
  FOLLOW_UP_SOURCE_LABELS,
  FOLLOW_UP_STATUS,
  FOLLOW_UP_STATUS_LABELS,
  formatFollowUpDate,
  followUpPriorityBadgeClass,
  followUpStatusBadgeClass,
  isFollowUpOverdue,
} from "@/lib/followUp";
import { hasAnyRole, ROLE } from "@/lib/roles";
import { useAuth } from "@/redux/useAuth";
import { cn } from "@/lib/utils";

const FollowUpCaseDetail: React.FC = () => {
  const { id } = useParams();
  const caseId = Number(id);
  const { user } = useAuth();
  const isAdmin = hasAnyRole(user, [ROLE.ADMIN, ROLE.MAIN]);
  const myMemberId = user?.member?.id;

  const [assignOpen, setAssignOpen] = useState(false);
  const [reassign, setReassign] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [graduateOpen, setGraduateOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);

  const { data, loading, refetch } = useQuery(GET_FOLLOW_UP_CASE, {
    variables: { id: caseId },
    skip: !caseId,
    fetchPolicy: "cache-and-network",
  });

  const item = (data as any)?.followUpCase;
  const isClosed =
    item &&
    [
      FOLLOW_UP_STATUS.JOINED,
      FOLLOW_UP_STATUS.NOT_INTERESTED,
      FOLLOW_UP_STATUS.UNREACHABLE,
      FOLLOW_UP_STATUS.MOVED_OUT,
    ].includes(item.status);

  if (loading && !item) {
    return <div className="p-8 text-muted-foreground">Loading case...</div>;
  }

  if (!item) {
    return (
      <div className="space-y-4">
        <Button variant="outline" asChild>
          <Link to="/follow-up">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <p>Follow-up case not found.</p>
      </div>
    );
  }

  const overdue = isFollowUpOverdue(item.next_follow_up_at, item.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/follow-up">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to follow-up
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold text-brand-gradient">
              {item.member?.full_name}
            </h1>
            <Badge className={cn(followUpStatusBadgeClass(item.status))}>
              {FOLLOW_UP_STATUS_LABELS[item.status] || item.status}
            </Badge>
            <Badge className={cn(followUpPriorityBadgeClass(item.priority))}>
              {item.priority}
            </Badge>
            {overdue && (
              <Badge className="bg-red-100 text-red-800">Overdue</Badge>
            )}
          </div>
          <p className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1">
            {item.member?.contact_no ? (
              <a
                href={`tel:${item.member.contact_no}`}
                className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
              >
                <Phone className="h-4 w-4" />
                {item.member.contact_no}
              </a>
            ) : (
              <span>No phone</span>
            )}
            <span>·</span>
            <span>
              Source:{" "}
              {FOLLOW_UP_SOURCE_LABELS[item.source] || item.source || "—"}
            </span>
          </p>
        </div>
        <ThemeToggle variant="icon" />
      </div>

      <div className="flex flex-wrap gap-2">
        {item.member?.contact_no && (
          <Button asChild>
            <a href={`tel:${item.member.contact_no}`}>
              <Phone className="h-4 w-4 mr-2" />
              Call
            </a>
          </Button>
        )}
        {!isClosed &&
          (isAdmin || !item.assigned_to || item.assigned_to === myMemberId) && (
            <>
              {!item.assigned_to && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setReassign(false);
                    setAssignOpen(true);
                  }}
                >
                  Claim / Assign
                </Button>
              )}
              {(isAdmin || item.assigned_to === myMemberId) &&
                item.assigned_to && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setReassign(true);
                      setAssignOpen(true);
                    }}
                  >
                    Reassign
                  </Button>
                )}
              <Button variant="outline" onClick={() => setContactOpen(true)}>
                Log contact
              </Button>
              <Button variant="outline" onClick={() => setGraduateOpen(true)}>
                Promote to Family
              </Button>
              <Button variant="ghost" onClick={() => setCloseOpen(true)}>
                Close
              </Button>
            </>
          )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Case details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <div className="text-muted-foreground">Phone</div>
              {item.member?.contact_no ? (
                <div className="flex items-center gap-2 mt-1">
                  <a
                    href={`tel:${item.member.contact_no}`}
                    className="text-primary hover:underline font-medium"
                  >
                    {item.member.contact_no}
                  </a>
                  <Button size="sm" asChild>
                    <a href={`tel:${item.member.contact_no}`}>
                      <Phone className="h-3.5 w-3.5 mr-1" />
                      Call
                    </a>
                  </Button>
                </div>
              ) : (
                <div>—</div>
              )}
            </div>
            <div>
              <div className="text-muted-foreground">Assignee</div>
              <div>{item.assignee?.full_name || "Unassigned"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Suggested family</div>
              <div>{item.family?.name || "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">First visit</div>
              <div>
                {formatFollowUpDate(item.first_visit_date, "MMM d, yyyy")}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Next follow-up</div>
              <div>{formatFollowUpDate(item.next_follow_up_at)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Created by</div>
              <div>{item.creator?.full_name || "—"}</div>
            </div>
            {item.outcome_notes && (
              <div>
                <div className="text-muted-foreground">Notes / outcome</div>
                <div className="whitespace-pre-wrap">{item.outcome_notes}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Contact history</CardTitle>
          </CardHeader>
          <CardContent>
            {!item.contacts?.length ? (
              <p className="text-sm text-muted-foreground">No contacts yet</p>
            ) : (
              <div className="space-y-4">
                {item.contacts.map((c: any) => (
                  <div
                    key={c.id}
                    className="border-l-2 border-brand pl-4 space-y-1"
                  >
                    <div className="flex flex-wrap gap-2 items-center">
                      <Badge variant="outline">{c.contact_type}</Badge>
                      <Badge>{c.outcome?.replace(/_/g, " ")}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatFollowUpDate(c.contacted_at)}
                      </span>
                    </div>
                    <div className="text-sm">
                      by {c.recorder?.full_name || "—"}
                    </div>
                    {c.notes && (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {c.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Assignment history</CardTitle>
          </CardHeader>
          <CardContent>
            {!item.assignments?.length ? (
              <p className="text-sm text-muted-foreground">
                No assignments yet
              </p>
            ) : (
              <div className="space-y-3">
                {item.assignments.map((a: any) => (
                  <div key={a.id} className="text-sm flex flex-wrap gap-x-3">
                    <span>
                      {a.fromMember?.full_name || "Unassigned"} →{" "}
                      {a.toMember?.full_name}
                    </span>
                    <span className="text-muted-foreground">
                      by {a.assigner?.full_name} on{" "}
                      {formatFollowUpDate(a.assigned_at)}
                    </span>
                    {a.reason && (
                      <span className="text-muted-foreground">
                        — {a.reason}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AssignFollowUpModal
        open={assignOpen}
        onOpenChange={setAssignOpen}
        caseId={item.id}
        isReassign={reassign}
        onSuccess={() => refetch()}
      />
      <LogFollowUpContactModal
        open={contactOpen}
        onOpenChange={setContactOpen}
        caseId={item.id}
        onSuccess={() => refetch()}
      />
      <GraduateFollowUpModal
        open={graduateOpen}
        onOpenChange={setGraduateOpen}
        caseId={item.id}
        defaultFamilyId={item.family_id}
        onSuccess={() => refetch()}
      />
      <CloseFollowUpModal
        open={closeOpen}
        onOpenChange={setCloseOpen}
        caseId={item.id}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default FollowUpCaseDetail;
