import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, X } from "lucide-react";

interface SearchFilterCardProps {
  title: string;
  isLoading?: boolean;
  hasActiveFilters?: boolean;
  onClear?: () => void;
  /** When true, shows the advanced filters section */
  showAdvanced?: boolean;
  onToggleAdvanced?: () => void;
  advancedFilterCount?: number;
  /** Hide the filter toggle button entirely */
  hideAdvancedToggle?: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  /** If provided, shows a search button (manual submit). Otherwise left icon + clear X. */
  onSearchSubmit?: () => void;
  searchPlaceholder?: string;
  onSearchKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Advanced filters / extra filters content */
  children?: ReactNode;
  /** Optional active-filters summary below the form */
  activeFiltersSummary?: ReactNode;
  /** Place clear next to search (inline) or below (footer) */
  clearPlacement?: "inline" | "below";
}

const SearchFilterCard = ({
  title,
  isLoading = false,
  hasActiveFilters = false,
  onClear,
  showAdvanced = false,
  onToggleAdvanced,
  advancedFilterCount = 0,
  hideAdvancedToggle = false,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = "Search...",
  onSearchKeyDown,
  children,
  activeFiltersSummary,
  clearPlacement = "inline",
}: SearchFilterCardProps) => {
  const isManual = Boolean(onSearchSubmit);
  const showFilterToggle = !hideAdvancedToggle && onToggleAdvanced;

  return (
    <Card className="shadow-brand">
      <CardHeader>
        <CardTitle className="text-brand-gradient">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            {!isManual && (
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            )}
            <Input
              placeholder={searchPlaceholder}
              className={
                isManual
                  ? "flex-1 focus-brand-ring pr-10"
                  : "pl-10 focus-brand-ring"
              }
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={onSearchKeyDown}
              disabled={isLoading}
            />
            {isManual ? (
              <Button
                type="button"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-brand-50"
                onClick={onSearchSubmit}
                disabled={isLoading}
              >
                <Search className="h-4 w-4" />
              </Button>
            ) : (
              searchValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => onSearchChange("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )
            )}
          </div>

          {showFilterToggle && (
            <Button
              type="button"
              variant={showAdvanced ? "default" : "outline"}
              size="icon"
              onClick={onToggleAdvanced}
              disabled={isLoading}
              aria-label={showAdvanced ? "Hide filters" : "Show filters"}
              aria-expanded={showAdvanced}
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
          )}

          {hasActiveFilters && onClear && clearPlacement === "inline" && (
            <Button
              variant="outline"
              onClick={onClear}
              disabled={isLoading}
              className="border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              Clear
            </Button>
          )}
        </div>

        {showAdvanced && children && (
          <div className="space-y-4">{children}</div>
        )}

        {hasActiveFilters && onClear && clearPlacement === "below" && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={onClear}
              disabled={isLoading}
              className="border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        )}

        {activeFiltersSummary}
      </CardContent>
    </Card>
  );
};

export default SearchFilterCard;
