"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";

type Lead = {
  _id: string;
  fullName: string;
  email: string;
  department?: string;
  role?: string;
  currentPosition?: string;
};

export default function NewCvBundlePage() {
  const router = useRouter();
  const search = useSearchParams();
  const idsParam = search.get("ids") || "";
  const selectedIds = useMemo(
    () => idsParam.split(",").map((s) => s.trim()).filter(Boolean),
    [idsParam]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [bundleName, setBundleName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!selectedIds.length) return;
    setIsLoading(true);
    fetch(`/api/salary-guide-leads?ids=${encodeURIComponent(selectedIds.join(","))}`, {
      credentials: "include",
    })
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!ok) throw new Error(d?.error || "Failed to load selected candidates");
        const items = Array.isArray(d) ? d : d?.data || [];
        setLeads(items);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setIsLoading(false));
  }, [selectedIds]);

  const submit = async () => {
    if (!bundleName.trim()) return toast.error("Bundle name is required");
    if (!companyName.trim()) return toast.error("Company name is required");
    if (!selectedIds.length) return toast.error("No selected candidates found");

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/cv-bundles", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bundleName: bundleName.trim(),
          companyName: companyName.trim(),
          companyEmail: companyEmail.trim(),
          candidateIds: selectedIds,
          notes: notes.trim(),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Failed to create bundle");
      toast.success("Bundle created");
      if (data?._id) router.push(`/dashboard/cv-bundles/${data._id}`);
      else router.push("/dashboard/cv-bundles");
    } catch (e: any) {
      toast.error(e.message || "Failed to create bundle");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/candidates">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to CV Bank
        </Link>
      </Button>

      <PageHeader
        icon={Briefcase}
        title="Create CV Bundle"
        description="Create bundles from selected CV Bank candidates."
      />

      <div className="rounded-lg border p-4 space-y-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Bundle Name</label>
          <Input
            value={bundleName}
            onChange={(e) => setBundleName(e.target.value)}
            placeholder="Software Engineers for TechCorp - April 2026"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Company Name</label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="TechCorp"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Company Email (optional)</label>
            <Input
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              placeholder="hr@techcorp.com"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Company Note</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="General note for this company/bundle..."
          />
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Selected Candidates</div>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            {selectedIds.length} selected
          </Badge>
        </div>
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading selected candidates...</div>
        ) : leads.length ? (
          <div className="space-y-2">
            {leads.map((lead) => (
              <div key={lead._id} className="rounded-md border p-2 text-sm">
                <div className="font-medium">{lead.fullName}</div>
                <div className="text-xs text-muted-foreground">{lead.email}</div>
                <div className="text-xs text-muted-foreground">
                  {[lead.department, lead.role, lead.currentPosition].filter(Boolean).join(" • ")}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            No candidates found. Go back to CV Bank and select candidates first.
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/dashboard/candidates">Cancel</Link>
        </Button>
        <Button
          onClick={submit}
          disabled={isSubmitting || !selectedIds.length}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {isSubmitting ? "Creating..." : "Create Bundle"}
        </Button>
      </div>
    </div>
  );
}

