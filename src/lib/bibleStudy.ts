/** Parse comma-separated question numbers like "1, 2, 3" into sorted unique ints. */
export function parseQuestionNumbers(input: string): number[] {
  if (!input.trim()) return [];
  return [
    ...new Set(
      input
        .split(/[,،፣\s]+/)
        .map((part) => Number(part.trim()))
        .filter((n) => Number.isInteger(n) && n > 0),
    ),
  ].sort((a, b) => a - b);
}

export function formatQuestionNumbersInput(
  questions: number[] | null | undefined,
): string {
  if (!questions || questions.length === 0) return "";
  return questions.join(", ");
}

export function formatBibleStudyLabel(
  studyNumber: number | null | undefined,
  questions: number[] | null | undefined,
): string | null {
  if (!studyNumber && (!questions || questions.length === 0)) return null;
  const study = studyNumber ? `Study ${studyNumber}` : "Study";
  const qs =
    questions && questions.length > 0
      ? `Question number ${questions.join(", ")}`
      : null;
  return qs ? `${study}, ${qs}` : study;
}

export function formatBibleStudyLabelAm(
  studyNumber: number | null | undefined,
  questions: number[] | null | undefined,
): string | null {
  if (!studyNumber && (!questions || questions.length === 0)) return null;
  const study = studyNumber ? `ጥናት ${studyNumber}` : "ጥናት";
  const qs =
    questions && questions.length > 0 ? `ጥያቄ ቁጥር ${questions.join(",")}` : null;
  return qs ? `${study}፣ ${qs}` : study;
}

export type BibleStudyProgressStatus =
  | "not_assigned"
  | "not_started"
  | "in_progress"
  | "complete";

export function getBibleStudyProgress(
  questions: number[] | null | undefined,
  completed: number[] | null | undefined,
): {
  status: BibleStudyProgressStatus;
  done: number;
  total: number;
  label: string;
} {
  const assigned = questions || [];
  const doneList = completed || [];
  if (assigned.length === 0) {
    return { status: "not_assigned", done: 0, total: 0, label: "No study" };
  }
  const assignedSet = new Set(assigned);
  const studied = [...new Set(doneList.filter((q) => assignedSet.has(q)))].sort(
    (a, b) => a - b,
  );
  const done = studied.length;
  const total = assigned.length;
  if (done === 0) {
    return { status: "not_started", done, total, label: "Not started" };
  }
  if (done >= total) {
    return { status: "complete", done, total, label: "Complete" };
  }
  const studiedLabel =
    studied.length === 1
      ? `${studied[0]} is studied`
      : `${studied.join(", ")} are studied`;
  return {
    status: "in_progress",
    done,
    total,
    label: studiedLabel,
  };
}
