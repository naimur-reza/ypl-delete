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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type Appointment = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
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
        id: "country",
        header: "Country",
        cell: ({ row }) => row.original.country?.name || "Global",
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
    ],
    [updateStatus]
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

      <DataTable
        table={table}
        columns={columns}
        filterColumnKey="name"
        filterPlaceholder="Search appointments..."
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        toolbar={<Button onClick={refetch}>Refresh</Button>}
      />
    </div>
  );
};

export default AppointmentsPage;
