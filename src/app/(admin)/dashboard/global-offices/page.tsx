"use client";

import { useMemo, useState } from "react";
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

type GlobalOfficeWithCountries = {
  id: string;
  name: string;
  subtitle?: string | null;
  slug: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  mapUrl?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  createdAt: string;
  updatedAt: string;
  countries?: Array<{ country: { id: string; name: string } }>;
};

const globalOfficeApi = createEntityApi<GlobalOfficeWithCountries>(
  "/api/global-offices",
);

const GlobalOfficesPage = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const endpoint = useMemo(
    () =>
      `/api/global-offices${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`,
    [statusFilter],
  );

  const { table, isLoading, error, pagination, refetch } =
    useDataTable<GlobalOfficeWithCountries>({
      endpoint,
      columns: [],
      enableServerSidePagination: true,
      enableServerSideSorting: true,
      enableServerSideFiltering: true,
      pageSize: 10,
      filterColumnKey: "name",
    });

  const deleteDialog = useConfirmDialog<GlobalOfficeWithCountries>({
    title: "Delete Global Office",
    getDescription: (office) =>
      `Are you sure you want to delete "${office.name}"? This action cannot be undone.`,
    onConfirm: async (office) => {
      const response = await globalOfficeApi.delete(office.id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Global office deleted successfully");
        refetch();
      }
    },
  });

  const columns: ColumnDef<GlobalOfficeWithCountries>[] = useMemo(
    () => [
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
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => row.original.email || "-",
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => row.original.phone || "-",
      },
      {
        accessorKey: "countries",
        header: "Countries",
        cell: ({ row }) => {
          const countries = row.original.countries || [];
          if (countries.length === 0) return "-";
          return (
            <div className="flex flex-wrap gap-1">
              {countries.slice(0, 2).map((c) => (
                <Badge
                  key={c.country.id}
                  variant="secondary"
                  className="text-xs"
                >
                  {c.country.name}
                </Badge>
              ))}
              {countries.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{countries.length - 2}
                </Badge>
              )}
            </div>
          );
        },
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
          const globalOffice = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 p-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    router.push(
                      `/dashboard/global-offices/${globalOffice.id}/edit`,
                    )
                  }
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deleteDialog.openDialog(globalOffice)}
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Global Offices</h1>
          <p className="text-muted-foreground">
            Manage global office locations and their details
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
        filterColumnKey="name"
        filterPlaceholder="Filter global offices..."
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        toolbar={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push("/dashboard/global-offices/new")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Global Office
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default GlobalOfficesPage;
