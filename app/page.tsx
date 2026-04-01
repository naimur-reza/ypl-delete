import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/job-card";
import { HeroSlider } from "@/components/hero-slider";
import Image from "next/image";
import { connectDB } from "@/lib/mongodb";
import Career from "@/lib/models/career";
import {
  ArrowRight,
  Users,
  Building2,
  Target,
  Award,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  Globe2,
  Zap,
} from "lucide-react";

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
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Briefcase,
    title: "Contract Staffing",
    description:
      "Flexible workforce solutions to meet your project-based and seasonal staffing needs.",
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    icon: Target,
    title: "Executive Search",
    description:
      "Confidential headhunting for senior leadership and C-suite positions.",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: Building2,
    title: "RPO Solutions",
    description:
      "End-to-end recruitment process outsourcing for scalable hiring operations.",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    icon: TrendingUp,
    title: "Career Consulting",
    description:
      "Professional guidance to help candidates navigate their career journey.",
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    icon: Award,
    title: "Employer Branding",
    description:
      "Build a compelling employer brand that attracts top talent to your organization.",
    color: "bg-amber-500/10 text-amber-500",
  },
];

export default async function HomePage() {
  await connectDB();
  const latestJobs = await Career.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  return (
    <>
      <HeroSlider />

      {/* Stats Section */}
      <section className="relative -mt-16 z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/20 bg-background/60 p-8 shadow-2xl backdrop-blur-xl transition-all hover:bg-background/80 lg:p-12">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <p className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/60 transition-all group-hover:scale-110 lg:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-primary">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="relative group">
              <div className="absolute -inset-4 rounded-4xl bg-linear-to-tr from-primary/10 to-transparent p-4 blur-2xl transition-all group-hover:from-primary/20" />
              <div className="relative aspect-4/3 overflow-hidden rounded-4xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                  alt="Professional team meeting"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 hidden rounded-3xl bg-secondary/90 p-8 shadow-2xl backdrop-blur-lg lg:block animate-float">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                    <Award className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">15+</p>
                    <p className="text-sm font-medium text-white/70 uppercase tracking-wider">
                      Years Expertise
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                For Candidates & Employers
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                A CV-First Partner in{" "}
                <span className="text-primary  ">Global</span> Talent
                Acquisition
              </h2>
              <div className="space-y-5 text-lg leading-relaxed text-muted-foreground/90 font-medium">
                <p>
                  YPL is more than a recruitment agency; we curate and activate
                  an{" "}
                  <span className="font-semibold text-foreground">
                    elite CV Bank
                  </span>{" "}
                  of professionals and then match that talent with ambitious
                  organizations.
                </p>
                <div className="grid gap-4 pt-4">
                  {[
                    {
                      icon: CheckCircle2,
                      text: "Deep, CV-level insight into talent",
                    },
                    { icon: Globe2, text: "Global Recruitment Network" },
                    { icon: Zap, text: "Rapid & Precise Placements" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-foreground font-semibold"
                    >
                      <item.icon className="h-5 w-5 text-primary" />
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  className="group h-14 rounded-2xl px-8 text-base shadow-xl shadow-primary/20 transition-all hover:scale-105"
                  asChild
                >
                  <Link href="/submit-cv">
                    Join the CV Bank
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-14 rounded-2xl px-6 text-sm font-semibold"
                  asChild
                >
                  <Link href="/about">Learn more about YPL</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative overflow-hidden bg-muted/40 py-24 lg:py-32">
        <div className="absolute top-0 right-0 h-96 w-96 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              Our Capabilities
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Specialized Recruitment Solutions
            </h2>
            <p className="mx-auto mt-4 text-xl text-muted-foreground font-medium">
              We provide tailored human capital strategies across various
              industries and seniority levels.
            </p>
          </div>

          <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="group relative h-full rounded-2xl border border-border/50 bg-card p-10 shadow-sm transition-all hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5"
              >
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${service.color} transition-transform group-hover:scale-110 shadow-sm`}
                >
                  <service.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-8 text-2xl font-bold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-4 text-muted-foreground/90 leading-relaxed font-medium">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button
              variant="outline"
              className="h-14 rounded-2xl px-10 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all font-bold tracking-wide"
              asChild
            >
              <Link href="/services">
                Explore All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                Live Opportunities
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Elevate Your <span className="text-primary  ">Career</span>
              </h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Apply directly or join the CV Bank once, and let our team
                surface matches for you over time.
              </p>
            </div>
            <Button
              variant="ghost"
              className="group text-primary font-bold transition-all hover:bg-primary/5"
              asChild
            >
              <div className="flex items-center gap-2">
                <Link href="/jobs">Browse All Openings</Link>
                <span className="h-6 w-px bg-border" />
                <Link
                  href="/submit-cv"
                  className="flex items-center gap-1 text-xs"
                >
                  Join CV Bank
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Button>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {latestJobs.map((job: any) => (
              <JobCard
                key={job._id.toString()}
                job={JSON.parse(JSON.stringify(job))}
              />
            ))}
            {latestJobs.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-border py-20 text-center">
                <p className="text-muted-foreground font-medium  ">
                  No active opportunities at the moment. Please check back soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-32 lg:py-40">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
            alt="Modern office"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-b from-secondary/80 via-secondary/95 to-secondary" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center space-y-10">
            <h2 className="text-5xl font-extrabold tracking-tight text-secondary-foreground sm:text-7xl">
              Ready to <span className="text-primary">Transform</span> Your
              Talent Strategy?
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-secondary-foreground/80 font-medium leading-relaxed">
              Unlock the full potential of your organization with elite talent
              and visionary recruitment strategies.
            </p>
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Button
                size="lg"
                className="h-16 rounded-2xl px-10 text-lg font-bold shadow-2xl shadow-primary/30 transition-all hover:scale-105"
                asChild
              >
                <Link href="/submit-cv">Join the CV Bank</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-16 rounded-2xl px-10 text-lg border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/40"
                asChild
              >
                <Link href="/contact">Partner With Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
