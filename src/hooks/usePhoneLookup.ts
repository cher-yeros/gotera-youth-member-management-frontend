import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { LOOKUP_BY_PHONE } from "@/graphql/operations";
import { isValidLocalPhone, toE164Phone } from "@/lib/phone";

export type PhoneLookupResult = {
  type: "MEMBER" | "TEENAGER";
  id: number;
  full_name: string;
  contact_no?: string | null;
  status?: string | null;
  family_name?: string | null;
  class_name?: string | null;
};

type Options = {
  localPhone: string;
  excludeMemberId?: number;
  excludeTeenagerId?: number;
  enabled?: boolean;
};

export function formatPhoneOwner(owner: PhoneLookupResult): string {
  const kind = owner.type === "MEMBER" ? "Member" : "Teenager";
  const extra =
    owner.type === "MEMBER"
      ? owner.family_name
        ? ` · Family ${owner.family_name}`
        : owner.status
          ? ` · ${owner.status}`
          : ""
      : owner.class_name
        ? ` · Class ${owner.class_name}`
        : "";
  return `${owner.full_name} (${kind}${extra})`;
}

export function usePhoneLookup({
  localPhone,
  excludeMemberId,
  excludeTeenagerId,
  enabled = true,
}: Options) {
  const [matches, setMatches] = useState<PhoneLookupResult[]>([]);
  const [lookup, { loading }] = useLazyQuery(LOOKUP_BY_PHONE, {
    fetchPolicy: "network-only",
    errorPolicy: "ignore",
  });

  useEffect(() => {
    if (!enabled || !isValidLocalPhone(localPhone)) {
      setMatches([]);
      return;
    }

    const e164 = toE164Phone(localPhone);
    if (!e164) {
      setMatches([]);
      return;
    }

    const handle = window.setTimeout(async () => {
      try {
        const result = await lookup({
          variables: {
            phone: e164,
            excludeMemberId: excludeMemberId || null,
            excludeTeenagerId: excludeTeenagerId || null,
          },
        });
        const rows =
          ((result.data as { lookupByPhone?: PhoneLookupResult[] } | undefined)
            ?.lookupByPhone as PhoneLookupResult[] | undefined) || [];
        setMatches(rows);
      } catch {
        setMatches([]);
      }
    }, 350);

    return () => window.clearTimeout(handle);
  }, [localPhone, excludeMemberId, excludeTeenagerId, enabled, lookup]);

  return {
    matches,
    loading,
    exists: matches.length > 0,
    primary: matches[0] || null,
  };
}
