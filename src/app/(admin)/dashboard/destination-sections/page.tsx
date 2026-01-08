"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
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
import { createRestEntityApi } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import DestinationSectionFormModal from "./add-destination-section-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import Image from "next/image";

interface DestinationSection {
  id: string;
  title: string;
  slug: string;
  image?: string | null;
  content?: string | null;
  displayOrder: number;
  isActive: boolean;
  destinationId: string;
  destination?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
}

const sectionApi = createRestEntityApi<DestinationSection>(
  "/api/destination-sections"
);

export default function DestinationSectionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSection, setSelectedSection] = useState<
    DestinationSection | undefined
  >();

  const { table, isLoading, error, pagination, refetch } =
    useDataTable<DestinationSection>({
      endpoint: "/api/destination-sections",
      columns: [],
      enableServerSidePagination: true,
      enableServerSideSorting: true,
      enableServerSideFiltering: true,
      pageSize: 50,
      filterColumnKey: "title",
    });

  const deleteDialog = useConfirmDialog<DestinationSection>({
    title: "Delete Section",
    getDescription: (section) =>
      `Are you sure you want to delete "${section.title}"? This action cannot be undone.`,
    onConfirm: async (section) => {
      const response = await sectionApi.delete(section.id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Section deleted successfully");
        refetch();
      }
    },
  });

  const handleOpenModal = () => {
    setIsEditing(false);
    setSelectedSection(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedSection(undefined);
  };

  const columns: ColumnDef<DestinationSection>[] = useMemo(
    () => [
      {
        accessorKey: "displayOrder",
        header: "Order",
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.original.displayOrder}</span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) =>
          row.original.image ? (
            <div className="relative w-12 h-12 rounded overflow-hidden bg-muted">
              <Image
                src={row.original.image}
                alt={row.original.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          ),
        enableSorting: false,
      },
      {
        accessorKey: "title",
        header: "Title",
        enableSorting: true,
      },
      {
        accessorKey: "destination.name",
        header: "Destination",
        cell: ({ row }) => (
          <Badge variant="outline">
            {row.original.destination?.name || "-"}
          </Badge>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => (
          <span className="font-mono text-sm text-muted-foreground">
            {row.original.slug}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={row.original.isActive ? "default" : "secondary"}>
            {row.original.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
        enableSorting: true,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const section = row.original;

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
                    setSelectedSection(section);
                    setIsModalOpen(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deleteDialog.openDialog(section)}
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Destination Sections
        </h1>
        <p className="text-muted-foreground">
          Manage &quot;Why Choose&quot; tabs for each destination
        </p>
      </div>

      {isModalOpen && (
        <DestinationSectionFormModal
          isEditing={isEditing}
          selected={selectedSection}
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
        filterColumnKey="title"
        filterPlaceholder="Filter sections..."
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        toolbar={
          <Button onClick={handleOpenModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </Button>
        }
      />
    </div>
  );
}
