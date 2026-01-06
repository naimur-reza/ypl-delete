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
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import StatFormModal from "./add-stat-modal";

interface Stat {
  id: string;
  title: string;
  subtitle: string;
  icon?: string | null;
  color?: string | null;
  section: string;
  slideIndex?: number | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  countries?: Array<{
    country?: { id: string; name: string };
    countryId?: string;
  }>;
}

const statApi = createRestEntityApi<Stat>("/api/stats");

const SECTION_LABELS: Record<string, string> = {
  about: "About Section",
  hero: "Hero Slider",
  faq: "FAQ Section",
  event: "Events",
};

const SECTION_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  about: "default",
  hero: "secondary",
  faq: "outline",
  event: "destructive",
};

const StatsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStat, setSelectedStat] = useState<Stat | undefined>();

  const { table, isLoading, error, pagination, refetch } = useDataTable<Stat>({
    endpoint: "/api/stats",
    columns: [],
    enableServerSidePagination: true,
    enableServerSideSorting: true,
    enableServerSideFiltering: true,
    pageSize: 10,
    filterColumnKey: "title",
  });

  const deleteDialog = useConfirmDialog<Stat>({
    title: "Delete Stat",
    getDescription: (stat) =>
      `Are you sure you want to delete "${stat.title} - ${stat.subtitle}"? This action cannot be undone.`,
    onConfirm: async (stat) => {
      const response = await statApi.delete(stat.id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Stat deleted successfully");
        refetch();
      }
    },
  });

  const columns: ColumnDef<Stat>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        enableSorting: true,
      },
      {
        accessorKey: "subtitle",
        header: "Subtitle",
      },
      {
        accessorKey: "section",
        header: "Section",
        cell: ({ row }) => {
          const section = row.original.section;
          return (
            <Badge variant={SECTION_VARIANTS[section] || "outline"}>
              {SECTION_LABELS[section] || section}
            </Badge>
          );
        },
      },
      {
        accessorKey: "icon",
        header: "Icon",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.icon || "-"}
          </span>
        ),
      },
      {
        accessorKey: "slideIndex",
        header: "Slide #",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.slideIndex !== null &&
            row.original.slideIndex !== undefined
              ? row.original.slideIndex
              : "-"}
          </span>
        ),
      },
      {
        accessorKey: "sortOrder",
        header: "Order",
        enableSorting: true,
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) =>
          row.original.isActive ? (
            <Badge variant="default">Active</Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          ),
      },
      {
        accessorKey: "countries",
        header: "Countries",
        cell: ({ row }) => {
          const countries = row.original.countries || [];
          const countryNames = countries
            .map((c) => c.country?.name)
            .filter(Boolean)
            .join(", ");
          return countryNames || "All";
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const stat = row.original;
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
                    setSelectedStat(stat);
                    setIsModalOpen(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deleteDialog.openDialog(stat)}
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
    setSelectedStat(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedStat(undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stats</h1>
        <p className="text-muted-foreground">
          Manage dynamic statistics displayed across the website. Configure
          stats for About section, Hero slider, and more.
        </p>
      </div>

      {isModalOpen && (
        <StatFormModal
          isEditing={isEditing}
          selectedStat={selectedStat}
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
        filterPlaceholder="Filter stats..."
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        toolbar={
          <Button onClick={handleOpenModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Stat
          </Button>
        }
      />
    </div>
  );
};

export default StatsPage;
