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
import BlogFormModal from "./add-blog-modal";
import { toast } from "sonner";
import { createEntityApi } from "@/lib/api-client";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  image?: string | null;
  author?: string | null;
  isFeatured?: boolean;
  destinationId: string;
  createdAt: string;
  destination?: { name: string };
  countries?: Array<{ country?: { id: string }; countryId?: string }>;
}

const blogApi = createEntityApi<Blog>("/api/blogs");

const BlogsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | undefined>();

  const { table, isLoading, error, pagination, refetch } = useDataTable<Blog>({
    endpoint: "/api/blogs",
    columns: [],
    enableServerSidePagination: true,
    enableServerSideSorting: true,
    enableServerSideFiltering: true,
    pageSize: 10,
    filterColumnKey: "title",
  });

  const deleteDialog = useConfirmDialog<Blog>({
    title: "Delete Blog",
    getDescription: (blog) =>
      `Are you sure you want to delete "${blog.title}"? This action cannot be undone.`,
    onConfirm: async (blog) => {
      const response = await blogApi.delete(blog.id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Blog deleted successfully");
        refetch();
      }
    },
  });

  const columns: ColumnDef<Blog>[] = useMemo(
    () => [
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
          const image = row.original.image;
          return image ? (
            <div className="relative w-16 h-16 rounded overflow-hidden">
              <Image src={image} alt="" fill className="object-cover" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
              No Image
            </div>
          );
        },
      },
      {
        accessorKey: "title",
        header: "Title",
        enableSorting: true,
      },
      {
        accessorKey: "destination",
        header: "Destination",
        cell: ({ row }) => row.original.destination?.name || "-",
      },
      {
        accessorKey: "isFeatured",
        header: "Featured",
        cell: ({ row }) =>
          row.original.isFeatured ? (
            <Badge variant="default">Featured</Badge>
          ) : null,
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
          const blog = row.original;
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
                    setSelectedBlog(blog);
                    setIsModalOpen(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deleteDialog.openDialog(blog)}
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
    setSelectedBlog(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedBlog(undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
        <p className="text-muted-foreground">Manage blog posts</p>
      </div>

      {isModalOpen && (
        <BlogFormModal
          isEditing={isEditing}
          selectedBlog={selectedBlog}
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
        filterPlaceholder="Filter blogs..."
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        toolbar={
          <Button onClick={handleOpenModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Blog
          </Button>
        }
      />
    </div>
  );
};

export default BlogsPage;
