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
    details: "123 Business Street, London, EC1A 1BB",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: "+44 (0) 20 1234 5678",
    color: "bg-green-500/10 text-green-500",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: "hello@ypl.com",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: Clock,
    title: "Hours",
    details: "Mon-Fri: 9am - 6pm",
    color: "bg-orange-500/10 text-orange-500",
  },
];

const inquiryTypes = [
  "General",
  "Hiring Talent",
  "Finding a Job",
  "Partnership",
];

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
      <section className="py-24">
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

      {/* --- MAP PLACEHOLDER --- */}
      <section className="px-6 pb-12 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-border bg-muted/50 aspect-[21/9] flex items-center justify-center relative group grayscale hover:grayscale-0 transition-all duration-700">
          {/* Visual Map Texture placeholder */}
          <div className="absolute inset-0 bg-[url('https://www.google.com/maps/d/u/0/thumbnail?mid=1_4yL-W6-XN_S_p3fI_3R_B3I9M0')] bg-cover opacity-30 group-hover:opacity-60 transition-opacity" />
          <Button variant="secondary" className="relative z-10 shadow-2xl">
            <MapPin className="mr-2 h-4 w-4" />
            Open in Google Maps
          </Button>
        </div>
      </section>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
