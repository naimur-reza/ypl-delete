"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Users,
  Award,
  Globe,
  Clock,
  ArrowRight,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeHtmlContent } from "@/components/ui/safe-html-content";
import { cn } from "@/lib/utils";

const stats = [
  { value: "28+", label: "Years of Experience" },
  { value: "5k+", label: "Placements Made" },
  { value: "500+", label: "Client Companies" },
  { value: "98%", label: "Satisfaction Rate" },
];

const values = [
  {
    icon: Users,
    title: "People First",
    description:
      "Putting people at the heart of everything we do, building trust-based relationships.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "Striving for exceptional service and results that consistently exceed expectations.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Globe,
    title: "Integrity",
    description:
      "Operating with transparency and the highest ethical standards in all dealings.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Clock,
    title: "Agility",
    description:
      "Responding quickly to talent needs with dedication and specialized expertise.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

const initialTeam = [
  {
    name: "Sarah Mitchell",
    role: "Managing Director",
    bio: "With over 20 years in recruitment, Sarah leads our strategic direction and client relationships.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  },
  {
    name: "James Cooper",
    role: "Head of Technology",
    bio: "James specializes in tech recruitment, connecting top engineers with innovative companies.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
  {
    name: "Emma Thompson",
    role: "Head of Executive Search",
    bio: "Emma leads our executive practice, placing senior leaders across multiple industries.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
  },
  {
    name: "Michael Chen",
    role: "Head of Operations",
    bio: "Michael ensures our processes run smoothly, delivering consistent quality to all partners.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function AboutPage({ dbTeam = [] }: { dbTeam?: any[] }) {
  const teamMembers = dbTeam.length > 0 ? dbTeam : initialTeam;

  console.log(dbTeam);
  return (
    <main className="overflow-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden bg-slate-950">
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80"
          alt="Team collaboration"
          fill
          className="object-cover opacity-40 mix-blend-luminosity"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="relative z-10 max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary backdrop-blur-md">
              Our Legacy
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl"
          >
            Humanizing <span className="text-primary">Capital.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-8 text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto"
          >
            Connecting world-class talent with organizations that change the
            world. Founded on the principle that people are the ultimate
            catalyst for growth.
          </motion.p>
        </div>
      </section>

      {/* --- STATS OVERLAP --- */}
      <section className="relative z-20 -mt-16 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl lg:grid-cols-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-background/40 p-8 text-center transition-colors hover:bg-white/5"
              >
                <p className="text-4xl font-black text-primary">{stat.value}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- STORY SECTION --- */}
      <section className="py-20 ">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div {...fadeInUp} className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80"
                  alt="Business meeting"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Decorative Element */}
              <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-primary/20 blur-[80px] -z-10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                A Decade of{" "}
                <span className="text-primary italic">Transformation.</span>
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Since 2010, YPL has navigated the evolving landscape of global
                  recruitment. What started as a specialized tech agency has
                  blossomed into a multi-sector talent powerhouse.
                </p>
                <p>
                  We don't just fill seats; we architect teams. Our methodology
                  blends data-driven insights with the intuitive "gut feel" that
                  only decades of experience can provide.
                </p>
                <div className="pt-4">
                  <Button
                    variant="link"
                    className="group p-0 text-foreground text-lg font-bold"
                  >
                    Our detailed methodology
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- VALUES GRID (BENTO BOX) --- */}
      <section className="bg-slate-50   dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Built on Foundations of Trust
          </h2>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-3xl border border-border bg-card p-8 transition-all hover:border-primary hover:shadow-xl"
              >
                <div
                  className={cn(
                    "inline-flex h-12 w-12 items-center justify-center rounded-2xl mb-6 transition-transform group-hover:rotate-6",
                    val.bg,
                  )}
                >
                  <val.icon className={cn("h-6 w-6", val.color)} />
                </div>
                <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {val.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TEAM SECTION --- */}
      <section className="py-20 ">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 flex flex-col justify-between items-end gap-6 md:flex-row">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold tracking-tight">
                The Minds Behind YPL
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Expertise is our baseline. Empathy is our edge.
              </p>
            </div>
            <Button variant="outline" className="rounded-full px-8">
              Join the Team
            </Button>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-6">
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary transition-colors cursor-pointer">
                        <Linkedin className="h-5 w-5" />
                      </div>
                      <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary transition-colors cursor-pointer">
                        <Twitter className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-sm font-semibold text-primary">
                    {member.role}
                  </p>
                  <SafeHtmlContent
                    content={member.bio}
                    className="mt-4 text-sm text-muted-foreground line-clamp-2"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="px-6 pb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-7xl relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-20 text-center text-primary-foreground shadow-2xl"
        >
          {/* Abstract background shapes */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-black/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl font-black sm:text-6xl tracking-tighter">
              Ready to evolve?
            </h2>
            <p className="mt-6 text-xl text-primary-foreground/80 leading-relaxed">
              We're ready to help you find the talent that defines your future.
              Let's build something exceptional together.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="h-14 rounded-full px-8 text-lg font-bold shadow-lg"
                asChild
              >
                <Link href="/contact">Book a Consultation</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 rounded-full text-black px-8 text-lg border-white/20 hover:bg-white/10"
                asChild
              >
                <Link href="/jobs">View Jobs</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
