"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { StudyLevel } from "@/hooks/use-course-wizard";

interface Step4StudyPreferencesProps {
  studyLevel?: StudyLevel;
  subjects: string[];
  onStudyLevelChange: (level: StudyLevel) => void;
  onSubjectsChange: (subjects: string[]) => void;
}

const STUDY_LEVELS: StudyLevel[] = [
  "Foundation",
  "Undergraduate",
  "Postgraduate",
  "Doctorate",
];

const COMMON_SUBJECTS = [
  "Computer Science",
  "Business Administration",
  "Engineering",
  "Medicine",
  "Law",
  "Psychology",
  "Economics",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Arts",
  "Design",
  "Education",
  "Finance",
  "Marketing",
  "Accounting",
  "Architecture",
  "Nursing",
  "Journalism",
];

export function Step4StudyPreferences({
  studyLevel,
  subjects,
  onStudyLevelChange,
  onSubjectsChange,
}: Step4StudyPreferencesProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) {
      return COMMON_SUBJECTS.filter((subj) => !subjects.includes(subj));
    }
    const query = searchQuery.toLowerCase();
    return COMMON_SUBJECTS.filter(
      (subj) => !subjects.includes(subj) && subj.toLowerCase().includes(query)
    );
  }, [searchQuery, subjects]);

  const handleAddSubject = (subject: string) => {
    if (subjects.length < 5 && !subjects.includes(subject)) {
      onSubjectsChange([...subjects, subject]);
      setSearchQuery("");
    }
  };

  const handleRemoveSubject = (subject: string) => {
    onSubjectsChange(subjects.filter((s) => s !== subject));
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What do you wish to study?
        </h2>
        <span className="text-2xl">📚</span>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Study level
          </label>
          <div className="flex flex-wrap gap-3">
            {STUDY_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => onStudyLevelChange(level)}
                className={cn(
                  "px-6 py-3 rounded-lg border-2 font-medium transition-all",
                  "hover:border-purple-300",
                  studyLevel === level
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 bg-white text-gray-700"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Subjects
          </label>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search here to select subjects"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-sm text-gray-500 mb-4">
            You can pick up to 5 subjects
          </p>

          {subjects.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {subjects.map((subject) => (
                <div
                  key={subject}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {subject}
                  <button
                    onClick={() => handleRemoveSubject(subject)}
                    className="hover:bg-purple-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {filteredSubjects.length > 0 && (
            <div className="max-h-48 overflow-y-auto space-y-2">
              {filteredSubjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => handleAddSubject(subject)}
                  disabled={subjects.length >= 5}
                  className={cn(
                    "w-full text-left px-4 py-2 rounded-lg border border-gray-200",
                    "hover:bg-gray-50 hover:border-purple-300 transition-all",
                    subjects.length >= 5 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {subject}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
