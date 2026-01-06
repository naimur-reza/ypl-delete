"use client";

import { useState, useCallback } from "react";

export type StudyLevel =
  | "Foundation"
  | "Undergraduate"
  | "Postgraduate"
  | "Doctorate";

export type IntakeMonth = "JANUARY" | "MAY" | "SEPTEMBER";

export type MonthRange =
  | "January - March"
  | "April - June"
  | "July - September"
  | "October - December";

export type EnglishTest =
  | "TOEFL"
  | "PTE Academic"
  | "C1 Advanced(CAE)"
  | "IELTS"
  | "Duolingo"
  | "OET"
  | "LanguageCert International ESOL"
  | "CAEL"
  | "Goethe-Zertifikat"
  | "TestDaF"
  | "none";

export type StandardizedTest = "GMAT" | "ACT" | "SAT" | "GRE" | "LSAT" | "none";

export interface HighSchoolData {
  countryOfEducation: string;
  boardOfEducation?: string;
  gradingSystem: string;
  score: number;
  englishPercentage: number;
}

export interface IELTSScores {
  overall: number;
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
}

export interface SATScores {
  readingWriting: number;
  mathematics: number;
  writingLanguage: number;
  reading: number;
  total: number;
}

export interface CourseWizardData {
  // Step 1
  nationalityId?: string;

  // Step 2
  destinationId?: string;

  // Step 3
  startYear?: number;
  startMonth?: MonthRange;

  // Step 4
  studyLevel?: StudyLevel;
  subjects: string[];

  // Step 5
  highSchoolData?: HighSchoolData;

  // Step 6
  englishTest?: EnglishTest;
  ieltsScores?: IELTSScores;

  // Step 7
  standardizedTest?: StandardizedTest;
  satScores?: SATScores;
}

const TOTAL_STEPS = 8;

export function useCourseWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<CourseWizardData>({
    subjects: [],
  });

  const updateData = useCallback((updates: Partial<CourseWizardData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
    }
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(1);
    setData({ subjects: [] });
  }, []);

  const isStepValid = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1:
          return !!data.nationalityId;
        case 2:
          return !!data.destinationId;
        case 3:
          return !!data.startYear && !!data.startMonth;
        case 4:
          return !!data.studyLevel && data.subjects.length > 0;
        case 5:
          return !!(
            data.highSchoolData?.countryOfEducation &&
            data.highSchoolData?.gradingSystem &&
            data.highSchoolData?.score !== undefined &&
            data.highSchoolData?.englishPercentage !== undefined
          );
        case 6:
          return !!data.englishTest;
        case 7:
          return !!data.standardizedTest;
        case 8:
          return true; // Results step is always valid
        default:
          return false;
      }
    },
    [data]
  );

  const canProceed = useCallback(() => {
    return isStepValid(currentStep);
  }, [currentStep, isStepValid]);

  return {
    currentStep,
    totalSteps: TOTAL_STEPS,
    data,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    reset,
    isStepValid,
    canProceed,
  };
}
