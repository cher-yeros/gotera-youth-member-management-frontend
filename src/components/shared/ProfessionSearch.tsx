import SearchFilterCard from "@/components/shared/SearchFilterCard";
import { useState, useCallback } from "react";

interface ProfessionSearchProps {
  onSearch: (filters: { search: string }) => void;
  onClear: () => void;
  isLoading?: boolean;
}

const ProfessionSearch = ({
  onSearch,
  onClear,
  isLoading = false,
}: ProfessionSearchProps) => {
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
      title="Search Professions"
      isLoading={isLoading}
      hasActiveFilters={hasActiveFilters}
      onClear={handleClear}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      onSearchSubmit={handleSearch}
      searchPlaceholder="Search professions..."
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

export default ProfessionSearch;
