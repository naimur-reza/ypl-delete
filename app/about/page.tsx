import Link from "next/link";
import Image from "next/image";
import { Users, Award, Globe, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { connectDB } from "@/lib/mongodb";
import Team from "@/lib/models/team";
import { SafeHtmlContent } from "@/components/ui/safe-html-content";

const stats = [
  { value: "15+", label: "Years of Experience" },
  { value: "5,000+", label: "Placements Made" },
  { value: "500+", label: "Client Companies" },
  { value: "98%", label: "Client Satisfaction" },
];

const values = [
  {
    icon: Users,
    title: "People First",
    description:
      "We believe in putting people at the heart of everything we do, building lasting relationships based on trust and mutual respect.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We strive for excellence in every interaction, delivering exceptional service and results that exceed expectations.",
  },
  {
    icon: Globe,
    title: "Integrity",
    description:
      "We operate with complete transparency and honesty, maintaining the highest ethical standards in all our dealings.",
  },
  {
    icon: Clock,
    title: "Responsiveness",
    description:
      "We understand the urgency of talent needs and respond quickly with agility and dedication.",
  },
];

const initialTeam = [
  {
    name: "Sarah Mitchell",
    role: "Managing Director",
    bio: "With over 20 years in recruitment, Sarah leads our strategic direction and client relationships.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  },
  {
    name: "James Cooper",
    role: "Head of Technology",
    bio: "James specializes in tech recruitment, connecting top engineers with innovative companies.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
  {
    name: "Emma Thompson",
    role: "Head of Executive Search",
    bio: "Emma leads our executive practice, placing senior leaders across multiple industries.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
  },
  {
    name: "Michael Chen",
    role: "Head of Operations",
    bio: "Michael ensures our processes run smoothly, delivering consistent quality to clients and candidates.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
];

export default async function AboutPage() {
  await connectDB();
  const dbTeam = await Team.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
  const teamMembers = dbTeam.length > 0 ? dbTeam : initialTeam;

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] overflow-hidden bg-secondary">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80"
            alt="Team collaboration"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-secondary/85" />
        </div>

        <div className="relative mx-auto flex min-h-[60vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl py-20">
            <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">
              About Us
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-secondary-foreground sm:text-5xl lg:text-6xl">
              About YPL
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-secondary-foreground/80">
              We are a leading recruitment and talent consultancy, dedicated to
              connecting exceptional talent with outstanding organizations.
              Founded on the principle that the right people transform
              businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary lg:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div className="relative">
              <div className="aspect-4/3 overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80"
                  alt="Business meeting"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden rounded-xl bg-primary p-6 shadow-lg lg:block">
                <p className="text-3xl font-bold text-primary-foreground">2010</p>
                <p className="text-sm text-primary-foreground/80">Year Founded</p>
              </div>
            </div>
            
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Our Journey
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Our Story
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground">
                <p>
                  Founded in 2010, YPL began with a simple mission: to
                  transform how organizations and professionals connect. We
                  believed that recruitment could be more than transactions - it
                  could be about building relationships and understanding the
                  unique needs of both employers and job seekers.
                </p>
                <p>
                  Over the years, we have grown from a small team of dedicated
                  recruiters to a full-service talent consultancy, offering
                  everything from specialist recruitment to executive search and
                  career management services.
                </p>
                <p>
                  Today, we work with organizations of all sizes across multiple
                  industries, helping them build teams that drive success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              What We Stand For
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Values
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="rounded-xl bg-card p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Our Team
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Leadership Team
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Meet the people driving our mission forward
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member: any) => (
              <div
                key={member.name}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-sm text-primary">{member.role}</p>
                  <SafeHtmlContent
                    content={member.bio}
                    className="mt-3 text-sm text-muted-foreground line-clamp-3"
                  />
                </div>
              </div>
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
              Want to Work with Us?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-secondary-foreground/80">
              Whether you are looking to hire top talent or find your next
              career opportunity, we would love to hear from you.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/contact">
                  Get in Touch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10"
                asChild
              >
                <Link href="/jobs">View Opportunities</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
