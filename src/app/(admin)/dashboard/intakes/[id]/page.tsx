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

import { prisma } from "@/lib/prisma";

async function getIntakeData(id: string) {
  const intake = await prisma.intakePage.findUnique({
    where: { id },
    include: {
      destination: true,
      countries: { include: { country: true } },
      topUniversities: { include: { university: true } },
      intakePageBenefits: { orderBy: { sortOrder: "asc" } },
      howWeHelpItems: { orderBy: { sortOrder: "asc" } },
      intakeSeason: true,
      _count: {
        select: { faqs: true },
      },
    },
  });

  return intake;
}

import {
  handleUpdateIntakeAction,
  handleDeleteIntakeAction,
} from "@/app/actions/intake-actions";

export default async function EditIntakePage({ params }: EditIntakePageProps) {
  const { id } = await params;

  // Fetch intake data
  const intake = await getIntakeData(id);

  if (!intake) {
    notFound();
  }

  const deleteActionWithId = handleDeleteIntakeAction.bind(null, id);
  const updateActionWithId = handleUpdateIntakeAction.bind(null, id);

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
          <Button variant="destructive" onClick={deleteActionWithId}>
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
            <IntakeForm intake={intake} onSubmit={updateActionWithId} />
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
                href={`/study-in-${intake.destination?.slug}/${intake?.intake?.toLowerCase()}`}
                target="_blank"
              >
                <div className="text-lg mb-2">👁️</div>
                <div className="text-sm font-medium">Preview Page</div>
                <div className="text-xs text-gray-500">View live page</div>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex-col" asChild>
              <Link href={`/dashboard/intakes/${id}/faqs`}>
                <div className="text-lg mb-2">❓</div>
                <div className="text-sm font-medium">Manage FAQs</div>
                <div className="text-xs text-gray-500">Edit FAQ content</div>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex-col" asChild>
              <Link href={`/dashboard/intakes/${id}/analytics`}>
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
                  <dd>{intake.destination?.name}</dd>
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
