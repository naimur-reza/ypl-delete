import Link from "next/link";
import { MapPin, Clock, Building2 } from "lucide-react";
import type { Job } from "@/lib/data";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group block rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {job.type}
        </span>
        <span className="text-xs text-muted-foreground">{job.postedDate}</span>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary">
        {job.title}
      </h3>

      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4 text-primary/70" />
          <span>{job.company}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary/70" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-primary/70" />
          <span>{job.salary}</span>
        </div>
      </div>

      <p className="line-clamp-2 text-sm text-muted-foreground">
        {job.description}
      </p>
    </Link>
  );
}
