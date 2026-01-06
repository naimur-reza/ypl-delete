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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/table/data-table";
import { useDataTable } from "@/hooks/use-data-table";

import { toast } from "sonner";
import { createEntityApi } from "@/lib/api-client";
import FAQFormModal from "./add-faq-modal";
import BulkAssignModal from "./bulk-assign-modal";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  isGlobal?: boolean;
  createdAt: string;
  updatedAt: string;
  countries?: Array<{
    country?: { id: string; name: string };
    countryId?: string;
  }>;
  destinations?: Array<{
    destination?: { id: string; name: string };
    destinationId?: string;
  }>;
  universities?: Array<{
    university?: { id: string; name: string };
    universityId?: string;
  }>;
  events?: Array<{ event?: { id: string; title: string }; eventId?: string }>;
  courses?: Array<{
    course?: { id: string; title: string };
    courseId?: string;
  }>;
  scholarships?: Array<{
    scholarship?: { id: string; title: string };
    scholarshipId?: string;
  }>;
  intakePages?: Array<{
    intakePage?: { id: string; title: string };
    intakePageId?: string;
  }>;
}

const faqApi = createEntityApi<FAQ>("/api/faqs");

const FAQsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | undefined>();
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const { table, isLoading, error, pagination, refetch } = useDataTable<FAQ>({
    endpoint: "/api/faqs",
    columns: [],
    enableServerSidePagination: true,
    enableServerSideSorting: true,
    enableServerSideFiltering: true,
    pageSize: 10,
    filterColumnKey: "question",
  });

  const handleDelete = useCallback(
    async (faq: FAQ) => {
      if (!confirm(`Are you sure you want to delete this FAQ?`)) {
        return;
      }

      const response = await faqApi.delete(faq.id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("FAQ deleted successfully");
        refetch();
      }
    },
    [refetch]
  );

  const handleBulkDelete = useCallback(async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);

    if (selectedIds.length === 0) {
      toast.error("No FAQs selected");
      return;
    }

    if (
      !confirm(`Are you sure you want to delete ${selectedIds.length} FAQ(s)?`)
    ) {
      return;
    }

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const id of selectedIds) {
        const response = await faqApi.delete(id);
        if (response.error) {
          errorCount++;
        } else {
          successCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} FAQ(s)`);
      }
      if (errorCount > 0) {
        toast.error(`Failed to delete ${errorCount} FAQ(s)`);
      }

      table.resetRowSelection();
      refetch();
    } catch (error) {
      console.error("Error deleting FAQs:", error);
      toast.error("Failed to delete FAQs");
    }
  }, [table, refetch]);

  const columns: ColumnDef<FAQ>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "question",
        header: "Question",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="max-w-md truncate">{row.original.question}</div>
        ),
      },
      {
        accessorKey: "answer",
        header: "Answer",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="max-w-md truncate">{row.original.answer}</div>
        ),
      },
      {
        id: "relations",
        header: "Related To",
        enableSorting: false,
        cell: ({ row }) => {
          const faq = row.original;
          const relations: string[] = [];

          if (faq.isGlobal) {
            relations.push("Home Page");
          }
          if (faq.countries?.length) {
            relations.push(
              `${faq.countries.length} Country${
                faq.countries.length > 1 ? "ies" : ""
              }`
            );
          }
          if (faq.destinations?.length) {
            relations.push(
              `${faq.destinations.length} Destination${
                faq.destinations.length > 1 ? "s" : ""
              }`
            );
          }
          if (faq.universities?.length) {
            relations.push(
              `${faq.universities.length} Universit${
                faq.universities.length > 1 ? "ies" : "y"
              }`
            );
          }
          if (faq.events?.length) {
            relations.push(
              `${faq.events.length} Event${faq.events.length > 1 ? "s" : ""}`
            );
          }
          if (faq.courses?.length) {
            relations.push(
              `${faq.courses.length} Course${faq.courses.length > 1 ? "s" : ""}`
            );
          }
          if (faq.scholarships?.length) {
            relations.push(
              `${faq.scholarships.length} Scholarship${
                faq.scholarships.length > 1 ? "s" : ""
              }`
            );
          }
          if (faq.intakePages?.length) {
            relations.push(
              `${faq.intakePages.length} Intake Page${
                faq.intakePages.length > 1 ? "s" : ""
              }`
            );
          }

          return (
            <div className="flex flex-wrap gap-1">
              {relations.length > 0 ? (
                relations.map((rel, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {rel}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">None</span>
              )}
            </div>
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
          const faq = row.original;

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
                    setSelectedFAQ(faq);
                    setIsModalOpen(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => handleDelete(faq)}
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
    [handleDelete]
  );

  if (table.options.columns.length === 0) {
    table.setOptions((prev) => ({ ...prev, columns }));
  }

  const handleOpenModal = () => {
    setIsEditing(false);
    setSelectedFAQ(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedFAQ(undefined);
  };

  const selectedRowIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original.id);
  const selectedCount = selectedRowIds.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">FAQs</h1>
        <p className="text-muted-foreground">
          Manage frequently asked questions
        </p>
      </div>

      {isModalOpen && (
        <FAQFormModal
          isEditing={isEditing}
          selectedFAQ={selectedFAQ}
          onClose={handleCloseModal}
          onSuccess={refetch}
        />
      )}

      {isBulkModalOpen && (
        <BulkAssignModal
          isOpen={isBulkModalOpen}
          selectedFaqIds={selectedRowIds}
          onClose={() => setIsBulkModalOpen(false)}
          onSuccess={() => {
            table.resetRowSelection();
            refetch();
          }}
        />
      )}

      {/* Bulk Actions Toolbar */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{selectedCount} selected</Badge>
            <span className="text-sm text-muted-foreground">
              {selectedCount === 1 ? "FAQ" : "FAQs"} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBulkModalOpen(true)}
            >
              Assign To...
            </Button>
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.resetRowSelection()}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      <DataTable
        table={table}
        columns={columns}
        filterColumnKey="question"
        filterPlaceholder="Filter FAQs..."
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        toolbar={
          <Button onClick={handleOpenModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add FAQ
          </Button>
        }
      />
    </div>
  );
};

export default FAQsPage;
