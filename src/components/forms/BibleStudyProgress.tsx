import { useMutation } from "@apollo/client/react";
import { BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UPDATE_FAMILY_MEETUP_BIBLE_STUDY_PROGRESS } from "@/graphql/operations";
import {
  formatBibleStudyLabel,
  formatBibleStudyLabelAm,
  getBibleStudyProgress,
} from "@/lib/bibleStudy";
import { Badge } from "@/components/ui/badge";

interface Props {
  meetupId: number;
  bibleStudyNumber?: number | null;
  bibleStudyQuestions?: number[] | null;
  completedQuestions?: number[] | null;
  readOnly?: boolean;
}

const BibleStudyProgress = ({
  meetupId,
  bibleStudyNumber,
  bibleStudyQuestions,
  completedQuestions,
  readOnly = false,
}: Props) => {
  const questions = bibleStudyQuestions || [];
  const completed = completedQuestions || [];
  const [updateProgress, { loading }] = useMutation(
    UPDATE_FAMILY_MEETUP_BIBLE_STUDY_PROGRESS,
    {
      onError: (err: {
        message?: string;
        graphQLErrors?: Array<{ message: string }>;
      }) => {
        toast.error(
          err.graphQLErrors?.[0]?.message ||
            err.message ||
            "Failed to update bible study progress",
        );
      },
    },
  );

  if (questions.length === 0 && !bibleStudyNumber) {
    return null;
  }

  const labelEn = formatBibleStudyLabel(bibleStudyNumber, questions);
  const labelAm = formatBibleStudyLabelAm(bibleStudyNumber, questions);
  const progress = getBibleStudyProgress(questions, completed);

  const toggleQuestion = async (question: number, checked: boolean) => {
    if (readOnly || loading) return;
    const next = checked
      ? [...new Set([...completed, question])].sort((a, b) => a - b)
      : completed.filter((q) => q !== question);

    const id = Number(meetupId);
    if (!Number.isInteger(id) || id <= 0) {
      toast.error("Invalid meetup — refresh the page and try again");
      return;
    }

    await updateProgress({
      variables: {
        input: {
          meetup_id: id,
          completed_bible_study_questions: next,
        },
      },
    });
  };

  return (
    <div className="rounded-md border bg-muted/30 p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium">
            <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{labelEn}</span>
          </div>
          {labelAm && (
            <p className="text-xs text-muted-foreground mt-0.5 pl-6">
              {labelAm}
            </p>
          )}
        </div>
        {questions.length > 0 && (
          <Badge
            variant={
              progress.status === "complete"
                ? "default"
                : progress.status === "in_progress"
                  ? "secondary"
                  : "outline"
            }
            className={
              progress.status === "complete"
                ? "bg-green-600 hover:bg-green-600 shrink-0"
                : "shrink-0"
            }
          >
            {progress.label}
          </Badge>
        )}
      </div>

      {questions.length > 0 && (
        <div className="flex flex-wrap gap-3 pl-1">
          {questions.map((q) => {
            const isChecked = completed.includes(q);
            const id = `meetup-${meetupId}-q-${q}`;
            return (
              <div key={q} className="flex items-center gap-2">
                <Checkbox
                  id={id}
                  checked={isChecked}
                  disabled={readOnly || loading}
                  onCheckedChange={(value) => toggleQuestion(q, value === true)}
                />
                <Label
                  htmlFor={id}
                  className="text-sm font-normal cursor-pointer"
                >
                  Q{q}
                </Label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BibleStudyProgress;
