export type GenderSkew = "BALANCED" | "MORE_MALE" | "MORE_FEMALE" | "UNKNOWN";

export type FamilyPlacementSuggestion = {
  followUpCaseId: number;
  memberId: number;
  fullName: string;
  gender?: string | null;
  priority?: string | null;
  reason: string;
};

export type FamilyPlacementNeed = {
  id: number;
  name: string;
  activeMemberCount: number;
  maleCount: number;
  femaleCount: number;
  unknownGenderCount: number;
  averageActiveSize: number;
  sizeDeficit: number;
  genderSkew: GenderSkew | string;
  needsMembers: boolean;
  needReasons: string[];
  suggestedNewcomers: FamilyPlacementSuggestion[];
};

export const GENDER_SKEW_LABELS: Record<string, string> = {
  BALANCED: "Balanced",
  MORE_MALE: "Needs more female",
  MORE_FEMALE: "Needs more male",
  UNKNOWN: "Gender unknown",
};

export function genderSkewLabel(skew?: string | null): string {
  if (!skew) return "";
  return GENDER_SKEW_LABELS[skew] || skew;
}

export function formatGenderCounts(
  maleCount: number,
  femaleCount: number,
  unknownGenderCount = 0,
): string {
  const parts = [`${maleCount}M`, `${femaleCount}F`];
  if (unknownGenderCount > 0) {
    parts.push(`${unknownGenderCount}?`);
  }
  return parts.join(" / ");
}
