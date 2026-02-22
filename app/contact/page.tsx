"use client";

import React from "react"

import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
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

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["123 Business Street", "London, EC1A 1BB", "United Kingdom"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+44 (0) 20 1234 5678", "Mon-Fri: 9am - 6pm"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@ypl.com", "careers@ypl.com"],
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Monday - Friday: 9am - 6pm", "Saturday - Sunday: Closed"],
  },
];

const inquiryTypes = [
  "General Inquiry",
  "Submit a Vacancy",
  "Job Application",
  "Career Advice",
  "Partnership",
  "Other",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    inquiryType: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log("Form submitted:", formData);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-secondary py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">
            Get in Touch
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-secondary-foreground sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-secondary-foreground/80">
            Get in touch with our team. Whether you are looking to hire,
            seeking your next opportunity, or have a question, we are here
            to help.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info) => (
              <div
                key={info.title}
                className="rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <info.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">
                  {info.title}
                </h3>
                <div className="mt-2 space-y-1">
                  {info.details.map((detail, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-muted py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Send Us a Message
              </h2>
              <p className="mt-4 text-muted-foreground">
                Fill out the form below and a member of our team will get back
                to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="mt-2 bg-card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="mt-2 bg-card"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="mt-2 bg-card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="mt-2 bg-card"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="mt-2 bg-card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inquiryType">Inquiry Type *</Label>
                    <Select
                      value={formData.inquiryType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, inquiryType: value })
                      }
                    >
                      <SelectTrigger id="inquiryType" className="mt-2 bg-card">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {inquiryTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="mt-2 bg-card"
                  />
                </div>

                <Button type="submit" size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Send Message
                </Button>
              </form>
            </div>

            <div className="rounded-lg border border-border bg-card p-8">
              <h3 className="text-xl font-semibold text-foreground">
                Why Contact YPL?
              </h3>
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-medium text-foreground">For Employers</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Looking to build your team? Share your hiring needs with us
                    and let our expert recruiters find the perfect candidates
                    for your organization.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">
                    For Job Seekers
                  </h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Ready for your next career move? Register with us to access
                    exclusive opportunities and personalized career support.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">
                    General Inquiries
                  </h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Have questions about our services? Our team is here to
                    provide information and guidance on how we can help.
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-border pt-8">
                <h4 className="font-medium text-foreground">
                  Prefer to Call?
                </h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Speak directly with one of our consultants:
                </p>
                <a
                  href="tel:+442012345678"
                  className="mt-2 inline-block text-lg font-semibold text-foreground hover:text-foreground/80"
                >
                  +44 (0) 20 1234 5678
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
