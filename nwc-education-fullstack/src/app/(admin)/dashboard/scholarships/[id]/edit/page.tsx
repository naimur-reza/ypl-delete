"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ScholarshipForm } from "../../_components/ScholarshipForm";
import { toast } from "sonner";

export default function EditScholarshipPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [scholarship, setScholarship] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/scholarships/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Scholarship not found");
            router.push("/dashboard/scholarships");
            return;
          }
          throw new Error("Failed to fetch scholarship");
        }
        const data = await response.json();
        setScholarship(data);
      } catch (error) {
        console.error("Error fetching scholarship:", error);
        toast.error("Failed to load scholarship");
        router.push("/dashboard/scholarships");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchScholarship();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Scholarship</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Scholarship</h1>
        <p className="text-muted-foreground">Update scholarship information</p>
      </div>
      <ScholarshipForm initialData={scholarship} />
    </div>
  );
}

