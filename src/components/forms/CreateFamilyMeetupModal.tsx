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
import { BookOpen, CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CREATE_FAMILY_MEETUP_BATCH } from "@/graphql/operations";
import { toast } from "react-toastify";
import {
  formatBibleStudyLabel,
  formatBibleStudyLabelAm,
  parseQuestionNumbers,
} from "@/lib/bibleStudy";

interface CreateFamilyMeetupModalProps {
  /** @deprecated Kept for call-site compatibility; realtime subscriptions refresh lists. */
  familyId?: number;
  trigger?: React.ReactNode;
}

export const CreateFamilyMeetupModal: React.FC<
  CreateFamilyMeetupModalProps
> = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    meetup_date: new Date(),
    bible_study_number: "",
    bible_study_questions: "",
  });

  const [createFamilyMeetupBatch, { loading }] = useMutation(
    CREATE_FAMILY_MEETUP_BATCH,
    {
      onCompleted: () => {
        toast.success("Meetup batch created for all families!");
        setOpen(false);
        setFormData({
          title: "",
          description: "",
          location: "",
          meetup_date: new Date(),
          bible_study_number: "",
          bible_study_questions: "",
        });
      },
      onError: (error: {
        message?: string;
        graphQLErrors?: Array<{ message: string }>;
      }) => {
        console.error("Meetup batch creation error:", error);

        let errorMessage = "Error creating meetup batch";

        if (error.message && error.message.includes("CombinedGraphQLErrors:")) {
          errorMessage = error.message.replace("CombinedGraphQLErrors: ", "");
        } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          errorMessage = error.graphQLErrors[0].message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage);
      },
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    const questions = parseQuestionNumbers(formData.bible_study_questions);
    const studyRaw = formData.bible_study_number.trim();
    const studyNumber = studyRaw ? Number(studyRaw) : null;
    if (studyRaw && (!Number.isInteger(studyNumber) || (studyNumber ?? 0) <= 0)) {
      toast.error("Bible study number must be a positive integer");
      return;
    }

    try {
      await createFamilyMeetupBatch({
        variables: {
          input: {
            title: formData.title,
            description: formData.description,
            location: formData.location,
            meetup_date: formData.meetup_date.toISOString(),
            bible_study_number: studyNumber,
            bible_study_questions: questions.length > 0 ? questions : null,
          },
        },
      });
    } catch (error) {
      console.log(error);
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
          <DialogTitle>Create Meetup Batch</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Creates the same meetup for every family on the selected day.
          </p>
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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="bible-study-number">Bible Study Number</Label>
              <Input
                id="bible-study-number"
                type="number"
                min={1}
                value={formData.bible_study_number}
                onChange={(e) =>
                  handleInputChange("bible_study_number", e.target.value)
                }
                placeholder="e.g. 2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bible-study-questions">Question Numbers</Label>
              <Input
                id="bible-study-questions"
                value={formData.bible_study_questions}
                onChange={(e) =>
                  handleInputChange("bible_study_questions", e.target.value)
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

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Batch"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
