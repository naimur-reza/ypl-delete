import { Metadata } from "next";
import { Suspense } from "react";
import { IntakeForm } from "../_components/IntakeForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create Intake - Admin Dashboard",
  description: "Create a new intake page for study abroad programs",
};

export default async function CreateIntakePage() {
  const handleCreateIntake = async (data: any) => {
    "use server";
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin/intakes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      throw new Error(payload.error || "Failed to create intake");
    }

    redirect("/admin/dashboard/intakes");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/admin/dashboard/intakes">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Intakes
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Intake
          </h1>
          <p className="text-gray-600 mt-1">
            Create a new intake page for your study abroad programs
          </p>
        </div>
      </div>

      {/* Form */}
      <Suspense fallback={<div>Loading form...</div>}>
        <Card>
          <CardHeader>
            <CardTitle>Intake Details</CardTitle>
            <CardDescription>
              Fill in the details below to create a new intake page. All fields
              marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IntakeForm onSubmit={handleCreateIntake} />
          </CardContent>
        </Card>
      </Suspense>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Quick Tips</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  • Use descriptive titles that include the intake month and
                  year
                </li>
                <li>• Global intakes are visible to all countries</li>
                <li>
                  • Country-specific intakes override global ones for that
                  country
                </li>
                <li>• Keep meta titles under 60 characters for best SEO</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  •{" "}
                  <Link
                    href="/admin/dashboard/docs/intakes"
                    className="text-blue-600 hover:underline"
                  >
                    Intake Documentation
                  </Link>
                </li>
                <li>
                  •{" "}
                  <Link
                    href="/admin/dashboard/docs/seo"
                    className="text-blue-600 hover:underline"
                  >
                    SEO Best Practices
                  </Link>
                </li>
                <li>
                  •{" "}
                  <Link
                    href="/admin/dashboard/support"
                    className="text-blue-600 hover:underline"
                  >
                    Get Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
