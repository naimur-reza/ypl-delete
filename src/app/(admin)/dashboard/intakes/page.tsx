import { Metadata } from "next";
import { Suspense } from "react";

import { IntakeFilters } from "./_components/IntakeFilters";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload } from "lucide-react";
import Link from "next/link";
import { SearchParams } from "@/types";
import { IntakeList } from "./_components/IntakeList";

export const metadata: Metadata = {
  title: "Intake Management - Admin Dashboard",
  description: "Manage intake pages for study abroad programs",
};

interface IntakesPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function IntakesPage({ searchParams }: IntakesPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Intake Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage intake pages for different destinations and countries
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link href="/admin/dashboard/intakes/create">
              <Plus className="w-4 h-4 mr-2" />
              Create Intake
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Suspense fallback={<div>Loading filters...</div>}>
        <IntakeFilters searchParams={params} />
      </Suspense>

      {/* Intake List */}
      <Suspense fallback={<div>Loading intakes...</div>}>
        <IntakeList searchParams={params} />
      </Suspense>
    </div>
  );
}
