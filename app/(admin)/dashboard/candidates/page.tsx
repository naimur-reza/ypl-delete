"use client";

import { FileSpreadsheet, Trash2, Eye, FilterX, Plus, Edit, UserCheck, Loader2 } from "lucide-react";
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

const STATUSES = ["New", "Contacted", "Qualified", "Converted"];

const ACADEMIC_QUALIFICATIONS = ["BBA / MBA", "BSc / MSc"];
const PROFESSIONAL_QUALIFICATIONS = ["CA (ICAB)", "CMA (ICMAB)", "ACCA", "CIMA"];

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
      const ok = editingItem?._id ? await update(editingItem._id, value) : await create(value);
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
            {(field: any) => <field.Input label="Email Address" type="email" required />}
          </form.AppField>
          <form.AppField name="mobileNumber">
            {(field: any) => <field.Input label="Mobile Number" required />}
          </form.AppField>
          <form.AppField name="location">
            {(field: any) => (
              <field.Select label="Location">
                {LOCATIONS.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>

          <form.AppField name="department">
            {(field: any) => (
              <field.Select label="Primary Department">
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>
          <form.AppField name="role">
            {(field: any) => (
              <field.Select label="Specific Role">
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>

          <form.AppField name="currentPosition">
            {(field: any) => (
              <field.Select label="Position Level">
                {POSITIONS.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>
          <form.AppField name="industry">
            {(field: any) => (
              <field.Select label="Industry Experience">
                {INDUSTRIES.map((i) => (
                  <SelectItem key={i} value={i}>{i}</SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>

          <form.AppField name="totalExperience">
            {(field: any) => (
              <field.Select label="Total Experience">
                {EXPERIENCE_RANGES.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>
          <form.AppField name="availableFromDate">
            {(field: any) => (
              <field.Select label="Notice Period / Availability">
                {AVAILABILITY.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>

          <form.AppField name="educationalQualification">
            {(field: any) => (
              <field.Select label="Academic Qualification">
                {ACADEMIC_QUALIFICATIONS.map((q) => (
                  <SelectItem key={q} value={q}>{q}</SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>
          <form.AppField name="professionalQualification">
            {(field: any) => (
              <field.Select label="Professional Qualification">
                {PROFESSIONAL_QUALIFICATIONS.map((q) => (
                  <SelectItem key={q} value={q}>{q}</SelectItem>
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
          {(field: any) => <field.FileUpload label="Upload Candidate CV" required />}
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
                ) : (
                  editingItem ? "Update Profile" : "Register Candidate"
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
    status: "__all__",
  });

  const [departments, setDepartments] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/departments")
      .then(res => res.json())
      .then(data => setDepartments(data.map((d: any) => d.name)));
    
    fetch("/api/roles")
      .then(res => res.json())
      .then(data => setRoles(data.map((r: any) => r.name)));
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
      status: "__all__",
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

  const handleStatusChange = async (id: string, status: string) => {
    await update(id, { status } as any);
  };

  const columns: Column<CandidateLead>[] = [
    { key: "fullName", label: "Candidate", sortable: true },
    { key: "email", label: "Email" },
    { key: "department", label: "Dept" },
    { key: "role", label: "Role" },
    { key: "currentPosition", label: "Level" },
    { key: "totalExperience", label: "Exp." },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Select
          value={item.status}
          onValueChange={(v) => handleStatusChange(item._id!, v)}
        >
          <SelectTrigger className="h-7 w-[110px] text-[11px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="text-xs">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
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
          <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Add Candidate
          </Button>
        }
      />

      {/* ── Filter Bar ── */}
      <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Filter Candidates</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs gap-1.5">
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
            status: STATUSES,
          }).map(([key, options]) => (
            <Select key={key} value={(filters as any)[key]} onValueChange={(v) => setFilter(key, v)}>
              <SelectTrigger className="h-8 w-[150px] text-xs">
                <SelectValue placeholder={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__" className="text-xs">All {key}</SelectItem>
                {options.map((opt: string) => (
                  <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
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
        searchKeys={["fullName", "email", "industry", "currentPosition", "role"]}
        actions={(item) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => setViewLead(item)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingItem(item); setIsModalOpen(true); }}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(item)}>
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
              ["CV Link", viewLead.cvUrl || "Not provided"],
              ["Status", viewLead.status],
              ["Registration Date", new Date(viewLead.submittedAt).toLocaleString()],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between border-b border-border pb-2">
                <span className="font-semibold text-muted-foreground italic">{label}</span>
                <span className="text-right max-w-[60%] font-medium">{val || "—"}</span>
              </div>
            ))}
            {viewLead.cvUrl && (
              <div className="pt-4 text-center">
                <Button asChild className="w-full">
                  <a href={viewLead.cvUrl} target="_blank" rel="noopener">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Open Candidate CV
                  </a>
                </Button>
              </div>
            )}
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
