"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UniversityDetailForm } from "../../_components/UniversityDetailForm";
import { apiClient } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";

interface UniversityDetail {
  id?: string;
  universityId: string;
  overview: string;
  ranking?: string | null;
  tuitionFees?: string | null;
  famousFor?: string | null;
  servicesHeading?: string | null;
  servicesDescription?: string | null;
  servicesImage?: string | null;
  entryRequirements: string;
  description?: string | null;
  accommodation?: string | null;
  accommodationImage?: string | null;
}

export default function EditUniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [detail, setDetail] = useState<UniversityDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await apiClient.get<UniversityDetail>(
          `/api/university-details/${params.id}`
        );
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setDetail(response.data);
        }
      } catch (err) {
        setError("Failed to fetch university detail");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchDetail();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-destructive">
            Error
          </h1>
          <p className="text-muted-foreground">
            {error || "University detail not found"}
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/university-details")}
          className="text-primary hover:underline"
        >
          ← Back to University Details
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit University Detail</h1>
        <p className="text-muted-foreground">
          Update detailed information for the university
        </p>
      </div>
      <UniversityDetailForm detail={detail} isEditing />
    </div>
  );
}
