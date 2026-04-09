"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import type { BundleCandidate, CandidateStatus } from "@/lib/types/cv-bundle";
import { BundleStatusBadge } from "@/components/dashboard/cv-bundles/BundleStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInlineCvUrl } from "@/components/dashboard/candidates/candidate-utils";

const candidateStatuses: CandidateStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Converted",
];

type CandidateEdit = {
  status?: CandidateStatus;
};

export function BundleCandidatesTable(props: {
  bundleId: string;
  candidates: BundleCandidate[];
  onSaved?: (updatedBundle: any) => void;
}) {
  const [edits, setEdits] = useState<Record<string, CandidateEdit>>({});
  const [saving, setSaving] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [department, setDepartment] = useState("__all__");
  const [role, setRole] = useState("__all__");

  const allRows = useMemo(() => {
    return props.candidates.map((c) => {
      const key = c.leadId;
      const edit = edits[key] || {};
      return {
        ...c,
        _editStatus: edit.status ?? (c.status as CandidateStatus),
      };
    });
  }, [props.candidates, edits]);

  const rows = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return allRows.filter((c) => {
      if (
        q &&
        !(
          (c.fullName || "").toLowerCase().includes(q) ||
          (c.email || "").toLowerCase().includes(q)
        )
      ) {
        return false;
      }
      if (department !== "__all__" && (c.department || "") !== department) return false;
      if (role !== "__all__" && (c.role || "") !== role) return false;
      return true;
    });
  }, [allRows, keyword, department, role]);

  const departments = useMemo(
    () =>
      Array.from(
        new Set(
          props.candidates
            .map((c) => c.department || "")
            .filter(Boolean)
        )
      ),
    [props.candidates]
  );

  const roles = useMemo(
    () =>
      Array.from(new Set(props.candidates.map((c) => c.role || "").filter(Boolean))),
    [props.candidates]
  );

  const dirtyUpdates = useMemo(() => {
    const updates: { leadId: string; status: CandidateStatus }[] = [];
    for (const c of props.candidates) {
      const e = edits[c.leadId];
      if (!e) continue;
      const nextStatus = (e.status ?? c.status) as CandidateStatus;
      if (nextStatus !== c.status) {
        updates.push({ leadId: c.leadId, status: nextStatus });
      }
    }
    return updates;
  }, [props.candidates, edits]);

  const hasDirty = dirtyUpdates.length > 0;
  const hiredCount = allRows.filter((r) => r._editStatus === "Converted").length;

  const setStatus = (leadId: string, status: CandidateStatus) => {
    setEdits((prev) => ({
      ...prev,
      [leadId]: { ...(prev[leadId] || {}), status },
    }));
  };

  const save = async () => {
    if (!hasDirty) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/cv-bundles/${props.bundleId}/candidates`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: dirtyUpdates }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Failed to save changes");
      toast.success("Candidate statuses updated");
      setEdits({});
      props.onSaved?.(data);
    } catch (e: any) {
      toast.error(e.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          {hiredCount > 0 ? (
            <span className="text-amber-700">
              {hiredCount} candidate(s) marked as Converted. Upload an invoice in the
              panel below.
            </span>
          ) : (
            <span>Update candidate statuses within this bundle.</span>
          )}
        </div>

        {hasDirty ? (
          <Button
            onClick={save}
            disabled={saving}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {saving ? "Saving..." : "Save changes"}
          </Button>
        ) : null}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="relative sm:col-span-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search name/email..."
          />
        </div>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger>
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All roles</SelectItem>
            {roles.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>CV</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((c) => (
              <TableRow key={c.leadId}>
                <TableCell className="font-medium max-w-[220px] truncate">
                  {c.fullName}
                </TableCell>
                <TableCell className="max-w-[220px] truncate">
                  {c.email}
                </TableCell>
                <TableCell>
                  {c.cvUrl ? (
                    <a
                      className="text-orange-700 hover:underline"
                      href={getInlineCvUrl(c.cvUrl)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Select
                      value={c._editStatus}
                      onValueChange={(v) =>
                        setStatus(c.leadId, v as CandidateStatus)
                      }
                    >
                      <SelectTrigger size="sm" className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {candidateStatuses.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <BundleStatusBadge kind="candidate" status={c._editStatus} />
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {c.department || "—"}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {c.role || "—"}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {c.statusUpdatedAt
                    ? new Date(c.statusUpdatedAt as any).toLocaleString()
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

