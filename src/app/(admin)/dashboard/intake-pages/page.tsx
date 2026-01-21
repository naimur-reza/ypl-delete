"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { createEntityApi } from "@/lib/api-client";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  Eye,
  ExternalLink,
} from "lucide-react";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Item {
  id: string;
  destinationId: string;
  title: string;
  intake: string;
  createdAt: string;
  status?: string;
  destination?: {
    id: string;
    name: string;
    slug: string;
  };
}

const api = createEntityApi<Item>("/api/intake-pages");

export default function IntakePages() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const endpoint = useMemo(
    () =>
      `/api/intake-pages${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`,
    [statusFilter],
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
    title: "Delete Intake Page",
    getDescription: (item) =>
      `Are you sure you want to delete "${item.title}"? This action cannot be undone.`,
    onConfirm: async (item) => {
      const response = await api.delete(item.id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Intake page deleted successfully");
        refetch();
      }
    },
  });

  const columns: ColumnDef<Item>[] = useMemo(
    () => [
      { accessorKey: "title", header: "Title", enableSorting: true },
      { accessorKey: "intake", header: "Intake" },
      { accessorKey: "destinationId", header: "Destination ID" },
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
                  onClick={() => {
                    const destSlug = (item.destination as any)?.slug || "uk";
                    const intakeSlug = item.intake.toLowerCase();
                    // Use [program]/[intake] route - strip study-in- prefix if present
                    const cleanSlug = destSlug.startsWith("study-in-")
                      ? destSlug.replace("study-in-", "")
                      : destSlug;
                    // URL: /bangladesh/uk/january (uses [program]/[intake] route)
                    window.open(
                      `/bangladesh/${cleanSlug}/${intakeSlug}`,
                      "_blank",
                    );
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Page
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/dashboard/intake-pages/${item.id}/edit`)
                  }
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
    [deleteDialog, router],
  );

  if (table.options.columns.length === 0) {
    table.setOptions((prev) => ({ ...prev, columns }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Intake Pages</h1>
        <p className="text-muted-foreground">
          Manage destination-specific intake content
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
        filterPlaceholder="Filter intake pages..."
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
            <Button onClick={() => router.push("/dashboard/intake-pages/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Intake Page
            </Button>
          </div>
        }
      />
    </div>
  );
}
