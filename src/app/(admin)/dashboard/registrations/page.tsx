"use client";

import { useMemo, useCallback, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { MoreHorizontal, Pencil, Trash2, Download, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";

// CSV Export utility
const exportToCSV = (data: Registration[], filename: string) => {
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
    "Status",
    "Created At",
  ];

  const rows = data.map((r) => [
    r.name || "",
    r.email || "",
    r.phone || "",
    r.city || "",
    r.addressCountry || "",
    r.studyDestination || "",
    r.lastQualification || "",
    r.englishTest || "",
    r.englishTestScore || "",
    (r.additionalInfo || "").replace(/[\n\r]+/g, " "),
    r.event?.title || "",
    r.status || "",
    r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "",
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

type Registration = {
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
  createdAt: string;
  event?: { title: string };
  country?: { name: string };
};

const statusOptions = ["PENDING", "CONFIRMED", "CANCELLED"] as const;

const RegistrationsPage = () => {
  const router = useRouter();
  const [exportStartDate, setExportStartDate] = useState<string>("");
  const [exportEndDate, setExportEndDate] = useState<string>("");
  const [isExportDatePickerOpen, setIsExportDatePickerOpen] = useState(false);
  const { table, isLoading, error, pagination, refetch } =
    useDataTable<Registration>({
      endpoint: "/api/event-registrations",
      columns: [],
      enableServerSidePagination: true,
      enableServerSideSorting: true,
      enableServerSideFiltering: true,
      pageSize: 10,
      filterColumnKey: "name",
    });

  const deleteDialog = useConfirmDialog<Registration>({
    title: "Delete Registration",
    getDescription: (registration) =>
      `Are you sure you want to delete registration for "${registration.name}"? This action cannot be undone.`,
    onConfirm: async (registration) => {
      const res = await fetch(
        `/api/event-registrations?id=${registration.id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to delete registration");
      } else {
        toast.success("Registration deleted successfully");
        refetch();
      }
    },
  });

  const updateStatus = useCallback(
    async (registration: Registration, nextStatus: string) => {
      const res = await fetch("/api/event-registrations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: registration.id, status: nextStatus }),
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

  const columns: ColumnDef<Registration>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phone",
        header: "Phone",
      },
      {
        id: "address",
        header: "Address",
        cell: ({ row }) => {
          const city = row.original.city;
          const country = row.original.addressCountry;
          if (!city && !country) return "-";
          return [city, country].filter(Boolean).join(", ");
        },
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
          const registration = row.original;
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
                      `/dashboard/registrations/${registration.id}/edit`
                    );
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deleteDialog.openDialog(registration)}
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
        <h1 className="text-3xl font-bold tracking-tight">
          Event Registrations
        </h1>
        <p className="text-muted-foreground">
          Manage attendee registrations submitted from public event pages.
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
        filterPlaceholder="Search registrations..."
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        toolbar={
          <div className="flex gap-2">
            <Popover open={isExportDatePickerOpen} onOpenChange={setIsExportDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Export Date Range
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Select date range to filter exported registrations (optional)
                    </p>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="start-date-reg" className="text-xs">
                        Start Date
                      </Label>
                      <Input
                        id="start-date-reg"
                        type="date"
                        value={exportStartDate}
                        onChange={(e) => setExportStartDate(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="end-date-reg" className="text-xs">
                        End Date
                      </Label>
                      <Input
                        id="end-date-reg"
                        type="date"
                        value={exportEndDate}
                        onChange={(e) => setExportEndDate(e.target.value)}
                        min={exportStartDate || undefined}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={async () => {
                        try {
                          const params = new URLSearchParams();
                          params.append("limit", "10000");
                          if (exportStartDate) {
                            params.append("startDate", exportStartDate);
                          }
                          if (exportEndDate) {
                            params.append("endDate", exportEndDate);
                          }
                          
                          const res = await fetch(
                            `/api/event-registrations?${params.toString()}`
                          );
                          if (res.ok) {
                            const result = await res.json();
                            const data = Array.isArray(result)
                              ? result
                              : result.data || [];
                            if (data.length === 0) {
                              toast.error("No registrations to export");
                              return;
                            }
                            
                            // Filter by date range if needed (fallback if API doesn't support it)
                            let filteredData = data;
                            if (exportStartDate || exportEndDate) {
                              filteredData = data.filter((r: Registration) => {
                                const createdAt = new Date(r.createdAt);
                                if (exportStartDate && createdAt < new Date(exportStartDate)) {
                                  return false;
                                }
                                if (exportEndDate) {
                                  const endDate = new Date(exportEndDate);
                                  endDate.setHours(23, 59, 59, 999);
                                  if (createdAt > endDate) {
                                    return false;
                                  }
                                }
                                return true;
                              });
                            }
                            
                            exportToCSV(filteredData, "event-registrations");
                            const dateInfo = exportStartDate || exportEndDate
                              ? ` (${exportStartDate || "start"} to ${exportEndDate || "end"})`
                              : "";
                            toast.success(`Exported ${filteredData.length} registrations${dateInfo}`);
                            setIsExportDatePickerOpen(false);
                            setExportStartDate("");
                            setExportEndDate("");
                          } else {
                            toast.error("Failed to fetch data for export");
                          }
                        } catch {
                          toast.error("Export failed");
                        }
                      }}
                      className="flex-1"
                      size="sm"
                    >
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setExportStartDate("");
                        setExportEndDate("");
                      }}
                      size="sm"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button onClick={refetch}>Refresh</Button>
          </div>
        }
      />
    </div>
  );
};

export default RegistrationsPage;
