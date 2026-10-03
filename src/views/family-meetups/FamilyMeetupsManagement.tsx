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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ThemeToggle from "@/components/ui/theme-toggle";
import {
  CREATE_FAMILY_MEETUP_BATCH,
  DELETE_FAMILY_MEETUP_BATCH,
  GET_FAMILY_MEETUP_BATCHES,
  UPDATE_FAMILY_MEETUP_BATCH,
} from "@/graphql/operations";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@apollo/client/react";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  CalendarIcon,
  CheckCircle,
  ChevronRight,
  Edit,
  MapPin,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

interface FamilyMeetupInBatch {
  id: number;
  family_id: number;
  title: string;
  description: string;
  meetup_date: string;
  location: string;
  is_active: boolean;
  family: {
    id: number;
    name: string;
  };
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [batchPendingAction, setBatchPendingAction] =
    useState<FamilyMeetupBatch | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    meetup_date: new Date(),
  });

  const { data, loading, error } = useQuery(
    GET_FAMILY_MEETUP_BATCHES,
    {
      variables: {
        filter: {},
        pagination: { page: 1, limit: 1000 },
      },
    },
  );

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

  const [deleteBatch, { loading: deleting }] = useMutation(
    DELETE_FAMILY_MEETUP_BATCH,
    {
      onCompleted: () => {
        toast.success("Meetup batch deleted for all families!");
        setIsDeleteDialogOpen(false);
        setBatchPendingAction(null);
        setViewedBatchId(null);
      },
      onError: (err: {
        message?: string;
        graphQLErrors?: Array<{ message: string }>;
      }) => {
        const errorMessage = err.graphQLErrors?.[0]?.message || err.message;
        toast.error(`Failed to delete meetup batch: ${errorMessage}`);
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
    });
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
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (batch: FamilyMeetupBatch, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBatchPendingAction(batch);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!batchPendingAction) return;
    deleteBatch({ variables: { id: batchPendingAction.id } });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createBatch({
        variables: {
          input: {
            title: formData.title,
            description: formData.description,
            location: formData.location,
            meetup_date: formData.meetup_date.toISOString(),
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

    try {
      await updateBatch({
        variables: {
          input: {
            id: batchPendingAction.id,
            title: formData.title,
            description: formData.description,
            location: formData.location,
            meetup_date: formData.meetup_date.toISOString(),
          },
        },
      });
    } catch (err) {
      console.error("Error updating meetup batch:", err);
    }
  };

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
    const attendances = batch.meetups.flatMap((m) => m.attendances || []);
    const totalMembers = attendances.length;
    const presentMembers = attendances.filter((a) => a.is_present).length;
    const absentMembers = totalMembers - presentMembers;
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
    const attendances = meetup.attendances || [];
    const totalMembers = attendances.length;
    const presentMembers = attendances.filter((a) => a.is_present).length;
    const absentMembers = totalMembers - presentMembers;
    const attendanceRate =
      totalMembers > 0 ? (presentMembers / totalMembers) * 100 : 0;

    return { totalMembers, presentMembers, absentMembers, attendanceRate };
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
  const totalPages = Math.ceil(filtered.length / pageSize);
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
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="px-0 hover:bg-transparent"
              onClick={() => {
                setViewedBatchId(null);
                setFamilySearchTerm("");
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to batches
            </Button>
            <h1 className="text-3xl font-bold text-brand-gradient">
              {viewedBatch.title}
            </h1>
            <p className="text-muted-foreground">{viewedBatch.description}</p>
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
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <ThemeToggle variant="icon" />
            <Button variant="outline" onClick={() => handleEdit(viewedBatch)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Batch
            </Button>
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={() => handleDelete(viewedBatch)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search families..."
            value={familySearchTerm}
            onChange={(e) => setFamilySearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

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

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the meetup batch &quot;
                {batchPendingAction?.title}&quot; for all{" "}
                {batchPendingAction?.meetups.length || 0} families, including
                attendance records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Batch"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // List view: batches only
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-gradient">
            Family Meetups Management
          </h1>
          <p className="text-muted-foreground">
            Day batches for all families — click a batch to see each family (
            {batches.length} total)
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle variant="icon" />
          <Button onClick={handleCreate} className="bg-brand-gradient">
            <Plus className="h-4 w-4 mr-2" />
            Create Meetup Batch
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search meetup batches..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        {searchTerm && (
          <Button
            onClick={() => {
              setSearchTerm("");
              setCurrentPage(1);
            }}
            variant="outline"
          >
            Clear
          </Button>
        )}
      </div>

      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">
            Meetup Day Batches
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading batches...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">
                Error loading batches: {error.message}
              </p>
            </div>
          ) : paginatedBatches.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-brand-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">📅</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm
                  ? "No meetup batches found matching your search"
                  : "No meetup batches found"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Create a meetup batch to schedule the same meetup for every family"}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreate} className="bg-brand-gradient">
                  Create First Meetup Batch
                </Button>
              )}
            </div>
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
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => handleEdit(batch, e)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => handleDelete(batch, e)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mt-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Show:</span>
                    <Select
                      value={pageSize.toString()}
                      onValueChange={(value) => {
                        setPageSize(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, filtered.length)} of{" "}
                    {filtered.length} batches
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
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

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the meetup batch &quot;
              {batchPendingAction?.title}&quot; for all{" "}
              {batchPendingAction?.meetups.length || 0} families, including
              attendance records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Batch"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FamilyMeetupsManagement;
