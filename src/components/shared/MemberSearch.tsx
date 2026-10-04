import { useState, useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ComboBox } from "@/components/ui/combo-box";
import type { ComboBoxOption } from "@/components/ui/combo-box";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, Search } from "lucide-react";
import {
  useGetFamilies,
  useGetStatuses,
  useGetProfessions,
  useGetLocations,
} from "@/hooks/useGraphQL";

interface SearchFilters {
  search: string;
  status_id?: number;
  family_id?: number;
  profession_id?: number;
  location_id?: number;
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
}

const MemberSearch = ({
  onSearch,
  onClear,
  isLoading = false,
  extraFilters,
  extraFiltersActive = false,
  extraFiltersLabel = "Extra filter",
  hideFamilyFilter = false,
}: MemberSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(
    Boolean(extraFilters),
  );

  // Fetch lookup data
  const { data: familiesData } = useGetFamilies();
  const { data: statusesData } = useGetStatuses();
  const { data: professionsData } = useGetProfessions();
  const { data: locationsData } = useGetLocations();

  const families = familiesData?.families || [];
  const statuses = statusesData?.statuses || [];
  const professions = professionsData?.professions || [];
  const locations = locationsData?.locations || [];

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

  // Trigger search when filters change (excluding search term)
  useEffect(() => {
    onSearch({
      status_id: filters.status_id,
      family_id: hideFamilyFilter ? undefined : filters.family_id,
      profession_id: filters.profession_id,
      location_id: filters.location_id,
      search: "",
    });
  }, [
    filters.status_id,
    filters.family_id,
    filters.profession_id,
    filters.location_id,
    hideFamilyFilter,
    onSearch,
  ]);

  const handleInputChange = (
    field: keyof SearchFilters,
    value: string | number,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value === "" ? undefined : value,
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

  const handleSearch = () => {
    onSearch({
      ...filters,
      family_id: hideFamilyFilter ? undefined : filters.family_id,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearFilters = () => {
    setFilters({ search: "" });
    onClear();
  };

  const hasActiveFilters =
    Boolean(filters.search.trim()) ||
    filters.status_id != null ||
    (!hideFamilyFilter && filters.family_id != null) ||
    filters.profession_id != null ||
    filters.location_id != null ||
    extraFiltersActive;

  const advancedFilterCount =
    [
      filters.status_id,
      hideFamilyFilter ? undefined : filters.family_id,
      filters.profession_id,
      filters.location_id,
    ].filter((value) => value != null).length + (extraFiltersActive ? 1 : 0);

  return (
    <Card className="shadow-brand">
      <CardHeader>
        <CardTitle className="text-brand-gradient">Search Members</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search by name, contact, profession, or location..."
              className="flex-1 focus-brand-ring pr-10"
              value={filters.search}
              onChange={(e) => handleInputChange("search", e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button
              type="button"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-brand-50"
              onClick={handleSearch}
              disabled={isLoading}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Button
            type="button"
            variant={showAdvancedFilters ? "default" : "outline"}
            size="icon"
            onClick={() => setShowAdvancedFilters((prev) => !prev)}
            disabled={isLoading}
            aria-label={showAdvancedFilters ? "Hide filters" : "Show filters"}
            aria-expanded={showAdvancedFilters}
            className="relative shrink-0"
          >
            <Filter className="h-4 w-4" />
            {advancedFilterCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1.5 -top-1.5 h-5 min-w-5 rounded-full px-1"
              >
                {advancedFilterCount}
              </Badge>
            )}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              disabled={isLoading}
              className="border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="space-y-4">
            {extraFilters && (
              <div className="rounded-md border p-3">{extraFilters}</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <ComboBox
                  options={getStatusOptions()}
                  value={filters.status_id ?? undefined}
                  onValueChange={(value) =>
                    handleComboBoxChange("status_id", value)
                  }
                  placeholder="All Statuses"
                  disabled={isLoading}
                />
              </div>

              {/* Family Filter */}
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

              {/* Profession Filter */}
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

              {/* Location Filter */}
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
            </div>
          </div>
        )}

        {/* Search Info */}
        {hasActiveFilters && (
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
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberSearch;
