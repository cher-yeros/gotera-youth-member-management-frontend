import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  CREATE_FAMILY_MEETUP_BATCH,
  GET_FAMILY_MEETUP_BATCHES,
  UPDATE_FAMILY_MEETUP_BATCH,
} from "@/graphql/operations";
import PageHeader from "@/components/shared/PageHeader";
import ListLoadingState from "@/components/shared/ListLoadingState";
import ListEmptyState from "@/components/shared/ListEmptyState";
import ListErrorState from "@/components/shared/ListErrorState";
import ListPagination from "@/components/shared/ListPagination";
import InlineSearchRow from "@/components/shared/InlineSearchRow";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@apollo/client/react";
import { format } from "date-fns";
import {
  BookOpen,
  Calendar,
  CalendarIcon,
  CheckCircle,
  ChevronRight,
  Edit,
  MapPin,
  Plus,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  formatBibleStudyLabel,
  formatBibleStudyLabelAm,
  formatQuestionNumbersInput,
  getBibleStudyProgress,
  parseQuestionNumbers,
} from "@/lib/bibleStudy";

interface FamilyMeetupInBatch {
  id: number;
  family_id: number;
  title: string;
  description: string;
  meetup_date: string;
  location: string;
  bible_study_number?: number | null;
  bible_study_questions?: number[] | null;
  completed_bible_study_questions?: number[];
  is_active: boolean;
  family: {
    id: number;
    name: string;
  };
  attendanceStats?: {
    totalMembers: number;
    presentMembers: number;
    absentMembers: number;
    attendanceRate: number;
  } | null;
  attendances?: Array<{
    id: number;
    is_present: boolean;
  }>;
}

interface FamilyMeetupBatch {
  id: number;
  title: string;
  description: string;
  meetup_date: string;
  location: string;
  bible_study_number?: number | null;
  bible_study_questions?: number[] | null;
  is_active: boolean;
  createdAt: string;
  creator: {
    id: number;
    full_name: string;
  };
  meetups: FamilyMeetupInBatch[];
}

const FamilyMeetupsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [familySearchTerm, setFamilySearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewedBatchId, setViewedBatchId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [batchPendingAction, setBatchPendingAction] =
    useState<FamilyMeetupBatch | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    meetup_date: new Date(),
    bible_study_number: "",
    bible_study_questions: "",
  });

  const { data, loading, error } = useQuery(GET_FAMILY_MEETUP_BATCHES, {
    variables: {
      filter: {},
      pagination: { page: 1, limit: 1000 },
    },
  });

  const [createBatch, { loading: creating }] = useMutation(
    CREATE_FAMILY_MEETUP_BATCH,
    {
      onCompleted: () => {
        toast.success("Meetup batch created for all families!");
        setIsCreateModalOpen(false);
        resetForm();
      },
      onError: (err: {
        message?: string;
        graphQLErrors?: Array<{ message: string }>;
      }) => {
        const errorMessage = err.graphQLErrors?.[0]?.message || err.message;
        toast.error(`Failed to create meetup batch: ${errorMessage}`);
      },
    },
  );

  const [updateBatch, { loading: updating }] = useMutation(
    UPDATE_FAMILY_MEETUP_BATCH,
    {
      onCompleted: () => {
        toast.success("Meetup batch updated for all families!");
        setIsEditModalOpen(false);
        setBatchPendingAction(null);
        resetForm();
      },
      onError: (err: {
        message?: string;
        graphQLErrors?: Array<{ message: string }>;
      }) => {
        const errorMessage = err.graphQLErrors?.[0]?.message || err.message;
        toast.error(`Failed to update meetup batch: ${errorMessage}`);
      },
    },
  );

  const batches =
    (
      data as {
        familyMeetupBatches?: { batches: FamilyMeetupBatch[] };
      }
    )?.familyMeetupBatches?.batches || [];

  const viewedBatch = useMemo(
    () => batches.find((b) => b.id === viewedBatchId) || null,
    [batches, viewedBatchId],
  );

  useEffect(() => {
    if (viewedBatchId && !loading && !viewedBatch) {
      setViewedBatchId(null);
    }
  }, [viewedBatchId, viewedBatch, loading]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      meetup_date: new Date(),
      bible_study_number: "",
      bible_study_questions: "",
    });
  };

  const buildBibleStudyInput = () => {
    const questions = parseQuestionNumbers(formData.bible_study_questions);
    const studyRaw = formData.bible_study_number.trim();
    const studyNumber = studyRaw ? Number(studyRaw) : null;
    if (
      studyRaw &&
      (!Number.isInteger(studyNumber) || (studyNumber ?? 0) <= 0)
    ) {
      toast.error("Bible study number must be a positive integer");
      return null;
    }
    return {
      bible_study_number: studyNumber,
      bible_study_questions: questions.length > 0 ? questions : null,
    };
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleEdit = (batch: FamilyMeetupBatch, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBatchPendingAction(batch);
    setFormData({
      title: batch.title,
      description: batch.description,
      location: batch.location,
      meetup_date: new Date(parseInt(batch.meetup_date)),
      bible_study_number: batch.bible_study_number
        ? String(batch.bible_study_number)
        : "",
      bible_study_questions: formatQuestionNumbersInput(
        batch.bible_study_questions,
      ),
    });
    setIsEditModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    const bibleStudy = buildBibleStudyInput();
    if (!bibleStudy) return;

    try {
      await createBatch({
        variables: {
          input: {
            title: formData.title,
            description: formData.description,
            location: formData.location,
            meetup_date: formData.meetup_date.toISOString(),
            ...bibleStudy,
          },
        },
      });
    } catch (err) {
      console.error("Error creating meetup batch:", err);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !batchPendingAction ||
      !formData.title ||
      !formData.description ||
      !formData.location
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const bibleStudy = buildBibleStudyInput();
    if (!bibleStudy) return;

    try {
      await updateBatch({
        variables: {
          input: {
            id: batchPendingAction.id,
            title: formData.title,
            description: formData.description,
            location: formData.location,
            meetup_date: formData.meetup_date.toISOString(),
            ...bibleStudy,
          },
        },
      });
    } catch (err) {
      console.error("Error updating meetup batch:", err);
    }
  };

  const bibleStudyPreviewEn = formatBibleStudyLabel(
    formData.bible_study_number.trim()
      ? Number(formData.bible_study_number)
      : null,
    parseQuestionNumbers(formData.bible_study_questions),
  );
  const bibleStudyPreviewAm = formatBibleStudyLabelAm(
    formData.bible_study_number.trim()
      ? Number(formData.bible_study_number)
      : null,
    parseQuestionNumbers(formData.bible_study_questions),
  );

  const getStudyProgressBadge = (meetup: FamilyMeetupInBatch) => {
    const progress = getBibleStudyProgress(
      meetup.bible_study_questions,
      meetup.completed_bible_study_questions,
    );
    if (progress.status === "not_assigned") {
      return <Badge variant="outline">No study</Badge>;
    }
    if (progress.status === "complete") {
      return (
        <Badge className="bg-green-600 hover:bg-green-600">Complete</Badge>
      );
    }
    if (progress.status === "in_progress") {
      return <Badge variant="secondary">{progress.label}</Badge>;
    }
    return <Badge variant="outline">Not started</Badge>;
  };

  const renderBibleStudyFields = (idPrefix: string) => (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-study-number`}>Bible Study Number</Label>
          <Input
            id={`${idPrefix}-study-number`}
            type="number"
            min={1}
            value={formData.bible_study_number}
            onChange={(e) =>
              setFormData({ ...formData, bible_study_number: e.target.value })
            }
            placeholder="e.g. 2"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-questions`}>Question Numbers</Label>
          <Input
            id={`${idPrefix}-questions`}
            value={formData.bible_study_questions}
            onChange={(e) =>
              setFormData({
                ...formData,
                bible_study_questions: e.target.value,
              })
            }
            placeholder="e.g. 1, 2, 3"
          />
        </div>
      </div>
      {bibleStudyPreviewEn && (
        <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm space-y-0.5">
          <div className="flex items-center gap-2 font-medium">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            {bibleStudyPreviewEn}
          </div>
          {bibleStudyPreviewAm && (
            <div className="text-muted-foreground pl-6">
              {bibleStudyPreviewAm}
            </div>
          )}
        </div>
      )}
    </>
  );

  const filteredBatches = useCallback(
    (items: FamilyMeetupBatch[]) => {
      if (!searchTerm) return items;
      return items.filter(
        (batch) =>
          batch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          batch.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          batch.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    },
    [searchTerm],
  );

  const formatMeetupDate = (meetupDate: string) => {
    const timestamp = parseInt(meetupDate);
    if (isNaN(timestamp)) return "Invalid Date";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Invalid Date";
    return format(date, "PPP");
  };

  const getBatchAttendanceStats = (batch: FamilyMeetupBatch) => {
    const totalMembers = batch.meetups.reduce(
      (sum, m) => sum + (m.attendanceStats?.totalMembers ?? 0),
      0,
    );
    const presentMembers = batch.meetups.reduce(
      (sum, m) => sum + (m.attendanceStats?.presentMembers ?? 0),
      0,
    );
    const absentMembers = Math.max(0, totalMembers - presentMembers);
    const attendanceRate =
      totalMembers > 0 ? (presentMembers / totalMembers) * 100 : 0;

    return {
      familyCount: batch.meetups.length,
      totalMembers,
      presentMembers,
      absentMembers,
      attendanceRate,
    };
  };

  const getMeetupAttendanceStats = (meetup: FamilyMeetupInBatch) => {
    const stats = meetup.attendanceStats;
    return {
      totalMembers: stats?.totalMembers ?? 0,
      presentMembers: stats?.presentMembers ?? 0,
      absentMembers: stats?.absentMembers ?? 0,
      attendanceRate: stats?.attendanceRate ?? 0,
    };
  };

  const getStatusBadge = (meetupDateStr: string) => {
    const meetupDate = new Date(parseInt(meetupDateStr));
    const now = new Date();

    if (meetupDate.toDateString() === now.toDateString()) {
      return <Badge variant="default">Today</Badge>;
    } else if (meetupDate < now) {
      return <Badge variant="secondary">Past</Badge>;
    } else {
      return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  const filtered = filteredBatches(batches);
  const paginatedBatches = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const familyMeetups = useMemo(() => {
    if (!viewedBatch) return [];
    const meetups = [...viewedBatch.meetups].sort((a, b) =>
      a.family.name.localeCompare(b.family.name),
    );
    if (!familySearchTerm) return meetups;
    return meetups.filter((m) =>
      m.family.name.toLowerCase().includes(familySearchTerm.toLowerCase()),
    );
  }, [viewedBatch, familySearchTerm]);

  // Detail view: one batch → meetups per family
  if (viewedBatch) {
    const stats = getBatchAttendanceStats(viewedBatch);

    return (
      <div className="space-y-6">
        <PageHeader
          title={viewedBatch.title}
          back={{
            label: "Back to batches",
            onClick: () => {
              setViewedBatchId(null);
              setFamilySearchTerm("");
            },
          }}
          subtitle={
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatMeetupDate(viewedBatch.meetup_date)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {viewedBatch.location}
              </span>
              {getStatusBadge(viewedBatch.meetup_date)}
              <Badge variant="outline">{stats.familyCount} families</Badge>
              {formatBibleStudyLabel(
                viewedBatch.bible_study_number,
                viewedBatch.bible_study_questions,
              ) && (
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {formatBibleStudyLabel(
                    viewedBatch.bible_study_number,
                    viewedBatch.bible_study_questions,
                  )}
                </span>
              )}
            </div>
          }
          actions={
            <Button variant="outline" onClick={() => handleEdit(viewedBatch)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Batch
            </Button>
          }
        />

        <InlineSearchRow
          value={familySearchTerm}
          onChange={setFamilySearchTerm}
          placeholder="Search families..."
        />

        <Card className="shadow-brand">
          <CardHeader>
            <CardTitle className="text-brand-gradient">
              Meetups by Family
            </CardTitle>
          </CardHeader>
          <CardContent>
            {familyMeetups.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {familySearchTerm
                  ? "No families match your search"
                  : "No family meetups in this batch"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Family</th>
                      <th className="text-left p-3 font-semibold">Title</th>
                      <th className="text-left p-3 font-semibold">Location</th>
                      <th className="text-left p-3 font-semibold">
                        Attendance
                      </th>
                      <th className="text-left p-3 font-semibold">
                        Bible Study
                      </th>
                      <th className="text-left p-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {familyMeetups.map((meetup) => {
                      const meetupStats = getMeetupAttendanceStats(meetup);
                      return (
                        <tr
                          key={meetup.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-3">
                            <Badge variant="outline">
                              {meetup.family.name}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="font-medium">{meetup.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {meetup.description}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {meetup.location}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-green-600">
                                  {meetupStats.attendanceRate.toFixed(1)}%
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {meetupStats.presentMembers}
                                <XCircle className="h-3 w-3 text-red-600 ml-2" />
                                {meetupStats.absentMembers}
                                <Users className="h-3 w-3 text-muted-foreground ml-2" />
                                {meetupStats.totalMembers}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            {getStudyProgressBadge(meetup)}
                          </td>
                          <td className="p-3">
                            <Badge
                              variant={
                                meetup.is_active ? "default" : "secondary"
                              }
                            >
                              {meetup.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit / Delete dialogs shared below */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Meetup Batch</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Changes apply to every family&apos;s meetup in this batch.
              </p>
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location *</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Meetup Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.meetup_date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.meetup_date
                        ? format(formData.meetup_date, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.meetup_date}
                      onSelect={(date) =>
                        setFormData({
                          ...formData,
                          meetup_date: date || new Date(),
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {renderBibleStudyFields("detail-edit")}
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setBatchPendingAction(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updating}>
                  {updating ? "Updating..." : "Update Batch"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // List view: batches only
  return (
    <div className="space-y-6">
      <PageHeader
        title="Family Meetups Management"
        subtitle={`${batches.length} batches`}
        actions={
          <Button onClick={handleCreate} className="bg-brand-gradient">
            <Plus className="h-4 w-4 mr-2" />
            Create Meetup Batch
          </Button>
        }
      />

      <InlineSearchRow
        value={searchTerm}
        onChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        onClear={() => setCurrentPage(1)}
        placeholder="Search meetup batches..."
      />

      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">
            Meetup Day Batches
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ListLoadingState message="Loading batches..." />
          ) : error ? (
            <ListErrorState
              title="Error Loading Batches"
              message={error.message}
            />
          ) : paginatedBatches.length === 0 ? (
            <ListEmptyState
              icon="📅"
              title={
                searchTerm
                  ? "No meetup batches found matching your search"
                  : "No meetup batches found"
              }
              description={
                searchTerm
                  ? "Try adjusting your search criteria"
                  : "Create a meetup batch to schedule the same meetup for every family"
              }
              secondaryAction={
                searchTerm
                  ? {
                      label: "Clear Filters",
                      onClick: () => {
                        setSearchTerm("");
                        setCurrentPage(1);
                      },
                    }
                  : undefined
              }
              primaryAction={
                !searchTerm
                  ? {
                      label: "Create First Meetup Batch",
                      onClick: handleCreate,
                    }
                  : undefined
              }
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Meetup</th>
                      <th className="text-left p-3 font-semibold">Families</th>
                      <th className="text-left p-3 font-semibold">Date</th>
                      <th className="text-left p-3 font-semibold">Location</th>
                      <th className="text-left p-3 font-semibold">Status</th>
                      <th className="text-left p-3 font-semibold">
                        Attendance
                      </th>
                      <th className="text-left p-3 font-semibold">
                        Created By
                      </th>
                      <th className="text-left p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBatches.map((batch) => {
                      const stats = getBatchAttendanceStats(batch);
                      return (
                        <tr
                          key={batch.id}
                          className="border-b hover:bg-muted/50 cursor-pointer"
                          onClick={() => setViewedBatchId(batch.id)}
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="font-medium">{batch.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {batch.description}
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline">
                              {stats.familyCount} families
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {formatMeetupDate(batch.meetup_date)}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {batch.location}
                            </div>
                          </td>
                          <td className="p-3">
                            {getStatusBadge(batch.meetup_date)}
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-green-600">
                                  {stats.attendanceRate.toFixed(1)}%
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {stats.presentMembers}
                                <XCircle className="h-3 w-3 text-red-600 ml-2" />
                                {stats.absentMembers}
                                <Users className="h-3 w-3 text-muted-foreground ml-2" />
                                {stats.totalMembers}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              {batch.creator.full_name}
                            </div>
                          </td>
                          <td className="p-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => handleEdit(batch, e)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
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
                totalItems={filtered.length}
                onPageChange={(page) => setCurrentPage(page)}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                itemLabel="batches"
                showPageNumbers={false}
                hideWhenSinglePage
                filtered={!!searchTerm}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Meetup Batch</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This creates the same meetup for every family on the selected day.
            </p>
            <div className="space-y-2">
              <Label htmlFor="create-title">Title *</Label>
              <Input
                id="create-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter meetup title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-description">Description *</Label>
              <Textarea
                id="create-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter meetup description"
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-location">Location *</Label>
              <Input
                id="create-location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Enter meetup location"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Meetup Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.meetup_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.meetup_date ? (
                      format(formData.meetup_date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.meetup_date}
                    onSelect={(date) =>
                      setFormData({
                        ...formData,
                        meetup_date: date || new Date(),
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {renderBibleStudyFields("create")}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create Batch"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Meetup Batch</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Changes apply to every family&apos;s meetup in this batch.
            </p>
            <div className="space-y-2">
              <Label htmlFor="list-edit-title">Title *</Label>
              <Input
                id="list-edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="list-edit-description">Description *</Label>
              <Textarea
                id="list-edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="list-edit-location">Location *</Label>
              <Input
                id="list-edit-location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Meetup Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.meetup_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.meetup_date
                      ? format(formData.meetup_date, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.meetup_date}
                    onSelect={(date) =>
                      setFormData({
                        ...formData,
                        meetup_date: date || new Date(),
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {renderBibleStudyFields("list-edit")}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setBatchPendingAction(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updating}>
                {updating ? "Updating..." : "Update Batch"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FamilyMeetupsManagement;
