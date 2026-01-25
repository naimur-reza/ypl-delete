import { Metadata } from "next";
import { Suspense } from "react";
import { IntakeManagementTabs } from "./_components/IntakeManagementTabs";

export const metadata: Metadata = {
  title: "Intake Management - Admin Dashboard",
  description:
    "Manage intake seasons (banners) and intake page details (countdown, hero, etc.) for study abroad",
};

export default function IntakeManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Intake Management
        </h1>
        <p className="text-muted-foreground">
          Manage intake season banners and season details (countdown, hero,
          timeline) displayed across the website
        </p>
      </div>
      <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
        <IntakeManagementTabs />
      </Suspense>
    </div>
  );
}
