"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IntakePageForm } from "../../_components/IntakePageForm";
import { toast } from "sonner";

export default function EditIntakePagePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [intakePage, setIntakePage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIntakePage = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/intake-pages/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Intake page not found");
            router.push("/dashboard/intake-pages");
            return;
          }
          throw new Error("Failed to fetch intake page");
        }
        const data = await response.json();
        setIntakePage(data);
      } catch (error) {
        console.error("Error fetching intake page:", error);
        toast.error("Failed to load intake page");
        router.push("/dashboard/intake-pages");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchIntakePage();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Intake Page</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!intakePage) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Intake Page</h1>
        <p className="text-muted-foreground">Update intake page information</p>
      </div>
      <IntakePageForm initialData={intakePage} />
    </div>
  );
}

