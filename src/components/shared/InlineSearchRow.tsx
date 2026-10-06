import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface InlineSearchRowProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

const InlineSearchRow = ({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  className,
  inputClassName,
}: InlineSearchRowProps) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className={cn("relative flex-1 max-w-sm", inputClassName)}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
        />
      </div>
      {value && (
        <Button
          onClick={() => {
            onChange("");
            onClear?.();
          }}
          variant="outline"
          className="border-primary hover:bg-primary hover:text-primary-foreground"
        >
          Clear
        </Button>
      )}
    </div>
  );
};

export default InlineSearchRow;
