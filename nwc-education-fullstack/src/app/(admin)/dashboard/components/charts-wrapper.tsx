"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamic import with ssr: false must be in a Client Component
const DashboardCharts = dynamic(
  () => import("./dashboard-charts").then((mod) => mod.DashboardCharts),
  {
    loading: () => (
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[250px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    ),
    ssr: false,
  }
);

type ChartsWrapperProps = {
  data: {
    monthlyRegistrations: { month: string; count: number }[];
    monthlyAppointments: { month: string; count: number }[];
    registrationsByCountry: { country: string; count: number }[];
    appointmentsByStatus: { status: string; count: number }[];
  };
};

export function ChartsWrapper({ data }: ChartsWrapperProps) {
  return <DashboardCharts data={data as any} />;
}
