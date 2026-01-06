"use client";

import { useMemo, useState, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { createEntityApi } from "@/lib/api-client";
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
import UniversityDetailModal from "./add-detail-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";

interface UniversityDetail {
  id: string;
  universityId: string;
  overview: string;
  ranking?: string | null;
  tuitionFees?: string | null;
  famousFor?: string | null;
  servicesHeading?: string | null;
  servicesDescription?: string | null;
  servicesImage?: string | null;
  entryRequirements: string;
  university?: { name: string };
  createdAt: string;
  updatedAt: string;
}

const stripHtml = (html: string | null | undefined) => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim();
};

const formatCellContent = (
  content: string | null | undefined,
  maxLength: number = 100
) => {
  if (!content) return "—";
  const stripped = stripHtml(content);
  if (stripped.length <= maxLength) return stripped;
  return stripped.substring(0, maxLength) + "...";
};

export default function UniversityDetailsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<
    UniversityDetail | undefined
  >();

  const endpoint = "/api/university-details";
  const api = useMemo(
    () => createEntityApi<UniversityDetail>(endpoint),
    [endpoint]
  );

  const { table, isLoading, error, pagination, refetch } =
    useDataTable<UniversityDetail>({
      endpoint,
      columns: [],
      enableServerSidePagination: true,
      enableServerSideSorting: true,
      pageSize: 10,
      filterColumnKey: "overview",
    });

  const deleteDialog = useConfirmDialog<UniversityDetail>({
    title: "Delete Detail",
    getDescription: () =>
      "Are you sure you want to delete this university detail? This action cannot be undone.",
    onConfirm: async (item) => {
      const response = await api.delete(item.id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Deleted successfully");
        refetch();
      }
    },
  });

  const handleOpenModal = () => {
    setIsEditing(false);
    setSelectedDetail(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedDetail(undefined);
  }, []);

  const handleEdit = (item: UniversityDetail) => {
    setIsEditing(true);
    setSelectedDetail(item);
    setIsModalOpen(true);
  };

  const columns: ColumnDef<UniversityDetail>[] = useMemo(
    () => [
      {
        accessorKey: "university.name",
        header: "University",
        cell: ({ row }) => row.original.university?.name ?? "—",
      },
      {
        accessorKey: "overview",
        header: "Overview",
        cell: ({ row }) => (
          <span title={stripHtml(row.original.overview || "")}>
            {formatCellContent(row.original.overview, 50)}
          </span>
        ),
      },
      {
        accessorKey: "ranking",
        header: "Ranking",
        cell: ({ row }) => (
          <span title={stripHtml(row.original.ranking || "")}>
            {formatCellContent(row.original.ranking, 50)}
          </span>
        ),
      },
      {
        accessorKey: "tuitionFees",
        header: "Tuition Fees",
        cell: ({ row }) => row.original.tuitionFees || "—",
      },
      {
        accessorKey: "famousFor",
        header: "Famous For",
        cell: ({ row }) => (
          <span title={stripHtml(row.original.famousFor || "")}>
            {formatCellContent(row.original.famousFor, 50)}
          </span>
        ),
      },
      {
        accessorKey: "entryRequirements",
        header: "Entry Requirements",
        cell: ({ row }) => (
          <span title={stripHtml(row.original.entryRequirements || "")}>
            {formatCellContent(row.original.entryRequirements, 50)}
          </span>
        ),
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
                <DropdownMenuItem onClick={() => handleEdit(item)}>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            University Details
          </h1>
          <p className="text-muted-foreground">
            Manage narrative details, rankings, tuition fees, and services for
            each university
          </p>
        </div>
        <Button onClick={handleOpenModal}>
          <Plus className="mr-2 h-4 w-4" /> Add Detail
        </Button>
      </div>

      {isModalOpen && (
        <UniversityDetailModal
          isEditing={isEditing}
          selectedDetail={selectedDetail}
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
        filterColumnKey="overview"
        filterPlaceholder="Filter by overview..."
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        toolbar={
          <Button variant="outline" onClick={refetch} disabled={isLoading}>
            Refresh
          </Button>
        }
      />
    </div>
  );
}
