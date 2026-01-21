"use client";

import { useMemo } from "react";
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
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const endpoint = useMemo(
    () => `/api/courses${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`,
    [statusFilter]
  );

  const { table, isLoading, error, pagination, refetch } =
    useDataTable<TCourse>({
      endpoint,
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
          if (min && max) {
            return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
          } else if (min) {
            return `$${min.toLocaleString()}+`;
          }
          return "-";
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
                    router.push(`/dashboard/courses/${course.id}/edit`);
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
    [deleteDialog, router]
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
            <Button onClick={() => router.push("/dashboard/courses/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default CoursesPage;
