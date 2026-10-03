import { ROLE, ROLE_LABELS, type RoleCode } from "@/lib/roles";

export const ANNOUNCEMENT_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

export const ANNOUNCEMENT_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

export const ANNOUNCEMENT_TARGET_TYPE = {
  ALL: "ALL",
  ROLE: "ROLE",
} as const;

/** Roles that can be selected as announcement audiences (excluding ADMIN). */
export const ANNOUNCEMENT_TARGET_ROLES: RoleCode[] = [
  ROLE.MAIN,
  ROLE.ML,
  ROLE.FL,
  ROLE.FC,
  ROLE.FUC,
  ROLE.FUL,
  ROLE.TT,
  ROLE.FM,
];

export function formatAnnouncementDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatAnnouncementTargets(
  targets: Array<{ target_type: string; target_value?: string | null }>,
): string {
  if (!targets?.length) return "No audience";
  if (targets.some((t) => t.target_type === ANNOUNCEMENT_TARGET_TYPE.ALL)) {
    return "Everyone";
  }
  const labels = targets
    .filter((t) => t.target_type === ANNOUNCEMENT_TARGET_TYPE.ROLE)
    .map((t) => {
      const code = (t.target_value || "").toUpperCase() as RoleCode;
      return ROLE_LABELS[code] || code;
    });
  return labels.length ? labels.join(", ") : "No audience";
}

export function announcementStatusBadgeClass(status: string): string {
  switch (status) {
    case ANNOUNCEMENT_STATUS.PUBLISHED:
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200";
    case ANNOUNCEMENT_STATUS.DRAFT:
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200";
    case ANNOUNCEMENT_STATUS.ARCHIVED:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}
