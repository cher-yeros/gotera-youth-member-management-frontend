import type { TeenStatus } from "@/generated/graphql";

/** Statuses that can be set manually on create/edit (not via promote). */
export const EDITABLE_TEEN_STATUSES = [
  "ACTIVE",
  "INACTIVE",
  "MOVED_OUT",
  "MOVED_TO_OTHER_CHURCH",
] as const satisfies readonly TeenStatus[];

export const TEEN_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  PROMOTED: "Promoted",
  INACTIVE: "Inactive",
  MOVED_OUT: "Moved out",
  MOVED_TO_OTHER_CHURCH: "Moved to other church",
};

export const TEEN_STATUS_FILTER_OPTIONS = [
  { value: "ACTIVE", label: TEEN_STATUS_LABELS.ACTIVE },
  { value: "PROMOTED", label: TEEN_STATUS_LABELS.PROMOTED },
  { value: "INACTIVE", label: TEEN_STATUS_LABELS.INACTIVE },
  { value: "MOVED_OUT", label: TEEN_STATUS_LABELS.MOVED_OUT },
  {
    value: "MOVED_TO_OTHER_CHURCH",
    label: TEEN_STATUS_LABELS.MOVED_TO_OTHER_CHURCH,
  },
];

export const formatTeenStatus = (status?: string | null) =>
  (status && TEEN_STATUS_LABELS[status]) || status || "N/A";

export const teenStatusBadgeClass = (status?: string | null) => {
  if (status === "ACTIVE") return "bg-green-100 text-green-800";
  if (status === "PROMOTED") return "bg-blue-100 text-blue-800";
  if (status === "INACTIVE") return "bg-red-100 text-red-800";
  if (status === "MOVED_OUT") return "bg-orange-100 text-orange-800";
  if (status === "MOVED_TO_OTHER_CHURCH") return "bg-amber-100 text-amber-800";
  return "bg-yellow-100 text-yellow-800";
};

export const teenStatusDotClass = (status?: string | null) => {
  if (status === "ACTIVE") return "bg-green-600";
  if (status === "PROMOTED") return "bg-blue-500";
  if (status === "MOVED_OUT") return "bg-orange-500";
  if (status === "MOVED_TO_OTHER_CHURCH") return "bg-amber-500";
  return "bg-red-500";
};
