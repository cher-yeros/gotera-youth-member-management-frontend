import { AttendanceModal } from "@/components/forms/AttendanceModal";
import { CreateFamilyMeetupModal } from "@/components/forms/CreateFamilyMeetupModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "@/components/ui/theme-toggle";
import { GET_FAMILY_MEETUPS } from "@/graphql/operations";
import { useAuth } from "@/redux/useAuth";
import { useQuery } from "@apollo/client/react";
import { format } from "date-fns";
import { CheckCircle, Search, TrendingUp, Users, XCircle } from "lucide-react";
import React, { useState, useCallback } from "react";

interface FamilyMeetup {
  id: number;
  title: string;
  description: string;
  meetup_date: string;
  location: string;
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
  const currentDate = new Date();

  const upcomingMeetups = meetups.filter((meetup: FamilyMeetup) => {
    // Handle Unix timestamp (milliseconds) with validation
    const timestamp = parseInt(meetup.meetup_date);
    if (isNaN(timestamp)) {
      console.error(`Invalid timestamp: ${meetup.meetup_date}`);
      return false;
    }

    const meetupDate = new Date(timestamp);
    if (isNaN(meetupDate.getTime())) {
      console.error(`Invalid date from timestamp: ${timestamp}`);
      return false;
    }

    const isUpcoming = meetupDate >= currentDate;

    return isUpcoming;
  });

  const pastMeetups = meetups.filter((meetup: FamilyMeetup) => {
    const timestamp = parseInt(meetup.meetup_date);
    if (isNaN(timestamp)) return false;

    const meetupDate = new Date(timestamp);
    if (isNaN(meetupDate.getTime())) return false;

    return meetupDate < currentDate;
  });
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
          meetup.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    [searchTerm]
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
    const totalMembers = meetup.attendances.length;
    const presentMembers = meetup.attendances.filter(
      (a) => a.is_present
    ).length;
    const absentMembers = totalMembers - presentMembers;
    const attendanceRate =
      totalMembers > 0 ? (presentMembers / totalMembers) * 100 : 0;

    return {
      totalMembers,
      presentMembers,
      absentMembers,
      attendanceRate,
    };
  };

  const getStatusBadge = (meetup: FamilyMeetup) => {
    const meetupDate = new Date(meetup.meetup_date);
    const now = new Date();

    if (meetupDate < now) {
      return <Badge variant="secondary">Past</Badge>;
    } else if (meetupDate.toDateString() === now.toDateString()) {
      return <Badge variant="default">Today</Badge>;
    } else {
      return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  if (!familyId) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-gradient">
              Attendance Management
            </h1>
            <p className="text-muted-foreground">
              Manage family meetups and track member attendance
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
                No Family Assigned
              </h3>
              <p className="text-muted-foreground mb-4">
                You need to be assigned to a family to manage attendance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-gradient">
            Attendance Management
          </h1>
          <p className="text-muted-foreground">
            Manage family meetups and track member attendance ({meetups.length}{" "}
            total)
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle variant="icon" />
          <CreateFamilyMeetupModal familyId={familyId} />
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search meetups..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchTerm && (
          <Button
            onClick={handleClearSearch}
            variant="outline"
            className="border-primary hover:bg-primary hover:text-primary-foreground"
          >
            Clear
          </Button>
        )}
      </div>

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
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">
                    Loading meetups...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="h-16 w-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-red-600">
                    Error Loading Meetups
                  </h3>
                  <p className="text-muted-foreground mb-4">{error.message}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-brand-gradient hover:opacity-90 transition-opacity"
                  >
                    Retry
                  </Button>
                </div>
              ) : filteredMeetups(upcomingMeetups).length === 0 ? (
                <div className="text-center py-12">
                  <div className="h-16 w-16 bg-brand-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl">📅</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm
                      ? "No upcoming meetups found matching your search"
                      : "No upcoming meetups found"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "Try adjusting your search criteria or clear the filters to see all meetups."
                      : "Create a new meetup to get started with attendance tracking."}
                  </p>
                  {searchTerm ? (
                    <Button
                      onClick={handleClearSearch}
                      variant="outline"
                      className="border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Clear Filters
                    </Button>
                  ) : (
                    <CreateFamilyMeetupModal
                      familyId={familyId}
                      trigger={
                        <Button className="bg-brand-gradient hover:opacity-90 transition-opacity">
                          Create First Meetup
                        </Button>
                      }
                    />
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Mobile Card View - Hidden on desktop */}
                  <div className="block md:hidden space-y-3">
                    {(() => {
                      const paginatedMeetups = filteredMeetups(
                        upcomingMeetups
                      ).slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize
                      );
                      return paginatedMeetups.map((meetup: FamilyMeetup) => {
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

                                {/* Action buttons */}
                                <div className="flex space-x-2 pt-2">
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
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      });
                    })()}
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
                            Attendance
                          </th>
                          <th className="text-left p-3 font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const paginatedMeetups = filteredMeetups(
                            upcomingMeetups
                          ).slice(
                            (currentPage - 1) * pageSize,
                            currentPage * pageSize
                          );
                          return paginatedMeetups.map(
                            (meetup: FamilyMeetup) => {
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
                                  </td>
                                </tr>
                              );
                            }
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {(() => {
                    const totalPages = Math.ceil(
                      filteredMeetups(upcomingMeetups).length / pageSize
                    );
                    if (totalPages <= 1) return null;

                    return (
                      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mt-6">
                        {/* Page size selector */}
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            Show:
                          </span>
                          <Select
                            value={pageSize.toString()}
                            onValueChange={(value) => {
                              setPageSize(Number(value));
                              setCurrentPage(1);
                            }}
                          >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                          </Select>
                          <span className="text-sm text-muted-foreground">
                            per page
                          </span>
                        </div>

                        {/* Pagination info */}
                        <div className="text-sm text-muted-foreground">
                          Showing {(currentPage - 1) * pageSize + 1} to{" "}
                          {Math.min(
                            currentPage * pageSize,
                            filteredMeetups(upcomingMeetups).length
                          )}{" "}
                          of {filteredMeetups(upcomingMeetups).length} upcoming
                          meetups
                        </div>

                        {/* Pagination controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                          >
                            Previous
                          </Button>

                          <div className="flex space-x-1">
                            {(() => {
                              const maxVisiblePages = 5;
                              const halfVisible = Math.floor(
                                maxVisiblePages / 2
                              );
                              let startPage = Math.max(
                                1,
                                currentPage - halfVisible
                              );
                              const endPage = Math.min(
                                totalPages,
                                startPage + maxVisiblePages - 1
                              );
                              if (endPage - startPage + 1 < maxVisiblePages) {
                                startPage = Math.max(
                                  1,
                                  endPage - maxVisiblePages + 1
                                );
                              }
                              const pages = [];
                              for (let i = startPage; i <= endPage; i++) {
                                pages.push(i);
                              }
                              return pages.map((page) => (
                                <Button
                                  key={page}
                                  variant={
                                    currentPage === page ? "default" : "outline"
                                  }
                                  size="sm"
                                  onClick={() => handlePageChange(page)}
                                  className={
                                    currentPage === page
                                      ? "bg-brand-gradient text-white"
                                      : ""
                                  }
                                >
                                  {page}
                                </Button>
                              ));
                            })()}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4 mt-4">
              {filteredMeetups(pastMeetups).length === 0 ? (
                <div className="text-center py-12">
                  <div className="h-16 w-16 bg-brand-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl">📅</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm
                      ? "No past meetups found matching your search"
                      : "No past meetups found"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "Try adjusting your search criteria or clear the filters to see all meetups."
                      : "Past meetups will appear here once they are completed."}
                  </p>
                  {searchTerm && (
                    <Button
                      onClick={handleClearSearch}
                      variant="outline"
                      className="border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Mobile Card View - Hidden on desktop */}
                  <div className="block md:hidden space-y-3">
                    {(() => {
                      const paginatedMeetups = filteredMeetups(
                        pastMeetups
                      ).slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize
                      );
                      return paginatedMeetups.map((meetup: FamilyMeetup) => {
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
                              </div>
                            </CardContent>
                          </Card>
                        );
                      });
                    })()}
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
                            Final Attendance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const paginatedMeetups = filteredMeetups(
                            pastMeetups
                          ).slice(
                            (currentPage - 1) * pageSize,
                            currentPage * pageSize
                          );
                          return paginatedMeetups.map(
                            (meetup: FamilyMeetup) => {
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
                            }
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {(() => {
                    const totalPages = Math.ceil(
                      filteredMeetups(pastMeetups).length / pageSize
                    );
                    if (totalPages <= 1) return null;

                    return (
                      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mt-6">
                        {/* Page size selector */}
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            Show:
                          </span>
                          <Select
                            value={pageSize.toString()}
                            onValueChange={(value) => {
                              setPageSize(Number(value));
                              setCurrentPage(1);
                            }}
                          >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                          </Select>
                          <span className="text-sm text-muted-foreground">
                            per page
                          </span>
                        </div>

                        {/* Pagination info */}
                        <div className="text-sm text-muted-foreground">
                          Showing {(currentPage - 1) * pageSize + 1} to{" "}
                          {Math.min(
                            currentPage * pageSize,
                            filteredMeetups(pastMeetups).length
                          )}{" "}
                          of {filteredMeetups(pastMeetups).length} past meetups
                        </div>

                        {/* Pagination controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                          >
                            Previous
                          </Button>

                          <div className="flex space-x-1">
                            {(() => {
                              const maxVisiblePages = 5;
                              const halfVisible = Math.floor(
                                maxVisiblePages / 2
                              );
                              let startPage = Math.max(
                                1,
                                currentPage - halfVisible
                              );
                              const endPage = Math.min(
                                totalPages,
                                startPage + maxVisiblePages - 1
                              );
                              if (endPage - startPage + 1 < maxVisiblePages) {
                                startPage = Math.max(
                                  1,
                                  endPage - maxVisiblePages + 1
                                );
                              }
                              const pages = [];
                              for (let i = startPage; i <= endPage; i++) {
                                pages.push(i);
                              }
                              return pages.map((page) => (
                                <Button
                                  key={page}
                                  variant={
                                    currentPage === page ? "default" : "outline"
                                  }
                                  size="sm"
                                  onClick={() => handlePageChange(page)}
                                  className={
                                    currentPage === page
                                      ? "bg-brand-gradient text-white"
                                      : ""
                                  }
                                >
                                  {page}
                                </Button>
                              ));
                            })()}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
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
