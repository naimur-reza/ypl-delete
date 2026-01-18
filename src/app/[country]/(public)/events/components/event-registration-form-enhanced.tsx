"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { WORLD_COUNTRIES } from "@/const/world-countries";

type EventRegistrationFormProps = {
  event: Event;
};

const ENGLISH_TEST_OPTIONS = [
  { value: "IELTS", label: "IELTS" },
  { value: "TOEFL", label: "TOEFL" },
  { value: "PTE", label: "PTE" },
  { value: "Duolingo", label: "Duolingo" },
  { value: "None", label: "None / Not Yet" },
];

type Destination = {
  id: string;
  name: string;
  slug: string;
};

export function EventRegistrationFormEnhanced({
  event,
}: EventRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    addressCountry: "",
    studyDestination: "",
    lastQualification: "",
    englishTest: "",
    englishTestScore: "",
    additionalInfo: "",
  });

  // Fetch destinations on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const destRes = await fetch("/api/destinations?limit=100");

        if (destRes.ok) {
          const destData = await destRes.json();
          setDestinations(
            Array.isArray(destData) ? destData : destData.data || []
          );
        }
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
      }
    };
    fetchData();
  }, []);

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
          name: form.name,
          email: form.email,
          phone: form.phone,
          city: form.city,
          addressCountry: form.addressCountry,
          studyDestination: form.studyDestination,
          lastQualification: form.lastQualification,
          englishTest: form.englishTest,
          englishTestScore: form.englishTestScore,
          additionalInfo: form.additionalInfo,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Registration failed");
      }

      setIsSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        city: "",
        addressCountry: "",
        studyDestination: "",
        lastQualification: "",
        englishTest: "",
        englishTestScore: "",
        additionalInfo: "",
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
            Thank you for registering for {event.title}. We have sent a
            confirmation email with all the details.
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
          {/* Left - Event Details (shows second on mobile, first on desktop) */}
          <div className="space-y-6 order-2 lg:order-1">
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

          {/* Right - Registration Form (shows first on mobile, second on desktop) */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 order-1 lg:order-2">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
              Register for the event
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-slate-700"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="John Doe"
                  required
                  className="bg-white border-slate-300 focus:border-primary"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="john@example.com"
                  required
                  className="bg-white border-slate-300 focus:border-primary"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-slate-700"
                >
                  Phone <span className="text-red-500">*</span>
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  required
                  className="bg-white border-slate-300 focus:border-primary"
                />
              </div>

              {/* Address - City and Country */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Address <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, city: e.target.value }))
                    }
                    required
                    className="bg-white border-slate-300 focus:border-primary"
                  />
                  <Select
                    value={form.addressCountry}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, addressCountry: v }))
                    }
                  >
                    <SelectTrigger className="bg-white border-slate-300">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {WORLD_COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Study Destination */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Your Preferred Study Destination{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Select
                  value={form.studyDestination}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, studyDestination: v }))
                  }
                >
                  <SelectTrigger className="bg-white border-slate-300">
                    <SelectValue placeholder="Select a destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((dest) => (
                      <SelectItem key={dest.id} value={dest.name}>
                        {dest.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Last Qualification */}
              <div className="space-y-1.5">
                <label
                  htmlFor="lastQualification"
                  className="text-sm font-medium text-slate-700"
                >
                  Your Last Education Qualification{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  id="lastQualification"
                  value={form.lastQualification}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      lastQualification: e.target.value,
                    }))
                  }
                  required
                  className="bg-white border-slate-300 focus:border-primary"
                />
              </div>

              {/* English Test */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Do you have any English test? Which one?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Select
                  value={form.englishTest}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, englishTest: v }))
                  }
                >
                  <SelectTrigger className="bg-white border-slate-300">
                    <SelectValue placeholder="Select a test" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENGLISH_TEST_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* English Test Score */}
              {form.englishTest && form.englishTest !== "None" && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="englishTestScore"
                    className="text-sm font-medium text-slate-700"
                  >
                    Kindly write down the English test score{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="englishTestScore"
                    value={form.englishTestScore}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        englishTestScore: e.target.value,
                      }))
                    }
                    required
                    className="bg-white border-slate-300 focus:border-primary"
                  />
                </div>
              )}

              {/* Additional Information */}
              <div className="space-y-1.5">
                <label
                  htmlFor="additionalInfo"
                  className="text-sm font-medium text-slate-700"
                >
                  Additional Information
                </label>
                <Textarea
                  id="additionalInfo"
                  value={form.additionalInfo}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, additionalInfo: e.target.value }))
                  }
                  rows={3}
                  className="bg-white border-slate-300 focus:border-primary resize-none"
                />
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
                By registering, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
