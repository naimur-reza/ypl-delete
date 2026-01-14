"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UniversityForm } from "../../_components/UniversityForm";
import { toast } from "sonner";

export default function EditUniversityPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [university, setUniversity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/universities/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("University not found");
            router.push("/dashboard/universities");
            return;
          }
          throw new Error("Failed to fetch university");
        }
        const data = await response.json();
        setUniversity(data);
      } catch (error) {
        console.error("Error fetching university:", error);
        toast.error("Failed to load university");
        router.push("/dashboard/universities");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUniversity();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit University</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!university) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit University</h1>
        <p className="text-muted-foreground">Update university information</p>
      </div>
      <UniversityForm initialData={university} />
    </div>
  );
}
