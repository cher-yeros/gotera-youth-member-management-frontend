import React from "react";
import { ComboBox } from "@/components/ui/combo-box";
import type { ComboBoxOption } from "@/components/ui/combo-box";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ComboBoxTest = () => {
  const statusOptions: ComboBoxOption[] = [
    { value: 1, label: "Active" },
    { value: 2, label: "Inactive" },
    { value: 3, label: "Pending" },
    { value: 4, label: "Suspended" },
    { value: 5, label: "Archived" },
  ];

  const familyOptions: ComboBoxOption[] = [
    { value: 1, label: "Smith Family" },
    { value: 2, label: "Johnson Family" },
    { value: 3, label: "Williams Family" },
    { value: 4, label: "Brown Family" },
    { value: 5, label: "Davis Family" },
  ];

  const [selectedStatus, setSelectedStatus] = React.useState<
    number | undefined
  >();
  const [selectedFamily, setSelectedFamily] = React.useState<
    number | undefined
  >();

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ComboBox Selection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status ComboBox */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <ComboBox
                options={statusOptions}
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as number)}
                placeholder="Select status..."
                searchPlaceholder="Search statuses..."
                emptyText="No status found."
              />
              <div className="text-sm text-muted-foreground">
                <p>Selected: {selectedStatus || "None"}</p>
                <p>
                  Label:{" "}
                  {statusOptions.find((opt) => opt.value === selectedStatus)
                    ?.label || "None"}
                </p>
              </div>
            </div>

            {/* Family ComboBox */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Family</label>
              <ComboBox
                options={familyOptions}
                value={selectedFamily}
                onValueChange={(value) => setSelectedFamily(value as number)}
                placeholder="Select family..."
                searchPlaceholder="Search families..."
                emptyText="No family found."
              />
              <div className="text-sm text-muted-foreground">
                <p>Selected: {selectedFamily || "None"}</p>
                <p>
                  Label:{" "}
                  {familyOptions.find((opt) => opt.value === selectedFamily)
                    ?.label || "None"}
                </p>
              </div>
            </div>
          </div>

          {/* Test Instructions */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Test Instructions:
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>1. Click on any ComboBox to open the dropdown</li>
              <li>
                2. Type in the search box to filter options (e.g., "Act" for
                Active)
              </li>
              <li>3. Click on an option to select it</li>
              <li>
                4. Verify the selection appears in the button and the values
                below update
              </li>
              <li>
                5. Try searching for partial matches (e.g., "Fam" for Family
                options)
              </li>
            </ul>
          </div>

          {/* Current State */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h3 className="font-semibold mb-2">Current State:</h3>
            <div className="text-sm space-y-1">
              <p>Status ID: {selectedStatus || "None"}</p>
              <p>Family ID: {selectedFamily || "None"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComboBoxTest;
