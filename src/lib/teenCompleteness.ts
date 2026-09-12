export type TeenLike = {
  contact_no?: string | null;
  gender?: string | null;
  birth_date?: string | null;
  location_id?: number | null;
  guardian_name?: string | null;
  guardian_contact?: string | null;
  guardian_relationship?: string | null;
  class_id?: number | null;
  status?: string | null;
};

export function getTeenCompleteness(teen: TeenLike) {
  const missing: string[] = [];
  if (!teen.contact_no?.trim()) missing.push("Contact");
  if (!teen.gender?.trim()) missing.push("Gender");
  if (!teen.birth_date) missing.push("Birth date");
  if (!teen.location_id) missing.push("Address");
  if (!teen.guardian_name?.trim()) missing.push("Guardian name");
  if (!teen.guardian_contact?.trim()) missing.push("Guardian contact");
  if (!teen.guardian_relationship?.trim())
    missing.push("Guardian relationship");
  if (!teen.class_id) missing.push("Class");

  return {
    missing,
    isIncomplete: missing.length > 0,
    isFullyIncomplete: missing.length >= 5,
  };
}
