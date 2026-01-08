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
import CourseFormModal from "./add-course-modal";
import { Course } from "../../../../../prisma/src/generated/prisma/browser";

type TCourse = Course & {
  university?: {
    name: string;
  };
  destination?: {
    name: string;
  };
};

const courseApi = createEntityApi<TCourse>("/api/courses");

const CoursesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<TCourse | undefined>();

  const { table, isLoading, error, pagination, refetch } =
    useDataTable<TCourse>({
      endpoint: "/api/courses",
      columns: [],
      enableServerSidePagination: true,
      enableServerSideSorting: true,
      enableServerSideFiltering: true,
      pageSize: 10,
      filterColumnKey: "title",
    });

  const deleteDialog = useConfirmDialog<TCourse>({
    title: "Delete Course",
    getDescription: (course) =>
      `Are you sure you want to delete "${course.title}"? This action cannot be undone.`,
    onConfirm: async (course) => {
      const response = await courseApi.delete(course.id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Course deleted successfully");
        refetch();
      }
    },
  });

  const handleOpenModal = () => {
    setIsEditing(false);
    setSelectedCourse(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedCourse(undefined);
  };

  const columns: ColumnDef<TCourse>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        enableSorting: true,
      },
      {
        accessorKey: "slug",
        header: "Slug",
        enableSorting: true,
        cell: ({ row }) => <Badge variant="outline">{row.original.slug}</Badge>,
      },
      {
        accessorKey: "university.name",
        header: "University",
        enableSorting: false,
        cell: ({ row }) => {
          return row.original.university?.name || "-";
        },
      },
      {
        accessorKey: "destination.name",
        header: "Destination",
        enableSorting: false,
        cell: ({ row }) => {
          return row.original.destination?.name || "-";
        },
      },
      {
        accessorKey: "tuitionMin",
        header: "Tuition Range",
        enableSorting: false,
        cell: ({ row }) => {
          const min = row.original.tuitionMin;
          const max = row.original.tuitionMax;
          const currency = row.original.currency || "USD";
          if (min && max) {
            return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
          } else if (min) {
            return `${currency} ${min.toLocaleString()}+`;
          }
          return "-";
        },
      },
      {
        accessorKey: "isActive",
        header: "Status",
        enableSorting: true,
        cell: ({ row }) => {
          return (
            <Badge variant={row.original.isActive ? "default" : "secondary"}>
              {row.original.isActive ? "Active" : "Inactive"}
            </Badge>
          );
        },
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
          const course = row.original;

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
                    setSelectedCourse(course);
                    setIsModalOpen(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deleteDialog.openDialog(course)}
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
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <p className="text-muted-foreground">
          Manage courses and educational programs
        </p>
      </div>

      {isModalOpen && (
        <CourseFormModal
          isEditing={isEditing}
          selectedCourse={
            selectedCourse
              ? ({
                  id: selectedCourse.id,
                  title: selectedCourse.title,
                  slug: selectedCourse.slug,
                  description: selectedCourse.description ?? null,
                  duration: selectedCourse.duration ?? null,
                  tuitionMin: selectedCourse.tuitionMin ?? null,
                  tuitionMax: selectedCourse.tuitionMax ?? null,
                  currency: selectedCourse.currency ?? "USD",
                  isFeatured: selectedCourse.isFeatured,
                  isActive: selectedCourse.isActive,
                  universityId: selectedCourse.universityId,
                  destinationId: selectedCourse.destinationId,
                  createdAt: new Date(selectedCourse.createdAt),
                  updatedAt: new Date(selectedCourse.updatedAt),
                  metaTitle: selectedCourse.metaTitle ?? null,
                  metaDescription: selectedCourse.metaDescription ?? null,
                  metaKeywords: selectedCourse.metaKeywords ?? null,
                  createdBy: selectedCourse.createdBy ?? null,
                  updatedBy: selectedCourse.updatedBy ?? null,
                  sections: selectedCourse.sections
                    ? {
                        overview:
                          (
                            selectedCourse.sections as Record<string, unknown>
                          )?.overview?.toString() || "",
                        entryRequirements:
                          (
                            selectedCourse.sections as Record<string, unknown>
                          )?.entryRequirements?.toString() || "",
                        costOfStudy:
                          (
                            selectedCourse.sections as Record<string, unknown>
                          )?.costOfStudy?.toString() || "",
                        scholarships:
                          (
                            selectedCourse.sections as Record<string, unknown>
                          )?.scholarships?.toString() || "",
                        careers:
                          (
                            selectedCourse.sections as Record<string, unknown>
                          )?.careers?.toString() || "",
                        admission:
                          (
                            selectedCourse.sections as Record<string, unknown>
                          )?.admission?.toString() || "",
                      }
                    : null,
                } as any)
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
        filterColumnKey="title"
        filterPlaceholder="Filter courses..."
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        toolbar={
          <Button onClick={handleOpenModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        }
      />
    </div>
  );
};

export default CoursesPage;
