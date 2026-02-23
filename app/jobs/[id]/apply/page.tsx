import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, MapPin, Briefcase } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import Career from "@/lib/models/career";
import { ApplyForm } from "./ApplyForm";

interface ApplyPageProps {
  params: Promise<{ id: string }>;
}

async function getJob(id: string) {
  await connectDB();
  const job = await Career.findById(id).lean();
  return job ? JSON.parse(JSON.stringify(job)) : null;
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/jobs/${id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Job Details
        </Link>

        <div className="mt-8 mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Apply for <span className="text-primary">{job.title}</span>
          </h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {job.company && (
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                {job.company}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {job.location}
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              {job.type}
            </div>
          </div>
        </div>

        <ApplyForm jobId={id} jobTitle={job.title} />
      </div>
    </div>
  );
}
