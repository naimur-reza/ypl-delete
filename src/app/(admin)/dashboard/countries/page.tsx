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
import CountryFormModal from "./add-country-modal";
import { Country } from "../../../../../prisma/src/generated/prisma/browser";
import Image from "next/image";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";

const countryApi = createEntityApi<Country>("/api/countries");

const CountriesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>();

  const { table, isLoading, error, pagination, refetch } =
    useDataTable<Country>({
      endpoint: "/api/countries",
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

  const handleOpenModal = () => {
    setIsEditing(false);
    setSelectedCountry(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedCountry(undefined);
  };

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
                    setIsEditing(true);
                    setSelectedCountry(country);
                    setIsModalOpen(true);
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
    [deleteDialog]
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
          <p className="text-muted-foreground">
            Manage countries for content localization
          </p>
        </div>
      </div>

      {isModalOpen && (
        <CountryFormModal
          isEditing={isEditing}
          selectedCountry={
            selectedCountry
              ? {
                  id: selectedCountry.id,
                  name: selectedCountry.name,
                  slug: selectedCountry.slug,
                  isoCode: selectedCountry.isoCode,
                  flag: selectedCountry.flag,
                  createdAt: new Date(selectedCountry.createdAt),
                  updatedAt: new Date(selectedCountry.updatedAt),
                  metaTitle: selectedCountry.metaTitle ?? null,
                  metaDescription: selectedCountry.metaDescription ?? null,
                  metaKeywords: selectedCountry.metaKeywords ?? null,
                  isActive: selectedCountry.isActive,
                }
              : undefined
          }
          onClose={handleCloseModal}
          onSuccess={refetch}
        />
      )}

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
          <Button onClick={handleOpenModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Country
          </Button>
        }
      />
    </div>
  );
};

export default CountriesPage;
