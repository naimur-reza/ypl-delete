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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import UniversityFormModal from "./add-university-modal";
import { University } from "../../../../../prisma/src/generated/prisma/browser";

const universityApi = createEntityApi<University>("/api/universities");

type UniversityWithRelations = University & {
  country?: { name: string };
  destination?: { name: string };
};

const UniversitiesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<
    UniversityWithRelations | undefined
  >();

  const { table, isLoading, error, pagination, refetch } =
    useDataTable<UniversityWithRelations>({
      endpoint: "/api/universities",
      columns: [],
      enableServerSidePagination: true,
      enableServerSideSorting: true,
      enableServerSideFiltering: true,
      pageSize: 10,
      filterColumnKey: "name",
    });

  const deleteDialog = useConfirmDialog<UniversityWithRelations>({
    title: "Delete University",
    getDescription: (uni) =>
      `Are you sure you want to delete "${uni.name}"? This action cannot be undone.`,
    onConfirm: async (university) => {
      const response = await universityApi.delete(university.id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("University deleted successfully");
        refetch();
      }
    },
  });

  const handleOpenModal = () => {
    setIsEditing(false);
    setSelectedUniversity(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedUniversity(undefined);
  }, []);

  const columns: ColumnDef<UniversityWithRelations>[] = useMemo(
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
        accessorKey: "providerType",
        header: "Provider Type",
        enableSorting: true,
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.providerType}</Badge>
        ),
      },

      {
        accessorKey: "destination.name",
        header: "Destination",
        enableSorting: false,
        cell: ({ row }) => row.original.destination?.name || "-",
      },
      {
        accessorKey: "isActive",
        header: "Status",
        enableSorting: true,
        cell: ({ row }) => (
          <Badge variant={row.original.isActive ? "default" : "secondary"}>
            {row.original.isActive ? "Active" : "Inactive"}
          </Badge>
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
        cell: ({ row }) => (
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
                  setSelectedUniversity(row.original);
                  setIsModalOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => deleteDialog.openDialog(row.original)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [deleteDialog]
  );

  // Update table columns when they change
  if (table.options.columns.length === 0 && columns.length > 0) {
    table.setOptions((prev) => ({ ...prev, columns }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Universities</h1>
        <p className="text-muted-foreground">
          Manage universities and educational institutions
        </p>
      </div>

      {isModalOpen && (
        <UniversityFormModal
          isEditing={isEditing}
          selectedUniversity={selectedUniversity}
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
        filterPlaceholder="Filter universities..."
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        toolbar={
          <Button onClick={handleOpenModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add University
          </Button>
        }
      />
    </div>
  );
};

export default UniversitiesPage;
