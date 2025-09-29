import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  CreateProfessionInput,
  GetProfessionQuery,
  UpdateProfessionInput,
} from "@/generated/graphql";
import {
  useCreateProfession,
  useGetProfession,
  useUpdateProfession,
} from "@/hooks/useGraphQL";
import React, { useEffect, useState } from "react";

interface NewProfessionModalFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  professionId?: number; // If provided, form will be in update mode
  mode?: "create" | "update"; // Explicit mode control
}

const NewProfessionModalForm: React.FC<NewProfessionModalFormProps> = ({
  onSuccess,
  onCancel,
  professionId,
  mode = "create",
}) => {
  const isUpdateMode = mode === "update" && professionId;

  const { createProfession, loading: isCreating } = useCreateProfession();
  const { updateProfession, loading: isUpdating } = useUpdateProfession();

  // Fetch profession data if in update mode
  const { data: professionData, loading: professionLoading } = useGetProfession(
    professionId || 0
  ) as {
    data: GetProfessionQuery | undefined;
    loading: boolean;
  };

  // Form state
  const [formData, setFormData] = useState<
    CreateProfessionInput | UpdateProfessionInput
  >({
    name: "",
    ...(isUpdateMode && { id: professionId }),
  });

  // Initialize form with profession data when in update mode
  useEffect(() => {
    if (isUpdateMode && professionData?.profession) {
      const profession = professionData.profession;
      setFormData({
        id: profession.id,
        name: profession.name,
      });
    }
  }, [isUpdateMode, professionData]);

  const [errors, setErrors] = useState<
    Partial<
      Record<keyof (CreateProfessionInput | UpdateProfessionInput), string>
    >
  >({});

  // Handle input changes
  const handleInputChange = (
    field: keyof (CreateProfessionInput | UpdateProfessionInput),
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
      Record<keyof (CreateProfessionInput | UpdateProfessionInput), string>
    > = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Profession name is required";
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
        const cleanedData: UpdateProfessionInput = {
          id: professionId!,
          name: formData.name?.trim() || undefined,
        };

        await updateProfession(cleanedData);
      } else {
        // Clean up the form data for create - remove empty strings and undefined values
        const cleanedData: CreateProfessionInput = {
          name: formData.name?.trim() || "",
        };

        await createProfession(cleanedData);
      }

      // Success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(
        `Error ${isUpdateMode ? "updating" : "creating"} profession:`,
        error
      );
      // Error handling is done in the hooks with toast notifications
    }
  };

  const isLoading = isCreating || isUpdating || professionLoading;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Fill in the profession information below. Fields marked with * are
          required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Profession Information
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Profession Name *
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter profession name"
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
              ? "Update Profession"
              : "Create Profession"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewProfessionModalForm;
