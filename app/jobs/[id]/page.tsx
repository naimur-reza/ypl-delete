import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Clock, Building2, Calendar, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { connectDB } from "@/lib/mongodb";
import Career from "@/lib/models/career";

interface JobDetailsPageProps {
  params: Promise<{ id: string }>;
}

async function getCareer(id: string) {
  await connectDB();
  const career = await Career.findById(id).lean();
  return career ? JSON.parse(JSON.stringify(career)) : null;
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params;
  const career = await getCareer(id);

  if (!career) {
    notFound();
  }

  return (
    <>
      {/* Header */}
      <section className="bg-primary py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/jobs" className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Jobs
          </Link>

          <div className="mt-6">
            <span className="inline-block rounded-full bg-primary-foreground/20 px-3 py-1 text-sm font-medium text-primary-foreground">
              {career.type}
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">{career.title}</h1>

            <div className="mt-6 flex flex-wrap gap-6 text-primary-foreground/80">
              {career.company && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" /><span>{career.company}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" /><span>{career.location}</span>
              </div>
              {career.salary && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" /><span>{career.salary}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" /><span>Posted {new Date(career.postedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-lg border border-border bg-card p-8">
                <h2 className="text-xl font-semibold text-foreground">Job Description</h2>
                <p className="mt-4 text-muted-foreground whitespace-pre-line">{career.description}</p>

                {career.requirements && career.requirements.length > 0 && (
                  <>
                    <h3 className="mt-8 text-lg font-semibold text-foreground">Requirements</h3>
                    <ul className="mt-4 space-y-3">
                      {career.requirements.map((req: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
                          <span className="text-muted-foreground">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="sticky top-24 rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground">Interested in this role?</h3>
                <p className="mt-2 text-sm text-muted-foreground">Apply now or get in touch with our team to learn more about this opportunity.</p>
                <div className="mt-6 space-y-3">
                  <Button className="w-full" asChild>
                    <Link href={`/jobs/${career._id}/apply`}>Apply Now</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/contact">Contact Recruiter</Link>
                  </Button>
                </div>

                <div className="mt-8 border-t border-border pt-6">
                  <h4 className="text-sm font-semibold text-foreground">Job Summary</h4>
                  <dl className="mt-4 space-y-4">
                    {career.category && (
                      <div>
                        <dt className="text-xs text-muted-foreground">Category</dt>
                        <dd className="mt-1 text-sm text-foreground">{career.category}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-xs text-muted-foreground">Job Type</dt>
                      <dd className="mt-1 text-sm text-foreground">{career.type}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Location</dt>
                      <dd className="mt-1 text-sm text-foreground">{career.location}</dd>
                    </div>
                    {career.salary && (
                      <div>
                        <dt className="text-xs text-muted-foreground">Salary</dt>
                        <dd className="mt-1 text-sm text-foreground">{career.salary}</dd>
                      </div>
                    )}
                    {career.department && (
                      <div>
                        <dt className="text-xs text-muted-foreground">Department</dt>
                        <dd className="mt-1 text-sm text-foreground">{career.department}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
