"use client";

import { Suspense } from "react";
import { IntakeForm } from "../_components/IntakeForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateIntakePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/intake-management?tab=details">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Intake Management
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
            <IntakeForm />
          </CardContent>
        </Card>
      </Suspense>
    </div>
  );
}
