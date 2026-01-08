"use client";

import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { createRestEntityApi } from "@/lib/api-client";
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
import RepresentativeVideoFormModal from "./add-representative-video-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import Image from "next/image";

interface Item {
  id: string;
  title: string;
  thumbnail?: string;
  url: string;
  createdAt: string;
}

const api = createRestEntityApi<Item>("/api/representative-videos");

export default function RepresentativeVideosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState<Item | undefined>();

  const { table, isLoading, error, pagination, refetch } = useDataTable<Item>({
    endpoint: "/api/representative-videos",
    columns: [],
    enableServerSidePagination: true,
    enableServerSideSorting: true,
    enableServerSideFiltering: true,
    pageSize: 10,
    filterColumnKey: "title",
  });

  console.log("Table data:", table.getRowModel().rows);

  const deleteDialog = useConfirmDialog<Item>({
    title: "Delete Video",
    getDescription: (item) =>
      `Are you sure you want to delete "${item.title}"? This action cannot be undone.`,
    onConfirm: async (item) => {
      const response = await api.delete(item.id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Video deleted successfully");
        refetch();
      }
    },
  });

  const columns: ColumnDef<Item>[] = useMemo(
    () => [
      {
        accessorKey: "Thumbnail",
        header: "Thumbnail",
        cell: ({ row }) => (
          <Image
            width={100}
            height={100}
            src={row.original.thumbnail || "/placeholder-image.png"}
            alt={row.original.title}
            className="h-12 w-20 object-cover rounded"
          />
        ),
      },
      { accessorKey: "title", header: "Title", enableSorting: true },
      { accessorKey: "url", header: "URL" },
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
                    setIsEditing(true);
                    setSelected(item);
                    setIsModalOpen(true);
                  }}
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
    [deleteDialog]
  );

  if (table.options.columns.length === 0) {
    table.setOptions((prev) => ({ ...prev, columns }));
  }

  const handleOpenModal = () => {
    setIsEditing(false);
    setSelected(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelected(undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Representative Videos
        </h1>
        <p className="text-muted-foreground">
          Manage representative videos and associations
        </p>
      </div>

      {isModalOpen && (
        <RepresentativeVideoFormModal
          isEditing={isEditing}
          selected={selected}
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
        filterPlaceholder="Filter videos..."
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        toolbar={
          <Button onClick={handleOpenModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Video
          </Button>
        }
      />
    </div>
  );
}
