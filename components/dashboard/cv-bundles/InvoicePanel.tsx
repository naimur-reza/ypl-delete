"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ExternalLink, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { uploadFile } from "@/app/api/upload";
import type { BundleCandidate } from "@/lib/types/cv-bundle";

export function InvoicePanel(props: {
  bundleId: string;
  invoiceUrl?: string;
  invoiceUploadedAt?: string | Date;
  candidates: BundleCandidate[];
  onUploaded?: (updatedBundle: any) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);

  const hired = useMemo(
    () => props.candidates.filter((c) => c.status === "Converted"),
    [props.candidates]
  );

  const uploadInvoice = async (file: File) => {
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadFile(fd, "cv-bundle-invoices");
      if (!result?.success) {
        throw new Error(result?.error || "Upload failed");
      }
      const data = result.data as { secure_url?: string };
      if (!data?.secure_url) throw new Error("Upload failed");

      const res = await fetch(`/api/cv-bundles/${props.bundleId}/invoice`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceUrl: data.secure_url }),
      });
      const updated = await res.json().catch(() => null);
      if (!res.ok) throw new Error(updated?.error || "Failed to save invoice");

      toast.success("Invoice uploaded");
      props.onUploaded?.(updated);
    } catch (e: any) {
      toast.error(e.message || "Invoice upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium">Invoice</div>
          <div className="text-xs text-muted-foreground">
            Upload an invoice when any candidate in this bundle is converted.
          </div>
        </div>
        {hired.length ? (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-700 border-emerald-200"
          >
            {hired.length} hired
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-200">
            No hires yet
          </Badge>
        )}
      </div>

      {props.invoiceUrl ? (
        <div className="flex flex-col gap-2">
          <div className="text-xs text-muted-foreground">
            Uploaded{" "}
            {props.invoiceUploadedAt
              ? new Date(props.invoiceUploadedAt as any).toLocaleString()
              : "—"}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <a href={props.invoiceUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Invoice
              </a>
            </Button>
            <label className="inline-flex">
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,image/*"
                disabled={isUploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadInvoice(f);
                  e.currentTarget.value = "";
                }}
              />
              <Button
                type="button"
                disabled={isUploading}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Replace Invoice"}
              </Button>
            </label>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="text-xs text-muted-foreground">
            {hired.length
              ? "Ready to upload an invoice."
              : "You can still upload one now, but it’s usually done after conversion."}
          </div>
          <label className="inline-flex">
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,image/*"
              disabled={isUploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadInvoice(f);
                e.currentTarget.value = "";
              }}
            />
            <Button
              type="button"
              disabled={isUploading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Invoice"}
            </Button>
          </label>
        </div>
      )}

      {hired.length ? (
        <div className="pt-2 border-t">
          <div className="text-xs font-medium mb-1">Converted candidates</div>
          <div className="flex flex-wrap gap-2">
            {hired.map((c) => (
              <Badge key={c.leadId} variant="outline">
                {c.fullName}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

