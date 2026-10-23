import Kenat, { monthNames, toEC, toGC } from "kenat";

export type EthiopianYmd = { year: number; month: number; day: number };
export type GregorianYmd = { year: number; month: number; day: number };

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Format a local Date as Gregorian `YYYY-MM-DD`. */
export function dateToGregorianString(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** Parse Gregorian `YYYY-MM-DD` as a local Date (noon to avoid DST edge cases). */
export function gregorianStringToDate(ymd: string): Date | undefined {
  if (!ymd) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(ymd);
  if (!match) return undefined;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function gregorianStringToParts(
  ymd: string | null | undefined,
): GregorianYmd | null {
  if (!ymd) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(ymd);
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

export function partsToGregorianString(parts: GregorianYmd): string {
  return `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)}`;
}

export function gregorianToEthiopian(parts: GregorianYmd): EthiopianYmd {
  return toEC(parts.year, parts.month, parts.day);
}

export function ethiopianToGregorian(parts: EthiopianYmd): GregorianYmd {
  return toGC(parts.year, parts.month, parts.day);
}

export function ethiopianToGregorianString(parts: EthiopianYmd): string {
  return partsToGregorianString(ethiopianToGregorian(parts));
}

export function gregorianStringToEthiopian(
  ymd: string | null | undefined,
): EthiopianYmd | null {
  const g = gregorianStringToParts(ymd);
  if (!g) return null;
  return gregorianToEthiopian(g);
}

/** Split datetime-local `YYYY-MM-DDTHH:mm` into date + time parts. */
export function splitDatetimeLocal(value: string | null | undefined): {
  date: string;
  time: string;
} {
  if (!value) return { date: "", time: "00:00" };
  const [date = "", timePart = "00:00"] = value.split("T");
  return { date, time: timePart.slice(0, 5) || "00:00" };
}

export function joinDatetimeLocal(date: string, time: string): string {
  if (!date) return "";
  return `${date}T${time || "00:00"}`;
}

export function formatEthiopianDisplay(
  ethiopian: EthiopianYmd | null | undefined,
  options?: { lang?: "english" | "amharic"; showWeekday?: boolean },
): string {
  if (!ethiopian) return "";
  try {
    const k = new Kenat(ethiopian);
    return k.format({
      lang: options?.lang ?? "english",
      showWeekday: options?.showWeekday ?? false,
    });
  } catch {
    const names = monthNames.english;
    const monthName = names[ethiopian.month - 1] ?? String(ethiopian.month);
    return `${monthName} ${ethiopian.day}, ${ethiopian.year}`;
  }
}

export function formatGregorianHint(ymd: string | null | undefined): string {
  const g = gregorianStringToParts(ymd);
  if (!g) return "";
  try {
    const date = new Date(g.year, g.month - 1, g.day);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return ymd ?? "";
  }
}

export function todayEthiopian(): EthiopianYmd {
  return new Kenat().getEthiopian();
}

export const ETHIOPIAN_MONTH_NAMES_EN = monthNames.english as string[];
export const ETHIOPIAN_MONTH_NAMES_AM = monthNames.amharic as string[];

export function daysInEthiopianMonth(year: number, month: number): number {
  if (month === 13) {
    // Pagume: 6 days in leap years (year % 4 === 3), else 5
    return year % 4 === 3 ? 6 : 5;
  }
  return 30;
}
