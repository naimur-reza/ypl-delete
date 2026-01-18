"use client";

import { useState } from "react";
import { UniversityFilter } from "./university-filter";
import { CourseWizardProvider } from "@/components/course-wizard/course-wizard-provider";

interface UniversityFilterWithWizardProps {
  countries: Array<{
    id: string;
    name: string;
    isoCode: string;
    flag?: string | null;
  }>;
  destinations: Array<{
    id: string;
    name: string;
    slug: string;
    thumbnail?: string | null;
  }>;
}

export function UniversityFilterWithWizard({
  countries,
  destinations,
}: UniversityFilterWithWizardProps) {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <>
      <CourseWizardProvider
        countries={countries}
        destinations={destinations}
        renderTrigger={false}
        open={isWizardOpen}
        onOpenChange={setIsWizardOpen}
      />
      <UniversityFilter onOpenWizard={() => setIsWizardOpen(true)} />
    </>
  );
}
