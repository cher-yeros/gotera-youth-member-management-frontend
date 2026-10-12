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
