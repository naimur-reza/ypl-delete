"use client";

import { History } from "lucide-react";
import { useCrud } from "@/hooks/use-crud";
import { DataTable, Column } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Activity {
  _id: string;
  userName: string;
  userEmail: string;
  action: "create" | "update" | "delete" | "upload";
  entityType: string;
  entityName?: string;
  description: string;
  timestamp: string;
}

export default function ActivitiesPage() {
  const { items, isLoading, refetch } = useCrud<Activity>("/api/activities");

  const actionColors: Record<string, string> = {
    create: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    update: "bg-blue-500/10 text-blue-600 border-blue-200",
    delete: "bg-rose-500/10 text-rose-600 border-rose-200",
    upload: "bg-amber-500/10 text-amber-700 border-amber-200",
  };

  const columns: Column<Activity>[] = [
    {
      key: "timestamp",
      label: "Time",
      sortable: true,
      render: (item) => (
        <span className="text-xs text-muted-foreground">
          {new Date(item.timestamp).toLocaleString()}
        </span>
      ),
    },
    {
      key: "userName",
      label: "User",
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{item.userName}</span>
          <span className="text-xs text-muted-foreground">{item.userEmail}</span>
        </div>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (item) => (
        <Badge
          variant="outline"
          className={`capitalize ${actionColors[item.action] || "bg-gray-500/10 text-gray-700 border-gray-200"}`}
        >
          {item.action}
        </Badge>
      ),
    },
    {
      key: "description",
      label: "Activity",
      render: (item) => (
        <div className="max-w-[300px] truncate" title={item.description}>
          {item.description}
        </div>
      ),
    },
    {
      key: "entityType",
      label: "Entity",
      render: (item) => (
        <span className="text-xs font-mono">{item.entityType}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={History}
        title="Activity Log"
        description="Monitor administrative actions across the platform"
        action={
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              const ok = window.confirm("Clear all activity logs? This cannot be undone.");
              if (!ok) return;
              const res = await fetch("/api/activities", {
                method: "DELETE",
                credentials: "include",
              });
              const data = await res.json().catch(() => null);
              if (!res.ok) {
                toast.error(data?.error || "Failed to clear logs");
                return;
              }
              toast.success("Activity logs cleared");
              refetch();
            }}
          >
            Clear Logs
          </Button>
        }
      />

      <DataTable
        title="Recent Activities"
        columns={columns}
        data={items}
        isLoading={isLoading}
        searchKeys={["userName", "userEmail", "description", "action"]}
      />
    </div>
  );
}
