"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { Loader2 } from "lucide-react";
import { WORLD_COUNTRIES } from "@/const/world-countries";

type Appointment = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  addressCountry?: string | null;
  studyDestination?: string | null;
  lastQualification?: string | null;
  englishTest?: string | null;
  englishTestScore?: string | null;
  additionalInfo?: string | null;
  notes?: string | null;
  status: string;
  preferredAt?: string | null;
  event?: { id: string; title: string };
};

type Destination = {
  id: string;
  name: string;
  slug: string;
};

const statusOptions = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
] as const;

const ENGLISH_TEST_OPTIONS = [
  { value: "IELTS", label: "IELTS" },
  { value: "TOEFL", label: "TOEFL" },
  { value: "PTE", label: "PTE" },
  { value: "Duolingo", label: "Duolingo" },
  { value: "None", label: "None / Not Yet" },
];

export default function EditAppointmentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
    notes: "",
    status: "PENDING",
    preferredAt: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch appointment and destinations in parallel
        const [aptRes, destRes] = await Promise.all([
          fetch(`/api/appointments/${id}`),
          fetch("/api/destinations?limit=100"),
        ]);

        if (!aptRes.ok) {
          if (aptRes.status === 404) {
            toast.error("Appointment not found");
            router.push("/dashboard/appointments");
            return;
          }
          throw new Error("Failed to fetch appointment");
        }

        const aptData = await aptRes.json();
        setAppointment(aptData);
        setForm({
          name: aptData.name || "",
          email: aptData.email || "",
          phone: aptData.phone || "",
          city: aptData.city || "",
          addressCountry: aptData.addressCountry || "",
          studyDestination: aptData.studyDestination || "",
          lastQualification: aptData.lastQualification || "",
          englishTest: aptData.englishTest || "",
          englishTestScore: aptData.englishTestScore || "",
          additionalInfo: aptData.additionalInfo || "",
          notes: aptData.notes || "",
          status: aptData.status || "PENDING",
          preferredAt: aptData.preferredAt
            ? new Date(aptData.preferredAt).toISOString().slice(0, 16)
            : "",
        });

        if (destRes.ok) {
          const destData = await destRes.json();
          setDestinations(
            Array.isArray(destData) ? destData : destData.data || []
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load appointment");
        router.push("/dashboard/appointments");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          preferredAt: form.preferredAt || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update appointment");
      }

      toast.success("Appointment updated successfully");
      router.refresh();
      router.push("/dashboard/appointments");
    } catch (error: any) {
      toast.error(error.message || "Failed to update appointment");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Appointment
          </h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Appointment</h1>
        <p className="text-muted-foreground">Update appointment details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name *</label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Preferred Date & Time</label>
          <Input
            type="datetime-local"
            value={form.preferredAt}
            onChange={(e) =>
              setForm((f) => ({ ...f, preferredAt: e.target.value }))
            }
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <Input
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <Select
              value={form.addressCountry}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, addressCountry: v }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Study Destination</label>
          <Select
            value={form.studyDestination}
            onValueChange={(v) =>
              setForm((f) => ({ ...f, studyDestination: v }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select destination" />
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Last Qualification</label>
          <Input
            value={form.lastQualification}
            onChange={(e) =>
              setForm((f) => ({ ...f, lastQualification: e.target.value }))
            }
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">English Test</label>
            <Select
              value={form.englishTest}
              onValueChange={(v) => setForm((f) => ({ ...f, englishTest: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select test" />
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

          {form.englishTest && form.englishTest !== "None" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Test Score</label>
              <Input
                value={form.englishTestScore}
                onChange={(e) =>
                  setForm((f) => ({ ...f, englishTestScore: e.target.value }))
                }
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Additional Information</label>
          <Textarea
            value={form.additionalInfo}
            onChange={(e) =>
              setForm((f) => ({ ...f, additionalInfo: e.target.value }))
            }
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Admin Notes</label>
          <Textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            rows={3}
            placeholder="Internal notes (not visible to user)"
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/appointments")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
