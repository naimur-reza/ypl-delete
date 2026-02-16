"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { toast } from "sonner";
import { createEntityApi } from "@/lib/api-client";
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

interface Scholarship {
  id: string;
  title: string;
  slug: string;
  amount?: number | null;
  deadline?: string | null;
  destinationId: string;
  createdAt: string;
  university?: { name: string };
  destination?: { name: string };
}

const scholarshipApi = createEntityApi<Scholarship>("/api/scholarships");

const ScholarshipsPage = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const endpoint = useMemo(
    () => `/api/scholarships${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`,
    [statusFilter]
  );

  const { table, isLoading, error, pagination, refetch } =
    useDataTable<Scholarship>({
      endpoint,
      columns: [],
      enableServerSidePagination: true,
      enableServerSideSorting: true,
      enableServerSideFiltering: true,
      pageSize: 10,
      filterColumnKey: "title",
    });

  const deleteDialog = useConfirmDialog<Scholarship>({
    title: "Delete Scholarship",
    getDescription: (s) =>
      `Are you sure you want to delete "${s.title}"? This action cannot be undone.`,
    onConfirm: async (scholarship) => {
      const response = await scholarshipApi.delete(scholarship.id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Scholarship deleted successfully");
        refetch();
      }
    },
  });

  const columns: ColumnDef<Scholarship>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        enableSorting: true,
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
          const amount = row.original.amount;
          return amount
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(amount)
            : "-";
        },
      },
      {
        accessorKey: "deadline",
        header: "Deadline",
        cell: ({ row }) => {
          const deadline = row.original.deadline;
          return deadline ? new Date(deadline).toLocaleDateString() : "-";
        },
      },
      {
        accessorKey: "university",
        header: "University",
        cell: ({ row }) => row.original.university?.name || "-",
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
          const scholarship = row.original;
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
                  onClick={() => router.push(`/dashboard/scholarships/${scholarship.id}/edit`)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deleteDialog.openDialog(scholarship)}
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
        <h1 className="text-3xl font-bold tracking-tight">Scholarships</h1>
 
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
        filterPlaceholder="Filter scholarships..."
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
            <Button onClick={() => router.push("/dashboard/scholarships/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Scholarship
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default ScholarshipsPage;
