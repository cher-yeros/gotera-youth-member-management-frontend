/** Canonical role abbreviations used by the app. */
export const ROLE = {
  FL: "FL",
  FM: "FM",
  ML: "ML",
  MAIN: "MAIN",
  FUL: "FUL",
  TT: "TT",
  ADMIN: "ADMIN",
  FC: "FC",
  FUC: "FUC",
} as const;

export type RoleCode = (typeof ROLE)[keyof typeof ROLE];

export const ROLE_LABELS: Record<RoleCode, string> = {
  FL: "Family Leader",
  FM: "Family Member",
  ML: "Ministry Leader",
  MAIN: "Main Leader",
  FUL: "Follow up",
  TT: "Teenager Teacher",
  ADMIN: "Admin",
  FC: "Family Coordinator",
  FUC: "Follow Up Coordinator",
};

type UserLike = {
  role?: string | null;
  roles?: string[] | null;
  member?: {
    role?: { name?: string | null } | null;
    roles?: { name?: string | null }[] | null;
  } | null;
};

export function normalizeRole(role: string): string {
  const upper = role.trim().toUpperCase();
  if (upper === "ADMIN" || role.trim().toLowerCase() === "admin")
    return ROLE.ADMIN;
  if (upper === "TL") return ROLE.ML;
  if (role.trim().toLowerCase() === "member") return ROLE.FM;
  return upper;
}

export function getUserRoles(user: UserLike | null | undefined): string[] {
  if (!user) return [];
  const names = new Set<string>();
  if (user.role) names.add(normalizeRole(user.role));
  if (user.roles?.length) {
    for (const r of user.roles) names.add(normalizeRole(r));
  }
  if (user.member?.roles?.length) {
    for (const r of user.member.roles) {
      if (r?.name) names.add(normalizeRole(r.name));
    }
  }
  if (user.member?.role?.name) {
    names.add(normalizeRole(user.member.role.name));
  }
  return Array.from(names);
}

export function hasRole(
  user: UserLike | null | undefined,
  role: string,
): boolean {
  const target = normalizeRole(role);
  return getUserRoles(user).includes(target);
}

export function hasAnyRole(
  user: UserLike | null | undefined,
  roles: string[],
): boolean {
  return roles.some((role) => hasRole(user, role));
}

/** Admin, Main, or Follow Up Coordinator — can view all cases and assign FULs. */
export function isFollowUpCoordinator(
  user: UserLike | null | undefined,
): boolean {
  return hasAnyRole(user, [ROLE.ADMIN, ROLE.MAIN, ROLE.FUC]);
}

/** Default landing path when a user holds several roles. */
export function getDefaultPathForUser(
  user: UserLike | null | undefined,
): string {
  if (hasAnyRole(user, [ROLE.ADMIN, ROLE.MAIN, ROLE.FC])) return "/dashboard";
  if (hasRole(user, ROLE.FUC)) return "/follow-up";
  if (hasRole(user, ROLE.ML)) return "/ministry-dashboard";
  if (hasRole(user, ROLE.TT)) return "/teen-dashboard";
  if (hasRole(user, ROLE.FUL) && !hasRole(user, ROLE.FL)) {
    return "/follow-up";
  }
  if (hasAnyRole(user, [ROLE.FL, ROLE.FUL])) return "/family-dashboard";
  return "/dashboard";
}

type MemberLike = {
  role?: { name?: string | null } | null;
  roles?: { name?: string | null }[] | null;
};

export function getMemberRoleNames(
  member: MemberLike | null | undefined,
): string[] {
  if (!member) return [];
  const names = new Set<string>();
  if (member.roles?.length) {
    for (const r of member.roles) {
      if (r?.name) names.add(normalizeRole(r.name));
    }
  }
  if (member.role?.name) names.add(normalizeRole(member.role.name));
  return Array.from(names);
}

export function memberHasRole(
  member: MemberLike | null | undefined,
  role: string,
): boolean {
  return getMemberRoleNames(member).includes(normalizeRole(role));
}

export function formatMemberRoles(
  member: MemberLike | null | undefined,
  fallback = "N/A",
): string {
  const names = getMemberRoleNames(member);
  return names.length ? names.join(", ") : fallback;
}
