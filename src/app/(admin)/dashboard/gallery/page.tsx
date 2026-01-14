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
  Image as ImageIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
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
import { Gallery } from "../../../../../prisma/src/generated/prisma/browser";
 

const api = createEntityApi<Gallery>("/api/gallery");

const typeLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  VISA_SUCCESS: { label: "Visa Success", variant: "default" },
  REPRESENTATIVE: { label: "Representative", variant: "secondary" },
  EVENT: { label: "Event", variant: "outline" },
  OFFICE: { label: "Office", variant: "outline" },
  STUDENT: { label: "Student", variant: "secondary" },
};

export default function GalleryPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const endpoint = useMemo(
    () => `/api/gallery${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`,
    [statusFilter]
  );

  const { table, isLoading, error, pagination, refetch } =
    useDataTable<Gallery>({
      endpoint,
      columns: [],
      enableServerSidePagination: true,
      enableServerSideSorting: true,
      enableServerSideFiltering: true,
      pageSize: 10,
      filterColumnKey: "title",
    });

  const deleteDialog = useConfirmDialog<Gallery>({
    title: "Delete Gallery Item",
    getDescription: (item) =>
      `Are you sure you want to delete "${item.title}"? This action cannot be undone.`,
    onConfirm: async (item) => {
      const response = await api.delete(item.id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Gallery item deleted successfully");
        refetch();
      }
    },
  });

  const columns: ColumnDef<Gallery>[] = useMemo(
    () => [
      {
        accessorKey: "image",
        header: "Preview",
        cell: ({ row }) =>
          row.original.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={row.original.image}
              alt={row.original.title}
              className="h-12 w-16 object-cover rounded-md"
            />
          ) : (
            <div className="h-12 w-16 bg-muted rounded-md flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          ),
      },
      { accessorKey: "title", header: "Title", enableSorting: true },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          const typeInfo = typeLabels[row.original.type] || {
            label: row.original.type,
            variant: "outline" as const,
          };
          return <Badge variant={typeInfo.variant}>{typeInfo.label}</Badge>;
        },
      },
      {
        accessorKey: "status",
        header: "Content Status",
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
        accessorKey: "sortOrder",
        header: "Sort",
        cell: ({ row }) => row.original.sortOrder ?? "-",
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
                  onClick={() => router.push(`/dashboard/gallery/${item.id}/edit`)}
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
        <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
        <p className="text-muted-foreground">
          Manage gallery images for visa success stories, representatives, and
          more
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
        filterPlaceholder="Filter gallery..."
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
            <Button onClick={() => router.push("/dashboard/gallery/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Gallery Item
            </Button>
          </div>
        }
      />
    </div>
  );
}
