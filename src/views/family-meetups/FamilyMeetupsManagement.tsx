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
  CREATE_FAMILY_MEETUP,
  DELETE_FAMILY_MEETUP,
  GET_FAMILY_MEETUPS,
  UPDATE_FAMILY_MEETUP,
} from "@/graphql/operations";
import { useGetFamilies } from "@/hooks/useGraphQL";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@apollo/client/react";
import { format } from "date-fns";
import {
  Calendar,
  CalendarIcon,
  CheckCircle,
  Edit,
  MapPin,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";

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
  attendances?: Array<{
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

const FamilyMeetupsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMeetup, setSelectedMeetup] = useState<FamilyMeetup | null>(
    null
  );
  const [selectedFamilyId, setSelectedFamilyId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    meetup_date: new Date(),
    family_id: null as number | null,
  });

  const { data: familiesData } = useGetFamilies();
  const families = familiesData?.families || [];

  const { data, loading, error, refetch } = useQuery(GET_FAMILY_MEETUPS, {
    variables: {
      filter: {},
      pagination: { page: 1, limit: 1000 },
    },
  });

  const [createMeetup, { loading: creating }] = useMutation(
    CREATE_FAMILY_MEETUP,
    {
      onCompleted: () => {
        toast.success("Family meetup(s) created successfully!");
        setIsCreateModalOpen(false);
        resetForm();
        refetch();
      },
      onError: (error: {
        message?: string;
        graphQLErrors?: Array<{ message: string }>;
      }) => {
        const errorMessage = error.graphQLErrors?.[0]?.message || error.message;
        toast.error(`Failed to create meetup: ${errorMessage}`);
      },
    }
  );

  const [updateMeetup, { loading: updating }] = useMutation(
    UPDATE_FAMILY_MEETUP,
    {
      onCompleted: () => {
        toast.success("Family meetup updated successfully!");
        setIsEditModalOpen(false);
        setSelectedMeetup(null);
        resetForm();
        refetch();
      },
      onError: (error: {
        message?: string;
        graphQLErrors?: Array<{ message: string }>;
      }) => {
        const errorMessage = error.graphQLErrors?.[0]?.message || error.message;
        toast.error(`Failed to update meetup: ${errorMessage}`);
      },
    }
  );

  const [deleteMeetup, { loading: deleting }] = useMutation(
    DELETE_FAMILY_MEETUP,
    {
      onCompleted: () => {
        toast.success("Family meetup deleted successfully!");
        setIsDeleteDialogOpen(false);
        setSelectedMeetup(null);
        refetch();
      },
      onError: (error: {
        message?: string;
        graphQLErrors?: Array<{ message: string }>;
      }) => {
        const errorMessage = error.graphQLErrors?.[0]?.message || error.message;
        toast.error(`Failed to delete meetup: ${errorMessage}`);
      },
    }
  );

  const meetups =
    (data as { familyMeetups?: { meetups: FamilyMeetup[] } })?.familyMeetups
      ?.meetups || [];

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      meetup_date: new Date(),
      family_id: null,
    });
    setSelectedFamilyId(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleEdit = (meetup: FamilyMeetup) => {
    setSelectedMeetup(meetup);
    setFormData({
      title: meetup.title,
      description: meetup.description,
      location: meetup.location,
      meetup_date: new Date(parseInt(meetup.meetup_date)),
      family_id: meetup.family.id,
    });
    setSelectedFamilyId(meetup.family.id);
    setIsEditModalOpen(true);
  };

  const handleDelete = (meetup: FamilyMeetup) => {
    setSelectedMeetup(meetup);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedMeetup) return;
    deleteMeetup({ variables: { id: selectedMeetup.id } });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createMeetup({
        variables: {
          input: {
            family_id: formData.family_id || undefined,
            title: formData.title,
            description: formData.description,
            location: formData.location,
            meetup_date: formData.meetup_date.toISOString(),
          },
        },
      });
    } catch (error) {
      console.error("Error creating meetup:", error);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedMeetup ||
      !formData.title ||
      !formData.description ||
      !formData.location
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await updateMeetup({
        variables: {
          input: {
            id: selectedMeetup.id,
            title: formData.title,
            description: formData.description,
            location: formData.location,
            meetup_date: formData.meetup_date.toISOString(),
          },
        },
      });
    } catch (error) {
      console.error("Error updating meetup:", error);
    }
  };

  const filteredMeetups = useCallback(
    (meetups: FamilyMeetup[]) => {
      if (!searchTerm) return meetups;
      return meetups.filter(
        (meetup) =>
          meetup.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meetup.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meetup.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meetup.family.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    [searchTerm]
  );

  const formatMeetupDate = (meetupDate: string) => {
    const timestamp = parseInt(meetupDate);
    if (isNaN(timestamp)) return "Invalid Date";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Invalid Date";
    return format(date, "PPP");
  };

  const getAttendanceStats = (meetup: FamilyMeetup) => {
    const attendances = meetup.attendances || [];
    const totalMembers = attendances.length;
    const presentMembers = attendances.filter((a) => a.is_present).length;
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
    const meetupDate = new Date(parseInt(meetup.meetup_date));
    const now = new Date();

    if (meetupDate < now) {
      return <Badge variant="secondary">Past</Badge>;
    } else if (meetupDate.toDateString() === now.toDateString()) {
      return <Badge variant="default">Today</Badge>;
    } else {
      return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  const filtered = filteredMeetups(meetups);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedMeetups = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-gradient">
            Family Meetups Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage family meetups for all families ({meetups.length}{" "}
            total)
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle variant="icon" />
          <Button onClick={handleCreate} className="bg-brand-gradient">
            <Plus className="h-4 w-4 mr-2" />
            Create Meetup
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search meetups..."
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

      {/* Meetups Table */}
      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">
            All Family Meetups
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading meetups...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">
                Error loading meetups: {error.message}
              </p>
            </div>
          ) : paginatedMeetups.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-brand-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">📅</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm
                  ? "No meetups found matching your search"
                  : "No meetups found"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Create a new meetup to get started"}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreate} className="bg-brand-gradient">
                  Create First Meetup
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
                      <th className="text-left p-3 font-semibold">Family</th>
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
                    {paginatedMeetups.map((meetup) => {
                      const stats = getAttendanceStats(meetup);
                      return (
                        <tr
                          key={meetup.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-3">
                            <div className="font-medium">{meetup.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {meetup.description}
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline">
                              {meetup.family.name}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {formatMeetupDate(meetup.meetup_date)}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {meetup.location}
                            </div>
                          </td>
                          <td className="p-3">{getStatusBadge(meetup)}</td>
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
                              {meetup.creator.full_name}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(meetup)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(meetup)}
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

              {/* Pagination */}
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
                    {filtered.length} meetups
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
                    <div className="flex space-x-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const page =
                            currentPage <= 3
                              ? i + 1
                              : currentPage >= totalPages - 2
                              ? totalPages - 4 + i
                              : currentPage - 2 + i;
                          if (page < 1 || page > totalPages) return null;
                          return (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className={
                                currentPage === page
                                  ? "bg-brand-gradient text-white"
                                  : ""
                              }
                            >
                              {page}
                            </Button>
                          );
                        }
                      )}
                    </div>
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

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Family Meetup</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-family">Family (Optional)</Label>
              <Select
                value={selectedFamilyId?.toString() || "all"}
                onValueChange={(value) => {
                  if (value === "all") {
                    setSelectedFamilyId(null);
                    setFormData({ ...formData, family_id: null });
                  } else {
                    const familyId = parseInt(value);
                    setSelectedFamilyId(familyId);
                    setFormData({ ...formData, family_id: familyId });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a family or leave for all families" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Families</SelectItem>
                  {families.map((family) => (
                    <SelectItem key={family.id} value={family.id.toString()}>
                      {family.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Leave as "All Families" to create meetups for every family
              </p>
            </div>

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
                      !formData.meetup_date && "text-muted-foreground"
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
                {creating ? "Creating..." : "Create Meetup"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Family Meetup</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter meetup title"
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
                placeholder="Enter meetup description"
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
                      !formData.meetup_date && "text-muted-foreground"
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
                  setIsEditModalOpen(false);
                  setSelectedMeetup(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updating}>
                {updating ? "Updating..." : "Update Meetup"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the meetup "{selectedMeetup?.title}"
              for family "{selectedMeetup?.family.name}". This action cannot be
              undone and will also delete all associated attendance records.
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
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FamilyMeetupsManagement;
