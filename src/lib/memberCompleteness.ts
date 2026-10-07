export type MissingField =
  | "Contact"
  | "Gender"
  | "Status"
  | "Role"
  | "Profession"
  | "Location"
  | "Ministry";

export const ACTIVE_STATUS_NAME = "Active";

export type CompletenessMember = {
  contact_no?: string | null;
  gender?: string | null;
  status?: { id?: number | null; name?: string | null } | null;
  role?: { id?: number | null } | null;
  profession?: { id?: number | null } | null;
  profession_name?: string | null;
  location?: { id?: number | null } | null;
  location_name?: string | null;
  ministries?: Array<{ id?: number | null }> | null;
  no_ministry?: boolean | null;
  not_employed?: boolean | null;
};

export const isActiveMember = (member: CompletenessMember) =>
  member.status?.name === ACTIVE_STATUS_NAME;

export const hasValidContact = (contact?: string | null) => {
  if (!contact) return false;
  const trimmed = contact.trim();
  // Treat empty or country-code-only placeholders as unfilled
  return trimmed.length > 5 && trimmed !== "+251";
};

export const getMissingFields = (
  member: CompletenessMember,
): MissingField[] => {
  // Completeness only applies to Active members
  if (!isActiveMember(member)) {
    return [];
  }

  const missing: MissingField[] = [];

  if (!hasValidContact(member.contact_no)) missing.push("Contact");
  if (!member.gender?.trim()) missing.push("Gender");
  if (!member.status?.id) missing.push("Status");
  if (!member.role?.id) missing.push("Role");
  if (
    !member.profession?.id &&
    !member.profession_name?.trim() &&
    member.not_employed !== true
  ) {
    missing.push("Profession");
  }
  if (!member.location?.id && !member.location_name?.trim()) {
    missing.push("Location");
  }
  const hasMinistry =
    (member.ministries && member.ministries.length > 0) ||
    member.no_ministry === true;
  if (!hasMinistry) {
    missing.push("Ministry");
  }

  return missing;
};

export const getMemberCompleteness = (member: CompletenessMember) => {
  const applicable = isActiveMember(member);
  const missingFields = getMissingFields(member);
  return {
    applicable,
    missingFields,
    isIncomplete: applicable && missingFields.length > 0,
    // Fully incomplete: only name (and maybe 1 field) filled
    isFullyIncomplete: applicable && missingFields.length >= 5,
  };
};

export type FamilyCompletenessSummary = {
  id: number;
  name: string;
  totalMembers: number;
  incompleteCount: number;
  fullyIncompleteCount: number;
  completeCount: number;
  isFullyUncompleted: boolean;
  hasUnfilledData: boolean;
};

export const getFamilyCompleteness = <
  T extends CompletenessMember & { id: number },
>(family: {
  id: number;
  name: string;
  members?: T[] | null;
}): FamilyCompletenessSummary => {
  const activeMembers = (family.members || []).filter(isActiveMember);
  const completeness = activeMembers.map(getMemberCompleteness);
  const incompleteCount = completeness.filter((m) => m.isIncomplete).length;
  const fullyIncompleteCount = completeness.filter(
    (m) => m.isFullyIncomplete,
  ).length;
  const completeCount = activeMembers.length - incompleteCount;

  return {
    id: family.id,
    name: family.name,
    totalMembers: activeMembers.length,
    incompleteCount,
    fullyIncompleteCount,
    completeCount,
    isFullyUncompleted: activeMembers.length > 0 && completeCount === 0,
    hasUnfilledData: incompleteCount > 0,
  };
};
