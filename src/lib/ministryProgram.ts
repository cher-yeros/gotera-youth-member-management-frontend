export const MINISTRY_PROGRAM_FREQUENCY = {
  WEEKLY: "WEEKLY",
  BI_MONTHLY: "BI_MONTHLY",
  MONTHLY: "MONTHLY",
} as const;

export type MinistryProgramFrequency =
  (typeof MINISTRY_PROGRAM_FREQUENCY)[keyof typeof MINISTRY_PROGRAM_FREQUENCY];

export const MINISTRY_PROGRAM_FREQUENCY_OPTIONS: Array<{
  value: MinistryProgramFrequency;
  label: string;
}> = [
  { value: MINISTRY_PROGRAM_FREQUENCY.WEEKLY, label: "Weekly" },
  { value: MINISTRY_PROGRAM_FREQUENCY.BI_MONTHLY, label: "Bi-monthly" },
  { value: MINISTRY_PROGRAM_FREQUENCY.MONTHLY, label: "Monthly" },
];

export const MINISTRY_PROGRAM_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type MinistryProgramDay = (typeof MINISTRY_PROGRAM_DAYS)[number];

export function formatMinistryProgram(
  frequency?: string | null,
  day?: string | null,
): string | null {
  if (!frequency || !day) return null;
  const freqLabel =
    MINISTRY_PROGRAM_FREQUENCY_OPTIONS.find((o) => o.value === frequency)
      ?.label || frequency;
  return `${freqLabel} on ${day}`;
}
