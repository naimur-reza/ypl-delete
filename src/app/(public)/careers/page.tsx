import { prisma } from "@/lib/prisma";
import { Briefcase, Users, Globe } from "lucide-react";
import { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import CallToActionBanner from "@/components/CallToActionBanner";
import { CareerListings } from "./career-listings";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Careers | Join Our Team | NWC Education",
  description:
    "Explore exciting career opportunities at NWC Education. Join our team and help students achieve their dreams of studying abroad.",
  keywords:
    "careers, jobs, NWC Education, study abroad careers, education jobs",
  url: "/careers",
});

async function getCareers() {
  const careers = await prisma.career.findMany({
    where: {
      isActive: true,
    },
    orderBy: [{ department: "asc" }, { createdAt: "desc" }],
  });

  return careers;
}

export default async function CareersPage() {
  const careers = await getCareers();

  // Group careers by department with fallback for null
  const groupedCareers = careers.reduce((acc, career) => {
    const department = career.department || "General";
    if (!acc[department]) {
      acc[department] = [];
    }
    acc[department].push(career);
    return acc;
  }, {} as Record<string, typeof careers>);

  // Serialize careers for client component
  const serializedGroupedCareers = Object.entries(groupedCareers).reduce(
    (acc, [dept, jobs]) => {
      acc[dept] = jobs.map((job) => ({
        id: job.id,
        title: job.title,
        slug: job.slug,
        department: job.department,
        location: job.location,
        jobType: job.jobType,
        jobLocation: job.jobLocation,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryCurrency: job.salaryCurrency,
        deadline: job.deadline?.toISOString() || null,
      }));
      return acc;
    },
    {} as Record<
      string,
      Array<{
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
      }>
    >
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-primary/10 via-primary/5 to-background py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 border border-primary/20">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm font-medium">We're Hiring!</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Build Your Career
              <span className="block text-primary mt-2">With Us</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join NWC Education and help students achieve their dreams of
              studying abroad. We're looking for passionate individuals to join
              our growing team.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                label: "Open Positions",
                value: careers.length,
                icon: Briefcase,
              },
              {
                label: "Departments",
                value: Object.keys(groupedCareers).length,
                icon: Users,
              },
              { label: "Countries", value: "15+", icon: Globe },
              { label: "Team Members", value: "200+", icon: Users },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 bg-card rounded-xl border border-border"
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Listing - Client Component */}
      <CareerListings groupedCareers={serializedGroupedCareers} />

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
                description:
                  "Help students from around the world achieve their educational dreams",
                icon: "🌍",
              },
              {
                title: "Career Growth",
                description:
                  "Continuous learning opportunities and clear career progression paths",
                icon: "📈",
              },
              {
                title: "Competitive Benefits",
                description:
                  "Comprehensive health coverage, retirement plans, and performance bonuses",
                icon: "💰",
              },
              {
                title: "Work-Life Balance",
                description: "Flexible working hours and remote work options",
                icon: "⚖️",
              },
              {
                title: "Diverse Team",
                description:
                  "Work with talented professionals from diverse backgrounds",
                icon: "🤝",
              },
              {
                title: "Innovation",
                description:
                  "Be part of cutting-edge educational technology and solutions",
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
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CallToActionBanner />
    </div>
  );
}
