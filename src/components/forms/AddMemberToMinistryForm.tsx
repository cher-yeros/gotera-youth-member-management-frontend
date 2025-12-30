import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { ComboBoxOption } from "@/components/ui/combo-box";
import { ComboBox } from "@/components/ui/combo-box";
import { useGetMembers, useUpdateMember } from "@/hooks/useGraphQL";
import { toast } from "react-toastify";

// Type for member from GetMembersQuery result
type MemberFromQuery = NonNullable<
  NonNullable<ReturnType<typeof useGetMembers>["data"]>["members"]
>["members"][number];

interface AddMemberToMinistryFormProps {
  ministryId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddMemberToMinistryForm: React.FC<AddMemberToMinistryFormProps> = ({
  ministryId,
  onSuccess,
  onCancel,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<number | undefined>(
    undefined
  );
  const { updateMember, loading: isUpdating } = useUpdateMember();

  // Fetch all members with pagination to get members without ministries
  // We'll fetch a large number to get all members, then filter client-side
  const { data: membersData, loading: membersLoading } = useGetMembers(
    undefined, // No filter - get all members
    { page: 1, limit: 10000 } // Get all members
  );

  // Filter members to only show those who don't belong to any ministry
  const membersWithoutMinistry = useMemo(() => {
    if (!membersData?.members?.members) return [];

    return membersData.members.members.filter((member) => {
      // Member has no ministries (empty array or undefined)
      // Type assertion needed because GetMembersQuery type doesn't include ministries in the type definition
      // but the actual query result does include it (the fragment includes ministries)
      const memberWithMinistries = member as MemberFromQuery & {
        ministries?: Array<{ id: number; name: string }>;
      };
      return (
        !memberWithMinistries.ministries ||
        memberWithMinistries.ministries.length === 0
      );
    });
  }, [membersData]);

  // Convert filtered members to ComboBox options
  const memberOptions: ComboBoxOption[] = useMemo(() => {
    return membersWithoutMinistry.map((member) => ({
      value: member.id,
      label: `${member.full_name}${
        member.contact_no ? ` (${member.contact_no})` : ""
      }`,
    }));
  }, [membersWithoutMinistry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ministryId || ministryId <= 0) {
      toast.error("Invalid ministry ID");
      return;
    }

    if (!selectedMemberId) {
      toast.error("Please select a member to add to the ministry");
      return;
    }

    try {
      // Get the selected member's current ministry_ids
      const selectedMember = membersData?.members?.members.find(
        (m) => m.id === selectedMemberId
      );

      // Add the current ministry to the member's ministry_ids
      // Type assertion needed because GetMembersQuery type doesn't include ministries in the type definition
      // but the actual query result does include it (the fragment includes ministries)
      const memberWithMinistries = selectedMember as MemberFromQuery & {
        ministries?: Array<{ id: number; name: string }>;
      };
      const currentMinistryIds =
        memberWithMinistries?.ministries?.map((m) => m.id) || [];
      const updatedMinistryIds = [...currentMinistryIds, ministryId];

      // Update the member with the new ministry_ids
      await updateMember({
        id: selectedMemberId,
        ministry_ids: updatedMinistryIds,
      });

      toast.success("Member added to ministry successfully!");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding member to ministry:", error);
      toast.error("Failed to add member to ministry");
    }
  };

  const isLoading = membersLoading || isUpdating;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Select an existing member who doesn't belong to any ministry to add
          them to this ministry.
        </p>
      </div>

      <div>
        <label
          htmlFor="member_id"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Select Member *
        </label>
        <ComboBox
          options={memberOptions}
          value={selectedMemberId}
          onValueChange={(value) =>
            setSelectedMemberId(
              value
                ? typeof value === "string"
                  ? parseInt(value, 10)
                  : value
                : undefined
            )
          }
          placeholder="Search and select a member..."
          disabled={isLoading}
        />
        {memberOptions.length === 0 && !membersLoading && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            No members available. All members already belong to at least one
            ministry.
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!selectedMemberId || isLoading}
          className="bg-brand-gradient hover:opacity-90 transition-opacity"
        >
          {isLoading ? "Adding..." : "Add Member to Ministry"}
        </Button>
      </div>
    </form>
  );
};

export default AddMemberToMinistryForm;
