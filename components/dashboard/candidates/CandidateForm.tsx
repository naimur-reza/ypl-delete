"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { useAppForm } from "@/hooks/use-field-context";
import {
  ACADEMIC_QUALIFICATIONS,
  AVAILABILITY,
  INDUSTRIES,
  LOCATIONS,
  POSITIONS,
} from "@/lib/candidate-options";
import type { CandidateLead } from "./types";

export function CandidateForm({
  editingItem,
  onSuccess,
  create,
  update,
  departments,
  roles,
}: {
  editingItem: CandidateLead | null;
  onSuccess: () => void;
  create: (data: Record<string, unknown>) => Promise<boolean>;
  update: (id: string, data: Record<string, unknown>) => Promise<boolean>;
  departments: string[];
  roles: string[];
}) {
  const form = useAppForm({
    defaultValues: (editingItem || {
      fullName: "",
      email: "",
      mobileNumber: "",
      professionalQualification: "",
      educationalQualification: "",
      totalExperience: "",
      currentPosition: "",
      department: "",
      role: "",
      currentOrganization: "",
      previousOrganizations: "",
      industry: "",
      currentSalary: "",
      expectedSalary: "",
      availableFromDate: "",
      location: "Dhaka",
      cvUrl: "",
      status: "New",
    }) as Record<string, unknown>,
    onSubmit: async ({ value }: { value: Record<string, unknown> }) => {
      const ok = editingItem?._id
        ? await update(editingItem._id, value)
        : await create(value);
      if (ok) onSuccess();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <form.AppForm>
        <div className="grid grid-cols-2 gap-4">
          <form.AppField name="fullName">
            {(field: any) => <field.Input label="Full Name" required />}
          </form.AppField>
          <form.AppField name="email">
            {(field: any) => (
              <field.Input label="Email Address" type="email" required />
            )}
          </form.AppField>
          <form.AppField name="mobileNumber">
            {(field: any) => <field.Input label="Mobile Number" required />}
          </form.AppField>
          <form.AppField name="location">
            {(field: any) => (
              <field.Select label="Location">
                {LOCATIONS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>

          <form.AppField name="department">
            {(field: any) => (
              <field.Select label="Primary Department">
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>
          <form.AppField name="role">
            {(field: any) => (
              <field.Select label="Specific Role">
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>

          <form.AppField name="currentPosition">
            {(field: any) => (
              <field.Select label="Position Level">
                {POSITIONS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>
          <form.AppField name="industry">
            {(field: any) => (
              <field.Select label="Industry Experience">
                {INDUSTRIES.map((i) => (
                  <SelectItem key={i} value={i}>
                    {i}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>

          <form.AppField name="totalExperience">
            {(field: any) => (
              <field.Input
                label="Total Experience"
                placeholder="e.g. 5 years or 3 years 6 months"
              />
            )}
          </form.AppField>
          <form.AppField name="availableFromDate">
            {(field: any) => (
              <field.Select label="Notice Period / Availability">
                {AVAILABILITY.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>

          <form.AppField name="educationalQualification">
            {(field: any) => (
              <field.Select label="Academic Qualification">
                {ACADEMIC_QUALIFICATIONS.map((q) => (
                  <SelectItem key={q} value={q}>
                    {q}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>
          <form.AppField name="professionalQualification">
            {(field: any) => <field.Input label="Professional Qualification" />}
          </form.AppField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <form.AppField name="currentSalary">
            {(field: any) => <field.Input label="Current Salary (Monthly)" />}
          </form.AppField>
          <form.AppField name="expectedSalary">
            {(field: any) => <field.Input label="Expected Salary (Monthly)" />}
          </form.AppField>
        </div>

        <form.AppField name="currentOrganization">
          {(field: any) => <field.Input label="Current Company" />}
        </form.AppField>

        <form.AppField name="cvUrl">
          {(field: any) => (
            <field.FileUpload label="Upload Candidate CV" required />
          )}
        </form.AppField>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <form.Subscribe selector={(state: any) => state.isSubmitting}>
            {(isSubmitting: any) => (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingItem ? (
                  "Update Profile"
                ) : (
                  "Register Candidate"
                )}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form.AppForm>
    </form>
  );
}
