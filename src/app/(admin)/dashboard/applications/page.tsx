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
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import {
  MoreHorizontal,
  Eye,
  FileText,
  ExternalLink,
  Linkedin,
  Globe,
  Mail,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  Clock,
  Trash2,
} from "lucide-react";

type JobApplication = {
  id: string;
  name: string;
  email: string;
  phone: string;
  coverLetter?: string | null;
  resumeUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  currentCompany?: string | null;
  yearsOfExperience?: number | null;
  expectedSalary?: string | null;
  availableFrom?: string | null;
  status: string;
  notes?: string | null;
  createdAt: string;
  career?: {
    id: string;
    title: string;
    department?: string | null;
  };
};

const statusOptions = [
  "PENDING",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "HIRED",
] as const;

const statusColors: Record<string, string> = {
  PENDING: "outline",
  REVIEWING: "secondary",
  SHORTLISTED: "default",
  REJECTED: "destructive",
  HIRED: "default",
};

const ApplicationsPage = () => {
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplication | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<JobApplication | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { table, isLoading, error, pagination, refetch } =
    useDataTable<JobApplication>({
      endpoint: "/api/job-applications",
      columns: [],
      enableServerSidePagination: true,
      enableServerSideSorting: true,
      enableServerSideFiltering: true,
      pageSize: 10,
      filterColumnKey: "name",
    });

  const updateStatus = useCallback(
    async (application: JobApplication, nextStatus: string) => {
      const res = await fetch("/api/job-applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: application.id, status: nextStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to update status");
      } else {
        toast.success("Status updated");
        refetch();
      }
    },
    [refetch]
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/job-applications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget.id }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to delete application");
      } else {
        toast.success("Application deleted");
        refetch();
      }
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, refetch]);

  const viewApplication = useCallback((application: JobApplication) => {
    setSelectedApplication(application);
    setIsViewDialogOpen(true);
  }, []);

  const columns: ColumnDef<JobApplication>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Applicant",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.email}
            </div>
          </div>
        ),
        enableSorting: true,
      },
      {
        id: "career",
        header: "Position",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">
              {row.original.career?.title || "-"}
            </div>
            <div className="text-sm text-muted-foreground">
              {row.original.career?.department || "General"}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
      },
      {
        id: "experience",
        header: "Experience",
        cell: ({ row }) =>
          row.original.yearsOfExperience
            ? `${row.original.yearsOfExperience} years`
            : "-",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Badge
                className="cursor-pointer"
                variant={
                  statusColors[row.original.status] as
                    | "default"
                    | "secondary"
                    | "destructive"
                    | "outline"
                }
              >
                {row.original.status}
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Change status</DropdownMenuLabel>
              {statusOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  onClick={() => updateStatus(row.original, opt)}
                  className={row.original.status === opt ? "bg-accent" : ""}
                >
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Applied",
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
              <DropdownMenuItem onClick={() => viewApplication(row.original)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {row.original.resumeUrl && (
                <DropdownMenuItem asChild>
                  <a
                    href={row.original.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Resume
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
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
    [updateStatus, viewApplication]
  );

  if (table.options.columns.length === 0) {
    table.setOptions((prev) => ({ ...prev, columns }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
        <p className="text-muted-foreground">
          Manage and review job applications submitted through the careers page.
        </p>
      </div>

      <DataTable
        table={table}
        columns={columns}
        filterColumnKey="name"
        filterPlaceholder="Search applications..."
        isLoading={isLoading}
        error={error}
        pagination={pagination}
      />

      {/* View Application Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Submitted on{" "}
              {selectedApplication &&
                new Date(selectedApplication.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6 mt-4">
              {/* Applicant Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">
                  Applicant Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedApplication.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <a
                        href={`mailto:${selectedApplication.email}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {selectedApplication.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <a
                        href={`tel:${selectedApplication.phone}`}
                        className="font-medium"
                      >
                        {selectedApplication.phone}
                      </a>
                    </div>
                  </div>
                  {selectedApplication.currentCompany && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Current Company
                        </p>
                        <p className="font-medium">
                          {selectedApplication.currentCompany}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Position Applied */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-xl">
                <h4 className="font-semibold text-foreground">
                  Position Applied
                </h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {selectedApplication.career?.title || "Unknown Position"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedApplication.career?.department || "General"}
                    </p>
                  </div>
                  <Badge
                    variant={
                      statusColors[selectedApplication.status] as
                        | "default"
                        | "secondary"
                        | "destructive"
                        | "outline"
                    }
                  >
                    {selectedApplication.status}
                  </Badge>
                </div>
              </div>

              {/* Experience & Expectations */}
              <div className="grid grid-cols-2 gap-4">
                {selectedApplication.yearsOfExperience && (
                  <div className="flex items-center gap-2 p-3 border border-border rounded-lg">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Experience
                      </p>
                      <p className="font-medium">
                        {selectedApplication.yearsOfExperience} years
                      </p>
                    </div>
                  </div>
                )}
                {selectedApplication.expectedSalary && (
                  <div className="flex items-center gap-2 p-3 border border-border rounded-lg">
                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Expected Salary
                      </p>
                      <p className="font-medium">
                        {selectedApplication.expectedSalary}
                      </p>
                    </div>
                  </div>
                )}
                {selectedApplication.availableFrom && (
                  <div className="flex items-center gap-2 p-3 border border-border rounded-lg">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Available From
                      </p>
                      <p className="font-medium">
                        {new Date(
                          selectedApplication.availableFrom
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-2">
                {selectedApplication.resumeUrl && (
                  <a
                    href={selectedApplication.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    View Resume
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {selectedApplication.linkedinUrl && (
                  <a
                    href={selectedApplication.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#0077B5] text-white rounded-lg text-sm font-medium hover:bg-[#0077B5]/90 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {selectedApplication.portfolioUrl && (
                  <a
                    href={selectedApplication.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Portfolio
                  </a>
                )}
              </div>

              {/* Cover Letter */}
              {selectedApplication.coverLetter && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Cover Letter
                  </h4>
                  <div className="p-4 bg-muted/50 rounded-xl text-sm whitespace-pre-wrap">
                    {selectedApplication.coverLetter}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedApplication.notes && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Internal Notes
                  </h4>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-sm">
                    {selectedApplication.notes}
                  </div>
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
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the application from{" "}
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

export default ApplicationsPage;
