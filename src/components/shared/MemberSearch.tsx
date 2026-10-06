import { useState, useEffect, type ReactNode } from "react";
import { ComboBox } from "@/components/ui/combo-box";
import type { ComboBoxOption } from "@/components/ui/combo-box";
import SearchFilterCard from "@/components/shared/SearchFilterCard";
import {
  useGetFamilies,
  useGetStatuses,
  useGetProfessions,
  useGetLocations,
  useGetMinistries,
} from "@/hooks/useGraphQL";

const NO_MINISTRY_FILTER = "__none__";

interface SearchFilters {
  search: string;
  status_id?: number;
  family_id?: number;
  profession_id?: number;
  location_id?: number;
  ministry_id?: number;
  no_ministry?: boolean;
}

interface MemberSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
  isLoading?: boolean;
  extraFilters?: ReactNode;
  extraFiltersActive?: boolean;
  /** Label shown in the active-filters summary when extraFiltersActive. */
  extraFiltersLabel?: string;
  /** Hide family combo when filtering unassigned-only externally. */
  hideFamilyFilter?: boolean;
  /** Prefill no-ministry filter (e.g. from URL). */
  initialNoMinistry?: boolean;
}

const MemberSearch = ({
  onSearch,
  onClear,
  isLoading = false,
  extraFilters,
  extraFiltersActive = false,
  extraFiltersLabel = "Extra filter",
  hideFamilyFilter = false,
  initialNoMinistry = false,
}: MemberSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    no_ministry: initialNoMinistry || undefined,
  });
  const [showAdvancedFilters, setShowAdvancedFilters] =
    useState(initialNoMinistry);

  // Fetch lookup data
  const { data: familiesData } = useGetFamilies();
  const { data: statusesData } = useGetStatuses();
  const { data: professionsData } = useGetProfessions();
  const { data: locationsData } = useGetLocations();
  const { data: ministriesData } = useGetMinistries();

  const families = familiesData?.families || [];
  const statuses = statusesData?.statuses || [];
  const professions = professionsData?.professions || [];
  const locations = locationsData?.locations || [];
  const ministries = ministriesData?.ministries || [];

  // Sync external initialNoMinistry (URL) into local state
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      no_ministry: initialNoMinistry || undefined,
      ministry_id: initialNoMinistry ? undefined : prev.ministry_id,
    }));
    if (initialNoMinistry) {
      setShowAdvancedFilters(true);
    }
  }, [initialNoMinistry]);

  // Helper functions to convert data to ComboBox options
  const getStatusOptions = (): ComboBoxOption[] =>
    statuses.map((status) => ({
      value: status.id,
      label: status.name,
    }));

  const getFamilyOptions = (): ComboBoxOption[] =>
    families.map((family) => ({
      value: family.id,
      label: family.name,
    }));

  const getProfessionOptions = (): ComboBoxOption[] =>
    professions.map((profession) => ({
      value: profession.id,
      label: profession.name,
    }));

  const getLocationOptions = (): ComboBoxOption[] =>
    locations.map((location) => ({
      value: location.id,
      label: location.name,
    }));

  const getMinistryOptions = (): ComboBoxOption[] => [
    { value: NO_MINISTRY_FILTER, label: "Ministry Unallocated" },
    ...ministries.map((ministry: { id: number; name: string }) => ({
      value: ministry.id,
      label: ministry.name,
    })),
  ];

  // Trigger search when filters change (excluding search term)
  useEffect(() => {
    onSearch({
      status_id: filters.status_id,
      family_id: hideFamilyFilter ? undefined : filters.family_id,
      profession_id: filters.profession_id,
      location_id: filters.location_id,
      ministry_id: filters.no_ministry ? undefined : filters.ministry_id,
      no_ministry: filters.no_ministry || undefined,
      search: "",
    });
  }, [
    filters.status_id,
    filters.family_id,
    filters.profession_id,
    filters.location_id,
    filters.ministry_id,
    filters.no_ministry,
    hideFamilyFilter,
    onSearch,
  ]);

  const handleInputChange = (
    field: keyof SearchFilters,
    value: string | number,
  ) => {
    setFilters((prev) => ({
      ...prev,
      // Keep search as a string; only optional numeric filters use undefined when cleared
      [field]: field === "search" ? value : value === "" ? undefined : value,
    }));
  };

  const handleComboBoxChange = (
    field: keyof SearchFilters,
    value: string | number | undefined,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMinistryFilterChange = (value: string | number | undefined) => {
    if (value === NO_MINISTRY_FILTER) {
      setFilters((prev) => ({
        ...prev,
        ministry_id: undefined,
        no_ministry: true,
      }));
      return;
    }
    if (value === undefined || value === "") {
      setFilters((prev) => ({
        ...prev,
        ministry_id: undefined,
        no_ministry: undefined,
      }));
      return;
    }
    const numericValue =
      typeof value === "string" ? parseInt(value, 10) : value;
    setFilters((prev) => ({
      ...prev,
      ministry_id: numericValue,
      no_ministry: undefined,
    }));
  };

  const handleSearch = () => {
    onSearch({
      ...filters,
      family_id: hideFamilyFilter ? undefined : filters.family_id,
      ministry_id: filters.no_ministry ? undefined : filters.ministry_id,
      no_ministry: filters.no_ministry || undefined,
    });
  };

const handleClearFilters = () => {
    setFilters({ search: "" });
    onClear();
  };

  const hasActiveFilters =
    Boolean(filters.search?.trim()) ||
    filters.status_id != null ||
    (!hideFamilyFilter && filters.family_id != null) ||
    filters.profession_id != null ||
    filters.location_id != null ||
    filters.ministry_id != null ||
    filters.no_ministry === true ||
    extraFiltersActive;

  const advancedFilterCount =
    [
      filters.status_id,
      hideFamilyFilter ? undefined : filters.family_id,
      filters.profession_id,
      filters.location_id,
      filters.ministry_id,
      filters.no_ministry ? 1 : undefined,
    ].filter((value) => value != null).length + (extraFiltersActive ? 1 : 0);

  return (
    <SearchFilterCard
      title="Search Members"
      isLoading={isLoading}
      hasActiveFilters={hasActiveFilters}
      onClear={handleClearFilters}
      showAdvanced={showAdvancedFilters}
      onToggleAdvanced={() => setShowAdvancedFilters((prev) => !prev)}
      advancedFilterCount={advancedFilterCount}
      searchValue={filters.search ?? ""}
      onSearchChange={(value) => handleInputChange("search", value)}
      onSearchSubmit={handleSearch}
      searchPlaceholder="Search by name, contact, profession, or location..."
      onSearchKeyDown={(e) => {
        if (e.key === "Enter") handleSearch();
      }}
      activeFiltersSummary={
        hasActiveFilters ? (
          <div className="text-sm text-muted-foreground">
            <p>Active filters:</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              {filters.search && <li>Search: "{filters.search}"</li>}
              {extraFiltersActive && <li>{extraFiltersLabel}</li>}
              {filters.status_id && (
                <li>
                  Status:{" "}
                  {statuses.find((s) => s.id === filters.status_id)?.name}
                </li>
              )}
              {!hideFamilyFilter && filters.family_id && (
                <li>
                  Family:{" "}
                  {families.find((f) => f.id === filters.family_id)?.name}
                </li>
              )}
              {filters.profession_id && (
                <li>
                  Profession:{" "}
                  {
                    professions.find((p) => p.id === filters.profession_id)
                      ?.name
                  }
                </li>
              )}
              {filters.location_id && (
                <li>
                  Location:{" "}
                  {locations.find((l) => l.id === filters.location_id)?.name}
                </li>
              )}
              {filters.no_ministry && <li>Ministry: Ministry Unallocated</li>}
              {!filters.no_ministry && filters.ministry_id && (
                <li>
                  Ministry:{" "}
                  {
                    ministries.find(
                      (m: { id: number; name: string }) =>
                        m.id === filters.ministry_id,
                    )?.name
                  }
                </li>
              )}
            </ul>
          </div>
        ) : undefined
      }
    >
      {extraFilters && (
        <div className="rounded-md border p-3">{extraFilters}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Status
          </label>
          <ComboBox
            options={getStatusOptions()}
            value={filters.status_id ?? undefined}
            onValueChange={(value) => handleComboBoxChange("status_id", value)}
            placeholder="All Statuses"
            disabled={isLoading}
          />
        </div>

        {!hideFamilyFilter && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Family
            </label>
            <ComboBox
              options={getFamilyOptions()}
              value={filters.family_id ?? undefined}
              onValueChange={(value) =>
                handleComboBoxChange("family_id", value)
              }
              placeholder="All Families"
              disabled={isLoading}
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Profession
          </label>
          <ComboBox
            options={getProfessionOptions()}
            value={filters.profession_id ?? undefined}
            onValueChange={(value) =>
              handleComboBoxChange("profession_id", value)
            }
            placeholder="All Professions"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Location
          </label>
          <ComboBox
            options={getLocationOptions()}
            value={filters.location_id ?? undefined}
            onValueChange={(value) =>
              handleComboBoxChange("location_id", value)
            }
            placeholder="All Locations"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Ministry
          </label>
          <ComboBox
            options={getMinistryOptions()}
            value={
              filters.no_ministry
                ? NO_MINISTRY_FILTER
                : (filters.ministry_id ?? undefined)
            }
            onValueChange={handleMinistryFilterChange}
            placeholder="All Ministries"
            disabled={isLoading}
          />
        </div>
      </div>
    </SearchFilterCard>
  );
};

export default MemberSearch;
