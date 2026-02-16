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
import HeroFormModal from "./add-hero-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Hero {
  id: string;
  title: string;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  backgroundType: "IMAGE" | "VIDEO" | "YOUTUBE";
  backgroundUrl: string;
  slug: string;
  order: number;
  createdAt: string;
  countries?: Array<{
    country?: { id: string; name: string };
    countryId?: string;
  }>;
}

const heroApi = createRestEntityApi<Hero>("/api/heroes");

const HeroesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedHero, setSelectedHero] = useState<Hero | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const endpoint = useMemo(
    () => `/api/heroes${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`,
    [statusFilter]
  );

  const { table, isLoading, error, pagination, refetch } = useDataTable<Hero>({
    endpoint,
    columns: [],
    enableServerSidePagination: true,
    enableServerSideSorting: true,
    enableServerSideFiltering: true,
    pageSize: 10,
    filterColumnKey: "title",
  });

  const deleteDialog = useConfirmDialog<Hero>({
    title: "Delete Hero",
    getDescription: (hero) =>
      `Are you sure you want to delete "${hero.title}"? This action cannot be undone.`,
    onConfirm: async (hero) => {
      const response = await heroApi.delete(hero.id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Hero deleted successfully");
        refetch();
      }
    },
  });

  const columns: ColumnDef<Hero>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        enableSorting: true,
      },
      {
        accessorKey: "slug",
        header: "Page",
        cell: ({ row }) => <Badge variant="outline">{row.original.slug}</Badge>,
      },
      {
        accessorKey: "backgroundType",
        header: "Background Type",
        cell: ({ row }) => {
          const type = row.original.backgroundType;
          const variant =
            type === "IMAGE"
              ? "default"
              : type === "VIDEO"
              ? "secondary"
              : "destructive";
          return <Badge variant={variant}>{type}</Badge>;
        },
      },
      {
        accessorKey: "order",
        header: "Order",
        enableSorting: true,
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
          const hero = row.original;
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
                    setSelectedHero(hero);
                    setIsModalOpen(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deleteDialog.openDialog(hero)}
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
    setSelectedHero(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedHero(undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Heroes</h1>
 
      </div>

      {isModalOpen && (
        <HeroFormModal
          isEditing={isEditing}
          selectedHero={selectedHero}
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
        filterPlaceholder="Filter heroes..."
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
              Add Hero
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default HeroesPage;
