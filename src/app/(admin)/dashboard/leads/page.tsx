"use client";

import { useMemo, useCallback, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  MoreHorizontal,
  Eye,
  Download,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Plane,
  Calendar,
  FileJson,
  Filter,
} from "lucide-react";

type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  countryId: string | null;
  destinationId: string | null;
  interestJson: Record<string, unknown> | null;
  createdAt: string;
  country?: {
    id: string;
    name: string;
  } | null;
  destination?: {
    id: string;
    name: string;
  } | null;
};

const LeadsPage = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStartDate, setExportStartDate] = useState<string>("");
  const [exportEndDate, setExportEndDate] = useState<string>("");
  const [isExportDatePickerOpen, setIsExportDatePickerOpen] = useState(false);

  const { table, isLoading, error, pagination, refetch } = useDataTable<Lead>({
    endpoint: "/api/leads",
    columns: [],
    enableServerSidePagination: true,
    enableServerSideSorting: true,
    enableServerSideFiltering: true,
    pageSize: 10,
    filterColumnKey: "name",
  });

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget.id }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to delete lead");
      } else {
        toast.success("Lead deleted");
        refetch();
      }
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, refetch]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      params.append("format", "csv");
      if (exportStartDate) {
        params.append("startDate", exportStartDate);
      }
      if (exportEndDate) {
        params.append("endDate", exportEndDate);
      }

      const res = await fetch(`/api/leads/export?${params.toString()}`);
      if (!res.ok) {
        toast.error("Failed to export leads");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const dateRange = exportStartDate || exportEndDate
        ? `-${exportStartDate || "start"}-${exportEndDate || "end"}`
        : "";
      a.download = `leads${dateRange}-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      const dateInfo = exportStartDate || exportEndDate
        ? ` (${exportStartDate || "start"} to ${exportEndDate || "end"})`
        : "";
      toast.success(`Leads exported successfully${dateInfo}`);
      setIsExportDatePickerOpen(false);
      setExportStartDate("");
      setExportEndDate("");
    } catch {
      toast.error("Failed to export leads");
    } finally {
      setIsExporting(false);
    }
  }, [exportStartDate, exportEndDate]);

  const viewLead = useCallback((lead: Lead) => {
    setSelectedLead(lead);
    setIsViewDialogOpen(true);
  }, []);

  const columns: ColumnDef<Lead>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.email || "No email"}
            </div>
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => row.original.phone || "-",
      },
      {
        id: "country",
        header: "Country",
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.country?.name || "-"}</Badge>
        ),
      },
      {
        id: "destination",
        header: "Destination",
        cell: ({ row }) =>
          row.original.destination?.name ? (
            <Badge variant="secondary">{row.original.destination.name}</Badge>
          ) : (
            "-"
          ),
      },
      {
        accessorKey: "createdAt",
        header: "Submitted",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        enableSorting: true,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => viewLead(row.original)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteTarget(row.original)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [viewLead]
  );

  if (table.options.columns.length === 0) {
    table.setOptions((prev) => ({ ...prev, columns }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            Manage leads submitted through forms on the website.
          </p>
        </div>
        <Popover open={isExportDatePickerOpen} onOpenChange={setIsExportDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button disabled={isExporting} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Exporting..." : "Export CSV"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Export Date Range
                </h4>
                <p className="text-xs text-muted-foreground">
                  Select date range to filter exported leads (optional)
                </p>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start-date" className="text-xs">
                    Start Date
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={exportStartDate}
                    onChange={(e) => setExportStartDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end-date" className="text-xs">
                    End Date
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={exportEndDate}
                    onChange={(e) => setExportEndDate(e.target.value)}
                    min={exportStartDate || undefined}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex-1"
                  size="sm"
                >
                  {isExporting ? "Exporting..." : "Export"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setExportStartDate("");
                    setExportEndDate("");
                  }}
                  size="sm"
                >
                  Clear
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <DataTable
        table={table}
        columns={columns}
        filterColumnKey="name"
        filterPlaceholder="Search leads..."
        isLoading={isLoading}
        error={error}
        pagination={pagination}
      />

      {/* View Lead Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>
              Submitted on{" "}
              {selectedLead &&
                new Date(selectedLead.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-6 mt-4">
              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">
                  Contact Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedLead.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      {selectedLead.email ? (
                        <a
                          href={`mailto:${selectedLead.email}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {selectedLead.email}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">Not provided</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      {selectedLead.phone ? (
                        <a
                          href={`tel:${selectedLead.phone}`}
                          className="font-medium"
                        >
                          {selectedLead.phone}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">Not provided</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Submitted</p>
                      <p className="font-medium">
                        {new Date(selectedLead.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">
                  Location & Interest
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Country</p>
                      <p className="font-medium">
                        {selectedLead.country?.name || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Plane className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Destination
                      </p>
                      <p className="font-medium">
                        {selectedLead.destination?.name || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interest Data */}
              {selectedLead.interestJson && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileJson className="w-5 h-5 text-muted-foreground" />
                    <h4 className="font-semibold text-foreground">
                      Interest Data
                    </h4>
                  </div>
                  <pre className="p-4 bg-muted/50 rounded-xl text-sm overflow-x-auto">
                    {JSON.stringify(selectedLead.interestJson, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the lead from{" "}
              <strong>{deleteTarget?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LeadsPage;
