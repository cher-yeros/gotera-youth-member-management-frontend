import { Button } from "@/components/ui/button";
import type { ComboBoxOption } from "@/components/ui/combo-box";
import { ComboBox } from "@/components/ui/combo-box";
import { Input } from "@/components/ui/input";
import type {
  CreateMemberInput,
  GetMemberQuery,
  UpdateMemberInput,
  Ministry,
} from "@/generated/graphql";
import {
  useCreateMember,
  useGetFamilies,
  useGetLocations,
  useGetMember,
  useGetProfessions,
  useGetRoles,
  useGetStatuses,
  useGetMinistries,
  useUpdateMember,
} from "@/hooks/useGraphQL";
import React, { useEffect, useState } from "react";

interface NewMemberModalFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  memberId?: number; // If provided, form will be in update mode
  mode?: "create" | "update"; // Explicit mode control
  defaultFamilyId?: number; // Default family ID for new members
  defaultMinistryId?: number; // Default ministry ID for new members
}

const NewMemberModalForm: React.FC<NewMemberModalFormProps> = ({
  onSuccess,
  onCancel,
  memberId,
  mode = "create",
  defaultFamilyId,
  defaultMinistryId,
}) => {
  const isUpdateMode = mode === "update" && memberId;

  const { createMember, loading: isCreating } = useCreateMember();
  const { updateMember, loading: isUpdating } = useUpdateMember();

  // Fetch member data if in update mode
  const { data: memberData, loading: memberLoading } = useGetMember(
    memberId || 0
  ) as {
    data: GetMemberQuery | undefined;
    loading: boolean;
  };

  // Fetch all the lookup data
  const { data: familiesData, loading: familiesLoading } = useGetFamilies();
  const { data: rolesData, loading: rolesLoading } = useGetRoles();
  const { data: statusesData, loading: statusesLoading } = useGetStatuses();
  const { data: professionsData, loading: professionsLoading } =
    useGetProfessions();
  const { data: locationsData, loading: locationsLoading } = useGetLocations();
  const { data: ministrysData, loading: ministrysLoading } = useGetMinistries();

  // Form state
  const [formData, setFormData] = useState<
    CreateMemberInput | UpdateMemberInput
  >({
    full_name: "",
    contact_no: "",
    gender: undefined,
    status_id: undefined,
    family_id: defaultFamilyId || undefined,
    ministry_ids: defaultMinistryId ? [defaultMinistryId] : [],
    role_id: undefined,
    profession_id: undefined,
    location_id: undefined,
    profession_name: "",
    location_name: "",
    ...(isUpdateMode && { id: memberId }),
  });

  // Initialize form with member data when in update mode
  useEffect(() => {
    if (isUpdateMode && memberData?.member) {
      const member = memberData.member;
      setFormData({
        id: member.id,
        full_name: member.full_name,
        contact_no: member.contact_no || "",
        gender: member.gender || undefined,
        status_id: member.status_id || undefined,
        family_id: member.family_id || undefined,
        ministry_ids: [], // Initialize empty, will be set from form
        role_id: member.role_id || undefined,
        profession_id: member.profession_id || undefined,
        location_id: member.location_id || undefined,
        profession_name: member.profession_name || "",
        location_name: member.location_name || "",
      });
    }
  }, [isUpdateMode, memberData]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof (CreateMemberInput | UpdateMemberInput), string>>
  >({});

  // Helper functions to convert GraphQL data to ComboBox options
  const getStatusOptions = (): ComboBoxOption[] =>
    statusesData?.statuses?.map((status) => ({
      value: status.id,
      label: status.name,
    })) || [];

  const getFamilyOptions = (): ComboBoxOption[] =>
    familiesData?.families?.map((family) => ({
      value: family.id,
      label: family.name,
    })) || [];

  const getMinistryOptions = (): ComboBoxOption[] =>
    ministrysData?.ministries?.map((ministry: Ministry) => ({
      value: ministry.id,
      label: ministry.name,
    })) || [];

  const getRoleOptions = (): ComboBoxOption[] =>
    rolesData?.roles?.map((role) => ({
      value: role.id,
      label: role.name,
    })) || [];

  const getProfessionOptions = (): ComboBoxOption[] =>
    professionsData?.professions?.map((profession) => ({
      value: profession.id,
      label: profession.name,
    })) || [];

  const getLocationOptions = (): ComboBoxOption[] =>
    locationsData?.locations?.map((location) => ({
      value: location.id,
      label: location.name,
    })) || [];

  // Handle input changes
  const handleInputChange = (
    field: keyof (CreateMemberInput | UpdateMemberInput),
    value: string | number | undefined | number[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Handle ComboBox changes for foreign keys
  const handleComboBoxChange = (
    field: keyof (CreateMemberInput | UpdateMemberInput),
    value: string | number | undefined | number[]
  ) => {
    handleInputChange(field, value);
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Partial<
      Record<keyof (CreateMemberInput | UpdateMemberInput), string>
    > = {};

    if (!formData.full_name?.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (
      formData.contact_no &&
      !/^[+]?[0-9\s\-()]{10,}$/.test(formData.contact_no)
    ) {
      newErrors.contact_no = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isUpdateMode) {
        // Clean up the form data for update - remove empty strings and undefined values
        const cleanedData: UpdateMemberInput = {
          id: memberId!,
          full_name: formData.full_name?.trim() || undefined,
          contact_no: formData.contact_no?.trim() || undefined,
          gender: formData.gender || undefined,
          status_id: formData.status_id || undefined,
          family_id: formData.family_id || undefined,
          role_id: formData.role_id || undefined,
          profession_id: formData.profession_id || undefined,
          location_id: formData.location_id || undefined,
          profession_name: formData.profession_name?.trim() || undefined,
          location_name: formData.location_name?.trim() || undefined,
        };

        await updateMember(cleanedData);
      } else {
        // Clean up the form data for create - remove empty strings and undefined values
        const cleanedData: CreateMemberInput = {
          full_name: formData.full_name?.trim() || "",
          contact_no: formData.contact_no?.trim() || undefined,
          gender: formData.gender || undefined,
          status_id: formData.status_id || undefined,
          family_id: formData.family_id || undefined,
          role_id: formData.role_id || undefined,
          profession_id: formData.profession_id || undefined,
          location_id: formData.location_id || undefined,
          profession_name: formData.profession_name?.trim() || undefined,
          location_name: formData.location_name?.trim() || undefined,
        };

        await createMember(cleanedData);
      }

      // Success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(
        `Error ${isUpdateMode ? "updating" : "creating"} member:`,
        error
      );
      // Error handling is done in the hooks with toast notifications
    }
  };

  const isLoading =
    isCreating ||
    isUpdating ||
    memberLoading ||
    familiesLoading ||
    rolesLoading ||
    statusesLoading ||
    professionsLoading ||
    locationsLoading ||
    ministrysLoading;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Fill in the member information below. Fields marked with * are
          required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Basic Information
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Full Name *
              </label>
              <Input
                id="full_name"
                type="text"
                value={formData.full_name || ""}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                placeholder="Enter full name"
                className={errors.full_name ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.full_name && (
                <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact_no"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Contact Number
              </label>
              <Input
                id="contact_no"
                type="tel"
                value={formData.contact_no || ""}
                onChange={(e) =>
                  handleInputChange("contact_no", e.target.value)
                }
                placeholder="Enter phone number"
                className={errors.contact_no ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.contact_no && (
                <p className="text-red-500 text-sm mt-1">{errors.contact_no}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Gender
              </label>
              <ComboBox
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                ]}
                value={formData.gender ?? undefined}
                onValueChange={(value) =>
                  handleComboBoxChange("gender", value)
                }
                placeholder="Select gender"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Member Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Member Details
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="status_id"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Status
              </label>
              <ComboBox
                options={getStatusOptions()}
                value={formData.status_id ?? undefined}
                onValueChange={(value) =>
                  handleComboBoxChange("status_id", value)
                }
                placeholder="Select status"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="family_id"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Family
              </label>
              <ComboBox
                options={getFamilyOptions()}
                value={formData.family_id ?? undefined}
                onValueChange={(value) =>
                  handleComboBoxChange("family_id", value)
                }
                placeholder="Select family"
                disabled={
                  isLoading ||
                  !!defaultFamilyId ||
                  !!memberData?.member?.family_id
                }
              />
            </div>

            <div>
              <label
                htmlFor="ministry_ids"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Ministries
              </label>
              <ComboBox
                options={getMinistryOptions()}
                value={formData.ministry_ids?.[0] ?? undefined}
                onValueChange={(value) => {
                  if (value) {
                    const currentIds = formData.ministry_ids || [];
                    const numericValue =
                      typeof value === "string" ? parseInt(value, 10) : value;
                    if (!currentIds.includes(numericValue)) {
                      handleComboBoxChange("ministry_ids", [
                        ...currentIds,
                        numericValue,
                      ]);
                    }
                  }
                }}
                placeholder="Select ministries"
                disabled={isLoading}
              />
              {formData.ministry_ids && formData.ministry_ids.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.ministry_ids.map((id) => {
                    const ministry = ministrysData?.ministries?.find(
                      (m: Ministry) => m.id === id
                    );
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {ministry?.name}
                        <button
                          type="button"
                          onClick={() => {
                            const newIds =
                              formData.ministry_ids?.filter(
                                (mid) => mid !== id
                              ) || [];
                            handleComboBoxChange("ministry_ids", newIds);
                          }}
                          className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="role_id"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Role
              </label>
              <ComboBox
                options={getRoleOptions()}
                value={formData.role_id ?? undefined}
                onValueChange={(value) =>
                  handleComboBoxChange("role_id", value)
                }
                placeholder="Select role"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="profession_id"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Profession
              </label>
              <ComboBox
                options={getProfessionOptions()}
                value={formData.profession_id ?? undefined}
                onValueChange={(value) =>
                  handleComboBoxChange("profession_id", value)
                }
                placeholder="Select profession"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="location_id"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Location
              </label>
              <ComboBox
                options={getLocationOptions()}
                value={formData.location_id ?? undefined}
                onValueChange={(value) =>
                  handleComboBoxChange("location_id", value)
                }
                placeholder="Select location"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Additional Information
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="profession_name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Custom Profession Name
              </label>
              <Input
                id="profession_name"
                type="text"
                value={formData.profession_name || ""}
                onChange={(e) =>
                  handleInputChange("profession_name", e.target.value)
                }
                placeholder="Enter custom profession name"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Override the profession name from the dropdown above
              </p>
            </div>

            <div>
              <label
                htmlFor="location_name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Custom Location Name
              </label>
              <Input
                id="location_name"
                type="text"
                value={formData.location_name || ""}
                onChange={(e) =>
                  handleInputChange("location_name", e.target.value)
                }
                placeholder="Enter custom location name"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Override the location name from the dropdown above
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 sm:flex-none sm:order-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 sm:flex-none sm:order-1"
          >
            {isLoading
              ? isUpdateMode
                ? "Updating..."
                : "Creating..."
              : isUpdateMode
              ? "Update Member"
              : "Create Member"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewMemberModalForm;
