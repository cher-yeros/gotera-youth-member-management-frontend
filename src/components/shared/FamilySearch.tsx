import { useState, useEffect, type ReactNode } from "react";
import SearchFilterCard from "@/components/shared/SearchFilterCard";

interface SearchFilters {
  search: string;
}

interface FamilySearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
  isLoading?: boolean;
  extraFilters?: ReactNode;
  extraFiltersActive?: boolean;
}

const FamilySearch = ({
  onSearch,
  onClear,
  isLoading = false,
  extraFilters,
  extraFiltersActive = false,
}: FamilySearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, onSearch]);

  const handleClear = () => {
    setFilters({ search: "" });
    onClear();
  };

  const hasActiveFilters = filters.search.trim() !== "" || extraFiltersActive;

  return (
    <SearchFilterCard
      title="Search Families"
      isLoading={isLoading}
      hasActiveFilters={hasActiveFilters}
      onClear={handleClear}
      showAdvanced={showAdvancedFilters}
      onToggleAdvanced={
        extraFilters ? () => setShowAdvancedFilters((prev) => !prev) : undefined
      }
      advancedFilterCount={extraFiltersActive ? 1 : 0}
      hideAdvancedToggle={!extraFilters}
      searchValue={filters.search}
      onSearchChange={(value) => setFilters({ search: value })}
      searchPlaceholder="Search by family name..."
      clearPlacement="below"
    >
      {extraFilters && (
        <div className="rounded-md border p-3">{extraFilters}</div>
      )}
    </SearchFilterCard>
  );
};

export default FamilySearch;
