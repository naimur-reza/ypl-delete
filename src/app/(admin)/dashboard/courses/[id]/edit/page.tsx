"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CourseForm } from "../../_components/CourseForm";
import { EditPageSkeleton } from "@/components/ui/edit-page-skeleton";
import { toast } from "sonner";

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/courses/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Course not found");
            router.push("/dashboard/courses");
            return;
          }
          throw new Error("Failed to fetch course");
        }
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to load course");
        router.push("/dashboard/courses");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id, router]);

  if (isLoading) {
    return <EditPageSkeleton />;
  }

  if (!course) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Course</h1>
        <p className="text-muted-foreground">Update course information</p>
      </div>
      <CourseForm initialData={course} />
    </div>
  );
}

