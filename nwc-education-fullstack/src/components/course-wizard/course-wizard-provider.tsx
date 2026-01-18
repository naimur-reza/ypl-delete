"use client";

import { useState } from "react";
import { CourseWizardModal } from "./course-wizard-modal";
import { WizardTrigger } from "./wizard-trigger";

interface CourseWizardProviderProps {
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
  renderTrigger?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

export function CourseWizardProvider({
  countries,
  destinations,
  renderTrigger = true,
  onOpenChange: externalOnOpenChange,
  open: externalOpen,
}: CourseWizardProviderProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen =
    externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalOpen;

  return (
    <>
      {renderTrigger && <WizardTrigger onClick={() => setIsOpen(true)} />}
      <CourseWizardModal
        open={isOpen}
        onOpenChange={setIsOpen}
        countries={countries}
        destinations={destinations}
      />
    </>
  );
}
