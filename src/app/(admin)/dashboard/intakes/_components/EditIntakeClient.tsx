"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IntakeForm } from "../_components/IntakeForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { Prisma } from "../../../../../../prisma/src/generated/prisma/client";
 

type IntakePageWithRelations = Prisma.IntakePageGetPayload<{
  include: {
    destination: true;
    intakeSeason: true;
    intakePageBenefits: true;
    howWeHelpItems: true;
    topUniversities: { include: { university: true } };
    countries: { include: { country: true } };
    _count: { select: { faqs: true } };
  };
}>;

interface EditIntakeClientProps {
  intake: IntakePageWithRelations;
}

export function EditIntakeClient({ intake }: EditIntakeClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this intake? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await apiClient.delete("/api/intake-pages", { id: intake.id });
      toast.success("Intake deleted successfully");
      router.push("/dashboard/intake-management?tab=details");
    } catch (e: any) {
      console.error("Delete failed", e);
      toast.error(e.message || "Failed to delete intake");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/intake-management?tab=details">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Intakes
            </Link>
          </Button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Intake Detail</h1>
            <p className="text-gray-600 mt-1">
              Update the configuration and content for this intake.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Intake Details</CardTitle>
          <CardDescription>
            Update the information below. Changes will be reflected
            immediately on the live site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IntakeForm intake={intake} />
        </CardContent>
      </Card>

 

 
    </div>
  );
}
