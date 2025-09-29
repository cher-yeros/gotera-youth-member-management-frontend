import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X } from "lucide-react";
import { useState, useCallback } from "react";

interface ProfessionSearchProps {
  onSearch: (filters: { search: string }) => void;
  onClear: () => void;
  isLoading?: boolean;
}

const ProfessionSearch: React.FC<ProfessionSearchProps> = ({
  onSearch,
  onClear,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = useCallback(() => {
    onSearch({ search: searchTerm });
  }, [onSearch, searchTerm]);

  const handleClear = useCallback(() => {
    setSearchTerm("");
    onClear();
  }, [onClear]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Card className="shadow-brand">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search professions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 focus-brand-ring"
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-brand-gradient hover:opacity-90 transition-opacity"
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={isLoading}
              className="border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionSearch;
