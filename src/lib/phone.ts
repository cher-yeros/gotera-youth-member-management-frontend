/** Strip country code / leading 0 → local 9xxxxxxxx for the input. */
export function toLocalPhone(value?: string | null): string {
  if (!value) return "";
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("251")) digits = digits.slice(3);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 9);
}

/** Local 9xxxxxxxx → +2519xxxxxxxx; empty → null. */
export function toE164Phone(local: string): string | null {
  const digits = local.replace(/\D/g, "");
  if (!digits) return null;
  if (/^9\d{8}$/.test(digits)) return `+251${digits}`;
  return null;
}

/** Keep only a local Ethiopian mobile (must start with 9, max 9 digits). */
export function sanitizeLocalPhone(value: string): string {
  const clean = value.replace(/\D/g, "");
  if (clean && !clean.startsWith("9")) return "";
  return clean.slice(0, 9);
}

export function isValidLocalPhone(local: string): boolean {
  return /^9\d{8}$/.test(local.replace(/\D/g, ""));
}
