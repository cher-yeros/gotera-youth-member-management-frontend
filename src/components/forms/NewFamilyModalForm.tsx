import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  CreateFamilyInput,
  GetFamilyQuery,
  UpdateFamilyInput,
} from "@/generated/graphql";
import {
  useCreateFamily,
  useGetFamily,
  useUpdateFamily,
} from "@/hooks/useGraphQL";
import React, { useEffect, useState } from "react";

interface NewFamilyModalFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  familyId?: number; // If provided, form will be in update mode
  mode?: "create" | "update"; // Explicit mode control
}

const NewFamilyModalForm: React.FC<NewFamilyModalFormProps> = ({
  onSuccess,
  onCancel,
  familyId,
  mode = "create",
}) => {
  const isUpdateMode = mode === "update" && familyId;

  const { createFamily, loading: isCreating } = useCreateFamily();
  const { updateFamily, loading: isUpdating } = useUpdateFamily();

  // Fetch family data if in update mode
  const { data: familyData, loading: familyLoading } = useGetFamily(
    familyId || 0
  ) as {
    data: GetFamilyQuery | undefined;
    loading: boolean;
  };

  // Form state
  const [formData, setFormData] = useState<
    CreateFamilyInput | UpdateFamilyInput
  >({
    name: "",
    ...(isUpdateMode && { id: familyId }),
  });

  // Initialize form with family data when in update mode
  useEffect(() => {
    if (isUpdateMode && familyData?.family) {
      const family = familyData.family;
      setFormData({
        id: family.id,
        name: family.name,
      });
    }
  }, [isUpdateMode, familyData]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof (CreateFamilyInput | UpdateFamilyInput), string>>
  >({});

  // Handle input changes
  const handleInputChange = (
    field: keyof (CreateFamilyInput | UpdateFamilyInput),
    value: string
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

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Partial<
      Record<keyof (CreateFamilyInput | UpdateFamilyInput), string>
    > = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Family name is required";
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
        const cleanedData: UpdateFamilyInput = {
          id: familyId!,
          name: formData.name?.trim() || undefined,
        };

        await updateFamily(cleanedData);
      } else {
        // Clean up the form data for create - remove empty strings and undefined values
        const cleanedData: CreateFamilyInput = {
          name: formData.name?.trim() || "",
        };

        await createFamily(cleanedData);
      }

      // Success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(
        `Error ${isUpdateMode ? "updating" : "creating"} family:`,
        error
      );
      // Error handling is done in the hooks with toast notifications
    }
  };

  const isLoading = isCreating || isUpdating || familyLoading;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Fill in the family information below. Fields marked with * are
          required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Family Information
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Family Name *
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter family name"
                className={errors.name ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
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
              ? "Update Family"
              : "Create Family"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewFamilyModalForm;
