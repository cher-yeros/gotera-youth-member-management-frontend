import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X } from "lucide-react";

interface SearchFilters {
  search: string;
}

interface FamilySearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
  isLoading?: boolean;
}

const FamilySearch = ({
  onSearch,
  onClear,
  isLoading = false,
}: FamilySearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
  });

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

  const hasActiveFilters = filters.search.trim() !== "";

  return (
    <Card className="shadow-brand">
      <CardHeader>
        <CardTitle className="text-brand-gradient">Search Families</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
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
