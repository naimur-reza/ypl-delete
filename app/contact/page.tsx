"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  ShieldCheck,
  Zap,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: "Open our location on Google Maps",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: "01678000335 | 01678000337 | 01678000334",
    color: "bg-green-500/10 text-green-500",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: "hr@yesjobsbd.com",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: Clock,
    title: "Hours",
    details: "Saturday to Thursday, 9:00 AM – 6:00 PM",
    color: "bg-orange-500/10 text-orange-500",
  },
];

const inquiryTypes = [
  "General",
  "Hiring Talent",
  "Finding a Job",
  "Partnership",
];

const mapLink = "https://maps.app.goo.gl/Zt8ascB9rxNVMoEn6";
const mapEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3650.3086827645093!2d90.427454!3d23.80762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjPCsDQ4JzI3LjQiTiA5MMKwMjUnMzguOCJF!5e0!3m2!1sen!2sbd!4v1775733904447!5m2!1sen!2sbd";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    inquiryType: "",
    message: "",
  });

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden py-20">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm"
          >
            Connect with our team
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 text-5xl font-bold tracking-tight text-foreground sm:text-7xl"
          >
            Let&apos;s start a{" "}
            <span className="text-primary">conversation.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground"
          >
            Whether you&apos;re looking to scale your team or find your next
            career milestone, our experts are ready to guide you.
          </motion.p>
        </div>
      </section>

      {/* --- CONTACT CARDS --- */}
      <section className="-mt-12 ">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info, i) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5"
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                    info.color,
                  )}
                >
                  <info.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-bold text-foreground">{info.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {info.details}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT: FORM & SIDEBAR --- */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-12">
            {/* Form Side */}
            <motion.div {...fadeIn} className="lg:col-span-7">
              <div className="rounded-3xl border border-border bg-card p-8 shadow-sm lg:p-12">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold tracking-tight">
                    Send a message
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Responses typically within 2 business hours.
                  </p>
                </div>

                <form className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        placeholder="John"
                        className="h-12 border-muted/40 bg-muted/20 focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        placeholder="Doe"
                        className="h-12 border-muted/40 bg-muted/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@company.com"
                      className="h-12 border-muted/40 bg-muted/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">How can we help?</Label>
                    <Select>
                      <SelectTrigger className="h-12 border-muted/40 bg-muted/20">
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {inquiryTypes.map((t) => (
                          <SelectItem key={t} value={t.toLowerCase()}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="msg">Your Message</Label>
                    <Textarea
                      id="msg"
                      rows={4}
                      className="resize-none border-muted/40 bg-muted/20"
                      placeholder="Tell us about your needs..."
                    />
                  </div>

                  <Button
                    className="group h-12 w-full rounded-xl text-base font-semibold transition-all hover:scale-[1.01]"
                    size="lg"
                  >
                    Send Message
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Support / FAQ Side */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-2xl font-bold">Why partner with us?</h3>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    We don&apos;t just fill roles; we build teams. Join 500+
                    companies that rely on our intelligence-driven recruitment.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: Zap,
                      t: "Fast Placement",
                      d: "Average 14 days to hire.",
                    },
                    {
                      icon: ShieldCheck,
                      t: "Guaranteed Fit",
                      d: "90-day replacement policy.",
                    },
                    {
                      icon: MessageSquare,
                      t: "Dedicated Lead",
                      d: "1-on-1 account management.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-4 rounded-2xl border border-transparent hover:border-border hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{item.t}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.d}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8">
                  <h4 className="font-bold mb-4">Common Questions</h4>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-left">
                        What industries do you cover?
                      </AccordionTrigger>
                      <AccordionContent>
                        We specialize in Tech, Finance, Healthcare, and
                        Executive placements across Europe and the UK.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-left">
                        How do you charge?
                      </AccordionTrigger>
                      <AccordionContent>
                        Our pricing is performance-based. We only win when you
                        find the right candidate.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAP --- */}
      <section className="px-6 pb-12 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="relative min-h-88 bg-muted/30">
              <iframe
                src={mapEmbedUrl}
                title="YPL office location on Google Maps"
                className="h-full min-h-88 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="flex flex-col justify-between gap-8 p-8 lg:p-10">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                  Visit Us
                </p>
                <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
                  Find our office on the map
                </h3>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Use the map to plan your visit, or open Google Maps directly
                  for directions and live traffic updates.
                </p>
              </div>

              <div className="space-y-4 rounded-2xl border border-border bg-muted/30 p-5">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">
                      YPL (Yes Pvt Ltd)
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Dhaka, Bangladesh
                    </p>
                  </div>
                </div>

                <Button asChild className="w-full rounded-xl">
                  <a href={mapLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open in Google Maps
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
