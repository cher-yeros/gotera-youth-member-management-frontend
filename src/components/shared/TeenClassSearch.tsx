import { useState, useEffect } from "react";
import SearchFilterCard from "@/components/shared/SearchFilterCard";

interface SearchFilters {
  search: string;
}

interface TeenClassSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
  isLoading?: boolean;
}

const TeenClassSearch = ({
  onSearch,
  onClear,
  isLoading = false,
}: TeenClassSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
  });

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

  const hasActiveFilters = filters.search.trim() !== "";

  return (
    <SearchFilterCard
      title="Search Classes"
      isLoading={isLoading}
      hasActiveFilters={hasActiveFilters}
      onClear={handleClear}
      hideAdvancedToggle
      searchValue={filters.search}
      onSearchChange={(value) => setFilters({ search: value })}
      searchPlaceholder="Search by class name..."
      clearPlacement="below"
    />
  );
};

export default TeenClassSearch;
