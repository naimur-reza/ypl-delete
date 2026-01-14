"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ServiceForm } from "../../_components/ServiceForm";
import { toast } from "sonner";

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [service, setService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/services/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Service not found");
            router.push("/dashboard/services");
            return;
          }
          throw new Error("Failed to fetch service");
        }
        const data = await response.json();
        setService(data);
      } catch (error) {
        console.error("Error fetching service:", error);
        toast.error("Failed to load service");
        router.push("/dashboard/services");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Service</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Service</h1>
        <p className="text-muted-foreground">Update service information</p>
      </div>
      <ServiceForm initialData={service} />
    </div>
  );
}

