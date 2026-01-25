"use client";

import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntakeSeasonsTab } from "./IntakeSeasonsTab";
import { Suspense } from "react";
import { IntakeDetailsTab } from "./IntakeDetailsTab";

export function IntakeManagementTabs() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const defaultValue =
    tab === "details" || tab === "seasons" ? tab : "seasons";

  return (
    <Tabs defaultValue={defaultValue} className="space-y-6">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="seasons">Intake Seasons</TabsTrigger>
        <TabsTrigger value="details">Season Details</TabsTrigger>
      </TabsList>
      <TabsContent value="seasons" className="space-y-4">
        <IntakeSeasonsTab />
      </TabsContent>
      <TabsContent value="details" className="space-y-4">
        <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
          <IntakeDetailsTab />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
