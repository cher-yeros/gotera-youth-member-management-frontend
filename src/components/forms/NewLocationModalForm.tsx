import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  CreateLocationInput,
  GetLocationQuery,
  UpdateLocationInput,
} from "@/generated/graphql";
import {
  useCreateLocation,
  useGetLocation,
  useUpdateLocation,
} from "@/hooks/useGraphQL";
import React, { useEffect, useState } from "react";

interface NewLocationModalFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  locationId?: number; // If provided, form will be in update mode
  mode?: "create" | "update"; // Explicit mode control
}

const NewLocationModalForm: React.FC<NewLocationModalFormProps> = ({
  onSuccess,
  onCancel,
  locationId,
  mode = "create",
}) => {
  const isUpdateMode = mode === "update" && locationId;

  const { createLocation, loading: isCreating } = useCreateLocation();
  const { updateLocation, loading: isUpdating } = useUpdateLocation();

  // Fetch location data if in update mode
  const { data: locationData, loading: locationLoading } = useGetLocation(
    locationId || 0
  ) as {
    data: GetLocationQuery | undefined;
    loading: boolean;
  };

  // Form state
  const [formData, setFormData] = useState<
    CreateLocationInput | UpdateLocationInput
  >({
    name: "",
    ...(isUpdateMode && { id: locationId }),
  });

  // Initialize form with location data when in update mode
  useEffect(() => {
    if (isUpdateMode && locationData?.location) {
      const location = locationData.location;
      setFormData({
        id: location.id,
        name: location.name,
      });
    }
  }, [isUpdateMode, locationData]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof (CreateLocationInput | UpdateLocationInput), string>>
  >({});

  // Handle input changes
  const handleInputChange = (
    field: keyof (CreateLocationInput | UpdateLocationInput),
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
      Record<keyof (CreateLocationInput | UpdateLocationInput), string>
    > = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Location name is required";
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
        const cleanedData: UpdateLocationInput = {
          id: locationId!,
          name: formData.name?.trim() || undefined,
        };

        await updateLocation(cleanedData);
      } else {
        // Clean up the form data for create - remove empty strings and undefined values
        const cleanedData: CreateLocationInput = {
          name: formData.name?.trim() || "",
        };

        await createLocation(cleanedData);
      }

      // Success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(
        `Error ${isUpdateMode ? "updating" : "creating"} location:`,
        error
      );
      // Error handling is done in the hooks with toast notifications
    }
  };

  const isLoading = isCreating || isUpdating || locationLoading;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Fill in the location information below. Fields marked with * are
          required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Location Information
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Location Name *
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter location name"
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
              ? "Update Location"
              : "Create Location"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewLocationModalForm;
