"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormInput, FormTextarea, FormSelect } from "./form";
import { Button } from "./ui/button";
import { SelectItem } from "./ui/select";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react"; // Added icons
import { cn } from "@/lib/utils";

type ApplyNowFormData = {
  name: string;
  email: string;
  phone: string;
  destination: string;
  message: string;
};

type ApplyNowFormProps = {
  countryId?: string;
  destinationId?: string;
  officeSlug?: string;
  className?: string;
  destinations: Array<{ id: string; name: string }>;
};

export function ApplyNowForm({ countryId, destinationId, officeSlug, className, destinations }: ApplyNowFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { control, handleSubmit, reset } = useForm<ApplyNowFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      destination: destinationId || "",
      message: "",
    },
  });

  const onSubmit = async (data: ApplyNowFormData) => {
    setIsSubmitting(true);
    
    // Using sonner's promise feature for a better UX
    const promise = fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        countryId,
        destinationId: data.destination || destinationId,
        interestJson: {
          message: data.message,
          source: "global-office",
          officeSlug,
        },
      }),
    }).then(async (res) => {
      if (!res.ok) throw new Error();
      reset();
      return res;
    });

    toast.promise(promise, {
      loading: 'Sending your application...',
      success: 'Application submitted! Our team will contact you soon.',
      error: 'Failed to submit. Please check your connection and try again.',
    });

    try {
      await promise;
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("bg-card border border-border rounded-2xl p-6 shadow-lg", className)}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
          Apply Now <Send className="w-5 h-5 text-primary" />
        </h3>
        <p className="text-sm text-muted-foreground">
          Fill out the form below and our team will get back to you shortly.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          control={control}
          name="name"
          label="Full Name"
          rules={{ required: "Full name is required" }}
        />
        <FormInput
          control={control}
          name="email"
          label="Email Address"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
        />
        <FormInput
          control={control}
          name="phone"
          label="Phone Number"
          rules={{ required: "Phone number is required" }}
        />

        <FormSelect
          control={control}
          name="destination"
          label="Study Destination"
          description="Where do you want to study?"
          rules={{ required: "Please select a destination" }}
        >
          {destinations.map((dest) => (
            <SelectItem key={dest.id} value={dest.id}>
              {dest.name}
            </SelectItem>
          ))}
        </FormSelect>

        <FormTextarea control={control} name="message" label="Message (Optional)" />

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl transition-all shadow-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </form>
    </div>
  );
}