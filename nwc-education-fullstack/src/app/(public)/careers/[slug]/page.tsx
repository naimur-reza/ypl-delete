import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Metadata } from "next";
import { MarkdownContent } from "@/components/ui/markdown-content";
import Link from "next/link";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{
    country: string;
    slug: string;
  }>;
};

async function getCareer(slug: string) {
  const career = await prisma.career.findFirst({
    where: { slug, status: "ACTIVE" },
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
    title: career.metaTitle || `${career.title} | Careers | NWC Education`,
    description:
      career.metaDescription ||
      `Apply for ${career.title} position at NWC Education. ${
        career.location || ""
      }`,
    keywords: career.metaKeywords || undefined,
  };
}

export default async function CareerDetailsPage({ params }: PageProps) {
  const { country, slug } = await params;
  const career = await getCareer(slug);

  if (!career || career.status !== "ACTIVE") {
    notFound();
  }

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

  const getJobTypeLabel = (type?: string | null) => {
    if (!type) return "";
    return type.replace(/_/g, " ");
  };

  const parseListContent = (content?: string | null) => {
    if (!content) return [];
    return content.split("\n").filter((item) => item.trim());
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-primary/10 via-primary/5 to-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm font-medium">
                {career.department || "Career Opportunity"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              {career.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              {career.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{career.location}</span>
                </div>
              )}
              {career.jobType && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{getJobTypeLabel(career.jobType)}</span>
                </div>
              )}
              {(career.salaryMin || career.salaryMax) && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
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
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content - 2/3 width */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description */}
              {career.description && (
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    About the Role
                  </h2>
                  <MarkdownContent content={career.description} />
                </div>
              )}

              {/* Responsibilities */}
              {career.responsibilities && (
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Key Responsibilities
                  </h2>
                  <MarkdownContent content={career.responsibilities} />
                </div>
              )}

              {/* Requirements */}
              {career.requirements && (
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Requirements
                  </h2>
                  <MarkdownContent content={career.requirements} />
                </div>
              )}

              {/* Benefits */}
              {career.benefits && (
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    What We Offer
                  </h2>
                  <ul className="space-y-3">
                    {parseListContent(career.benefits).map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Sidebar - Job Info & Application */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Job Details Card */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    Job Details
                  </h3>
                  <div className="space-y-4">
                    {career.jobType && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Employment Type
                        </div>
                        <div className="font-medium text-foreground">
                          {getJobTypeLabel(career.jobType)}
                        </div>
                      </div>
                    )}
                    {career.jobLocation && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Work Location
                        </div>
                        <div className="font-medium text-foreground">
                          {getJobTypeLabel(career.jobLocation)}
                        </div>
                      </div>
                    )}
                    {career.location && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Location
                        </div>
                        <div className="font-medium text-foreground">
                          {career.location}
                        </div>
                      </div>
                    )}
                    {career.department && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Department
                        </div>
                        <div className="font-medium text-foreground">
                          {career.department}
                        </div>
                      </div>
                    )}
                    {(career.salaryMin || career.salaryMax) && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Salary Range
                        </div>
                        <div className="font-medium text-foreground">
                          {formatSalary(
                            career.salaryMin,
                            career.salaryMax,
                            career.salaryCurrency
                          )}
                        </div>
                      </div>
                    )}
                    {career.deadline && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Application Deadline
                        </div>
                        <div className="font-medium text-foreground flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(career.deadline).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Apply Now Card */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Ready to Apply?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join our team and make a difference in students' lives
                  </p>
                  <Link
                    href={`/careers/${career.slug}/apply`}
                    className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  {career.deadline && (
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Deadline:{" "}
                      {new Date(career.deadline).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
