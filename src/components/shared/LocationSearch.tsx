import SearchFilterCard from "@/components/shared/SearchFilterCard";
import { useState, useCallback } from "react";

interface LocationSearchProps {
  onSearch: (filters: { search: string }) => void;
  onClear: () => void;
  isLoading?: boolean;
}

const LocationSearch = ({
  onSearch,
  onClear,
  isLoading = false,
}: LocationSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = useCallback(() => {
    onSearch({ search: searchTerm });
  }, [onSearch, searchTerm]);

  const handleClear = useCallback(() => {
    setSearchTerm("");
    onClear();
  }, [onClear]);

  const hasActiveFilters = Boolean(searchTerm.trim());

  return (
    <SearchFilterCard
      title="Search Locations"
      isLoading={isLoading}
      hasActiveFilters={hasActiveFilters}
      onClear={handleClear}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      onSearchSubmit={handleSearch}
      searchPlaceholder="Search locations..."
      clearPlacement="inline"
      onSearchKeyDown={(e) => {
        if (e.key === "Enter") handleSearch();
      }}
      activeFiltersSummary={
        hasActiveFilters ? (
          <div className="text-sm text-muted-foreground">
            <p>Active filters:</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              {searchTerm && <li>Search: &quot;{searchTerm}&quot;</li>}
            </ul>
          </div>
        ) : undefined
      }
    />
  );
};

export default LocationSearch;
