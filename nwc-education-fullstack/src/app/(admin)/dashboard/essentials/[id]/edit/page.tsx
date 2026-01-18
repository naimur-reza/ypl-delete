"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { EssentialForm } from "../../_components/EssentialForm";
import { toast } from "sonner";

export default function EditEssentialPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [essential, setEssential] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEssential = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/essential-studies/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Essential study not found");
            router.push("/dashboard/essentials");
            return;
          }
          throw new Error("Failed to fetch essential study");
        }
        const data = await response.json();
        setEssential(data);
      } catch (error) {
        console.error("Error fetching essential study:", error);
        toast.error("Failed to load essential study");
        router.push("/dashboard/essentials");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEssential();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Essential</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!essential) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Essential</h1>
        <p className="text-muted-foreground">Update essential study guide</p>
      </div>
      <EssentialForm initialData={essential} />
    </div>
  );
}

