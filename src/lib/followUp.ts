import { format } from "date-fns";

export const FOLLOW_UP_STATUS = {
  NEW: "NEW",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  JOINED: "JOINED",
  NOT_INTERESTED: "NOT_INTERESTED",
  UNREACHABLE: "UNREACHABLE",
  MOVED_OUT: "MOVED_OUT",
} as const;

export const FOLLOW_UP_STATUS_LABELS: Record<string, string> = {
  NEW: "Unassigned",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  JOINED: "Promoted to Family",
  NOT_INTERESTED: "Not Interested",
  UNREACHABLE: "Unreachable",
  MOVED_OUT: "Moved Out",
};

export const FOLLOW_UP_PRIORITY = {
  LOW: "LOW",
  NORMAL: "NORMAL",
  HIGH: "HIGH",
} as const;

export const FOLLOW_UP_SOURCE = {
  SUNDAY_SERVICE: "SUNDAY_SERVICE",
  FRIEND: "FRIEND",
  EVENT: "EVENT",
  OTHER: "OTHER",
} as const;

export const FOLLOW_UP_SOURCE_LABELS: Record<string, string> = {
  SUNDAY_SERVICE: "Sunday Service",
  FRIEND: "Friend",
  EVENT: "Event",
  OTHER: "Other",
};

export const FOLLOW_UP_CONTACT_TYPES = {
  CALL: "CALL",
  VISIT: "VISIT",
  SMS: "SMS",
  WHATSAPP: "WHATSAPP",
  OTHER: "OTHER",
} as const;

export const FOLLOW_UP_CONTACT_OUTCOMES = {
  REACHED: "REACHED",
  NO_ANSWER: "NO_ANSWER",
  WRONG_NUMBER: "WRONG_NUMBER",
  CALLBACK_REQUESTED: "CALLBACK_REQUESTED",
  VISITED: "VISITED",
  DECLINED: "DECLINED",
} as const;

export const CLOSE_STATUSES = [
  FOLLOW_UP_STATUS.NOT_INTERESTED,
  FOLLOW_UP_STATUS.UNREACHABLE,
  FOLLOW_UP_STATUS.MOVED_OUT,
] as const;

export function isFollowUpOverdue(
  nextFollowUpAt?: string | null,
  status?: string | null,
): boolean {
  if (!nextFollowUpAt) return false;
  if (
    status &&
    [
      FOLLOW_UP_STATUS.JOINED,
      FOLLOW_UP_STATUS.NOT_INTERESTED,
      FOLLOW_UP_STATUS.UNREACHABLE,
      FOLLOW_UP_STATUS.MOVED_OUT,
    ].includes(status as any)
  ) {
    return false;
  }
  const date = new Date(nextFollowUpAt);
  if (Number.isNaN(date.getTime())) return false;
  return date < new Date();
}

/** Safe date format — returns fallback when value is missing/invalid. */
export function formatFollowUpDate(
  value?: string | null,
  pattern = "MMM d, yyyy HH:mm",
  fallback = "—",
): string {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return format(date, pattern);
}

export function followUpStatusBadgeClass(status: string): string {
  switch (status) {
    case FOLLOW_UP_STATUS.NEW:
      return "bg-blue-100 text-blue-800";
    case FOLLOW_UP_STATUS.ASSIGNED:
      return "bg-indigo-100 text-indigo-800";
    case FOLLOW_UP_STATUS.IN_PROGRESS:
      return "bg-amber-100 text-amber-800";
    case FOLLOW_UP_STATUS.JOINED:
      return "bg-green-100 text-green-800";
    case FOLLOW_UP_STATUS.NOT_INTERESTED:
      return "bg-gray-100 text-gray-800";
    case FOLLOW_UP_STATUS.UNREACHABLE:
      return "bg-orange-100 text-orange-800";
    case FOLLOW_UP_STATUS.MOVED_OUT:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function followUpPriorityBadgeClass(priority: string): string {
  switch (priority) {
    case FOLLOW_UP_PRIORITY.HIGH:
      return "bg-red-100 text-red-800";
    case FOLLOW_UP_PRIORITY.LOW:
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-emerald-100 text-emerald-800";
  }
}
