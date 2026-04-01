"use client";

import {
  FileSpreadsheet,
  Trash2,
  Eye,
  FilterX,
  Plus,
  Edit,
  UserCheck,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCrud } from "@/hooks/use-crud";
import { DataTable, Column } from "@/components/dashboard/data-table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { CrudModal } from "@/components/dashboard/crud-modal";
import { useState, useMemo, useEffect } from "react";
import { useAppForm } from "@/hooks/use-field-context";
import { toast } from "sonner";

/* ───────── Option lists ───────── */
const POSITIONS = [
  "Strategic Level",
  "Management Level",
  "Mid Level",
  "Entry Level",
];

const INDUSTRIES = [
  "Manufacturing",
  "Service",
  "Financial Institutions",
  "Real Estate & Construction",
  "Telecom",
  "Energy & Power",
];

const EXPERIENCE_RANGES = [
  "0-3 Years",
  "4-7 Years",
  "8-12 Years",
  "13-18 Years",
  "19+ Years",
];

const AVAILABILITY = ["Immediate", "15 Days", "1 Month+"];

const LOCATIONS = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Outside Bangladesh",
];

const ACADEMIC_QUALIFICATIONS = ["BBA / MBA", "BSc / MSc"];
const PROFESSIONAL_QUALIFICATIONS = [
  "CA (ICAB)",
  "CMA (ICMAB)",
  "ACCA",
  "CIMA",
];

/* ───────── Types ───────── */
interface CandidateLead {
  _id?: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  professionalQualification: string;
  educationalQualification: string;
  totalExperience: string;
  currentPosition: string;
  department: string;
  role: string;
  currentOrganization: string;
  previousOrganizations: string;
  industry: string;
  currentSalary: string;
  expectedSalary: string;
  availableFromDate: string;
  location: string;
  cvUrl: string;
  status: string;
  submittedAt: string;
}

/* ───────── Form Component ───────── */
function CandidateForm({
  editingItem,
  onSuccess,
  create,
  update,
  departments,
  roles,
}: {
  editingItem: CandidateLead | null;
  onSuccess: () => void;
  create: (data: any) => Promise<boolean>;
  update: (id: string, data: any) => Promise<boolean>;
  departments: string[];
  roles: string[];
}) {
  const form = useAppForm({
    defaultValues: editingItem || {
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
    },
    onSubmit: async ({ value }: { value: any }) => {
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
              <field.Select label="Total Experience">
                {EXPERIENCE_RANGES.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </field.Select>
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
            {(field: any) => (
              <field.Select label="Professional Qualification">
                {PROFESSIONAL_QUALIFICATIONS.map((q) => (
                  <SelectItem key={q} value={q}>
                    {q}
                  </SelectItem>
                ))}
              </field.Select>
            )}
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

/* ───────── Main Page ───────── */
export default function CandidatesPage() {
  const { items, isLoading, create, update, remove } = useCrud<CandidateLead>(
    "/api/salary-guide-leads",
  );

  const [deleteTarget, setDeleteTarget] = useState<CandidateLead | null>(null);
  const [viewLead, setViewLead] = useState<CandidateLead | null>(null);
  const [previewCv, setPreviewCv] = useState<{
    url: string;
    candidateName: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CandidateLead | null>(null);

  /* ── Filter state ── */
  const [filters, setFilters] = useState({
    department: "__all__",
    role: "__all__",
    currentPosition: "__all__",
    industry: "__all__",
    educationalQualification: "__all__",
    professionalQualification: "__all__",
    totalExperience: "__all__",
    availableFromDate: "__all__",
    location: "__all__",
  });

  const [departments, setDepartments] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data.map((d: any) => d.name)));

    fetch("/api/roles")
      .then((res) => res.json())
      .then((data) => setRoles(data.map((r: any) => r.name)));
  }, []);

  const setFilter = (key: string, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () =>
    setFilters({
      department: "__all__",
      role: "__all__",
      currentPosition: "__all__",
      industry: "__all__",
      educationalQualification: "__all__",
      professionalQualification: "__all__",
      totalExperience: "__all__",
      availableFromDate: "__all__",
      location: "__all__",
    });

  const hasActiveFilters = Object.values(filters).some((v) => v !== "__all__");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      for (const [key, value] of Object.entries(filters)) {
        if (value === "__all__") continue;
        if ((item as any)[key] !== value) return false;
      }
      return true;
    });
  }, [items, filters]);

  const getInlineCvUrl = (url: string) => {
    // Add fl_inline flag to Cloudinary URLs to serve with Content-Disposition: inline
    if (url.includes("res.cloudinary.com")) {
      return url.replace("/upload/", "/upload/fl_inline/");
    }
    return url;
  };

  const columns: Column<CandidateLead>[] = [
    { key: "fullName", label: "Candidate", sortable: true },
    { key: "email", label: "Email" },
    { key: "department", label: "Dept" },
    { key: "role", label: "Role" },
    { key: "currentPosition", label: "Level" },
    { key: "totalExperience", label: "Exp." },
    {
      key: "submittedAt",
      label: "Reg. Date",
      render: (item) => new Date(item.submittedAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        icon={UserCheck}
        title="Candidate CV Bank"
        description="Search and manage elite candidate profiles"
        action={
          <Button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> Add Candidate
          </Button>
        }
      />

      {/* ── Filter Bar ── */}
      <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Filter Candidates
          </h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 text-xs gap-1.5"
            >
              <FilterX className="h-3.5 w-3.5" /> Clear All
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries({
            department: departments,
            role: roles,
            currentPosition: POSITIONS,
            industry: INDUSTRIES,
            totalExperience: EXPERIENCE_RANGES,
            location: LOCATIONS,
          }).map(([key, options]) => (
            <Select
              key={key}
              value={(filters as any)[key]}
              onValueChange={(v) => setFilter(key, v)}
            >
              <SelectTrigger className="h-8 w-37.5 text-xs">
                <SelectValue
                  placeholder={key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__" className="text-xs">
                  All {key}
                </SelectItem>
                {options.map((opt: string) => (
                  <SelectItem key={opt} value={opt} className="text-xs">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </div>

      <DataTable
        title={`All Candidates (${filteredItems.length})`}
        columns={columns}
        data={filteredItems}
        isLoading={isLoading}
        searchKeys={[
          "fullName",
          "email",
          "industry",
          "currentPosition",
          "role",
        ]}
        actions={(item) => (
          <div className="flex gap-1">
            {item.cvUrl ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setPreviewCv({
                    url: item.cvUrl,
                    candidateName: item.fullName,
                  })
                }
              >
                <FileSpreadsheet className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                <FileSpreadsheet className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary"
              onClick={() => setViewLead(item)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setEditingItem(item);
                setIsModalOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => setDeleteTarget(item)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <CrudModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Candidate" : "Register Candidate"}
        className="max-w-4xl"
      >
        <CandidateForm
          editingItem={editingItem}
          departments={departments}
          roles={roles}
          onSuccess={() => setIsModalOpen(false)}
          create={create}
          update={update}
        />
      </CrudModal>

      {/* View Lead Detail */}
      <CrudModal
        open={!!viewLead}
        onClose={() => setViewLead(null)}
        title="Candidate Profile"
        className="max-w-2xl"
      >
        {viewLead && (
          <div className="space-y-3 text-sm max-h-[70vh] overflow-y-auto pr-2">
            {[
              ["Full Name", viewLead.fullName],
              ["Email", viewLead.email],
              ["Mobile", viewLead.mobileNumber],
              ["Department", viewLead.department],
              ["Role", viewLead.role],
              ["Level", viewLead.currentPosition],
              ["Industry", viewLead.industry],
              ["Current Company", viewLead.currentOrganization],
              ["Edu. Qualification", viewLead.educationalQualification],
              ["Prof. Qualification", viewLead.professionalQualification],
              ["Experience", viewLead.totalExperience],
              ["Current Salary", viewLead.currentSalary],
              ["Expected Salary", viewLead.expectedSalary],
              ["Availability", viewLead.availableFromDate],
              ["Location", viewLead.location],
              [
                "Registration Date",
                new Date(viewLead.submittedAt).toLocaleString(),
              ],
            ].map(([label, val]) => (
              <div
                key={label}
                className="flex justify-between border-b border-border pb-2"
              >
                <span className="font-semibold text-muted-foreground  ">
                  {label}
                </span>
                <span className="text-right max-w-[60%] font-medium">
                  {val || "—"}
                </span>
              </div>
            ))}
            <div className="rounded-lg border border-border bg-card/60 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-muted-foreground">CV Link</span>
                {viewLead.cvUrl ? (
                  <a
                    href={viewLead.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    Open original
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
              {viewLead.cvUrl ? (
                <a
                  href={viewLead.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate rounded-md bg-muted px-2.5 py-2 text-xs text-primary hover:bg-muted/80"
                  title={viewLead.cvUrl}
                >
                  {viewLead.cvUrl}
                </a>
              ) : (
                <span className="text-sm font-medium">Not provided</span>
              )}
            </div>
            {viewLead.cvUrl && (
              <div className="pt-4 text-center">
                <Button
                  className="w-full"
                  onClick={() =>
                    setPreviewCv({
                      url: viewLead.cvUrl,
                      candidateName: viewLead.fullName,
                    })
                  }
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Preview Candidate CV
                </Button>
              </div>
            )}
          </div>
        )}
      </CrudModal>

      <CrudModal
        open={!!previewCv}
        onClose={() => setPreviewCv(null)}
        title={
          previewCv ? `${previewCv.candidateName} - CV Preview` : "CV Preview"
        }
        className="max-w-5xl"
      >
        {previewCv && (
          <div className="space-y-4">
            <div className="rounded-xl border border-primary/20 bg-linear-to-r from-primary/5 via-background to-background p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base font-semibold">Live CV Preview</p>
                  <p className="text-xs text-muted-foreground">
                    Reviewing {previewCv.candidateName}&apos;s latest CV submission
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={previewCv.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-1.5 h-4 w-4" />
                      Open Original
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="h-[75vh] w-full overflow-hidden rounded-xl border border-border bg-muted/20 shadow-inner">
              <iframe
                src={getInlineCvUrl(previewCv.url)}
                title="Candidate CV Preview"
                className="h-full w-full"
              />
            </div>
            <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
              If the preview appears blank, the source file host may be forcing downloads. Use Open Original for direct access.
            </div>
          </div>
        )}
      </CrudModal>

      <DeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => remove(deleteTarget!._id!)}
        title="Delete Candidate Record"
      />
    </div>
  );
}
