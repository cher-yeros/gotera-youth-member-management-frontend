import type { ListSortBy, SortOrder } from "@/generated/graphql";

export type ListSortPreset =
  | "newest"
  | "oldest"
  | "name_asc"
  | "name_desc"
  | "roll_no";

export type ListSortOption = {
  value: ListSortPreset;
  label: string;
};

export const MEMBER_SORT_OPTIONS: ListSortOption[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name_asc", label: "Name (A–Z)" },
  { value: "name_desc", label: "Name (Z–A)" },
];

export const TEENAGER_SORT_OPTIONS: ListSortOption[] = [
  { value: "roll_no", label: "Roll number" },
  { value: "name_asc", label: "Name (A–Z)" },
  { value: "name_desc", label: "Name (Z–A)" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

export type PaginationSortInput = {
  sort_by?: ListSortBy;
  sort_order?: SortOrder;
};

/** Map a UI preset to GraphQL pagination sort fields. */
export function sortPresetToPagination(
  preset: ListSortPreset,
): PaginationSortInput {
  switch (preset) {
    case "newest":
      return { sort_by: "CREATED_AT", sort_order: "DESC" };
    case "oldest":
      return { sort_by: "CREATED_AT", sort_order: "ASC" };
    case "name_asc":
      return { sort_by: "FULL_NAME", sort_order: "ASC" };
    case "name_desc":
      return { sort_by: "FULL_NAME", sort_order: "DESC" };
    case "roll_no":
      // Omit sort so the teenagers query keeps roll_no + name default order
      return {};
    default:
      return {};
  }
}

type SortablePerson = {
  full_name: string;
  createdAt?: string | Date | null;
  id?: number;
};

type SortableTeen = SortablePerson & {
  roll_no?: string | null;
};

/** Parse createdAt safely; NaN means “use id instead”. */
function createdAtMs(person: SortablePerson): number {
  const raw = person.createdAt as unknown;
  if (raw instanceof Date) {
    const ms = raw.getTime();
    return Number.isNaN(ms) ? Number.NaN : ms;
  }
  if (typeof raw === "number" && Number.isFinite(raw)) {
    // Heuristic: values below 1e12 are unix seconds
    return raw < 1e12 ? raw * 1000 : raw;
  }
  if (typeof raw === "string" && raw.trim()) {
    const ms = Date.parse(raw);
    return Number.isNaN(ms) ? Number.NaN : ms;
  }
  return Number.NaN;
}

function compareNewest(a: SortablePerson, b: SortablePerson): number {
  const aTime = createdAtMs(a);
  const bTime = createdAtMs(b);
  const aOk = !Number.isNaN(aTime);
  const bOk = !Number.isNaN(bTime);
  // Bulk imports often share the same second — always tie-break by id
  if (aOk && bOk && aTime !== bTime) return bTime - aTime;
  return (b.id ?? 0) - (a.id ?? 0);
}

function compareByName(
  a: SortablePerson,
  b: SortablePerson,
  direction: "asc" | "desc",
): number {
  const byName =
    direction === "asc"
      ? a.full_name.localeCompare(b.full_name)
      : b.full_name.localeCompare(a.full_name);
  if (byName !== 0) return byName;
  return (a.id ?? 0) - (b.id ?? 0);
}

/** Client-side sort for offline-filtered member lists (e.g. ministry). */
export function sortMembersByPreset<T extends SortablePerson>(
  members: T[],
  preset: ListSortPreset,
): T[] {
  const list = [...members];
  switch (preset) {
    case "name_asc":
      return list.sort((a, b) => compareByName(a, b, "asc"));
    case "name_desc":
      return list.sort((a, b) => compareByName(a, b, "desc"));
    case "oldest":
      return list.sort((a, b) => compareNewest(b, a));
    case "newest":
    default:
      return list.sort(compareNewest);
  }
}

/** Client-side sort for class detail / offline-filtered teen lists. */
export function sortTeensByPreset<T extends SortableTeen>(
  teens: T[],
  preset: ListSortPreset,
): T[] {
  const list = [...teens];
  switch (preset) {
    case "name_asc":
      return list.sort((a, b) => compareByName(a, b, "asc"));
    case "name_desc":
      return list.sort((a, b) => compareByName(a, b, "desc"));
    case "newest":
      return list.sort(compareNewest);
    case "oldest":
      return list.sort((a, b) => compareNewest(b, a));
    case "roll_no":
    default:
      return list.sort((a, b) => {
        const aRoll = a.roll_no;
        const bRoll = b.roll_no;
        if (aRoll && bRoll) {
          const byRoll = aRoll.localeCompare(bRoll);
          if (byRoll !== 0) return byRoll;
        } else if (aRoll && !bRoll) return -1;
        else if (!aRoll && bRoll) return 1;
        return compareByName(a, b, "asc");
      });
  }
}
