import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

import { Briefcase, MapPin, Clock, DollarSign, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ApplyForm } from "./apply-form";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{
    country?: string;
    slug: string;
  }>;
};

async function getCareer(slug: string) {
  const career = await prisma.career.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      department: true,
      location: true,
      jobType: true,
      jobLocation: true,
      salaryMin: true,
      salaryMax: true,
      salaryCurrency: true,
      deadline: true,
      isActive: true,
    },
  });

  return career;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const career = await getCareer(slug);

  if (!career) {
    return {
      title: "Job Not Found",
    };
  }

  return {
    title: `Apply for ${career.title} | Careers | NWC Education`,
    description: `Submit your application for the ${career.title} position at NWC Education. Join our team and make a difference in students' lives.`,
  };
}

export default async function ApplyPage({ params }: PageProps) {
  const { slug } = await params;
  const career = await getCareer(slug);

  if (!career || !career.isActive) {
    notFound();
  }

  // Check if deadline has passed
  const isExpired = career.deadline && new Date(career.deadline) < new Date();

  const formatSalary = (
    min?: number | null,
    max?: number | null,
    currency?: string | null
  ) => {
    if (!min && !max) return "Competitive";
    const curr = currency || "USD";
    if (min && max)
      return `${curr} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `${curr} ${min.toLocaleString()}+`;
    if (max) return `Up to ${curr} ${max.toLocaleString()}`;
    return "Competitive";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-linear-to-br from-primary/10 via-primary/5 to-background py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <Link
            href={`/careers/${slug}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to job details</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full mb-3">
                <Briefcase className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">
                  {career.department || "Open Position"}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Apply for {career.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {career.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{career.location}</span>
                  </div>
                )}
                {career.jobType && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{career.jobType.replace(/_/g, " ")}</span>
                  </div>
                )}
                {(career.salaryMin || career.salaryMax) && (
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      {formatSalary(
                        career.salaryMin,
                        career.salaryMax,
                        career.salaryCurrency
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {career.deadline && (
              <div
                className={`px-4 py-2 rounded-xl text-sm font-medium ${
                  isExpired
                    ? "bg-destructive/10 text-destructive"
                    : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                }`}
              >
                {isExpired
                  ? "Applications closed"
                  : `Deadline: ${new Date(career.deadline).toLocaleDateString(
                      "en-US",
                      { month: "long", day: "numeric", year: "numeric" }
                    )}`}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isExpired ? (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Applications Closed
              </h2>
              <p className="text-muted-foreground mb-6">
                The application deadline for this position has passed. Please
                check our other open positions.
              </p>
              <Link
                href="/careers"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                View Open Positions
              </Link>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Submit Your Application
                  </h2>
                  <p className="text-muted-foreground">
                    Fill out the form below to apply for this position. Fields
                    marked with <span className="text-destructive">*</span> are
                    required.
                  </p>
                </div>

                <ApplyForm careerId={career.id} careerTitle={career.title} />
              </div>

              {/* Tips Section */}
              <div className="mt-8 bg-muted/50 border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Application Tips
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                      1
                    </span>
                    <span>
                      Make sure your resume is up-to-date and highlights
                      relevant experience
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                      2
                    </span>
                    <span>
                      Write a compelling cover letter explaining why you're a
                      great fit
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                      3
                    </span>
                    <span>
                      Double-check your contact information before submitting
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                      4
                    </span>
                    <span>
                      You'll receive a confirmation email once your application
                      is submitted
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
