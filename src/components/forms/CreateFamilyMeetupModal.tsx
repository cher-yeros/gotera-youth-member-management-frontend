import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CREATE_FAMILY_MEETUP, GET_FAMILY_MEETUPS } from "@/graphql/operations";
import { toast } from "react-toastify";

interface CreateFamilyMeetupModalProps {
  familyId: number;
  trigger?: React.ReactNode;
}

export const CreateFamilyMeetupModal: React.FC<
  CreateFamilyMeetupModalProps
> = ({ familyId, trigger }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    meetup_date: new Date(),
  });

  const [createFamilyMeetup, { loading }] = useMutation(CREATE_FAMILY_MEETUP, {
    refetchQueries: [
      {
        query: GET_FAMILY_MEETUPS,
        variables: {
          filter: { family_id: familyId },
          pagination: { page: 1, limit: 10 },
        },
      },
    ],
    onCompleted: () => {
      toast.success("Family meetup created successfully!");
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        location: "",
        meetup_date: new Date(),
      });
    },
    onError: (error: {
      message?: string;
      graphQLErrors?: Array<{ message: string }>;
    }) => {
      console.error("Meetup creation error:", error);

      // Get the error message from different error types
      let errorMessage = "Error creating meetup";

      // Handle CombinedGraphQLErrors
      if (error.message && error.message.includes("CombinedGraphQLErrors:")) {
        errorMessage = error.message.replace("CombinedGraphQLErrors: ", "");
      }
      // Handle regular GraphQL errors
      else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        errorMessage = error.graphQLErrors[0].message;
      }
      // Handle regular error messages
      else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createFamilyMeetup({
        variables: {
          input: {
            family_id: familyId,
            title: formData.title,
            description: formData.description,
            location: formData.location,
            meetup_date: formData.meetup_date.toISOString(),
          },
        },
      });
    } catch (error) {
      console.log(error);
      // Handle CombinedGraphQLErrors

      // } else if (error instanceof Error && error.message.includes("CombinedGraphQLErrors:")) {
      //   toast.error(error.message.replace("CombinedGraphQLErrors: ", ""));
      // } else {
      //   toast.error("Error creating meetup");
      // }
    }
  };

  const handleInputChange = (field: string, value: string | Date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Meetup
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Family Meetup</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter meetup title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter meetup description"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
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
                <Calendar
                  mode="single"
                  selected={formData.meetup_date}
                  onSelect={(date) =>
                    handleInputChange("meetup_date", date || new Date())
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
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Meetup"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
