import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Briefcase, MapPin, Clock, DollarSign, Calendar } from "lucide-react";
import { Metadata } from "next";

type PageProps = {
  params: Promise<{
    country: string;
  }>;
};

export const metadata: Metadata = {
  title: "Careers | Join Our Team | NWC Education",
  description: "Explore exciting career opportunities at NWC Education. Join our team and help students achieve their dreams of studying abroad.",
};

async function getCareers() {
  const careers = await prisma.career.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return careers;
}

export default async function CareersPage({ params }: PageProps) {
  const { country } = await params;
  const careers = await getCareers();

  // Group careers by department
  const groupedCareers = careers.reduce((acc, career) => {
    if (!acc[career.department!]) {
      acc[career.department!] = [];
    }
    acc[career.department!].push(career);
    return acc;
  }, {} as Record<string, typeof careers>);

  const formatSalary = (min?: number | null, max?: number | null, currency?: string | null) => {
    if (!min && !max) return "Competitive";
    const curr = currency || "USD";
    if (min && max) return `${curr} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `${curr} ${min.toLocaleString()}+`;
    if (max) return `Up to ${curr} ${max.toLocaleString()}`;
    return "Competitive";
  };

 

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-primary/10 via-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm font-medium">Join Our Team</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Build Your Career With Us
            </h1>
            <p className="text-xl text-muted-foreground">
              Join NWC Education and help students achieve their dreams of studying abroad.
              We're looking for passionate individuals to join our growing team.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Open Positions", value: careers.length },
              { label: "Departments", value: Object.keys(groupedCareers).length },
              { label: "Countries", value: "15+" },
              { label: "Team Members", value: "200+" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Listing */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {Object.keys(groupedCareers).length > 0 ? (
            <div className="space-y-12">
              {Object.entries(groupedCareers).map(([department, jobs]) => (
                <div key={department}>
                  <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <div className="w-1 h-8 bg-primary rounded-full" />
                    {department}
                    <span className="text-lg font-normal text-muted-foreground">
                      ({jobs.length} {jobs.length === 1 ? "position" : "positions"})
                    </span>
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                      <Link
                        key={job.id}
                        href={`/${country}/careers/${job.slug}`}
                        className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                                <Clock className="w-3 h-3" />
                            {job.jobType}
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs bg-accent/50 text-accent-foreground px-3 py-1 rounded-full">
                                {job.jobLocation}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 shrink-0" />
                            <span>{job.location}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <DollarSign className="w-4 h-4 shrink-0" />
                            <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
                          </div>

                          {job.deadline && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 shrink-0" />
                              <span>
                                Apply by {new Date(job.deadline).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-border">
                          <span className="text-sm font-medium text-primary group-hover:underline">
                            View Details & Apply →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">
                No Open Positions
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We don't have any open positions at the moment, but we're always looking
                for talented individuals. Check back soon or send us your resume.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Join NWC Education?
            </h2>
            <p className="text-lg text-muted-foreground">
              We offer more than just a job - we offer a career with purpose
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Global Impact",
                description: "Help students from around the world achieve their educational dreams",
                icon: "🌍",
              },
              {
                title: "Career Growth",
                description: "Continuous learning opportunities and clear career progression paths",
                icon: "📈",
              },
              {
                title: "Competitive Benefits",
                description: "Comprehensive health coverage, retirement plans, and performance bonuses",
                icon: "💰",
              },
              {
                title: "Work-Life Balance",
                description: "Flexible working hours and remote work options",
                icon: "⚖️",
              },
              {
                title: "Diverse Team",
                description: "Work with talented professionals from diverse backgrounds",
                icon: "🤝",
              },
              {
                title: "Innovation",
                description: "Be part of cutting-edge educational technology and solutions",
                icon: "💡",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
