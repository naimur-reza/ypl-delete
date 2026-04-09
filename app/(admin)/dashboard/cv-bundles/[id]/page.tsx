"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/dashboard/page-header";
import { BundleStatusBadge } from "@/components/dashboard/cv-bundles/BundleStatusBadge";
import { BundleCandidatesTable } from "@/components/dashboard/cv-bundles/BundleCandidatesTable";
import { InvoicePanel } from "@/components/dashboard/cv-bundles/InvoicePanel";
import type { BundleStatus, CvBundle } from "@/lib/types/cv-bundle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const bundleStatuses: BundleStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Converted",
];

export default function CvBundleDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [bundle, setBundle] = useState<CvBundle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingInfo, setEditingInfo] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);

  const [draft, setDraft] = useState({
    bundleName: "",
    companyName: "",
    companyEmail: "",
    notes: "",
    status: "New" as BundleStatus,
    sentAt: "" as string,
  });

  const fetchBundle = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cv-bundles/${id}`, { credentials: "include" });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Failed to load bundle");
      setBundle(data);
      setDraft({
        bundleName: data.bundleName || "",
        companyName: data.companyName || "",
        companyEmail: data.companyEmail || "",
        notes: data.notes || "",
        status: data.status || "New",
        sentAt: data.sentAt ? new Date(data.sentAt).toISOString().slice(0, 16) : "",
      });
    } catch (e: any) {
      toast.error(e.message || "Failed to load bundle");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBundle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveInfo = async () => {
    if (!bundle) return;
    setSavingInfo(true);
    try {
      const res = await fetch(`/api/cv-bundles/${bundle._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bundleName: draft.bundleName.trim(),
          companyName: draft.companyName.trim(),
          companyEmail: draft.companyEmail.trim(),
          notes: draft.notes,
          status: draft.status,
          sentAt: draft.sentAt ? new Date(draft.sentAt).toISOString() : null,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Failed to update bundle");
      setBundle(data);
      setEditingInfo(false);
      toast.success("Bundle updated");
    } catch (e: any) {
      toast.error(e.message || "Failed to update bundle");
    } finally {
      setSavingInfo(false);
    }
  };

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading...</div>;

  if (!bundle) {
    return (
      <div className="space-y-3">
        <div className="text-sm text-muted-foreground">Bundle not found.</div>
        <Button variant="outline" onClick={() => router.push("/dashboard/cv-bundles")}>
          Back to Bundles
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/cv-bundles">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>
      </div>

      <PageHeader icon={Briefcase} title={bundle.bundleName} description={bundle.companyName} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-sm font-medium">Bundle info</div>
                <div className="text-xs text-muted-foreground">
                  Company details, note, status and sent date.
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingInfo((v) => !v)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                {editingInfo ? "Cancel" : "Edit"}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Bundle name</div>
                {editingInfo ? (
                  <Input
                    value={draft.bundleName}
                    onChange={(e) => setDraft((d) => ({ ...d, bundleName: e.target.value }))}
                  />
                ) : (
                  <div className="text-sm font-medium">{bundle.bundleName}</div>
                )}
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Company</div>
                {editingInfo ? (
                  <Input
                    value={draft.companyName}
                    onChange={(e) => setDraft((d) => ({ ...d, companyName: e.target.value }))}
                  />
                ) : (
                  <div className="text-sm font-medium">{bundle.companyName}</div>
                )}
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Company email</div>
                {editingInfo ? (
                  <Input
                    value={draft.companyEmail}
                    onChange={(e) => setDraft((d) => ({ ...d, companyEmail: e.target.value }))}
                  />
                ) : (
                  <div className="text-sm">{bundle.companyEmail || "—"}</div>
                )}
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Sent at</div>
                {editingInfo ? (
                  <Input
                    type="datetime-local"
                    value={draft.sentAt}
                    onChange={(e) => setDraft((d) => ({ ...d, sentAt: e.target.value }))}
                  />
                ) : (
                  <div className="text-sm">
                    {bundle.sentAt ? new Date(bundle.sentAt as any).toLocaleString() : "—"}
                  </div>
                )}
              </div>
              <div className="space-y-1 sm:col-span-2">
                <div className="text-xs text-muted-foreground">Status</div>
                {editingInfo ? (
                  <div className="flex items-center gap-2">
                    <Select
                      value={draft.status}
                      onValueChange={(v) => setDraft((d) => ({ ...d, status: v as BundleStatus }))}
                    >
                      <SelectTrigger className="w-[220px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {bundleStatuses.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <BundleStatusBadge kind="bundle" status={draft.status} />
                  </div>
                ) : (
                  <BundleStatusBadge kind="bundle" status={bundle.status} />
                )}
              </div>
              <div className="space-y-1 sm:col-span-2">
                <div className="text-xs text-muted-foreground">Company note</div>
                {editingInfo ? (
                  <Textarea
                    value={draft.notes}
                    onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                  />
                ) : (
                  <div className="text-sm whitespace-pre-wrap">{bundle.notes || "—"}</div>
                )}
              </div>
            </div>

            {editingInfo ? (
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setEditingInfo(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={saveInfo}
                  disabled={savingInfo}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {savingInfo ? "Saving..." : "Save"}
                </Button>
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Candidates</div>
            <BundleCandidatesTable
              bundleId={bundle._id}
              candidates={bundle.candidates}
              onSaved={(updated) => setBundle(updated)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <InvoicePanel
            bundleId={bundle._id}
            invoiceUrl={bundle.invoiceUrl}
            invoiceUploadedAt={bundle.invoiceUploadedAt}
            candidates={bundle.candidates}
            onUploaded={(updated) => setBundle(updated)}
          />
        </div>
      </div>
    </div>
  );
}

