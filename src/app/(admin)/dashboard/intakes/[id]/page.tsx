import { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { IntakeForm } from "../_components/IntakeForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EditIntakePageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Edit Intake - Admin Dashboard",
  description: "Edit intake page for study abroad programs",
};

async function getIntakeData(id: string) {
  // TODO: Implement server-side data fetching
  // This would typically fetch from your database
  const mockIntake = {
    id,
    title: "May Intake 2024",
    slug: "may-intake",
    description: "Comprehensive guide for May 2024 intake",
    destinationId: "uk",
    intake: "MAY",
    countryId: null,
    isGlobal: true,
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),

    // Hero Section
    heroTitle: "Study in UK - May Intake 2024",
    heroSubtitle: "Start your journey to top UK universities",
    heroMedia: "/images/hero-may-2024.jpg",
    heroMediaType: "IMAGE" as const,
    heroCTALabel: "Apply Now",
    heroCTAUrl: "/apply-now",

    // Why Choose Section
    whyChooseTitle: "Why Choose May Intake?",
    whyChooseDescription: "Discover the advantages of May intake",

    // Timeline
    timelineJson: [],
    targetDate: new Date(),
    timelineEnabled: true,

    // How We Help
    howWeHelpJson: [],
    howWeHelpEnabled: true,

    // SEO
    metaTitle: "May Intake 2024 - Study in UK | NWC Education",
    metaDescription:
      "Apply for May 2024 intake to study in UK. Get expert guidance on universities and courses.",
    metaKeywords:
      "may intake, study in uk, uk universities, international students",
    canonicalUrl: "https://www.nwc.education.com/study-in-uk/may-intake",

    // Relations
    destination: {
      id: "uk",
      name: "United Kingdom",
      slug: "uk",
    },
    country: null,
    intakePageBenefits: [
      {
        id: "1",
        title: "Wide Course Selection",
        description: "Access to hundreds of programs",
        icon: "BookOpen",
        sortOrder: 0,
        isActive: true,
      },
      {
        id: "2",
        title: "Early Application Advantage",
        description: "Apply early to secure your spot",
        icon: "Clock",
        sortOrder: 1,
        isActive: true,
      },
    ],
    _count: {
      faqs: 0,
    },
  };

  return mockIntake;
}

export default async function EditIntakePage({ params }: EditIntakePageProps) {
  const { id } = await params;

  // Fetch intake data
  const intake = await getIntakeData(id);

  if (!intake) {
    notFound();
  }

  const handleUpdateIntake = async (data: any) => {
    "use server";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin/intakes/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      throw new Error(payload.error || "Failed to update intake");
    }

    redirect("/admin/dashboard/intakes");
  };

  const handleDeleteIntake = async () => {
    "use server";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin/intakes/${id}`,
      {
        method: "DELETE",
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      throw new Error(payload.error || "Failed to delete intake");
    }

    redirect("/admin/dashboard/intakes");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/dashboard/intakes">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Intakes
            </Link>
          </Button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Intake</h1>
            <p className="text-gray-600 mt-1">
              Update intake page details for <strong>{intake.title}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="destructive" onClick={handleDeleteIntake}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Form */}
      <Suspense fallback={<div>Loading form...</div>}>
        <Card>
          <CardHeader>
            <CardTitle>Edit Intake Details</CardTitle>
            <CardDescription>
              Update the information below. Changes will be reflected
              immediately on the live site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IntakeForm intake={intake} onSubmit={handleUpdateIntake} />
          </CardContent>
        </Card>
      </Suspense>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts for managing this intake
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col" asChild>
              <Link
                href={`/study-in-${intake.destination.slug}/${intake.intake.toLowerCase()}`}
                target="_blank"
              >
                <div className="text-lg mb-2">👁️</div>
                <div className="text-sm font-medium">Preview Page</div>
                <div className="text-xs text-gray-500">View live page</div>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex-col" asChild>
              <Link href={`/admin/dashboard/intakes/${id}/faqs`}>
                <div className="text-lg mb-2">❓</div>
                <div className="text-sm font-medium">Manage FAQs</div>
                <div className="text-xs text-gray-500">Edit FAQ content</div>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex-col" asChild>
              <Link href={`/admin/dashboard/intakes/${id}/analytics`}>
                <div className="text-lg mb-2">📊</div>
                <div className="text-sm font-medium">View Analytics</div>
                <div className="text-xs text-gray-500">Page performance</div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Intake Information */}
      <Card>
        <CardHeader>
          <CardTitle>Intake Information</CardTitle>
          <CardDescription>Current configuration and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Basic Details
              </h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">ID:</dt>
                  <dd className="font-mono text-sm">{intake.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Status:</dt>
                  <dd>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        intake.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {intake.status}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Destination:</dt>
                  <dd>{intake.destination.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Intake:</dt>
                  <dd>{intake.intake}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Scope:</dt>
                  <dd>{intake.isGlobal ? "Global" : "Country-Specific"}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Content Summary
              </h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Benefits:</dt>
                  <dd>{intake.intakePageBenefits.length} configured</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Timeline Enabled:</dt>
                  <dd>{intake.timelineEnabled ? "Yes" : "No"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">How We Help Enabled:</dt>
                  <dd>{intake.howWeHelpEnabled ? "Yes" : "No"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">SEO Optimized:</dt>
                  <dd>{intake.metaTitle ? "Yes" : "No"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
