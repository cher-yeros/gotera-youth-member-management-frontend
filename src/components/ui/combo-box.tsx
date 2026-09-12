"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ComboBoxOption {
  value: string | number;
  label: string;
}

interface ComboBoxProps {
  options: ComboBoxOption[];
  value?: string | number;
  onValueChange?: (value: string | number | undefined) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  className?: string;
}

const ComboBox = React.forwardRef<HTMLButtonElement, ComboBoxProps>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = "Select option...",
      searchPlaceholder = "Search...",
      emptyText = "No option found.",
      disabled = false,
      loading = false,
      loadingText = "Loading...",
      className,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);

    const selectedOption = options.find((option) => option.value === value);

    return (
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          if (loading || disabled) return;
          setOpen(nextOpen);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-busy={loading}
            className={cn(
              "w-full justify-between",
              !selectedOption && !loading && "text-muted-foreground",
              className,
            )}
            disabled={disabled || loading}
          >
            {loading ? (
              <span className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {loadingText}
              </span>
            ) : selectedOption ? (
              selectedOption.label
            ) : (
              placeholder
            )}
            {!loading && (
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={`${option.label} ${option.value}`}
                    keywords={[option.label]}
                    onSelect={() => {
                      const newValue =
                        option.value === value ? undefined : option.value;
                      onValueChange?.(newValue);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

ComboBox.displayName = "ComboBox";

export { ComboBox };
