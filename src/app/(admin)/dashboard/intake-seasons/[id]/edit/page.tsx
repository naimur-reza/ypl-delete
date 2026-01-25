"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IntakeSeasonForm } from "../../_components/IntakeSeasonForm";
import { EditPageSkeleton } from "@/components/ui/edit-page-skeleton";
import { toast } from "sonner";

export default function EditIntakeSeasonPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [intakeSeason, setIntakeSeason] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIntakeSeason = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/intake-seasons/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Intake season not found");
            router.push("/dashboard/intake-management?tab=seasons");
            return;
          }
          throw new Error("Failed to fetch intake season");
        }
        const data = await response.json();
        setIntakeSeason(data);
      } catch (error) {
        console.error("Error fetching intake season:", error);
        toast.error("Failed to load intake season");
        router.push("/dashboard/intake-management?tab=seasons");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchIntakeSeason();
    }
  }, [id, router]);

  if (isLoading) {
    return <EditPageSkeleton />;
  }

  if (!intakeSeason) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Intake Season</h1>
        <p className="text-muted-foreground">Update intake season information</p>
      </div>
      <IntakeSeasonForm initialData={intakeSeason} />
    </div>
  );
}

