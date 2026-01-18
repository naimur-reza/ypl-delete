"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CountryForm } from "../../_components/CountryForm";
import { EditPageSkeleton } from "@/components/ui/edit-page-skeleton";
import { createEntityApi } from "@/lib/api-client";
 
import { toast } from "sonner";
import { Country } from "../../../../../../../prisma/src/generated/prisma/browser";

const countryApi = createEntityApi<Country>("/api/countries");

export default function EditCountryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [country, setCountry] = useState<Country | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/countries/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Country not found");
            router.push("/dashboard/countries");
            return;
          }
          throw new Error("Failed to fetch country");
        }
        const data = await response.json();
        setCountry(data);
      } catch (error) {
        console.error("Error fetching country:", error);
        toast.error("Failed to load country");
        router.push("/dashboard/countries");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCountry();
    }
  }, [id, router]);

  if (isLoading) {
    return <EditPageSkeleton />;
  }

  if (!country) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Country</h1>
        <p className="text-muted-foreground">
          Update country information
        </p>
      </div>
      <CountryForm initialData={country} />
    </div>
  );
}

