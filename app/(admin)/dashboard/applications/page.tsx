"use client";

import { UserCheck } from "lucide-react";
import { useCrud } from "@/hooks/use-crud";
import { DataTable, Column } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Application {
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  cvUrl: string;
  career: { _id: string; title: string } | string;
  branch: { _id: string; name: string } | string;
  status: string;
  appliedAt: string;
}

export default function ApplicationsPage() {
  const { items, isLoading, update } = useCrud<Application>("/api/applications");

  const handleStatusChange = async (id: string, status: string) => {
    await update(id, { status } as any);
  };

  const columns: Column<Application>[] = [
    { key: "fullName", label: "Candidate", sortable: true },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "career", label: "Career/Job",
      render: (item) => typeof item.career === "object" ? item.career.title : item.career,
    },
    {
      key: "branch", label: "Branch",
      render: (item) => (
        <Badge variant="outline">
          {typeof item.branch === "object" ? item.branch.name : item.branch || "—"}
        </Badge>
      ),
    },
    {
      key: "status", label: "Status",
      render: (item) => (
        <Select value={item.status} onValueChange={(v) => handleStatusChange(item._id!, v)}>
          <SelectTrigger className="h-7 w-[120px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["new", "reviewed", "shortlisted", "rejected", "hired"].map((s) => (
              <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "appliedAt", label: "Applied",
      render: (item) => new Date(item.appliedAt).toLocaleDateString(),
    },
    {
      key: "cvUrl", label: "CV",
      render: (item) => item.cvUrl ? (
        <a href={item.cvUrl} target="_blank" rel="noopener" className="text-xs text-primary underline">View CV</a>
      ) : <span className="text-xs text-muted-foreground">No CV</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader icon={UserCheck} title="Job Applications" description="View and manage candidate applications" />
      <DataTable title="All Applications" columns={columns} data={items} isLoading={isLoading} searchKeys={["fullName", "email"]} />
    </div>
  );
}
