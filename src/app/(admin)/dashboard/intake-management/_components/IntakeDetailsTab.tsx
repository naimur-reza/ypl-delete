"use client";

import { Suspense } from "react";
import { IntakeFilters } from "@/app/(admin)/dashboard/intakes/_components/IntakeFilters";
import { IntakeList } from "@/app/(admin)/dashboard/intakes/_components/IntakeList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SearchParams } from "@/types";

function useSearchParamsObject(): SearchParams {
  const sp = useSearchParams();
  const o: Record<string, string> = {};
  sp.forEach((v, k) => {
    o[k] = v;
  });
  return o;
}

export function IntakeDetailsTab() {
  const searchParams = useSearchParamsObject();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Season Details (Intake Pages)</h2>
        <Button asChild>
          <Link href="/dashboard/intakes/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Intake
          </Link>
        </Button>
      </div>
      <Suspense fallback={<div className="text-muted-foreground">Loading filters...</div>}>
        <IntakeFilters searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<div className="text-muted-foreground">Loading intakes...</div>}>
        <IntakeList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
