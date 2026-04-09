"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

type LeadListItem = {
  _id: string;
  fullName: string;
  email: string;
  currentPosition?: string;
  department?: string;
  role?: string;
  cvUrl?: string;
};

export function CreateBundleDialog(props: {
  onCreated?: (bundle?: { _id?: string }) => void;
  trigger?: React.ReactNode;
  selectedCandidateIds?: string[];
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [bundleName, setBundleName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [candidateQuery, setCandidateQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [leads, setLeads] = useState<LeadListItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    props.selectedCandidateIds || []
  );
  const preselectedMode = !!props.selectedCandidateIds?.length;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(candidateQuery.trim()), 250);
    return () => clearTimeout(t);
  }, [candidateQuery]);

  useEffect(() => {
    if (!open || preselectedMode) return;
    let cancelled = false;
    setIsLoadingLeads(true);

    const p = new URLSearchParams();
    p.set("hasCv", "true");
    if (debouncedQuery) p.set("q", debouncedQuery);

    fetch(`/api/salary-guide-leads?${p.toString()}`, {
      credentials: "include",
    })
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (cancelled) return;
        if (!ok) throw new Error(d?.error || "Failed to load candidates");
        setLeads(Array.isArray(d) ? d : d?.data || []);
      })
      .catch((e) => {
        if (!cancelled) toast.error(e.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingLeads(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, debouncedQuery, preselectedMode]);

  const selectedCount = selectedIds.length;

  const visibleLeads = useMemo(() => {
    if (!candidateQuery.trim()) return leads;
    const q = candidateQuery.trim().toLowerCase();
    return leads.filter((l) => {
      return (
        (l.fullName || "").toLowerCase().includes(q) ||
        (l.email || "").toLowerCase().includes(q) ||
        (l.currentPosition || "").toLowerCase().includes(q) ||
        (l.department || "").toLowerCase().includes(q)
      );
    });
  }, [leads, candidateQuery]);

  const toggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const reset = () => {
    setBundleName("");
    setCompanyName("");
    setCompanyEmail("");
    setNotes("");
    setCandidateQuery("");
    setDebouncedQuery("");
    setLeads([]);
    setSelectedIds(props.selectedCandidateIds || []);
  };

  const submit = async () => {
    if (!bundleName.trim()) return toast.error("Bundle name is required");
    if (!companyName.trim()) return toast.error("Company name is required");
    if (!selectedIds.length) return toast.error("Select at least one candidate");

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
      setOpen(false);
      props.onCreated?.(data);
      reset();
    } catch (e: any) {
      toast.error(e.message || "Failed to create bundle");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        {props.trigger || (
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Bundle
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create CV Bundle</DialogTitle>
          <DialogDescription>
            Group candidate CVs into a bundle to send to a company.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Bundle Name</label>
            <Input
              value={bundleName}
              onChange={(e) => setBundleName(e.target.value)}
              placeholder="Software Engineers for TechCorp – April 2026"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any admin notes about this bundle..."
            />
          </div>

          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Select Candidates</span>
                <Badge
                  variant="outline"
                  className="bg-orange-50 text-orange-700 border-orange-200"
                >
                  {selectedCount} selected
                </Badge>
              </div>
              {!preselectedMode ? (
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    value={candidateQuery}
                    onChange={(e) => setCandidateQuery(e.target.value)}
                    placeholder="Search candidates..."
                  />
                </div>
              ) : null}
            </div>

            {preselectedMode ? (
              <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
                Using candidates selected from CV Bank.
              </div>
            ) : (
              <ScrollArea className="h-[320px] rounded-md border">
                <div className="divide-y">
                  {isLoadingLeads ? (
                    <div className="p-4 text-sm text-muted-foreground">
                      Loading candidates...
                    </div>
                  ) : visibleLeads.length ? (
                    visibleLeads.map((lead) => {
                      const checked = selectedIds.includes(lead._id);
                      return (
                        <button
                          type="button"
                          key={lead._id}
                          onClick={() => toggle(lead._id)}
                          className="w-full flex items-start gap-3 p-3 text-left hover:bg-muted/40"
                        >
                          <Checkbox checked={checked} onCheckedChange={() => toggle(lead._id)} />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-medium truncate">
                                {lead.fullName}
                              </span>
                              {lead.department ? (
                                <Badge variant="outline" className="text-xs">
                                  {lead.department}
                                </Badge>
                              ) : null}
                              {lead.currentPosition ? (
                                <span className="text-xs text-muted-foreground truncate">
                                  {lead.currentPosition}
                                </span>
                              ) : null}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {lead.email}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-4 text-sm text-muted-foreground">
                      No candidates found.
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={isSubmitting}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isSubmitting ? "Creating..." : "Create Bundle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

