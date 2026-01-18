"use client";

import { useMemo, useCallback } from "react";
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
import { MoreHorizontal, Pencil, Trash2, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";

// CSV Export utility
const exportToCSV = (data: Appointment[], filename: string) => {
  const headers = [
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
    "Event",
    "Preferred Time",
    "Status",
    "Created At",
  ];

  const rows = data.map((a) => [
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
    a.event?.title || "",
    a.preferredAt ? new Date(a.preferredAt).toLocaleString() : "",
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

type Appointment = {
  id: string;
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
  preferredAt?: string | null;
  createdAt: string;
  event?: { title: string };
  country?: { name: string };
};

const statusOptions = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
] as const;

const AppointmentsPage = () => {
  const router = useRouter();
  const { table, isLoading, error, pagination, refetch } =
    useDataTable<Appointment>({
      endpoint: "/api/appointments",
      columns: [],
      enableServerSidePagination: true,
      enableServerSideSorting: true,
      enableServerSideFiltering: true,
      pageSize: 10,
      filterColumnKey: "name",
    });

  const deleteDialog = useConfirmDialog<Appointment>({
    title: "Delete Appointment",
    getDescription: (appointment) =>
      `Are you sure you want to delete appointment for "${appointment.name}"? This action cannot be undone.`,
    onConfirm: async (appointment) => {
      const res = await fetch(`/api/appointments?id=${appointment.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to delete appointment");
      } else {
        toast.success("Appointment deleted successfully");
        refetch();
      }
    },
  });

  const updateStatus = useCallback(
    async (appointment: Appointment, nextStatus: string) => {
      const res = await fetch("/api/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appointment.id, status: nextStatus }),
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

  const columns: ColumnDef<Appointment>[] = useMemo(
    () => [
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
        id: "event",
        header: "Event",
        cell: ({ row }) => row.original.event?.title || "-",
      },
      {
        id: "preferredAt",
        header: "Preferred Time",
        cell: ({ row }) =>
          row.original.preferredAt
            ? new Date(row.original.preferredAt).toLocaleString()
            : "-",
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
                  row.original.status === "CONFIRMED"
                    ? "default"
                    : row.original.status === "CANCELLED"
                    ? "destructive"
                    : row.original.status === "COMPLETED"
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
          const appointment = row.original;
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
                      `/dashboard/appointments/${appointment.id}/edit`
                    );
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deleteDialog.openDialog(appointment)}
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
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">
          Review consultation appointments submitted from public forms.
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
        filterPlaceholder="Search appointments..."
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        toolbar={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const res = await fetch("/api/appointments?limit=10000");
                  if (res.ok) {
                    const result = await res.json();
                    const data = Array.isArray(result)
                      ? result
                      : result.data || [];
                    if (data.length === 0) {
                      toast.error("No appointments to export");
                      return;
                    }
                    exportToCSV(data, "appointments");
                    toast.success(`Exported ${data.length} appointments`);
                  } else {
                    toast.error("Failed to fetch data for export");
                  }
                } catch {
                  toast.error("Export failed");
                }
              }}
            >
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

export default AppointmentsPage;
