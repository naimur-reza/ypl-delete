import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Users, Clock, Target, Award, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: Target,
    title: "Targeted Recruitment",
    description:
      "Access our extensive network of pre-screened candidates matched to your specific requirements.",
  },
  {
    icon: Clock,
    title: "Time Efficiency",
    description:
      "Reduce your time-to-hire with our streamlined recruitment process and dedicated support.",
  },
  {
    icon: Award,
    title: "Quality Guarantee",
    description:
      "Benefit from our rigorous screening process ensuring only the best candidates reach you.",
  },
  {
    icon: Users,
    title: "Scalable Solutions",
    description:
      "From single hires to volume recruitment, we adapt to your business needs.",
  },
];

const services = [
  {
    title: "Permanent Recruitment",
    description:
      "Find the perfect long-term additions to your team with our comprehensive search and selection process.",
    features: [
      "Thorough candidate screening",
      "Skills and cultural fit assessment",
      "Reference and background checks",
      "Replacement guarantee",
    ],
  },
  {
    title: "Temporary & Contract Staffing",
    description:
      "Flexible workforce solutions for project-based needs, seasonal demands, or interim coverage.",
    features: [
      "Rapid deployment capability",
      "Fully managed payroll",
      "Flexible contract terms",
      "On-demand talent pool",
    ],
  },
  {
    title: "Executive Search",
    description:
      "Confidential recruitment for senior leadership and board-level positions.",
    features: [
      "Discreet headhunting",
      "Executive assessment",
      "Leadership profiling",
      "Succession planning support",
    ],
  },
  {
    title: "RPO Solutions",
    description:
      "Full or partial outsourcing of your recruitment function for improved efficiency and cost savings.",
    features: [
      "Dedicated recruitment team",
      "Employer branding support",
      "Process optimization",
      "Talent analytics",
    ],
  },
];

export default function EmployersPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] overflow-hidden bg-secondary">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1560472355-536de3962603?w=1920&q=80"
            alt="Business meeting"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-secondary/85" />
        </div>

        <div className="relative mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl py-20">
            <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">
              For Employers
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-secondary-foreground sm:text-5xl lg:text-6xl">
              Hire the Right Talent,
              <span className="block text-primary">Every Time</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-secondary-foreground/80">
              Partner with us to access top-tier candidates and streamline your
              hiring process. Our expert recruiters understand your industry and
              deliver measurable results.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/contact?type=vacancy">
                  Submit a Vacancy
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10"
                asChild
              >
                <Link href="/contact">Request a Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Why Choose Us
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Partner with YPL?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              We deliver more than recruitment - we deliver results that drive
              your business forward.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <benefit.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-muted py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Our Solutions
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Hiring Solutions That Work
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Comprehensive recruitment services tailored to your specific needs
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-xl border border-border bg-card p-8 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-3 text-muted-foreground">
                  {service.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
            alt="Team collaboration"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-secondary/90" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-secondary-foreground sm:text-4xl lg:text-5xl">
              Ready to Build Your Team?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-secondary-foreground/80">
              Get in touch today to discuss your hiring needs and discover how
              we can help you find exceptional talent.
            </p>
            <div className="mt-10">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/contact?type=vacancy">
                  Submit a Vacancy
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
