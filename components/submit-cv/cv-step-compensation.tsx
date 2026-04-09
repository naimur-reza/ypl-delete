"use client";

import { SelectItem } from "@/components/ui/select";
import { AVAILABILITY } from "@/lib/candidate-options";

type FormApi = {
  AppField: React.ComponentType<{ name: string; children: (field: any) => React.ReactNode }>;
};

export function CVStepCompensation({ form }: { form: FormApi }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-1">
      <div className="grid gap-6 sm:grid-cols-2">
        <form.AppField name="currentOrganization">
          {(field: any) => <field.Input label="Current Company" />}
        </form.AppField>
        <form.AppField name="availableFromDate">
          {(field: any) => (
            <field.Select label="Notice Period / Availability">
              {AVAILABILITY.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </field.Select>
          )}
        </form.AppField>
      </div>

      <form.AppField name="previousOrganizations">
        {(field: any) => (
          <field.Input
            label="Previous Companies"
            placeholder="e.g. Company A, Company B"
          />
        )}
      </form.AppField>

      <div className="grid gap-6 sm:grid-cols-2">
        <form.AppField name="currentSalary">
          {(field: any) => <field.Input label="Current Salary (Monthly)" />}
        </form.AppField>
        <form.AppField name="expectedSalary">
          {(field: any) => <field.Input label="Expected Salary (Monthly)" />}
        </form.AppField>
      </div>

      <form.AppField name="cvUrl">
        {(field: any) => <field.FileUpload label="Upload CV (PDF preferred)" required />}
      </form.AppField>
    </div>
  );
}
