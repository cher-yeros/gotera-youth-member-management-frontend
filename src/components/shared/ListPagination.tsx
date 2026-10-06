import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const LIST_PAGE_SIZE_ALL = 10000;

interface ListPaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  itemLabel?: string;
  pageSizeOptions?: number[];
  allowShowAll?: boolean;
  showPageNumbers?: boolean;
  /** When true, hide the whole control if only one page and not showing "all" */
  hideWhenSinglePage?: boolean;
  filtered?: boolean;
  className?: string;
}

const ListPagination = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  itemLabel = "items",
  pageSizeOptions = [5, 10, 20, 50],
  allowShowAll = false,
  showPageNumbers = true,
  hideWhenSinglePage = false,
  filtered = false,
  className,
}: ListPaginationProps) => {
  const isShowAll = allowShowAll && pageSize === LIST_PAGE_SIZE_ALL;
  const totalPages = isShowAll
    ? 1
    : Math.max(1, Math.ceil(totalItems / pageSize));

  if (hideWhenSinglePage && totalPages <= 1 && !isShowAll) {
    return null;
  }

  if (totalItems === 0) {
    return null;
  }

  const filteredLabel = filtered ? `filtered ${itemLabel}` : itemLabel;

  const rangeLabel = isShowAll ? (
    <>Showing all {totalItems} {filteredLabel}</>
  ) : (
    <>
      Showing {(currentPage - 1) * pageSize + 1} to{" "}
      {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{" "}
      {filteredLabel}
    </>
  );

  const handlePageSizeChange = (value: string) => {
    if (value === "all") {
      onPageSizeChange(LIST_PAGE_SIZE_ALL);
    } else {
      onPageSizeChange(Number(value));
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mt-6",
        className,
      )}
    >
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">Show:</span>
        <Select
          value={isShowAll ? "all" : pageSize.toString()}
          onValueChange={handlePageSizeChange}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
            {allowShowAll && <SelectItem value="all">All</SelectItem>}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">per page</span>
      </div>

      <div className="text-sm text-muted-foreground">{rangeLabel}</div>

      {totalPages > 1 && (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </Button>

          {showPageNumbers && (
            <div className="flex space-x-1">
              {(() => {
                const maxVisiblePages = 5;
                const halfVisible = Math.floor(maxVisiblePages / 2);
                let startPage = Math.max(1, currentPage - halfVisible);
                const endPage = Math.min(
                  totalPages,
                  startPage + maxVisiblePages - 1,
                );
                if (endPage - startPage + 1 < maxVisiblePages) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }
                const pages = [];
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(i);
                }
                return pages.map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className={`min-w-[40px] ${
                      currentPage === page ? "bg-brand-gradient text-white" : ""
                    }`}
                  >
                    {page}
                  </Button>
                ));
              })()}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListPagination;
