"use client";

import { useState } from "react";
import { ArrowRight, GraduationCap, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CourseWizardData } from "@/hooks/use-course-wizard";
import Image from "next/image";

interface Step8ResultsProps {
  wizardData: CourseWizardData;
  onClose: () => void;
}

interface MatchedCourse {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  tuitionMin: number | null;
  tuitionMax: number | null;
  currency: string | null;
  destination: {
    id: string;
    name: string;
  };
  university: {
    id: string;
    name: string;
    logo: string | null;
  };
  relevanceScore: number;
}

export function Step8Results({ wizardData, onClose }: Step8ResultsProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [matchedCourses, setMatchedCourses] = useState<MatchedCourse[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      // Call the course matching API
      const response = await fetch("/api/courses/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wizardData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to match courses");
      }

      setMatchedCourses(data.courses || []);
      setShowResults(true);

      // Save lead to database with email and wizard data
      try {
        await fetch("/api/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            wizardData,
          }),
        });
      } catch (leadError) {
        // Don't block the user if lead saving fails
        console.error("Error saving lead:", leadError);
      }
    } catch (err) {
      console.error("Error matching courses:", err);
      setError(
        err instanceof Error ? err.message : "Failed to find matching courses"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // TODO: Implement Google OAuth
 
  };

  if (showResults) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            We found {matchedCourses.length} courses for you! 🎉
          </h2>
          <p className="text-gray-600">
            Based on your preferences, here are your best matches
          </p>
        </div>

        <div className="max-h-[500px] overflow-y-auto space-y-4">
          {matchedCourses.length > 0 ? (
            matchedCourses.map((course) => (
              <div
                key={course.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {course.university.logo && (
                    <div className="relative h-16 w-16 shrink-0">
                      <Image
                        src={course.university.logo}
                        alt={course.university.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {course.university.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{course.destination.name}</span>
                      </div>
                      {course.tuitionMin && (
                        <div className="flex items-center gap-1">
                          <span>
                            {course.currency || "USD"} {course.tuitionMin}
                            {course.tuitionMax
                              ? ` - ${course.tuitionMax}`
                              : "+"}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <span className="text-purple-600 font-medium">
                          Match: {course.relevanceScore}%
                        </span>
                      </div>
                    </div>
                    {course.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                    <Button
                      className="mt-3"
                      variant="outline"
                      onClick={() => {
                        window.location.href = `/courses/${course.slug}`;
                      }}
                    >
                      View Course
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No courses found matching your criteria.</p>
              <p className="text-sm mt-2">
                Try adjusting your preferences or contact us for assistance.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button
            onClick={() => {
              setShowResults(false);
              setMatchedCourses([]);
            }}
            className="flex-1"
          >
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          We&apos;re ready with the results 🎉
        </h2>
        <p className="text-gray-600">Log in/sign up to view your matches</p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 text-base"
            onKeyDown={(e) => {
              if (e.key === "Enter" && email.trim() && !isLoading) {
                handleContinue();
              }
            }}
          />
          <p className="text-sm text-gray-500 mt-2 text-left">
            Important updates will be sent to this email address
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Button
          onClick={handleContinue}
          disabled={!email.trim() || isLoading}
          className={cn(
            "w-full h-12 text-base font-semibold",
            "bg-linear-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500",
            "text-white disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isLoading ? "Finding your matches..." : "Continue"}
          {!isLoading && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">OR</span>
          </div>
        </div>

        <Button
          onClick={handleGoogleAuth}
          variant="outline"
          className="w-full h-12 text-base font-medium"
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
