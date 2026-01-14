"use client";

import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { createEntityApi } from "@/lib/api-client";
import { toast } from "sonner";
import { MoreHorizontal, Plus, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { useRouter } from "next/navigation";

interface UniversityDetail {
  id: string;
  universityId: string;
  overview: string;
  ranking?: string | null;
  tuitionFees?: string | null;
  famousFor?: string | null;
  servicesHeading?: string | null;
  servicesDescription?: string | null;
  servicesImage?: string | null;
  entryRequirements: string;
  university?: { name: string; status?: string };
  status: string;
  createdAt: string;
  updatedAt: string;
}

const stripHtml = (html: string | null | undefined) => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim();
};

const formatCellContent = (
  content: string | null | undefined,
  maxLength: number = 100
) => {
  if (!content) return "—";
  const stripped = stripHtml(content);
  if (stripped.length <= maxLength) return stripped;
  return stripped.substring(0, maxLength) + "...";
};

export default function UniversityDetailsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const endpoint = `/api/university-details${
    statusFilter !== "all" ? `?status=${statusFilter}` : ""
  }`;
  
  const api = useMemo(
    () => createEntityApi<UniversityDetail>("/api/university-details"),
    []
  );

  const { table, isLoading, error, pagination, refetch } =
    useDataTable<UniversityDetail>({
      endpoint,
      columns: [],
      enableServerSidePagination: true,
      enableServerSideSorting: true,
      pageSize: 10,
      filterColumnKey: "overview",
    });

  const deleteDialog = useConfirmDialog<UniversityDetail>({
    title: "Delete Detail",
    getDescription: () =>
      "Are you sure you want to delete this university detail? This action cannot be undone.",
    onConfirm: async (item) => {
      const response = await api.delete(item.id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Deleted successfully");
        refetch();
      }
    },
  });

  const columns: ColumnDef<UniversityDetail>[] = useMemo(
    () => [
      {
        accessorKey: "university.name",
        header: "University",
        cell: ({ row }) => row.original.university?.name ?? "—",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status as string;
          return (
            <Badge variant={status === "ACTIVE" ? "default" : "secondary"}>
              {status || "DRAFT"}
            </Badge>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "overview",
        header: "Overview",
        cell: ({ row }) => (
          <span title={stripHtml(row.original.overview || "")}>
            {formatCellContent(row.original.overview, 30)}
          </span>
        ),
      },
      {
        accessorKey: "ranking",
        header: "Ranking",
        cell: ({ row }) => (
          <span title={stripHtml(row.original.ranking || "")}>
            {formatCellContent(row.original.ranking, 30)}
          </span>
        ),
      },
      {
        accessorKey: "tuitionFees",
        header: "Tuition Fees",
        cell: ({ row }) => (
          <span title={stripHtml(row.original.tuitionFees || "")}>
            {formatCellContent(row.original.tuitionFees, 30)}
          </span>
        ),
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
                  onClick={() =>
                    router.push(`/dashboard/university-details/${item.id}/edit`)
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
    [deleteDialog, router]
  );

  if (table.options.columns.length === 0) {
    table.setOptions((prev) => ({ ...prev, columns }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            University Details
          </h1>
          <p className="text-muted-foreground">
            Manage narrative details, rankings, tuition fees, and services for
            each university
          </p>
        </div>
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
        filterColumnKey="overview"
        filterPlaceholder="Filter by overview..."
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
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={refetch}
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Button onClick={() => router.push("/dashboard/university-details/new")}>
              <Plus className="mr-2 h-4 w-4" /> Add Detail
            </Button>
          </div>
        }
      />
    </div>
  );
}
