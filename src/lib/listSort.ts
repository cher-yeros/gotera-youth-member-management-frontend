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

type SortableTeen = {
  full_name: string;
  roll_no?: string | null;
  createdAt?: string | null;
  id?: number;
};

/** Client-side sort for class detail / offline-filtered teen lists. */
export function sortTeensByPreset<T extends SortableTeen>(
  teens: T[],
  preset: ListSortPreset,
): T[] {
  const list = [...teens];
  switch (preset) {
    case "name_asc":
      return list.sort((a, b) => a.full_name.localeCompare(b.full_name));
    case "name_desc":
      return list.sort((a, b) => b.full_name.localeCompare(a.full_name));
    case "newest":
      return list.sort((a, b) => {
        const aTime = a.createdAt ? Date.parse(a.createdAt) : (a.id ?? 0);
        const bTime = b.createdAt ? Date.parse(b.createdAt) : (b.id ?? 0);
        return bTime - aTime;
      });
    case "oldest":
      return list.sort((a, b) => {
        const aTime = a.createdAt ? Date.parse(a.createdAt) : (a.id ?? 0);
        const bTime = b.createdAt ? Date.parse(b.createdAt) : (b.id ?? 0);
        return aTime - bTime;
      });
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
        return a.full_name.localeCompare(b.full_name);
      });
  }
}
