"use client";

import { useState } from "react";
import { Users, Filter, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCrud } from "@/hooks/use-crud";
import { DataTable, Column } from "@/components/dashboard/data-table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventLead {
  _id?: string;
  eventId: { _id: string; title: string } | string;
  fullName: string;
  email: string;
  mobileNumber: string;
  organization?: string;
  designation?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export default function EventLeadsPage() {
  const { items, isLoading, update, remove } = useCrud<EventLead>("/api/event-leads");
  const [deleteTarget, setDeleteTarget] = useState<EventLead | null>(null);

 
  const handleStatusChange = async (id: string, status: string) => {
    await update(id, { status } as any);
  };

  const columns: Column<EventLead>[] = [
    { key: "fullName", label: "Full Name", sortable: true },
    {
      key: "eventId",
      label: "Event",
      render: (item) => (
        <span className="font-medium">
          {typeof item.eventId === "object" ? item.eventId.title : "—"}
        </span>
      ),
    },
    { key: "email", label: "Email" },
    { key: "mobileNumber", label: "Mobile" },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Select
          value={item.status}
          onValueChange={(val) => handleStatusChange(item._id!, val)}
        >
          <SelectTrigger className="h-8 w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-amber-500" />
                <span>Pending</span>
              </div>
            </SelectItem>
            <SelectItem value="confirmed">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Confirmed</span>
              </div>
            </SelectItem>
            <SelectItem value="cancelled">
              <div className="flex items-center gap-2">
                <XCircle className="h-3 w-3 text-red-500" />
                <span>Cancelled</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "createdAt",
      label: "Applied On",
      sortable: true,
      render: (item) => (
        <span className="text-xs text-muted-foreground">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Event Leads"
        description="Manage event registrations and attendee leads"
      />

      <DataTable
        title="Event Registrations"
        columns={columns}
        data={items}
        isLoading={isLoading}
        searchKeys={["fullName", "email", "mobileNumber", "organization"]}
        actions={(item) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteTarget(item)}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => remove(deleteTarget!._id!)}
        title="Delete Registration"
        description={`Are you sure you want to delete the registration for ${deleteTarget?.fullName}?`}
      />
    </div>
  );
}
