import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Search, FileText, Users, Briefcase, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: Search,
    title: "Exclusive Opportunities",
    description:
      "Access job openings that aren't advertised elsewhere through our extensive employer network.",
  },
  {
    icon: FileText,
    title: "Career Guidance",
    description:
      "Receive personalized advice on CV optimization, interview preparation, and career planning.",
  },
  {
    icon: Users,
    title: "Industry Expertise",
    description:
      "Work with consultants who specialize in your sector and understand market demands.",
  },
  {
    icon: TrendingUp,
    title: "Salary Insights",
    description:
      "Get accurate market salary data to negotiate the best compensation package.",
  },
];

const process = [
  {
    step: "01",
    title: "Register & Submit CV",
    description:
      "Create your profile and upload your CV. Our team will review your experience and career goals.",
  },
  {
    step: "02",
    title: "Consultation Call",
    description:
      "Speak with a specialist consultant who will understand your aspirations and discuss suitable opportunities.",
  },
  {
    step: "03",
    title: "Job Matching",
    description:
      "We'll match you with relevant positions from our database and present your profile to potential employers.",
  },
  {
    step: "04",
    title: "Interview Support",
    description:
      "Receive preparation guidance, feedback, and support throughout the interview process.",
  },
  {
    step: "05",
    title: "Offer & Onboarding",
    description:
      "We'll help negotiate your offer and support you through to your first day in the new role.",
  },
];

const services = [
  "CV review and optimization",
  "Interview coaching",
  "Salary benchmarking",
  "Career path planning",
  "Skills assessment",
  "Market insights",
];

export default function JobSeekersPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] overflow-hidden bg-secondary">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1920&q=80"
            alt="Professional woman"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-secondary/85" />
        </div>

        <div className="relative mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl py-20">
            <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">
              For Job Seekers
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-secondary-foreground sm:text-5xl lg:text-6xl">
              Your Next Career Move
              <span className="block text-primary">Starts Here</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-secondary-foreground/80">
              Whether you are actively looking or exploring options, we will
              connect you with opportunities that match your skills, experience,
              and ambitions.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/jobs">
                  Browse Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10"
                asChild
              >
                <Link href="/contact">Submit Your CV</Link>
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
              Why Work with YPL?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              We are committed to supporting your career journey every step
              of the way.
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

      {/* Process Section */}
      <section className="bg-muted py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              The Process
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Our simple process to connect you with your next opportunity
            </p>
          </div>

          <div className="mt-16 space-y-6">
            {process.map((item) => (
              <div
                key={item.step}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-start sm:gap-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Our Support
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Comprehensive Career Support
              </h2>
              <p className="mt-4 text-muted-foreground">
                Beyond job placement, we offer a range of services to help you
                succeed in your career.
              </p>
              <ul className="mt-8 space-y-4">
                {services.map((service) => (
                  <li key={service} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-foreground">{service}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link href="/contact">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"
                  alt="Team working together"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden rounded-xl bg-primary p-6 shadow-lg lg:block">
                <Briefcase className="h-8 w-8 text-primary-foreground" />
                <p className="mt-2 text-2xl font-bold text-primary-foreground">2,500+</p>
                <p className="text-sm text-primary-foreground/80">Successful Placements</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80"
            alt="Team meeting"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-secondary/90" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-secondary-foreground sm:text-4xl lg:text-5xl">
              Start Your Job Search Today
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-secondary-foreground/80">
              Browse hundreds of opportunities or register to receive
              personalized job alerts tailored to your preferences.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/jobs">Browse All Jobs</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10"
                asChild
              >
                <Link href="/contact">Register with Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
