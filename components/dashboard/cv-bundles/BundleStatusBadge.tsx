"use client";

import { Badge } from "@/components/ui/badge";
import type { BundleStatus, CandidateStatus } from "@/lib/types/cv-bundle";

const bundleColors: Record<BundleStatus, string> = {
  New: "bg-gray-500/10 text-gray-700 border-gray-200",
  Contacted: "bg-blue-500/10 text-blue-600 border-blue-200",
  Qualified: "bg-amber-500/10 text-amber-700 border-amber-200",
  Converted: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
};

const candidateColors: Record<CandidateStatus, string> = {
  New: "bg-gray-500/10 text-gray-700 border-gray-200",
  Contacted: "bg-blue-500/10 text-blue-600 border-blue-200",
  Qualified: "bg-amber-500/10 text-amber-700 border-amber-200",
  Converted: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
};

export function BundleStatusBadge(props: {
  status: BundleStatus | CandidateStatus;
  kind: "bundle" | "candidate";
  className?: string;
}) {
  const color =
    props.kind === "bundle"
      ? bundleColors[props.status as BundleStatus]
      : candidateColors[props.status as CandidateStatus];

  return (
    <Badge
      variant="outline"
      className={`whitespace-nowrap ${color} ${props.className || ""}`}
    >
      {props.status}
    </Badge>
  );
}

