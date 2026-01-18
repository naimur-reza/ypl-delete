"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DestinationForm } from "../../_components/DestinationForm";
import { toast } from "sonner";

export default function EditDestinationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [destination, setDestination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/destinations/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Destination not found");
            router.push("/dashboard/destinations");
            return;
          }
          throw new Error("Failed to fetch destination");
        }
        const data = await response.json();
        setDestination(data);
      } catch (error) {
        console.error("Error fetching destination:", error);
        toast.error("Failed to load destination");
        router.push("/dashboard/destinations");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDestination();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Destination</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!destination) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Destination</h1>
        <p className="text-muted-foreground">Update destination information</p>
      </div>
      <DestinationForm initialData={destination} />
    </div>
  );
}

