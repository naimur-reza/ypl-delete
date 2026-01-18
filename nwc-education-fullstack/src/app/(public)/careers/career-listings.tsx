"use client";

import { CountryAwareLink } from "@/components/common/navbar/country-aware-link";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  ArrowRight,
  Building2,
  Users,
} from "lucide-react";

type Career = {
  id: string;
  title: string;
  slug: string;
  department: string | null;
  location: string | null;
  jobType: string | null;
  jobLocation: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  deadline: string | null;
};

type CareerListingsProps = {
  groupedCareers: Record<string, Career[]>;
};

const formatSalary = (
  min?: number | null,
  max?: number | null,
  currency?: string | null
) => {
  if (!min && !max) return "Competitive Salary";
  const curr = currency || "USD";
  if (min && max)
    return `${curr} ${min.toLocaleString()} - ${max.toLocaleString()}`;
  if (min) return `From ${curr} ${min.toLocaleString()}`;
  if (max) return `Up to ${curr} ${max.toLocaleString()}`;
  return "Competitive Salary";
};

const getDepartmentIcon = (department: string) => {
  const icons: Record<string, string> = {
    Engineering: "💻",
    Marketing: "📢",
    Sales: "💼",
    Operations: "⚙️",
    "Human Resources": "👥",
    Finance: "📊",
    Design: "🎨",
    Support: "🎧",
    General: "🏢",
  };
  return icons[department] || "📁";
};

export function CareerListings({ groupedCareers }: CareerListingsProps) {
  const hasJobs = Object.keys(groupedCareers).length > 0;

  if (!hasJobs) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center py-16 bg-muted/30 rounded-3xl border border-border">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              No Open Positions
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              We don't have any open positions at the moment, but we're always
              looking for talented individuals. Check back soon or send us your
              resume.
            </p>
            <CountryAwareLink
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </CountryAwareLink>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Open Positions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the perfect role that matches your skills and passion
          </p>
        </div>

        <div className="space-y-16">
          {Object.entries(groupedCareers).map(([department, jobs]) => (
            <div key={department}>
              {/* Department Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                  {getDepartmentIcon(department)}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    {department}
                  </h2>
                  <p className="text-muted-foreground">
                    {jobs.length} open{" "}
                    {jobs.length === 1 ? "position" : "positions"}
                  </p>
                </div>
              </div>

              {/* Job Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <CountryAwareLink
                    key={job.id}
                    href={`/careers/${job.slug}`}
                    className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-primary/50 hover:-translate-y-1"
                  >
                    {/* Gradient accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-primary/70 to-primary/30 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {job.jobType && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                              <Clock className="w-3 h-3" />
                              {job.jobType}
                            </span>
                          )}
                          {job.jobLocation && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-accent text-accent-foreground px-3 py-1.5 rounded-full">
                              <Building2 className="w-3 h-3" />
                              {job.jobLocation}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-0.5" />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 mb-5">
                      {job.location && (
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <span>{job.location}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <DollarSign className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-foreground">
                          {formatSalary(
                            job.salaryMin,
                            job.salaryMax,
                            job.salaryCurrency
                          )}
                        </span>
                      </div>

                      {job.deadline && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <span className="text-orange-600 dark:text-orange-400 font-medium">
                            Apply by{" "}
                            {new Date(job.deadline).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary group-hover:underline flex items-center gap-2">
                        View Details & Apply
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </CountryAwareLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
