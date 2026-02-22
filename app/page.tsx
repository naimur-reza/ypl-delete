import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Users,
  Building2,
  Target,
  Award,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/job-card";
import { jobs } from "@/lib/data";

const stats = [
  { value: "15+", label: "Years Experience" },
  { value: "2,500+", label: "Placements Made" },
  { value: "98%", label: "Client Retention" },
  { value: "500+", label: "Partner Companies" },
];

const services = [
  {
    icon: Users,
    title: "Permanent Recruitment",
    description:
      "Find the perfect long-term fit for your team with our comprehensive permanent placement services.",
  },
  {
    icon: Briefcase,
    title: "Contract Staffing",
    description:
      "Flexible workforce solutions to meet your project-based and seasonal staffing needs.",
  },
  {
    icon: Target,
    title: "Executive Search",
    description:
      "Confidential headhunting for senior leadership and C-suite positions.",
  },
  {
    icon: Building2,
    title: "RPO Solutions",
    description:
      "End-to-end recruitment process outsourcing for scalable hiring operations.",
  },
  {
    icon: TrendingUp,
    title: "Career Consulting",
    description:
      "Professional guidance to help candidates navigate their career journey.",
  },
  {
    icon: Award,
    title: "Employer Branding",
    description:
      "Build a compelling employer brand that attracts top talent to your organization.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden bg-secondary">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80"
            alt="Team collaboration"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-secondary/85" />
        </div>

        <div className="relative mx-auto flex min-h-[90vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl py-20">
            <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">
              Your Trusted Recruitment Partner
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-secondary-foreground sm:text-5xl lg:text-6xl">
              Building Teams That
              <span className="block text-primary">Drive Success</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-secondary-foreground/80">
              We connect exceptional talent with forward-thinking organizations.
              From permanent placements to executive search, we deliver
              recruitment solutions that transform businesses.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="/job-seekers">
                  Find Your Next Role
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10"
                asChild
              >
                <Link href="/employers">
                  Hire Top Talent
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary lg:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative">
              <div className="aspect-4/3 overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                  alt="Professional team meeting"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden rounded-xl bg-primary p-6 shadow-lg lg:block">
                <p className="text-3xl font-bold text-primary-foreground">
                  15+
                </p>
                <p className="text-sm text-primary-foreground/80">
                  Years in Industry
                </p>
              </div>
            </div>

            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                About YPL
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Your Partner in Building Exceptional Teams
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                YPL is a specialist recruitment consultancy dedicated to
                connecting businesses with outstanding talent. With over 15
                years of experience, we understand that the right hire can
                transform an organization.
              </p>
              <p className="mt-4 text-muted-foreground">
                Our approach combines deep industry knowledge with a genuine
                commitment to understanding your unique needs. We do not just
                fill positions - we build lasting partnerships that drive
                growth.
              </p>
              <Button
                className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="/about">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-muted py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              What We Do
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Comprehensive Recruitment Solutions
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              From entry-level to executive positions, we deliver tailored
              recruitment services that meet your specific requirements.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="group rounded-xl bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-3 text-muted-foreground">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              asChild
            >
              <Link href="/services">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Open Positions
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Latest Opportunities
              </h2>
            </div>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              asChild
            >
              <Link href="/jobs">
                View All Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.slice(0, 6).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
            alt="Modern office"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-secondary/90" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-secondary-foreground sm:text-4xl lg:text-5xl">
              Ready to Take the Next Step?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-secondary-foreground/80">
              Whether you are looking for top talent or your dream job, our team
              is ready to help you succeed.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="/jobs">Browse Opportunities</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10"
                asChild
              >
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
