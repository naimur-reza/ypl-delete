"use client";

import { SelectItem } from "@/components/ui/select";
import {
  INDUSTRIES,
  POSITIONS,
  QUALIFICATIONS_ACADEMIC,
  QUALIFICATIONS_PROFESSIONAL,
} from "@/lib/candidate-options";
import type { DepartmentOption, RoleOption } from "@/hooks/use-departments-and-roles";

type FormApi = {
  AppField: React.ComponentType<{ name: string; children: (field: any) => React.ReactNode }>;
  Subscribe: React.ComponentType<{
    selector: (state: any) => any;
    children: (value: any) => React.ReactNode;
  }>;
  setFieldValue: (name: string, value: string) => void;
};

export function CVStepCareer({
  form,
  departments,
  roles,
  onDepartmentNameChange,
}: {
  form: FormApi;
  departments: DepartmentOption[];
  roles: RoleOption[];
  onDepartmentNameChange: (name: string, resetRole: () => void) => void;
}) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-1">
      <div className="grid gap-6 sm:grid-cols-2">
        <form.AppField name="department">
          {(field: any) => (
            <field.Select
              label="Primary Department"
              onValueChange={(val: string) => {
                onDepartmentNameChange(val, () => form.setFieldValue("role", ""));
              }}
            >
              {departments.map((opt) => (
                <SelectItem key={opt._id} value={opt.name}>
                  {opt.name}
                </SelectItem>
              ))}
            </field.Select>
          )}
        </form.AppField>
        <form.Subscribe selector={(state: any) => state.values.department}>
          {(deptName: string) => (
            <form.AppField name="role">
              {(field: any) => (
                <field.Select label="Specific Role" disabled={!deptName}>
                  {roles.map((opt) => (
                    <SelectItem key={opt._id} value={opt.name}>
                      {opt.name}
                    </SelectItem>
                  ))}
                </field.Select>
              )}
            </form.AppField>
          )}
        </form.Subscribe>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <form.AppField name="currentPosition">
          {(field: any) => (
            <field.Select label="Position Level">
              {POSITIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </field.Select>
          )}
        </form.AppField>
        <form.AppField name="industry">
          {(field: any) => (
            <field.Select label="Target Industry">
              {INDUSTRIES.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </field.Select>
          )}
        </form.AppField>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <form.AppField name="totalExperience">
          {(field: any) => (
            <field.Input
              label="Total Experience"
              placeholder="e.g. 5 years or 3 years 6 months"
            />
          )}
        </form.AppField>
        <form.AppField name="educationalQualification">
          {(field: any) => (
            <field.Select label="Academic Qualification">
              {QUALIFICATIONS_ACADEMIC.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </field.Select>
          )}
        </form.AppField>
        <form.AppField name="professionalQualification">
          {(field: any) => (
            <field.Select label="Professional Qualification">
              {QUALIFICATIONS_PROFESSIONAL.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </field.Select>
          )}
        </form.AppField>
      </div>
    </div>
  );
}
