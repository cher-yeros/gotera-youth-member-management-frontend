import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ListSortOption, ListSortPreset } from "@/lib/listSort";
import { cn } from "@/lib/utils";

interface ListSortSelectProps {
  value: ListSortPreset;
  onChange: (value: ListSortPreset) => void;
  options: ListSortOption[];
  disabled?: boolean;
  className?: string;
}

const ListSortSelect = ({
  value,
  onChange,
  options,
  disabled = false,
  className,
}: ListSortSelectProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        Sort:
      </span>
      <Select
        value={value}
        onValueChange={(next) => onChange(next as ListSortPreset)}
        disabled={disabled}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ListSortSelect;
