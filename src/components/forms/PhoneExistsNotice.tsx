import {
  formatPhoneOwner,
  type PhoneLookupResult,
} from "@/hooks/usePhoneLookup";

interface Props {
  matches: PhoneLookupResult[];
  loading?: boolean;
}

const PhoneExistsNotice = ({ matches, loading }: Props) => {
  if (loading && matches.length === 0) {
    return (
      <p className="text-xs text-muted-foreground mt-1">Checking phone...</p>
    );
  }

  if (matches.length === 0) return null;

  return (
    <div className="mt-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100">
      <p className="font-medium">This phone number already exists</p>
      <ul className="mt-1 list-disc pl-4 space-y-0.5">
        {matches.map((m) => (
          <li key={`${m.type}-${m.id}`}>{formatPhoneOwner(m)}</li>
        ))}
      </ul>
    </div>
  );
};

export default PhoneExistsNotice;
