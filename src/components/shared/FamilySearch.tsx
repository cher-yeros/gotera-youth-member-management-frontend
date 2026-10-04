import { useState, useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, X } from "lucide-react";

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

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, onSearch]);

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClear = () => {
    setFilters({ search: "" });
    onClear();
  };

  const hasActiveFilters = filters.search.trim() !== "" || extraFiltersActive;

  return (
    <Card className="shadow-brand">
      <CardHeader>
        <CardTitle className="text-brand-gradient">Search Families</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by family name..."
                className="pl-10 focus-brand-ring"
                value={filters.search}
                onChange={(e) => handleInputChange("search", e.target.value)}
                disabled={isLoading}
              />
              {filters.search && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => handleInputChange("search", "")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {extraFilters && (
              <Button
                type="button"
                variant={showAdvancedFilters ? "default" : "outline"}
                size="icon"
                onClick={() => setShowAdvancedFilters((prev) => !prev)}
                disabled={isLoading}
                aria-label={
                  showAdvancedFilters ? "Hide filters" : "Show filters"
                }
                aria-expanded={showAdvancedFilters}
                className="relative shrink-0"
              >
                <Filter className="h-4 w-4" />
                {extraFiltersActive && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1.5 -top-1.5 h-5 min-w-5 rounded-full px-1"
                  >
                    1
                  </Badge>
                )}
              </Button>
            )}
          </div>

          {extraFilters && showAdvancedFilters && (
            <div className="rounded-md border p-3">{extraFilters}</div>
          )}

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={isLoading}
                className="border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FamilySearch;
