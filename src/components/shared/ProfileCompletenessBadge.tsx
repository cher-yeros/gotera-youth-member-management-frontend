import { Badge } from "@/components/ui/badge";

export type CompletenessViewModel = {
  applicable?: boolean;
  isIncomplete: boolean;
  isFullyIncomplete: boolean;
  missingFields: string[];
};

interface ProfileCompletenessBadgeProps {
  completeness: CompletenessViewModel;
  notApplicableLabel?: string;
}

const ProfileCompletenessBadge = ({
  completeness,
  notApplicableLabel = "Not checked (inactive)",
}: ProfileCompletenessBadgeProps) => {
  const {
    applicable = true,
    isIncomplete,
    isFullyIncomplete,
    missingFields,
  } = completeness;

  if (!applicable) {
    return (
      <Badge className="text-xs bg-gray-100 text-gray-700">
        {notApplicableLabel}
      </Badge>
    );
  }

  if (isFullyIncomplete) {
    return (
      <div className="space-y-1">
        <Badge className="text-xs bg-red-100 text-red-800">Mostly empty</Badge>
        {missingFields.length > 0 && (
          <p className="text-[11px] text-muted-foreground leading-tight">
            Missing: {missingFields.join(", ")}
          </p>
        )}
      </div>
    );
  }

  if (isIncomplete) {
    return (
      <div className="space-y-1">
        <Badge className="text-xs bg-yellow-100 text-yellow-800">
          Incomplete
        </Badge>
        {missingFields.length > 0 && (
          <p className="text-[11px] text-muted-foreground leading-tight">
            Missing: {missingFields.join(", ")}
          </p>
        )}
      </div>
    );
  }

  return (
    <Badge className="text-xs bg-green-100 text-green-800">Complete</Badge>
  );
};

interface CompletenessPageSummaryProps {
  incompleteCount: number;
  totalOnPage: number;
}

export const CompletenessPageSummary = ({
  incompleteCount,
  totalOnPage,
}: CompletenessPageSummaryProps) => {
  if (totalOnPage === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-yellow-100 text-yellow-800">
        {incompleteCount} incomplete on this page
      </Badge>
      <Badge className="bg-green-100 text-green-800">
        {totalOnPage - incompleteCount} complete on this page
      </Badge>
    </div>
  );
};

export default ProfileCompletenessBadge;
