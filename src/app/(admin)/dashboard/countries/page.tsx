"use client";

import { useState, useMemo, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Country } from "../../../../../prisma/src/generated/prisma/browser";
import Image from "next/image";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const countryApi = createEntityApi<Country>("/api/countries");

const CountriesPage = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const endpoint = useMemo(
    () => `/api/countries${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`,
    [statusFilter]
  );

  const { table, isLoading, error, pagination, refetch } =
    useDataTable<Country>({
      endpoint,
      columns: [],
      enableServerSidePagination: true,
      enableServerSideSorting: true,
      enableServerSideFiltering: true,
      pageSize: 10,
      filterColumnKey: "name",
    });

  const deleteDialog = useConfirmDialog<Country>({
    title: "Delete Country",
    getDescription: (country) =>
      `Are you sure you want to delete "${country.name}"? This action cannot be undone.`,
    onConfirm: async (country) => {
      const response = await countryApi.delete(country.id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Country deleted successfully");
        refetch();
      }
    },
  });

  const columns: ColumnDef<Country>[] = useMemo(
    () => [
      {
        accessorKey: "flag",
        header: "Flag",
        cell: ({ row }) => (
          <Image
            height={40}
            width={40}
            src={row.original.flag || ""}
            alt="Flag"
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
      },
      {
        accessorKey: "slug",
        header: "Slug",
        enableSorting: true,
        cell: ({ row }) => <Badge variant="outline">{row.original.slug}</Badge>,
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
        cell: ({ row }) => {
          return new Date(row.original.createdAt).toLocaleDateString();
        },
        enableSorting: true,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const country = row.original;

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
                    router.push(`/dashboard/countries/${country.id}/edit`);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deleteDialog.openDialog(country)}
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

  // Update table columns when they change
  if (table.options.columns.length === 0) {
    table.setOptions((prev) => ({ ...prev, columns }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Countries</h1>
 
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
        filterColumnKey="name"
        filterPlaceholder="Filter countries..."
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
            <Button onClick={() => router.push("/dashboard/countries/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Country
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default CountriesPage;
