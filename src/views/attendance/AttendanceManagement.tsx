import { AttendanceModal } from "@/components/forms/AttendanceModal";
import BibleStudyProgress from "@/components/forms/BibleStudyProgress";
import { CreateFamilyMeetupModal } from "@/components/forms/CreateFamilyMeetupModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/shared/PageHeader";
import ListLoadingState from "@/components/shared/ListLoadingState";
import ListEmptyState from "@/components/shared/ListEmptyState";
import ListErrorState from "@/components/shared/ListErrorState";
import ListPagination from "@/components/shared/ListPagination";
import InlineSearchRow from "@/components/shared/InlineSearchRow";
import { GET_FAMILY_MEETUPS } from "@/graphql/operations";
import { hasAnyRole, ROLE } from "@/lib/roles";
import { useAuth } from "@/redux/useAuth";
import { useQuery } from "@apollo/client/react";
import { format } from "date-fns";
import { CheckCircle, TrendingUp, Users, XCircle } from "lucide-react";
import React, { useState, useCallback } from "react";

interface FamilyMeetup {
  id: number;
  title: string;
  description: string;
  meetup_date: string;
  location: string;
  bible_study_number?: number | null;
  bible_study_questions?: number[] | null;
  completed_bible_study_questions?: number[];
  is_active: boolean;
  createdAt: string;
  family: {
    id: number;
    name: string;
  };
  creator: {
    id: number;
    full_name: string;
  };
  attendanceStats?: {
    totalMembers: number;
    presentMembers: number;
    absentMembers: number;
    attendanceRate: number;
  } | null;
  attendances: Array<{
    id: number;
    member_id: number;
    is_present: boolean;
    notes?: string;
    member: {
      id: number;
      full_name: string;
    };
  }>;
}

const AttendanceManagement: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const familyId = user?.member?.family?.id;
  const canCreateMeetup = hasAnyRole(user, [ROLE.ADMIN, ROLE.FC]);

  const { data, loading, error } = useQuery(GET_FAMILY_MEETUPS, {
    variables: {
      filter: {
        family_id: familyId,
        is_active: true,
      },
      pagination: { page: 1, limit: 50 },
    },
    skip: !familyId,
  });

  const meetups =
    (data as { familyMeetups?: { meetups: FamilyMeetup[] } })?.familyMeetups
      ?.meetups || [];

  // Compare by calendar day so today's meetups stay in Upcoming
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const getMeetupDay = (meetupDate: string) => {
    const timestamp = parseInt(meetupDate);
    if (isNaN(timestamp)) return null;
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return null;
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    return day;
  };

  const isMeetupToday = (meetupDate: string) => {
    const day = getMeetupDay(meetupDate);
    return !!day && day.getTime() === startOfToday.getTime();
  };

  // Upcoming: soonest first (today on top). Past: most recent day first.
  const byMeetupDateAsc = (a: FamilyMeetup, b: FamilyMeetup) =>
    parseInt(a.meetup_date) - parseInt(b.meetup_date);
  const byMeetupDateDesc = (a: FamilyMeetup, b: FamilyMeetup) =>
    parseInt(b.meetup_date) - parseInt(a.meetup_date);

  const upcomingMeetups = meetups
    .filter((meetup: FamilyMeetup) => {
      const meetupDay = getMeetupDay(meetup.meetup_date);
      if (!meetupDay) {
        console.error(`Invalid timestamp: ${meetup.meetup_date}`);
        return false;
      }
      return meetupDay >= startOfToday;
    })
    .sort(byMeetupDateAsc);

  const pastMeetups = meetups
    .filter((meetup: FamilyMeetup) => {
      const meetupDay = getMeetupDay(meetup.meetup_date);
      if (!meetupDay) return false;
      return meetupDay < startOfToday;
    })
    .sort(byMeetupDateDesc);

  const formatMeetupDate = (meetupDate: string) => {
    const timestamp = parseInt(meetupDate);
    if (isNaN(timestamp)) return "Invalid Date";

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Invalid Date";

    return format(date, "PPP");
  };

  const filteredMeetups = useCallback(
    (meetups: FamilyMeetup[]) => {
      if (!searchTerm) return meetups;
      return meetups.filter(
        (meetup: FamilyMeetup) =>
          meetup.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meetup.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meetup.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    },
    [searchTerm],
  );

  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1) {
      setCurrentPage(page);
    }
  };

  const getAttendanceStats = (meetup: FamilyMeetup) => {
    const stats = meetup.attendanceStats;
    return {
      totalMembers: stats?.totalMembers ?? 0,
      presentMembers: stats?.presentMembers ?? 0,
      absentMembers: stats?.absentMembers ?? 0,
      attendanceRate: stats?.attendanceRate ?? 0,
    };
  };

  const getStatusBadge = (meetup: FamilyMeetup) => {
    const meetupDate = new Date(parseInt(meetup.meetup_date));
    const now = new Date();

    if (meetupDate.toDateString() === now.toDateString()) {
      return <Badge variant="default">Today</Badge>;
    } else if (meetupDate < now) {
      return <Badge variant="secondary">Past</Badge>;
    } else {
      return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  if (!familyId) {
    return (
      <div className="space-y-6">
        <PageHeader title="Attendance Management" subtitle="Family meetups" />
        <ListErrorState
          layout="page"
          title="No Family Assigned"
          message="You need to be assigned to a family to manage attendance."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Attendance Management"
        subtitle={`${meetups.length} meetups`}
        actions={
          canCreateMeetup ? (
            <CreateFamilyMeetupModal familyId={familyId} />
          ) : undefined
        }
      />

      {/* Search */}
      <InlineSearchRow
        value={searchTerm}
        onChange={handleSearch}
        onClear={handleClearSearch}
        placeholder="Search meetups..."
      />

      {/* Tabs */}
      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">Family Meetups</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming Meetups</TabsTrigger>
              <TabsTrigger value="past">Past Meetups</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4 mt-4">
              {loading ? (
                <ListLoadingState message="Loading meetups..." />
              ) : error ? (
                <ListErrorState
                  title="Error Loading Meetups"
                  message={error.message}
                  onRetry={() => window.location.reload()}
                />
              ) : filteredMeetups(upcomingMeetups).length === 0 ? (
                <ListEmptyState
                  icon="📅"
                  title={
                    searchTerm
                      ? "No upcoming meetups found matching your search"
                      : "No upcoming meetups found"
                  }
                  description={
                    searchTerm
                      ? "Try adjusting your search criteria or clear the filters to see all meetups."
                      : canCreateMeetup
                        ? "Create a meetup batch to schedule the same meetup for every family."
                        : "No meetups have been scheduled yet. Contact an admin or Family Coordinator to create one."
                  }
                  secondaryAction={
                    searchTerm
                      ? { label: "Clear Filters", onClick: handleClearSearch }
                      : undefined
                  }
                  primaryAction={
                    !searchTerm && canCreateMeetup
                      ? {
                          label: "Create First Meetup Batch",
                          onClick: () => {},
                        }
                      : undefined
                  }
                />
              ) : (
                <div className="space-y-4">
                  {/* Mobile Card View - Hidden on desktop */}
                  <div className="block md:hidden space-y-3">
                    {filteredMeetups(upcomingMeetups)
                      .slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize,
                      )
                      .map((meetup: FamilyMeetup) => {
                        const stats = getAttendanceStats(meetup);
                        return (
                          <Card key={meetup.id} className="shadow-sm border">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                {/* Header with meetup title and status */}
                                <div className="flex items-center justify-between">
                                  <div className="font-semibold text-lg">
                                    {meetup.title}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {getStatusBadge(meetup)}
                                    <Badge className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-900">
                                      {stats.totalMembers} members
                                    </Badge>
                                  </div>
                                </div>

                                {/* Meetup details */}
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Date:
                                    </span>
                                    <span>
                                      {formatMeetupDate(meetup.meetup_date)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Location:
                                    </span>
                                    <span>{meetup.location}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Created by:
                                    </span>
                                    <span>{meetup.creator.full_name}</span>
                                  </div>
                                </div>

                                {/* Attendance stats */}
                                {stats.totalMembers > 0 && (
                                  <div className="pt-2 border-t">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-medium text-sm">
                                        Attendance
                                      </h4>
                                      <span className="text-sm font-medium text-green-600">
                                        {stats.attendanceRate.toFixed(1)}%
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                      <div className="flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                        <span>
                                          {stats.presentMembers} Present
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <XCircle className="h-3 w-3 text-red-600" />
                                        <span>
                                          {stats.absentMembers} Absent
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3 text-muted-foreground" />
                                        <span>{stats.totalMembers} Total</span>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <BibleStudyProgress
                                  meetupId={meetup.id}
                                  bibleStudyNumber={meetup.bible_study_number}
                                  bibleStudyQuestions={
                                    meetup.bible_study_questions
                                  }
                                  completedQuestions={
                                    meetup.completed_bible_study_questions
                                  }
                                />

                                {/* Action buttons — attendance only for today's meetup */}
                                <div className="flex space-x-2 pt-2">
                                  {isMeetupToday(meetup.meetup_date) ? (
                                    <AttendanceModal
                                      meetupId={meetup.id}
                                      familyId={familyId}
                                      trigger={
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="flex-1 text-green-600 hover:bg-green-50"
                                        >
                                          <Users className="h-4 w-4 mr-1" />
                                          Record Attendance
                                        </Button>
                                      }
                                    />
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      disabled
                                      className="flex-1"
                                      title="Attendance can only be recorded on the meetup day"
                                    >
                                      <Users className="h-4 w-4 mr-1" />
                                      Record Attendance
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>

                  {/* Desktop Table View - Hidden on mobile */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold">
                            Meetup
                          </th>
                          <th className="text-left p-3 font-semibold">Date</th>
                          <th className="text-left p-3 font-semibold">
                            Location
                          </th>
                          <th className="text-left p-3 font-semibold">
                            Status
                          </th>
                          <th className="text-left p-3 font-semibold">
                            Bible Study
                          </th>
                          <th className="text-left p-3 font-semibold">
                            Attendance
                          </th>
                          <th className="text-left p-3 font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMeetups(upcomingMeetups)
                          .slice(
                            (currentPage - 1) * pageSize,
                            currentPage * pageSize,
                          )
                          .map((meetup: FamilyMeetup) => {
                            const stats = getAttendanceStats(meetup);
                            return (
                              <tr
                                key={meetup.id}
                                className="border-b hover:bg-muted/50"
                              >
                                <td className="p-3">
                                  <div className="font-medium">
                                    {meetup.title}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {meetup.description}
                                  </div>
                                </td>
                                <td className="p-3">
                                  <div className="text-sm">
                                    {formatMeetupDate(meetup.meetup_date)}
                                  </div>
                                </td>
                                <td className="p-3">
                                  <div className="text-sm">
                                    {meetup.location}
                                  </div>
                                </td>
                                <td className="p-3">
                                  {getStatusBadge(meetup)}
                                </td>
                                <td className="p-3 min-w-[200px]">
                                  <BibleStudyProgress
                                    meetupId={meetup.id}
                                    bibleStudyNumber={meetup.bible_study_number}
                                    bibleStudyQuestions={
                                      meetup.bible_study_questions
                                    }
                                    completedQuestions={
                                      meetup.completed_bible_study_questions
                                    }
                                  />
                                </td>
                                <td className="p-3">
                                  <div className="text-sm">
                                    <div className="flex items-center gap-2">
                                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium text-green-600">
                                        {stats.attendanceRate.toFixed(1)}%
                                      </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {stats.presentMembers}/
                                      {stats.totalMembers} present
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3">
                                  {isMeetupToday(meetup.meetup_date) ? (
                                    <AttendanceModal
                                      meetupId={meetup.id}
                                      familyId={familyId}
                                      trigger={
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-green-600 hover:bg-green-50"
                                        >
                                          <Users className="h-4 w-4 mr-1" />
                                          Record
                                        </Button>
                                      }
                                    />
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      disabled
                                      title="Attendance can only be recorded on the meetup day"
                                    >
                                      <Users className="h-4 w-4 mr-1" />
                                      Record
                                    </Button>
                                  )}
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
                    totalItems={filteredMeetups(upcomingMeetups).length}
                    onPageChange={handlePageChange}
                    onPageSizeChange={(size) => {
                      setPageSize(size);
                      setCurrentPage(1);
                    }}
                    itemLabel="upcoming meetups"
                    showPageNumbers={false}
                    hideWhenSinglePage
                    filtered={!!searchTerm}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4 mt-4">
              {filteredMeetups(pastMeetups).length === 0 ? (
                <ListEmptyState
                  icon="📅"
                  title={
                    searchTerm
                      ? "No past meetups found matching your search"
                      : "No past meetups found"
                  }
                  description={
                    searchTerm
                      ? "Try adjusting your search criteria or clear the filters to see all meetups."
                      : "Past meetups will appear here once they are completed."
                  }
                  secondaryAction={
                    searchTerm
                      ? { label: "Clear Filters", onClick: handleClearSearch }
                      : undefined
                  }
                />
              ) : (
                <div className="space-y-4">
                  {/* Mobile Card View - Hidden on desktop */}
                  <div className="block md:hidden space-y-3">
                    {filteredMeetups(pastMeetups)
                      .slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize,
                      )
                      .map((meetup: FamilyMeetup) => {
                        const stats = getAttendanceStats(meetup);
                        return (
                          <Card key={meetup.id} className="shadow-sm border">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                {/* Header with meetup title and status */}
                                <div className="flex items-center justify-between">
                                  <div className="font-semibold text-lg">
                                    {meetup.title}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {getStatusBadge(meetup)}
                                    <Badge className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-900">
                                      {stats.totalMembers} members
                                    </Badge>
                                  </div>
                                </div>

                                {/* Meetup details */}
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Date:
                                    </span>
                                    <span>
                                      {formatMeetupDate(meetup.meetup_date)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Location:
                                    </span>
                                    <span>{meetup.location}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Created by:
                                    </span>
                                    <span>{meetup.creator.full_name}</span>
                                  </div>
                                </div>

                                {/* Final attendance stats */}
                                {stats.totalMembers > 0 && (
                                  <div className="pt-2 border-t">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-medium text-sm">
                                        Final Attendance
                                      </h4>
                                      <span className="text-sm font-medium text-green-600">
                                        {stats.attendanceRate.toFixed(1)}%
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                      <div className="flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                        <span>
                                          {stats.presentMembers} Present
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <XCircle className="h-3 w-3 text-red-600" />
                                        <span>
                                          {stats.absentMembers} Absent
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3 text-muted-foreground" />
                                        <span>{stats.totalMembers} Total</span>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <BibleStudyProgress
                                  meetupId={meetup.id}
                                  bibleStudyNumber={meetup.bible_study_number}
                                  bibleStudyQuestions={
                                    meetup.bible_study_questions
                                  }
                                  completedQuestions={
                                    meetup.completed_bible_study_questions
                                  }
                                />
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>

                  {/* Desktop Table View - Hidden on mobile */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold">
                            Meetup
                          </th>
                          <th className="text-left p-3 font-semibold">Date</th>
                          <th className="text-left p-3 font-semibold">
                            Location
                          </th>
                          <th className="text-left p-3 font-semibold">
                            Status
                          </th>
                          <th className="text-left p-3 font-semibold">
                            Bible Study
                          </th>
                          <th className="text-left p-3 font-semibold">
                            Final Attendance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMeetups(pastMeetups)
                          .slice(
                            (currentPage - 1) * pageSize,
                            currentPage * pageSize,
                          )
                          .map((meetup: FamilyMeetup) => {
                            const stats = getAttendanceStats(meetup);
                            return (
                              <tr
                                key={meetup.id}
                                className="border-b hover:bg-muted/50"
                              >
                                <td className="p-3">
                                  <div className="font-medium">
                                    {meetup.title}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {meetup.description}
                                  </div>
                                </td>
                                <td className="p-3">
                                  <div className="text-sm">
                                    {formatMeetupDate(meetup.meetup_date)}
                                  </div>
                                </td>
                                <td className="p-3">
                                  <div className="text-sm">
                                    {meetup.location}
                                  </div>
                                </td>
                                <td className="p-3">
                                  {getStatusBadge(meetup)}
                                </td>
                                <td className="p-3 min-w-[200px]">
                                  <BibleStudyProgress
                                    meetupId={meetup.id}
                                    bibleStudyNumber={meetup.bible_study_number}
                                    bibleStudyQuestions={
                                      meetup.bible_study_questions
                                    }
                                    completedQuestions={
                                      meetup.completed_bible_study_questions
                                    }
                                  />
                                </td>
                                <td className="p-3">
                                  <div className="text-sm">
                                    <div className="flex items-center gap-2">
                                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium text-green-600">
                                        {stats.attendanceRate.toFixed(1)}%
                                      </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {stats.presentMembers}/
                                      {stats.totalMembers} present
                                    </div>
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
                    totalItems={filteredMeetups(pastMeetups).length}
                    onPageChange={handlePageChange}
                    onPageSizeChange={(size) => {
                      setPageSize(size);
                      setCurrentPage(1);
                    }}
                    itemLabel="past meetups"
                    showPageNumbers={false}
                    hideWhenSinglePage
                    filtered={!!searchTerm}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceManagement;
