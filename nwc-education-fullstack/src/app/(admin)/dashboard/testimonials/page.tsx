"use client";

import { useState, useMemo } from "react";
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
import { createRestEntityApi } from "@/lib/api-client";
import Image from "next/image";
import TestimonialFormModal from "./add-testimonial-modal";
import { Testimonial } from "../../../../../prisma/src/generated/prisma/client";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
 

// Interface matching the Prisma Testimonial schema

const testimonialApi = createRestEntityApi<Testimonial>("/api/testimonials");

const TestimonialsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<
    Testimonial | undefined
  >();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const endpoint = useMemo(
    () => `/api/testimonials${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`,
    [statusFilter]
  );

  const { table, isLoading, error, pagination, refetch } =
    useDataTable<Testimonial>({
      endpoint,
      columns: [],
      enableServerSidePagination: true,
      enableServerSideSorting: true,
      enableServerSideFiltering: true,
      pageSize: 10,
      filterColumnKey: "name",
    });

  const deleteDialog = useConfirmDialog<Testimonial>({
    title: "Delete Testimonial",
    getDescription: (t) =>
      `Are you sure you want to delete "${t.name}"? This action cannot be undone.`,
    onConfirm: async (testimonial) => {
      const response = await testimonialApi.delete(testimonial.id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Testimonial deleted successfully");
        refetch();
      }
    },
  });

  const columns: ColumnDef<Testimonial>[] = useMemo(
    () => [
      {
        accessorKey: "avatar",
        header: "Image",
        cell: ({ row }) => {
          const image = row.original.avatar;
          return image ? (
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image src={image} alt="" fill className="object-cover" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-xs text-muted-foreground">
              No Image
            </div>
          );
        },
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          const type = row.original.type || "STUDENT";
          const colors: Record<string, string> = {
            STUDENT:
              "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            REPRESENTATIVE:
              "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
            GMB: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          };
          return (
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                colors[type] || colors.STUDENT
              }`}
            >
              {type}
            </span>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => {
          const rating = row.original.rating;
          return rating ? (
            <span className="font-medium">{rating}/5 ⭐</span>
          ) : (
            <span className="text-muted-foreground">-</span>
          );
        },
      },
      {
        accessorKey: "content",
        header: "Content",
        cell: ({ row }) => (
          <div className="max-w-md truncate">{row.original.content || "-"}</div>
        ),
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
          const testimonial = row.original;
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
                    setSelectedTestimonial(testimonial);
                    setIsModalOpen(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deleteDialog.openDialog(testimonial)}
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
    setSelectedTestimonial(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTestimonial(undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
        <p className="text-muted-foreground">
          Manage all testimonials (Student reviews, Representative videos, GMB
          reviews)
        </p>
      </div>

      {isModalOpen && (
        <TestimonialFormModal
          isEditing={!!selectedTestimonial}
          selectedTestimonial={selectedTestimonial}
          onClose={handleCloseModal}
          onSuccess={() => {
            refetch();
          }}
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
        filterPlaceholder="Filter testimonials..."
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
            <Button onClick={handleOpenModal}>
              <Plus className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default TestimonialsPage;
