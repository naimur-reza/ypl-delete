"use client";

import {
  FileSpreadsheet,
  Trash2,
  Eye,
  Plus,
  Edit,
  UserCheck,
  ExternalLink,
  TriangleAlert,
  Download,
  Bell,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCrud } from "@/hooks/use-crud";
import { DataTable, Column } from "@/components/dashboard/data-table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { CrudModal } from "@/components/dashboard/crud-modal";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  exportCandidateProfileCardsPdf,
  exportCandidateSummaryPdf,
} from "@/lib/export/candidate-pdf";
import { buildSalaryGuideLeadsListUrl } from "@/lib/salary-guide-leads-url";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CandidateForm } from "@/components/dashboard/candidates/CandidateForm";
import {
  CandidateFiltersPanel,
  type CandidateFiltersState,
} from "@/components/dashboard/candidates/CandidateFiltersPanel";
import type { CandidateLead } from "@/components/dashboard/candidates/types";
import {
  getInlineCvUrl,
  isCvExpired,
} from "@/components/dashboard/candidates/candidate-utils";

const defaultFilters = (): CandidateFiltersState => ({
  department: "__all__",
  role: "__all__",
  industry: "__all__",
  location: "__all__",
  educationalQualification: "__all__",
  professionalQualification: "__all__",
  currentPosition: "__all__",
  availability: "__all__",
  onlyExpired: false,
  hasCv: false,
  registrationFrom: "",
  registrationTo: "",
});

export default function CandidatesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();

  const [keyword, setKeyword] = useState(query.get("q") || "");
  const [debouncedKeyword, setDebouncedKeyword] = useState(
    query.get("q") || "",
  );
  const [experienceMin, setExperienceMin] = useState(query.get("expMin") || "");
  const [experienceMax, setExperienceMax] = useState(query.get("expMax") || "");
  const [debouncedExpMin, setDebouncedExpMin] = useState(
    query.get("expMin") || "",
  );
  const [debouncedExpMax, setDebouncedExpMax] = useState(
    query.get("expMax") || "",
  );

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState<number>(() =>
    Number(query.get("page") || "1"),
  );
  const [pageSize, setPageSize] = useState<number>(() =>
    Number(query.get("limit") || "25"),
  );
  const [meta, setMeta] = useState<{
    page: number;
    totalPages: number;
    total: number;
    hasPrev: boolean;
    hasNext: boolean;
  }>({
    page: 1,
    totalPages: 1,
    total: 0,
    hasPrev: false,
    hasNext: false,
  });
  const [exportModeOpen, setExportModeOpen] = useState(false);
  const [exportSource, setExportSource] = useState<"all" | "selected">("all");
  const [notifyTarget, setNotifyTarget] = useState<CandidateLead | null>(null);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [sortState, setSortState] = useState<{
    key: string;
    dir: "asc" | "desc";
  }>({
    key: query.get("sortKey") || "",
    dir: query.get("sortDir") === "desc" ? "desc" : "asc",
  });

  const [filters, setFilters] = useState<CandidateFiltersState>(() => ({
    department: query.get("department") || "__all__",
    role: query.get("role") || "__all__",
    industry: query.get("industry") || "__all__",
    location: query.get("location") || "__all__",
    educationalQualification: query.get("education") || "__all__",
    professionalQualification:
      query.get("professionalQualification") || "__all__",
    currentPosition: query.get("currentPosition") || "__all__",
    availability: query.get("availability") || "__all__",
    onlyExpired: query.get("onlyExpired") === "true",
    hasCv: query.get("hasCv") === "true",
    registrationFrom: query.get("registrationFrom") || "",
    registrationTo: query.get("registrationTo") || "",
  }));

  const listEndpoint = useMemo(
    () =>
      buildSalaryGuideLeadsListUrl({
        q: debouncedKeyword.trim() || undefined,
        department:
          filters.department === "__all__" ? undefined : filters.department,
        role: filters.role === "__all__" ? undefined : filters.role,
        industry: filters.industry === "__all__" ? undefined : filters.industry,
        location: filters.location === "__all__" ? undefined : filters.location,
        education:
          filters.educationalQualification === "__all__"
            ? undefined
            : filters.educationalQualification,
        professionalQualification:
          filters.professionalQualification === "__all__"
            ? undefined
            : filters.professionalQualification,
        currentPosition:
          filters.currentPosition === "__all__"
            ? undefined
            : filters.currentPosition,
        availability:
          filters.availability === "__all__" ? undefined : filters.availability,
        onlyExpired: filters.onlyExpired ? true : undefined,
        hasCv: filters.hasCv ? true : undefined,
        registrationFrom: filters.registrationFrom || undefined,
        registrationTo: filters.registrationTo || undefined,
        expMin: debouncedExpMin.trim() || undefined,
        expMax: debouncedExpMax.trim() || undefined,
        page,
        limit: pageSize,
      }),
    [
      debouncedKeyword,
      filters,
      debouncedExpMin,
      debouncedExpMax,
      page,
      pageSize,
    ],
  );

  const { items, isLoading, error, create, update, remove, refetch } =
    useCrud<CandidateLead>(listEndpoint);

  useEffect(() => {
    fetch(listEndpoint, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const m = data?.meta;
        if (m) {
          setMeta({
            page: m.page || 1,
            totalPages: m.totalPages || 1,
            total: m.total || 0,
            hasPrev: !!m.hasPrev,
            hasNext: !!m.hasNext,
          });
        }
      })
      .catch(() => {});
  }, [listEndpoint]);

  const [deleteTarget, setDeleteTarget] = useState<CandidateLead | null>(null);
  const [viewLead, setViewLead] = useState<CandidateLead | null>(null);
  const [previewCv, setPreviewCv] = useState<{
    url: string;
    candidateName: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CandidateLead | null>(null);
  const [departments, setDepartments] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(keyword), 300);
    return () => clearTimeout(t);
  }, [keyword]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedExpMin(experienceMin);
      setDebouncedExpMax(experienceMax);
    }, 300);
    return () => clearTimeout(t);
  }, [experienceMin, experienceMax]);

  useEffect(() => {
    const p = new URLSearchParams();
    if (debouncedKeyword) p.set("q", debouncedKeyword);
    if (debouncedExpMin) p.set("expMin", debouncedExpMin);
    if (debouncedExpMax) p.set("expMax", debouncedExpMax);
    if (filters.department !== "__all__")
      p.set("department", filters.department);
    if (filters.role !== "__all__") p.set("role", filters.role);
    if (filters.industry !== "__all__") p.set("industry", filters.industry);
    if (filters.location !== "__all__") p.set("location", filters.location);
    if (filters.educationalQualification !== "__all__") {
      p.set("education", filters.educationalQualification);
    }
    if (filters.professionalQualification !== "__all__") {
      p.set("professionalQualification", filters.professionalQualification);
    }
    if (filters.currentPosition !== "__all__")
      p.set("currentPosition", filters.currentPosition);
    if (filters.availability !== "__all__")
      p.set("availability", filters.availability);
    if (filters.onlyExpired) p.set("onlyExpired", "true");
    if (filters.hasCv) p.set("hasCv", "true");
    if (filters.registrationFrom)
      p.set("registrationFrom", filters.registrationFrom);
    if (filters.registrationTo) p.set("registrationTo", filters.registrationTo);
    if (sortState.key) p.set("sortKey", sortState.key);
    if (sortState.key) p.set("sortDir", sortState.dir);
    p.set("page", String(page));
    p.set("limit", String(pageSize));
    router.replace(`${pathname}?${p.toString()}`);
  }, [
    debouncedKeyword,
    debouncedExpMin,
    debouncedExpMax,
    filters,
    sortState,
    page,
    pageSize,
    pathname,
    router,
  ]);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, debouncedExpMin, debouncedExpMax, filters]);

  useEffect(() => {
    fetch("/api/departments", { credentials: "include" })
      .then((res) => res.json())
      .then((data) =>
        setDepartments(data.map((d: { name: string }) => d.name)),
      );
    fetch("/api/roles", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setRoles(data.map((r: { name: string }) => r.name)));
  }, []);

  const setFilter = (
    key: keyof CandidateFiltersState,
    value: string | boolean,
  ) => setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () => {
    setFilters(defaultFilters());
    setKeyword("");
    setExperienceMin("");
    setExperienceMax("");
    setDebouncedExpMin("");
    setDebouncedExpMax("");
  };

  const hasActiveFilters =
    !!debouncedKeyword ||
    !!debouncedExpMin ||
    !!debouncedExpMax ||
    filters.department !== "__all__" ||
    filters.role !== "__all__" ||
    filters.industry !== "__all__" ||
    filters.location !== "__all__" ||
    filters.educationalQualification !== "__all__" ||
    filters.professionalQualification !== "__all__" ||
    filters.currentPosition !== "__all__" ||
    filters.availability !== "__all__" ||
    filters.onlyExpired ||
    filters.hasCv ||
    !!filters.registrationFrom ||
    !!filters.registrationTo;

  const activeChips: Array<{ key: string; label: string; remove: () => void }> =
    [
      debouncedKeyword
        ? {
            key: "q",
            label: `Search: ${debouncedKeyword}`,
            remove: () => setKeyword(""),
          }
        : null,
      debouncedExpMin
        ? {
            key: "expMin",
            label: `Exp. min: ${debouncedExpMin} yrs`,
            remove: () => {
              setExperienceMin("");
              setDebouncedExpMin("");
            },
          }
        : null,
      debouncedExpMax
        ? {
            key: "expMax",
            label: `Exp. max: ${debouncedExpMax} yrs`,
            remove: () => {
              setExperienceMax("");
              setDebouncedExpMax("");
            },
          }
        : null,
      filters.department !== "__all__"
        ? {
            key: "department",
            label: `Department: ${filters.department}`,
            remove: () => setFilter("department", "__all__"),
          }
        : null,
      filters.role !== "__all__"
        ? {
            key: "role",
            label: `Role: ${filters.role}`,
            remove: () => setFilter("role", "__all__"),
          }
        : null,
      filters.industry !== "__all__"
        ? {
            key: "industry",
            label: `Industry: ${filters.industry}`,
            remove: () => setFilter("industry", "__all__"),
          }
        : null,
      filters.location !== "__all__"
        ? {
            key: "location",
            label: `Location: ${filters.location}`,
            remove: () => setFilter("location", "__all__"),
          }
        : null,
      filters.educationalQualification !== "__all__"
        ? {
            key: "education",
            label: `Education: ${filters.educationalQualification}`,
            remove: () => setFilter("educationalQualification", "__all__"),
          }
        : null,
      filters.professionalQualification !== "__all__"
        ? {
            key: "professionalQualification",
            label: `Professional: ${filters.professionalQualification}`,
            remove: () => setFilter("professionalQualification", "__all__"),
          }
        : null,
      filters.currentPosition !== "__all__"
        ? {
            key: "currentPosition",
            label: `Position: ${filters.currentPosition}`,
            remove: () => setFilter("currentPosition", "__all__"),
          }
        : null,
      filters.availability !== "__all__"
        ? {
            key: "availability",
            label: `Availability: ${filters.availability}`,
            remove: () => setFilter("availability", "__all__"),
          }
        : null,
      filters.onlyExpired
        ? {
            key: "onlyExpired",
            label: "Expired CVs only",
            remove: () => setFilter("onlyExpired", false),
          }
        : null,
      filters.hasCv
        ? {
            key: "hasCv",
            label: "Has CV Uploaded",
            remove: () => setFilter("hasCv", false),
          }
        : null,
      filters.registrationFrom
        ? {
            key: "registrationFrom",
            label: `Registered From: ${filters.registrationFrom}`,
            remove: () => setFilter("registrationFrom", ""),
          }
        : null,
      filters.registrationTo
        ? {
            key: "registrationTo",
            label: `Registered To: ${filters.registrationTo}`,
            remove: () => setFilter("registrationTo", ""),
          }
        : null,
    ].filter(Boolean) as Array<{
      key: string;
      label: string;
      remove: () => void;
    }>;

  const selectedCandidates = useMemo(
    () => items.filter((i) => i._id && selectedIds.includes(i._id)),
    [items, selectedIds],
  );

  const handleExport = (format: "summary" | "cards") => {
    const data = exportSource === "selected" ? selectedCandidates : items;
    if (!data.length) {
      toast.error("No candidates to export");
      return;
    }
    if (format === "summary") exportCandidateSummaryPdf(data);
    else exportCandidateProfileCardsPdf(data);
    setExportModeOpen(false);
  };

  const handleSendNotification = async () => {
    if (!notifyTarget?._id) return;
    try {
      setIsSendingNotification(true);
      const res = await fetch("/api/candidates/notify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: notifyTarget._id,
          email: notifyTarget.email,
          fullName: notifyTarget.fullName,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to send notification");
      }
      toast.success(`Notification sent to ${notifyTarget.fullName}`);
      setNotifyTarget(null);
      await refetch();
    } catch (_error) {
      toast.error("Failed to send notification. Please try again.");
    } finally {
      setIsSendingNotification(false);
    }
  };

  const columns: Column<CandidateLead>[] = [
    {
      key: "fullName",
      label: "Candidate",
      sortable: true,
      hideable: false,
      cellClassName: "max-w-[220px]",
      render: (item) => {
        const expired = isCvExpired(item);
        const missing = [
          !item.role ? "Role" : null,
          !item.currentPosition ? "Current Position" : null,
          !item.professionalQualification ? "Professional Qualification" : null,
          !item.cvUrl ? "CV" : null,
        ].filter(Boolean) as string[];
        return (
          <div className="flex items-center gap-2">
            <span>{item.fullName}</span>
            {expired && (
              <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                CV Outdated
              </span>
            )}
            {missing.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <TriangleAlert className="h-3.5 w-3.5 text-amber-500" />
                </TooltipTrigger>
                <TooltipContent>Missing: {missing.join(", ")}</TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      key: "email",
      label: "Email",
      headerClassName: "hidden 2xl:table-cell",
      cellClassName: "hidden 2xl:table-cell max-w-[220px] truncate",
    },
    {
      key: "department",
      label: "Dept",
      headerClassName: "hidden xl:table-cell",
      cellClassName: "hidden xl:table-cell max-w-[140px] truncate",
    },
    {
      key: "role",
      label: "Role",
      hideable: false,
      cellClassName: "max-w-[140px] truncate",
    },
    {
      key: "currentPosition",
      label: "Level",
      headerClassName: "hidden xl:table-cell",
      cellClassName: "hidden xl:table-cell max-w-[140px] truncate",
    },
    { key: "totalExperience", label: "Exp.", sortable: true },
    {
      key: "expectedSalary",
      label: "Expected Salary",
      sortable: true,
      headerClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell",
    },
    {
      key: "createdAt",
      label: "Reg. Date",
      sortable: true,
      render: (item) =>
        new Date(item.createdAt || item.submittedAt || "").toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      headerClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
      render: (item) => (
        <Select
          value={item.status || "New"}
          onValueChange={async (v) => {
            if (!item._id) return;
            const ok = await update(item._id, { status: v });
            if (ok) refetch();
          }}
        >
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["New", "Contacted", "Qualified", "Converted"].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
  ];

  const sortAccessor = (item: CandidateLead, key: string) => {
    if (key === "totalExperience") {
      const n = Number(
        String(item.totalExperience || "").match(/\d+/)?.[0] || 0,
      );
      return n;
    }
    if (key === "expectedSalary") {
      return (
        Number(String(item.expectedSalary || "").replace(/[^\d.]/g, "")) || 0
      );
    }
    if (key === "createdAt") {
      const d = new Date(item.createdAt || item.submittedAt || "");
      return Number.isNaN(d.getTime()) ? 0 : d.getTime();
    }
    const v = (item as unknown as Record<string, string | number | undefined>)[
      key
    ];
    return v ?? "";
  };

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

      {error && !isLoading ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load candidates</AlertTitle>
          <AlertDescription className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <CandidateFiltersPanel
        keyword={keyword}
        onKeywordChange={setKeyword}
        showAdvanced={showAdvanced}
        onToggleAdvanced={() => setShowAdvanced((x) => !x)}
        filters={filters}
        setFilter={setFilter}
        clearFilters={() => {}}
        departments={departments}
        roles={roles}
        experienceMin={experienceMin}
        experienceMax={experienceMax}
        onExperienceMinChange={setExperienceMin}
        onExperienceMaxChange={setExperienceMax}
        activeChips={activeChips}
        hasActiveFilters={hasActiveFilters}
        onClearAll={clearFilters}
      />

      <DataTable
        title={`Showing ${items.length} of ${meta.total} candidates`}
        columns={columns}
        columnVisibilityStorageKey="candidate-cv-bank"
        data={items}
        isLoading={isLoading}
        searchKeys={[]}
        pageSize={pageSize}
        hidePagination
        sortState={sortState}
        onSortChange={setSortState}
        sortAccessor={sortAccessor}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        rowClassName={(item) => (isCvExpired(item) ? "bg-amber-50/60" : "")}
        headerAction={
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <Button
                size="sm"
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() =>
                  router.push(
                    `/dashboard/cv-bundles/new?ids=${encodeURIComponent(selectedIds.join(","))}`,
                  )
                }
              >
                Bundle Selected ({selectedIds.length})
              </Button>
            )}
            {selectedIds.length > 0 && (
              <Button
                size="sm"
                onClick={() => {
                  setExportSource("selected");
                  setExportModeOpen(true);
                }}
              >
                <Download className="mr-1.5 h-4 w-4" />
                Export Selected ({selectedIds.length})
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setExportSource("all");
                setExportModeOpen(true);
              }}
            >
              <Download className="mr-1.5 h-4 w-4" />
              Export All
            </Button>
          </div>
        }
        actions={(item) => (
          <div className="flex items-center gap-1 rounded-md border border-border/60 bg-muted/20 px-1 py-0.5">
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 rounded-md ${isCvExpired(item) ? "text-amber-600 hover:text-amber-700" : "text-muted-foreground"}`}
              onClick={() => setNotifyTarget(item)}
            >
              <Bell className="h-4 w-4" />
            </Button>
            {item.cvUrl ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md"
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
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md"
                disabled
              >
                <FileSpreadsheet className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md text-primary"
              onClick={() => setViewLead(item)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md"
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
              className="h-7 w-7 rounded-md text-destructive"
              onClick={() => setDeleteTarget(item)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              setPageSize(Number(v));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[110px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[25, 50, 100, 200].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={!meta.hasPrev || isLoading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!meta.hasNext || isLoading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

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

      <CrudModal
        open={!!viewLead}
        onClose={() => setViewLead(null)}
        title="Candidate Profile"
        className="max-w-2xl"
      >
        {viewLead && (
          <div className="space-y-3 text-sm max-h-[70vh] overflow-y-auto pr-2">
            {(
              [
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
                  new Date(
                    viewLead.createdAt || viewLead.submittedAt || "",
                  ).toLocaleString(),
                ],
              ] as const
            ).map(([label, val]) => (
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
                <span className="font-semibold text-muted-foreground">
                  CV Link
                </span>
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
                    Reviewing {previewCv.candidateName}&apos;s latest CV
                    submission
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
              If the preview appears blank, the source file host may be forcing
              downloads. Use Open Original for direct access.
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

      <CrudModal
        open={exportModeOpen}
        onClose={() => setExportModeOpen(false)}
        title="Export Candidate PDF"
        className="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose export format for{" "}
            {exportSource === "selected"
              ? `${selectedCandidates.length} selected`
              : `${items.length} filtered`}{" "}
            candidates.
          </p>
          <div className="grid gap-2">
            <Button onClick={() => handleExport("summary")}>
              Summary Report
            </Button>
            <Button variant="outline" onClick={() => handleExport("cards")}>
              Profile Cards
            </Button>
          </div>
        </div>
      </CrudModal>

      <AlertDialog
        open={!!notifyTarget}
        onOpenChange={(open) => !open && setNotifyTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send CV Update Request</AlertDialogTitle>
            <AlertDialogDescription>
              {notifyTarget
                ? `Send an email to ${notifyTarget.fullName} at ${notifyTarget.email} asking them to update their CV profile?`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={(e) => {
                e.preventDefault();
                handleSendNotification();
              }}
              disabled={isSendingNotification}
            >
              {isSendingNotification ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  Sending...
                </>
              ) : (
                "Send Email"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
