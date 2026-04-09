"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Briefcase, Eye, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { useCrud } from "@/hooks/use-crud";
import { BundleStatusBadge } from "@/components/dashboard/cv-bundles/BundleStatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { BundleStatus } from "@/lib/types/cv-bundle";

type CvBundleListItem = {
  _id: string;
  bundleName: string;
  companyName: string;
  companyEmail?: string;
  sentAt?: string | Date;
  status: BundleStatus;
  candidates: any[];
  invoiceUrl?: string;
};

const bundleStatuses: (BundleStatus | "__all__")[] = [
  "__all__",
  "New",
  "Contacted",
  "Qualified",
  "Converted",
];

export default function CvBundlesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();

  const [q, setQ] = useState(query.get("q") || "");
  const [debouncedQ, setDebouncedQ] = useState(query.get("q") || "");
  const [status, setStatus] = useState<(typeof bundleStatuses)[number]>(
    (query.get("status") as any) || "__all__"
  );
  const [deleteTarget, setDeleteTarget] = useState<CvBundleListItem | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const p = new URLSearchParams();
    if (debouncedQ.trim()) p.set("q", debouncedQ.trim());
    if (status !== "__all__") p.set("status", status);
    router.replace(`${pathname}?${p.toString()}`);
  }, [debouncedQ, status, pathname, router]);

  const endpoint = useMemo(() => {
    const p = new URLSearchParams();
    if (debouncedQ.trim()) p.set("q", debouncedQ.trim());
    if (status !== "__all__") p.set("status", status);
    return `/api/cv-bundles?${p.toString()}`;
  }, [debouncedQ, status]);

  const { items, isLoading, refetch, remove } = useCrud<CvBundleListItem>(endpoint);

  const columns: Column<CvBundleListItem>[] = [
    { key: "bundleName", label: "Bundle Name", sortable: true },
    { key: "companyName", label: "Company", sortable: true },
    {
      key: "candidates",
      label: "# Candidates",
      render: (item) => <span className="text-sm">{item.candidates?.length || 0}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (item) => <BundleStatusBadge kind="bundle" status={item.status} />,
    },
    {
      key: "sentAt",
      label: "Sent",
      sortable: true,
      render: (item) =>
        item.sentAt ? (
          <span className="text-xs text-muted-foreground">
            {new Date(item.sentAt as any).toLocaleDateString()}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      key: "invoiceUrl",
      label: "Invoice",
      render: (item) =>
        item.invoiceUrl ? (
          <FileText className="h-4 w-4 text-orange-700" />
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Briefcase}
        title="CV Bundles"
        description="Group CV bank candidates into company bundles and track conversion."
        action={
          <Button asChild className="bg-orange-600 hover:bg-orange-700">
            <Link href="/dashboard/candidates">Create from CV Bank</Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search bundle name or company..."
            className="max-w-xl"
          />
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {bundleStatuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "__all__" ? "All statuses" : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        title="All Bundles"
        columns={columns}
        data={items}
        isLoading={isLoading}
        searchKeys={["bundleName", "companyName"]}
        actions={(item) => (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/cv-bundles/${item._id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(item)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete bundle"
        description="This will remove the bundle from the dashboard."
        onConfirm={async () => {
          if (!deleteTarget?._id) return false;
          const ok = await remove(deleteTarget._id);
          if (ok) setDeleteTarget(null);
          return ok;
        }}
      />
    </div>
  );
}

