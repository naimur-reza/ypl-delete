"use client";

import { FileSpreadsheet, Trash2, Eye, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useState, useMemo } from "react";

/* ───────── Option lists (synced with salary-guide-modal) ───────── */
const DEPARTMENTS = [
  "Finance & Accounts",
  "Human Resources",
  "Sales & Marketing",
  "Supply Chain / Procurement",
  "Operations",
  "IT & Technology",
];

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

const QUALIFICATIONS_ACADEMIC = ["BBA / MBA", "BSc / MSc"];
const QUALIFICATIONS_PROFESSIONAL = [
  "CA (ICAB)",
  "CMA (ICMAB)",
  "ACCA",
  "CIMA",
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

/* ───────── Types ───────── */
interface SalaryGuideLead {
  _id?: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  professionalQualification: string;
  educationalQualification: string;
  totalExperience: string;
  currentPosition: string;
  department: string;
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

/* ───────── Reusable filter select ───────── */
function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-[160px] text-xs">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__all__" className="text-xs">
          All {label}
        </SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt} className="text-xs">
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/* ───────── Page ───────── */
export default function SalaryGuideLeadsPage() {
  const { items, isLoading, update, remove } = useCrud<SalaryGuideLead>(
    "/api/salary-guide-leads",
  );
  const [deleteTarget, setDeleteTarget] = useState<SalaryGuideLead | null>(
    null,
  );
  const [viewLead, setViewLead] = useState<SalaryGuideLead | null>(null);

  /* ── Filter state ── */
  const [filters, setFilters] = useState({
    department: "__all__",
    currentPosition: "__all__",
    industry: "__all__",
    educationalQualification: "__all__",
    professionalQualification: "__all__",
    totalExperience: "__all__",
    availableFromDate: "__all__",
    location: "__all__",
    status: "__all__",
  });

  const setFilter = (key: string, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () =>
    setFilters({
      department: "__all__",
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

  /* ── Filtered data ── */
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

  const columns: Column<SalaryGuideLead>[] = [
    { key: "fullName", label: "Name", sortable: true },
    { key: "email", label: "Email" },

    { key: "department", label: "Dept" },
    { key: "currentPosition", label: "Position" },
    { key: "industry", label: "Industry" },
    { key: "totalExperience", label: "Experience" },
    { key: "location", label: "Location" },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Select
          value={item.status}
          onValueChange={(v) => handleStatusChange(item._id!, v)}
        >
          <SelectTrigger className="h-7 w-[120px] text-xs">
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
      label: "Submitted",
      render: (item) => new Date(item.submittedAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileSpreadsheet}
        title="Salary Guide Leads"
        description="View and manage salary guide form submissions"
      />

      {/* ── Filter Bar ── */}
      <div className="rounded-lg border border-border/60 bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Filters</h3>
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
          <FilterSelect
            label="Department"
            value={filters.department}
            onChange={(v) => setFilter("department", v)}
            options={DEPARTMENTS}
          />
          <FilterSelect
            label="Position"
            value={filters.currentPosition}
            onChange={(v) => setFilter("currentPosition", v)}
            options={POSITIONS}
          />
          <FilterSelect
            label="Industry"
            value={filters.industry}
            onChange={(v) => setFilter("industry", v)}
            options={INDUSTRIES}
          />
          <FilterSelect
            label="Education"
            value={filters.educationalQualification}
            onChange={(v) => setFilter("educationalQualification", v)}
            options={QUALIFICATIONS_ACADEMIC}
          />
          <FilterSelect
            label="Prof. Qual."
            value={filters.professionalQualification}
            onChange={(v) => setFilter("professionalQualification", v)}
            options={QUALIFICATIONS_PROFESSIONAL}
          />
          <FilterSelect
            label="Experience"
            value={filters.totalExperience}
            onChange={(v) => setFilter("totalExperience", v)}
            options={EXPERIENCE_RANGES}
          />
          <FilterSelect
            label="Availability"
            value={filters.availableFromDate}
            onChange={(v) => setFilter("availableFromDate", v)}
            options={AVAILABILITY}
          />
          <FilterSelect
            label="Location"
            value={filters.location}
            onChange={(v) => setFilter("location", v)}
            options={LOCATIONS}
          />
          <FilterSelect
            label="Status"
            value={filters.status}
            onChange={(v) => setFilter("status", v)}
            options={STATUSES}
          />
        </div>
      </div>

      <DataTable
        title={`All Leads (${filteredItems.length})`}
        columns={columns}
        data={filteredItems}
        isLoading={isLoading}
        searchKeys={["fullName", "email", "industry", "currentPosition"]}
        actions={(item) => (
          <>
            <Button variant="ghost" size="sm" onClick={() => setViewLead(item)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteTarget(item)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </>
        )}
      />

      {/* View Lead Detail */}
      <CrudModal
        open={!!viewLead}
        onClose={() => setViewLead(null)}
        title="Lead Details"
      >
        {viewLead && (
          <div className="space-y-3 text-sm max-h-[60vh] overflow-y-auto pr-2">
            {[
              ["Full Name", viewLead.fullName],
              ["Email", viewLead.email],
              ["Mobile", viewLead.mobileNumber],
              ["Department", viewLead.department],
              ["Position / Level", viewLead.currentPosition],
              ["Industry", viewLead.industry],
              ["Current Org", viewLead.currentOrganization],
              ["Previous Orgs", viewLead.previousOrganizations],
              ["Edu. Qualification", viewLead.educationalQualification],
              ["Prof. Qualification", viewLead.professionalQualification],
              ["Experience", viewLead.totalExperience],
              ["Current Salary", viewLead.currentSalary],
              ["Expected Salary", viewLead.expectedSalary],
              ["Availability", viewLead.availableFromDate],
              ["Location", viewLead.location],
              ["CV", viewLead.cvUrl || "Not uploaded"],
              ["Status", viewLead.status],
              ["Submitted", new Date(viewLead.submittedAt).toLocaleString()],
            ].map(([label, val]) => (
              <div
                key={label}
                className="flex justify-between border-b border-border pb-2"
              >
                <span className="font-medium text-muted-foreground">
                  {label}
                </span>
                <span className="text-right max-w-[60%]">{val || "—"}</span>
              </div>
            ))}
          </div>
        )}
      </CrudModal>

      <DeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => remove(deleteTarget!._id!)}
        title="Delete Lead"
      />
    </div>
  );
}
