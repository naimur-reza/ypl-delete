"use client";

import { useMemo, useCallback, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2, Download, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// CSV Export utility
const exportToCSV = (data: IntakeLead[], filename: string) => {
  const headers = [
    "Intake Name",
    "Name",
    "Email",
    "Phone",
    "City",
    "Country",
    "Study Destination",
    "Qualification",
    "English Test",
    "Test Score",
    "Additional Info",
    "Status",
    "Created At",
  ];

  const rows = data.map((a) => [
    a.intakeName || "",
    a.name || "",
    a.email || "",
    a.phone || "",
    a.city || "",
    a.addressCountry || "",
    a.studyDestination || "",
    a.lastQualification || "",
    a.englishTest || "",
    a.englishTestScore || "",
    (a.additionalInfo || "").replace(/[\n\r]+/g, " "),
    a.status || "",
    a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

type IntakeLead = {
  id: string;
  intakeName: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  addressCountry?: string | null;
  studyDestination?: string | null;
  lastQualification?: string | null;
  englishTest?: string | null;
  englishTestScore?: string | null;
  additionalInfo?: string | null;
  status: string;
  createdAt: string;
  intakePage?: { id: string; intake: string; destination?: { name: string } };
  country?: { name: string };
};

const statusOptions = [
  "PENDING",
  "CONTACTED",
  "CONVERTED",
  "CANCELLED",
] as const;

const IntakeLeadsPage = () => {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { table, isLoading, error, pagination, refetch } =
    useDataTable<IntakeLead>({
      endpoint: "/api/intake-leads",
      columns: [],
      enableServerSidePagination: true,
      enableServerSideSorting: true,
      enableServerSideFiltering: true,
      pageSize: 10,
      filterColumnKey: "name",
    });

  const deleteDialog = useConfirmDialog<IntakeLead>({
    title: "Delete Intake Lead",
    getDescription: (lead) =>
      `Are you sure you want to delete intake lead for "${lead.name}"? This action cannot be undone.`,
    onConfirm: async (lead) => {
      const res = await fetch(`/api/intake-leads?id=${lead.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to delete intake lead");
      } else {
        toast.success("Intake lead deleted successfully");
        refetch();
      }
    },
  });

  const updateStatus = useCallback(
    async (lead: IntakeLead, nextStatus: string) => {
      const res = await fetch("/api/intake-leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id, status: nextStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to update status");
      } else {
        toast.success("Status updated");
        refetch();
      }
    },
    [refetch]
  );

  const handleExport = async () => {
    try {
      let url = "/api/intake-leads?limit=10000";
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const res = await fetch(url);
      if (res.ok) {
        const result = await res.json();
        const data = Array.isArray(result)
          ? result
          : result.data || [];
        if (data.length === 0) {
          toast.error("No intake leads to export");
          return;
        }
        exportToCSV(data, "intake-leads");
        toast.success(`Exported ${data.length} intake leads`);
      } else {
        toast.error("Failed to fetch data for export");
      }
    } catch {
      toast.error("Export failed");
    }
  };

  const columns: ColumnDef<IntakeLead>[] = useMemo(
    () => [
      {
        accessorKey: "intakeName",
        header: "Intake",
        cell: ({ row }) => (
          <span className="font-medium text-primary">
            {row.original.intakeName}
          </span>
        ),
        enableSorting: true,
      },
      { accessorKey: "name", header: "Name", enableSorting: true },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "phone", header: "Phone" },
      {
        accessorKey: "city",
        header: "City",
        cell: ({ row }) => row.original.city || "-",
      },
      {
        id: "address",
        header: "Country",
        cell: ({ row }) => row.original.addressCountry || "-",
      },
      {
        accessorKey: "studyDestination",
        header: "Study Destination",
        cell: ({ row }) => row.original.studyDestination || "-",
      },
      {
        accessorKey: "lastQualification",
        header: "Qualification",
        cell: ({ row }) => row.original.lastQualification || "-",
      },
      {
        id: "englishTest",
        header: "English Test",
        cell: ({ row }) => {
          const test = row.original.englishTest;
          const score = row.original.englishTestScore;
          if (!test) return "-";
          if (test === "None") return "None";
          return score ? `${test}: ${score}` : test;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Badge
                className="cursor-pointer"
                variant={
                  row.original.status === "CONTACTED"
                    ? "default"
                    : row.original.status === "CANCELLED"
                    ? "destructive"
                    : row.original.status === "CONVERTED"
                    ? "secondary"
                    : "outline"
                }
              >
                {row.original.status}
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Change status</DropdownMenuLabel>
              {statusOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  onClick={() => updateStatus(row.original, opt)}
                >
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(),
        enableSorting: true,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const lead = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    router.push(
                      `/dashboard/intake-leads/${lead.id}/edit`
                    );
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deleteDialog.openDialog(lead)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [updateStatus, deleteDialog, router]
  );

  if (table.options.columns.length === 0) {
    table.setOptions((prev) => ({ ...prev, columns }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Intake Leads</h1>
        <p className="text-muted-foreground">
          Manage leads submitted from intake pages. Track which intake each
          student registered for.
        </p>
      </div>

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={deleteDialog.setIsOpen}
        title={deleteDialog.title}
        description={deleteDialog.description}
        onConfirm={deleteDialog.handleConfirm}
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteDialog.isLoading}
      />

      <DataTable
        table={table}
        columns={columns}
        filterColumnKey="name"
        filterPlaceholder="Search intake leads..."
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        toolbar={
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex gap-2 items-end">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">From</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-[140px]"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">To</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-[140px]"
                />
              </div>
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={refetch}>Refresh</Button>
          </div>
        }
      />
    </div>
  );
};

export default IntakeLeadsPage;
