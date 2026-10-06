import { useState, useEffect } from "react";
import { ComboBox } from "@/components/ui/combo-box";
import type { ComboBoxOption } from "@/components/ui/combo-box";
import SearchFilterCard from "@/components/shared/SearchFilterCard";
import { useGetLocations } from "@/hooks/useGraphQL";
import { useGetTeenClasses } from "@/hooks/useTeenGraphQL";
import type { TeenStatus, TeenagerFilterInput } from "@/generated/graphql";

interface SearchFilters {
  search: string;
  status?: TeenStatus;
  class_id?: number;
  location_id?: number;
  gender?: string;
}

interface TeenagerSearchProps {
  onSearch: (filters: TeenagerFilterInput) => void;
  onClear: () => void;
  isLoading?: boolean;
}

const STATUS_OPTIONS: ComboBoxOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "PROMOTED", label: "Promoted" },
  { value: "INACTIVE", label: "Inactive" },
];

const GENDER_OPTIONS: ComboBoxOption[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const TeenagerSearch = ({
  onSearch,
  onClear,
  isLoading = false,
}: TeenagerSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const { data: classesData } = useGetTeenClasses();
  const { data: locationsData } = useGetLocations();

  const teenClasses =
    (classesData as { teenClasses?: Array<{ id: number; name: string }> })
      ?.teenClasses || [];
  const locations = locationsData?.locations || [];

  const getClassOptions = (): ComboBoxOption[] =>
    teenClasses.map((teenClass) => ({
      value: teenClass.id,
      label: teenClass.name,
    }));

  const getLocationOptions = (): ComboBoxOption[] =>
    locations.map((location) => ({
      value: location.id,
      label: location.name,
    }));

  useEffect(() => {
    onSearch({
      status: filters.status,
      class_id: filters.class_id,
      location_id: filters.location_id,
      gender: filters.gender,
      search: "",
    });
  }, [
    filters.status,
    filters.class_id,
    filters.location_id,
    filters.gender,
    onSearch,
  ]);

  const handleComboBoxChange = (
    field: keyof SearchFilters,
    value: string | number | undefined,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value === "" ? undefined : value,
    }));
  };

  const handleSearch = () => {
    onSearch({
      search: filters.search || undefined,
      status: filters.status,
      class_id: filters.class_id,
      location_id: filters.location_id,
      gender: filters.gender,
    });
  };

  const handleClearFilters = () => {
    setFilters({ search: "" });
    onClear();
  };

  const hasActiveFilters =
    Boolean(filters.search?.trim()) ||
    filters.status != null ||
    filters.class_id != null ||
    filters.location_id != null ||
    filters.gender != null;

  const advancedFilterCount = [
    filters.status,
    filters.class_id,
    filters.location_id,
    filters.gender,
  ].filter((value) => value != null).length;

  return (
    <SearchFilterCard
      title="Search Teenagers"
      isLoading={isLoading}
      hasActiveFilters={hasActiveFilters}
      onClear={handleClearFilters}
      showAdvanced={showAdvancedFilters}
      onToggleAdvanced={() => setShowAdvancedFilters((prev) => !prev)}
      advancedFilterCount={advancedFilterCount}
      searchValue={filters.search ?? ""}
      onSearchChange={(value) =>
        setFilters((prev) => ({ ...prev, search: value }))
      }
      onSearchSubmit={handleSearch}
      searchPlaceholder="Search by name, contact, or guardian..."
      onSearchKeyDown={(e) => {
        if (e.key === "Enter") handleSearch();
      }}
      activeFiltersSummary={
        hasActiveFilters ? (
          <div className="text-sm text-muted-foreground">
            <p>Active filters:</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              {filters.search && <li>Search: "{filters.search}"</li>}
              {filters.status && (
                <li>
                  Status:{" "}
                  {
                    STATUS_OPTIONS.find((s) => s.value === filters.status)
                      ?.label
                  }
                </li>
              )}
              {filters.class_id && (
                <li>
                  Class:{" "}
                  {teenClasses.find((c) => c.id === filters.class_id)?.name}
                </li>
              )}
              {filters.location_id && (
                <li>
                  Location:{" "}
                  {locations.find((l) => l.id === filters.location_id)?.name}
                </li>
              )}
              {filters.gender && (
                <li>
                  Gender:{" "}
                  {
                    GENDER_OPTIONS.find((g) => g.value === filters.gender)
                      ?.label
                  }
                </li>
              )}
            </ul>
          </div>
        ) : undefined
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Status
          </label>
          <ComboBox
            options={STATUS_OPTIONS}
            value={filters.status ?? undefined}
            onValueChange={(value) =>
              handleComboBoxChange("status", value as TeenStatus | undefined)
            }
            placeholder="All Statuses"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Class
          </label>
          <ComboBox
            options={getClassOptions()}
            value={filters.class_id ?? undefined}
            onValueChange={(value) => handleComboBoxChange("class_id", value)}
            placeholder="All Classes"
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
            Gender
          </label>
          <ComboBox
            options={GENDER_OPTIONS}
            value={filters.gender ?? undefined}
            onValueChange={(value) => handleComboBoxChange("gender", value)}
            placeholder="All Genders"
            disabled={isLoading}
          />
        </div>
      </div>
    </SearchFilterCard>
  );
};

export default TeenagerSearch;
