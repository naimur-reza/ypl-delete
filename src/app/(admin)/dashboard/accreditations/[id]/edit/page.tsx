"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AccreditationForm } from "../../_components/AccreditationForm";
import { toast } from "sonner";

export default function EditAccreditationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [accreditation, setAccreditation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccreditation = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/accreditations/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Accreditation not found");
            router.push("/dashboard/accreditations");
            return;
          }
          throw new Error("Failed to fetch accreditation");
        }
        const data = await response.json();
        setAccreditation(data);
      } catch (error) {
        console.error("Error fetching accreditation:", error);
        toast.error("Failed to load accreditation");
        router.push("/dashboard/accreditations");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAccreditation();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Accreditation</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!accreditation) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Accreditation</h1>
        <p className="text-muted-foreground">Update accreditation information</p>
      </div>
      <AccreditationForm initialData={accreditation} />
    </div>
  );
}

