"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CareerForm } from "../../_components/CareerForm";
import { EditPageSkeleton } from "@/components/ui/edit-page-skeleton";
import { toast } from "sonner";

export default function EditCareerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [career, setCareer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/careers/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Career not found");
            router.push("/dashboard/careers");
            return;
          }
          throw new Error("Failed to fetch career");
        }
        const data = await response.json();
        setCareer(data);
      } catch (error) {
        console.error("Error fetching career:", error);
        toast.error("Failed to load career");
        router.push("/dashboard/careers");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCareer();
    }
  }, [id, router]);

  if (isLoading) {
    return <EditPageSkeleton />;
  }

  if (!career) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Career</h1>
        <p className="text-muted-foreground">Update career information</p>
      </div>
      <CareerForm initialData={career} />
    </div>
  );
}

