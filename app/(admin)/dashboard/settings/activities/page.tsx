"use client";

import { History } from "lucide-react";
import { useCrud } from "@/hooks/use-crud";
import { DataTable, Column } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";

interface Activity {
  _id: string;
  userName: string;
  userEmail: string;
  action: "create" | "update" | "delete";
  entityType: string;
  entityName?: string;
  description: string;
  timestamp: string;
}

export default function ActivitiesPage() {
  const { items, isLoading } = useCrud<Activity>("/api/activities");

  const actionColors: Record<string, string> = {
    create: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    update: "bg-blue-500/10 text-blue-600 border-blue-200",
    delete: "bg-rose-500/10 text-rose-600 border-rose-200",
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
        <Badge variant="outline" className={`capitalize ${actionColors[item.action]}`}>
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
