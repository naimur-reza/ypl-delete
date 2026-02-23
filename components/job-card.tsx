import Link from "next/link";
import { MapPin, Clock, Building2, ArrowRight } from "lucide-react";

interface JobCardProps {
  job: {
    _id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    postedDate: Date | string;
  };
}

export function JobCard({ job }: JobCardProps) {
  const formattedDate = new Date(job.postedDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/jobs/${job._id}`}
      className="group relative block rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          {job.type}
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          {formattedDate}
        </span>
      </div>

      <h3 className="mb-3 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
        {job.title}
      </h3>

      <div className="mb-6 space-y-2.5">
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground/90">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted/50 text-primary/70">
            <Building2 className="h-3.5 w-3.5" />
          </div>
          <span className="font-medium">{job.company}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground/90">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted/50 text-primary/70">
            <MapPin className="h-3.5 w-3.5" />
          </div>
          <span>{job.location}</span>
        </div>
        {job.salary && (
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground/90">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted/50 text-primary/70">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <span>{job.salary}</span>
          </div>
        )}
      </div>

      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground/80 transition-colors group-hover:text-muted-foreground">
        {job.description}
      </p>

      <div className="mt-6 flex items-center text-xs font-semibold uppercase tracking-wider text-primary opacity-0 transition-all group-hover:opacity-100">
        View Details
        <ArrowRight className="ml-1 h-3 w-3" />
      </div>
    </Link>
  );
}
