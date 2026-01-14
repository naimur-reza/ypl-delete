"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { createEntityApi } from "@/lib/api-client";
import { toast } from "sonner";
import { MoreHorizontal, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type IntakeType = "JANUARY" | "MAY" | "SEPTEMBER";

interface Item {
  id: string;
  title: string;
  subtitle?: string;
  intake: IntakeType;
  year: number;
 
  applicationDeadline?: string;
  createdAt: string;
  countries?: { country: { id: string; name: string } }[];
}

const api = createEntityApi<Item>("/api/intake-seasons");

export default function IntakeSeasonsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const endpoint = useMemo(
    () => `/api/intake-seasons${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`,
    [statusFilter]
  );

  const { table, isLoading, error, pagination, refetch } = useDataTable<Item>({
    endpoint,
    columns: [],
    enableServerSidePagination: true,
    enableServerSideSorting: true,
    enableServerSideFiltering: true,
    pageSize: 10,
    filterColumnKey: "title",
  });

  const deleteDialog = useConfirmDialog<Item>({
    title: "Delete Intake Season",
    getDescription: (item) =>
      `Are you sure you want to delete "${item.title}"? This action cannot be undone.`,
    onConfirm: async (item) => {
      const response = await api.delete(item.id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Intake season deleted successfully");
        refetch();
      }
    },
  });

  const columns: ColumnDef<Item>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="max-w-[300px]">
            <div className="font-medium truncate">{row.original.title}</div>
            {row.original.subtitle && (
              <div className="text-sm text-muted-foreground truncate">
                {row.original.subtitle}
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: "intake",
        header: "Intake",
        cell: ({ row }) => (
          <Badge variant="outline">
            {row.original.intake} {row.original.year}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = (row.original as any).status as string;
          return (
            <Badge variant={status === "ACTIVE" ? "default" : "secondary"}>
              {status || "DRAFT"}
            </Badge>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "applicationDeadline",
        header: "Deadline",
        cell: ({ row }) =>
          row.original.applicationDeadline
            ? new Date(row.original.applicationDeadline).toLocaleDateString()
            : "-",
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original;
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
                  onClick={() => router.push(`/dashboard/intake-seasons/${item.id}/edit`)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deleteDialog.openDialog(item)}
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
    [deleteDialog, router]
  );

  if (table.options.columns.length === 0) {
    table.setOptions((prev) => ({ ...prev, columns }));
  }



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Intake Seasons</h1>
        <p className="text-muted-foreground">
          Manage intake season banners and promotional content displayed across
          the website
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
        filterColumnKey="title"
        filterPlaceholder="Filter intake seasons..."
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        toolbar={
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => router.push("/dashboard/intake-seasons/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Intake Season
            </Button>
          </div>
        }
      />
    </div>
  );
}
