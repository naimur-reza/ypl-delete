"use client";

import { ArrowLeft, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCourseWizard } from "@/hooks/use-course-wizard";
import { cn } from "@/lib/utils";

// Import step components
import { Step1Nationality } from "./steps/step-1-nationality";
import { Step2Destination } from "./steps/step-2-destination";
import { Step3StartDate } from "./steps/step-3-start-date";
import { Step4StudyPreferences } from "./steps/step-4-study-preferences";
import { Step5HighSchool } from "./steps/step-5-high-school";
import { Step6IELTS } from "./steps/step-6-ielts";
import { Step7SAT } from "./steps/step-7-sat";
import { Step8Results } from "./steps/step-8-results";

interface CourseWizardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function CourseWizardModal({
  open,
  onOpenChange,
  countries,
  destinations,
}: CourseWizardModalProps) {
  const {
    currentStep,
    totalSteps,
    data,
    updateData,
    nextStep,
    prevStep,
    canProceed,
  } = useCourseWizard();

  const handleNext = () => {
    if (canProceed()) {
      if (currentStep === totalSteps) {
        // Final step - close modal or show results
        onOpenChange(false);
      } else {
        nextStep();
      }
    }
  };

  const handleBack = () => {
    prevStep();
  };

  const progress = (currentStep / totalSteps) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Nationality
            countries={countries}
            selectedCountryId={data.nationalityId}
            onSelect={(countryId) => updateData({ nationalityId: countryId })}
          />
        );
      case 2:
        return (
          <Step2Destination
            destinations={destinations}
            selectedDestinationId={data.destinationId}
            onSelect={(destinationId) => updateData({ destinationId })}
          />
        );
      case 3:
        return (
          <Step3StartDate
            startYear={data.startYear}
            startMonth={data.startMonth}
            onYearChange={(year) => updateData({ startYear: year })}
            onMonthChange={(month) => updateData({ startMonth: month })}
          />
        );
      case 4:
        return (
          <Step4StudyPreferences
            studyLevel={data.studyLevel}
            subjects={data.subjects}
            onStudyLevelChange={(level) => updateData({ studyLevel: level })}
            onSubjectsChange={(subjects) => updateData({ subjects })}
          />
        );
      case 5:
        return (
          <Step5HighSchool
            data={data.highSchoolData}
            countries={countries}
            onDataChange={(highSchoolData) => updateData({ highSchoolData })}
          />
        );
      case 6:
        return (
          <Step6IELTS
            englishTest={data.englishTest}
            ieltsScores={data.ieltsScores}
            onTestChange={(test) => updateData({ englishTest: test })}
            onScoresChange={(scores) => updateData({ ieltsScores: scores })}
          />
        );
      case 7:
        return (
          <Step7SAT
            standardizedTest={data.standardizedTest}
            satScores={data.satScores}
            onTestChange={(test) => updateData({ standardizedTest: test })}
            onScoresChange={(scores) => updateData({ satScores: scores })}
          />
        );
      case 8:
        return (
          <Step8Results wizardData={data} onClose={() => onOpenChange(false)} />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Course Wizard</DialogTitle>
      <DialogContent
        className=" max-h-[90vh] overflow-y-auto p-0 min-w-2xl max-w-4xl"
        showCloseButton={false}
      >
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            {currentStep > 1 && currentStep < totalSteps ? (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : (
              <div className="w-9" />
            )}
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="px-6 py-6">{renderStep()}</div>

        {currentStep < totalSteps && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className={cn(
                "w-full h-12 text-base font-semibold",
                "bg-linear-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500",
                "text-white disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              Continue
              <ArrowLeft className="h-4 w-4 rotate-180 ml-2" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
