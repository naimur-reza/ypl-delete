"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2, MapPin, Calendar, Clock } from "lucide-react";
import { Event } from "../../../../../../prisma/src/generated/prisma/client";
import { MarkdownContent } from "@/components/ui/markdown-content";
 
type EventRegistrationFormProps = {
  event: Event;
};

export function EventRegistrationFormEnhanced({ event }: EventRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    destination: "",
  });

  const eventDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const startTime = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const endTime = endDate
    ? endDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : null;
  const timeRange = endTime ? `${startTime} - ${endTime}` : startTime;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!event.id) {
      setError("Event unavailable. Please try again later.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/event-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone,
          notes: form.destination,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Registration failed");
      }

      setIsSuccess(true);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        destination: "",
      });
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="py-16 bg-slate-50" id="register">
        <div className="container mx-auto px-4 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Registration Successful!
          </h2>
          <p className="text-slate-600 mb-8">
            Thank you for registering for {event.title}. We have sent a confirmation email with
            all the details.
          </p>
          <Button onClick={() => setIsSuccess(false)} variant="outline">
            Register Another Person
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-slate-50" id="register">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left - Event Details */}
          <div className="space-y-6">
            <p className="text-slate-700 leading-relaxed text-lg">
              {`Don't miss the opportunity to attend our ${event.title}, where students can explore a wide range of study options.`}
            </p>

            {event.description && (
              <MarkdownContent content={event.description} />
            )}

            {/* Event Info Cards */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              {event.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Venue:</span>{" "}
                    <span className="text-slate-700">{event.location}</span>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-900">Date:</span>{" "}
                  <span className="text-slate-700">{formattedDate}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-900">Time:</span>{" "}
                  <span className="text-slate-700">{timeRange}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Registration Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
              Register for the event
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="firstName"
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    placeholder="John"
                    required
                    className="bg-white border-slate-300 focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="lastName"
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    placeholder="Doe"
                    required
                    className="bg-white border-slate-300 focus:border-primary"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="john@example.com"
                  required
                  className="bg-white border-slate-300 focus:border-primary"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+1 (555) 000-0000"
                  required
                  className="bg-white border-slate-300 focus:border-primary"
                />
              </div>

              {/* Preferred Destination */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Preferred Destination
                </label>
                <Select value={form.destination} onValueChange={(v) => setForm((f) => ({ ...f, destination: v }))}>
                  <SelectTrigger className="bg-white border-slate-300">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="usa">USA</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 rounded-xl mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Register Now"
                )}
              </Button>

              <p className="text-xs text-slate-500 text-center leading-relaxed">
                By registering, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
