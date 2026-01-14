"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GlobalOfficeForm } from "../../_components/GlobalOfficeForm";
import { toast } from "sonner";

export default function EditGlobalOfficePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [globalOffice, setGlobalOffice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalOffice = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/global-offices/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Global office not found");
            router.push("/dashboard/global-offices");
            return;
          }
          throw new Error("Failed to fetch global office");
        }
        const data = await response.json();
        setGlobalOffice(data);
      } catch (error) {
        console.error("Error fetching global office:", error);
        toast.error("Failed to load global office");
        router.push("/dashboard/global-offices");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchGlobalOffice();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Global Office</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!globalOffice) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Global Office</h1>
        <p className="text-muted-foreground">Update global office information</p>
      </div>
      <GlobalOfficeForm initialData={globalOffice} />
    </div>
  );
}

