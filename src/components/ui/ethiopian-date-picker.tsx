import * as React from "react";
import Kenat from "kenat";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ETHIOPIAN_MONTH_NAMES_EN,
  ethiopianToGregorianString,
  formatEthiopianDisplay,
  formatGregorianHint,
  gregorianStringToDate,
  gregorianStringToEthiopian,
  joinDatetimeLocal,
  splitDatetimeLocal,
  todayEthiopian,
  type EthiopianYmd,
} from "@/lib/ethiopian-date";
import { cn } from "@/lib/utils";

type CalendarDay = {
  ethiopian: EthiopianYmd;
  gregorian: { year: number; month: number; day: number; display?: string };
  isToday?: boolean;
} | null;

type EthiopianDatePickerBaseProps = {
  id?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  /** Show Gregorian equivalent below the Eth label (default true). */
  showGregorianHint?: boolean;
};

type DateStringProps = EthiopianDatePickerBaseProps & {
  mode?: "date";
  value: string;
  onChange: (value: string) => void;
};

type DatetimeStringProps = EthiopianDatePickerBaseProps & {
  mode: "datetime";
  value: string;
  onChange: (value: string) => void;
};

type DateObjectProps = EthiopianDatePickerBaseProps & {
  mode: "date-object";
  value: Date | undefined;
  onChange: (value: Date | undefined) => void;
};

export type EthiopianDatePickerProps =
  | DateStringProps
  | DatetimeStringProps
  | DateObjectProps;

function dateObjectToString(date: Date | undefined): string {
  if (!date || Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function EthiopianCalendarPanel({
  selectedEth,
  onSelect,
}: {
  selectedEth: EthiopianYmd | null;
  onSelect: (eth: EthiopianYmd) => void;
}) {
  const initial = selectedEth ?? todayEthiopian();
  const [viewYear, setViewYear] = React.useState(initial.year);
  const [viewMonth, setViewMonth] = React.useState(initial.month);

  React.useEffect(() => {
    if (!selectedEth) return;
    setViewYear(selectedEth.year);
    setViewMonth(selectedEth.month);
  }, [selectedEth?.year, selectedEth?.month, selectedEth?.day]);

  const grid = React.useMemo(() => {
    try {
      return Kenat.getMonthCalendar(viewYear, viewMonth, {
        useGeez: false,
        weekdayLang: "english",
      });
    } catch {
      return null;
    }
  }, [viewYear, viewMonth]);

  const yearOptions = React.useMemo(() => {
    const current = todayEthiopian().year;
    const years: number[] = [];
    for (let y = current + 5; y >= current - 120; y -= 1) {
      years.push(y);
    }
    return years;
  }, []);

  const goPrevMonth = () => {
    if (viewMonth <= 1) {
      setViewYear((y) => y - 1);
      setViewMonth(13);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth >= 13) {
      setViewYear((y) => y + 1);
      setViewMonth(1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const isSelected = (day: EthiopianYmd) =>
    !!selectedEth &&
    selectedEth.year === day.year &&
    selectedEth.month === day.month &&
    selectedEth.day === day.day;

  const headers = (grid?.headers as string[] | undefined)?.map((h) =>
    h.slice(0, 2),
  ) ?? ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const days = (grid?.days as CalendarDay[] | undefined) ?? [];

  return (
    <div className="w-[280px] p-3">
      <div className="mb-3 flex items-center justify-between gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={goPrevMonth}
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-1">
          <Select
            value={String(viewMonth)}
            onValueChange={(v) => setViewMonth(Number(v))}
          >
            <SelectTrigger className="h-8 w-[110px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ETHIOPIAN_MONTH_NAMES_EN.map((name, i) => (
                <SelectItem key={name} value={String(i + 1)}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(viewYear)}
            onValueChange={(v) => setViewYear(Number(v))}
          >
            <SelectTrigger className="h-8 w-[84px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {yearOptions.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={goNextMonth}
          aria-label="Next month"
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {headers.map((h, i) => (
          <div
            key={`${h}-${i}`}
            className="text-muted-foreground text-center text-[0.7rem] font-medium"
          >
            {h}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }
          const selected = isSelected(day.ethiopian);
          return (
            <Button
              key={`${day.ethiopian.year}-${day.ethiopian.month}-${day.ethiopian.day}`}
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "aspect-square size-auto h-8 w-full text-sm font-normal",
                day.isToday && !selected && "bg-accent text-accent-foreground",
                selected &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              )}
              onClick={() => onSelect(day.ethiopian)}
            >
              {day.ethiopian.day}
            </Button>
          );
        })}
      </div>

      <div className="mt-3 flex justify-between gap-2 border-t pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => onSelect(todayEthiopian())}
        >
          Today
        </Button>
        <p className="text-muted-foreground self-center text-[0.65rem]">
          Ethiopian calendar
        </p>
      </div>
    </div>
  );
}

function EthiopianDatePicker(props: EthiopianDatePickerProps) {
  const {
    id,
    disabled,
    placeholder = "Pick a date",
    className,
    showGregorianHint = true,
  } = props;

  const [open, setOpen] = React.useState(false);

  const gregorianDateValue = (() => {
    if (props.mode === "datetime") {
      return splitDatetimeLocal(props.value).date;
    }
    if (props.mode === "date-object") {
      return dateObjectToString(props.value);
    }
    return props.value || "";
  })();

  const timeValue =
    props.mode === "datetime" ? splitDatetimeLocal(props.value).time : "00:00";

  const selectedEth = gregorianStringToEthiopian(gregorianDateValue);

  const label = selectedEth ? formatEthiopianDisplay(selectedEth) : placeholder;

  const gregorianHint = showGregorianHint
    ? formatGregorianHint(gregorianDateValue)
    : "";

  const applyEthiopian = (eth: EthiopianYmd) => {
    const gString = ethiopianToGregorianString(eth);
    if (props.mode === "datetime") {
      props.onChange(joinDatetimeLocal(gString, timeValue));
    } else if (props.mode === "date-object") {
      props.onChange(gregorianStringToDate(gString));
    } else {
      props.onChange(gString);
    }
    setOpen(false);
  };

  const handleTimeChange = (nextTime: string) => {
    if (props.mode !== "datetime") return;
    if (!gregorianDateValue) {
      const todayG = ethiopianToGregorianString(todayEthiopian());
      props.onChange(joinDatetimeLocal(todayG, nextTime));
      return;
    }
    props.onChange(joinDatetimeLocal(gregorianDateValue, nextTime));
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedEth && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">{label}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <EthiopianCalendarPanel
            selectedEth={selectedEth}
            onSelect={applyEthiopian}
          />
          {props.mode === "datetime" && (
            <div className="border-t p-3">
              <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                Time
              </label>
              <Input
                type="time"
                value={timeValue}
                onChange={(e) => handleTimeChange(e.target.value)}
                disabled={disabled}
              />
            </div>
          )}
        </PopoverContent>
      </Popover>
      {selectedEth && gregorianHint && (
        <p className="text-muted-foreground text-xs">
          Stored as {gregorianHint} (Gregorian)
        </p>
      )}
    </div>
  );
}

export { EthiopianDatePicker };
