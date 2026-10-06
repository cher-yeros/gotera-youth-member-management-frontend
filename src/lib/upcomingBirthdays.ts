import { ACTIVE_STATUS_NAME } from "@/lib/memberCompleteness";

export const UPCOMING_BIRTHDAY_DAYS = 7;

type BirthdayMember = {
  id: number;
  full_name: string;
  birth_date?: string | null;
  status?: { name?: string | null } | null;
};

export type UpcomingBirthday = {
  id: number;
  full_name: string;
  birth_date: string;
  nextBirthday: Date;
  daysUntil: number;
};

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Parse YYYY-MM-DD (or ISO date prefix) as a local calendar date. */
function parseBirthDate(birthDate: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(birthDate.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const parsed = new Date(year, month, day);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month ||
    parsed.getDate() !== day
  ) {
    return null;
  }
  return parsed;
}

function nextBirthdayFrom(birthDate: Date, from: Date): Date {
  const today = startOfLocalDay(from);
  let next = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate(),
  );
  if (next < today) {
    next = new Date(
      today.getFullYear() + 1,
      birthDate.getMonth(),
      birthDate.getDate(),
    );
  }
  return next;
}

export function daysUntilLabel(daysUntil: number): string {
  if (daysUntil === 0) return "Today";
  if (daysUntil === 1) return "Tomorrow";
  return `In ${daysUntil} days`;
}

export function formatBirthdayMonthDay(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/**
 * Active family members whose birthday falls within the next `withinDays` days
 * (including today). Sorted soonest first.
 */
export function getUpcomingBirthdays(
  members: BirthdayMember[],
  withinDays = UPCOMING_BIRTHDAY_DAYS,
  from: Date = new Date(),
): UpcomingBirthday[] {
  const today = startOfLocalDay(from);

  return members
    .filter(
      (member) =>
        member.birth_date &&
        (!member.status?.name || member.status.name === ACTIVE_STATUS_NAME),
    )
    .map((member) => {
      const birthDate = parseBirthDate(member.birth_date!);
      if (!birthDate) return null;
      const nextBirthday = nextBirthdayFrom(birthDate, today);
      const daysUntil = Math.round(
        (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (daysUntil < 0 || daysUntil > withinDays) return null;
      return {
        id: member.id,
        full_name: member.full_name,
        birth_date: member.birth_date!,
        nextBirthday,
        daysUntil,
      };
    })
    .filter((item): item is UpcomingBirthday => item !== null)
    .sort(
      (a, b) =>
        a.daysUntil - b.daysUntil || a.full_name.localeCompare(b.full_name),
    );
}
