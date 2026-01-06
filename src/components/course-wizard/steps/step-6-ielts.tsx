"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { EnglishTest, IELTSScores } from "@/hooks/use-course-wizard";

interface Step6IELTSProps {
  englishTest?: EnglishTest;
  ieltsScores?: IELTSScores;
  onTestChange: (test: EnglishTest) => void;
  onScoresChange: (scores: IELTSScores) => void;
}

const ENGLISH_TESTS: EnglishTest[] = [
  "TOEFL",
  "PTE Academic",
  "C1 Advanced(CAE)",
  "IELTS",
  "Duolingo",
  "OET",
  "LanguageCert International ESOL",
  "CAEL",
  "Goethe-Zertifikat",
  "TestDaF",
  "none",
];

export function Step6IELTS({
  englishTest,
  ieltsScores,
  onTestChange,
  onScoresChange,
}: Step6IELTSProps) {
  const [localScores, setLocalScores] = useState<IELTSScores>(
    ieltsScores || {
      overall: 0,
      listening: 0,
      reading: 0,
      writing: 0,
      speaking: 0,
    }
  );

  const handleScoreChange = (field: keyof IELTSScores, value: number) => {
    const updated = { ...localScores, [field]: value };
    setLocalScores(updated);
    onScoresChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Which English language test have you taken so far?
        </h2>
        <div className="flex items-center justify-center gap-2">
          <span>✏️</span>
          <span>✋</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {ENGLISH_TESTS.map((test) => (
          <button
            key={test}
            onClick={() => onTestChange(test)}
            className={cn(
              "px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all",
              "hover:border-purple-300",
              englishTest === test
                ? "border-purple-500 bg-purple-50 text-purple-700"
                : "border-gray-200 bg-white text-gray-700"
            )}
          >
            {test === "none" ? "I haven't taken any yet" : test}
          </button>
        ))}
      </div>

      {englishTest === "IELTS" && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            Enter your IELTS results
            <span>📝</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Band Score (1-10)
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                step="0.5"
                value={localScores.overall || ""}
                onChange={(e) =>
                  handleScoreChange("overall", parseFloat(e.target.value) || 0)
                }
                placeholder="6.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Listening (1-10)
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                step="0.5"
                value={localScores.listening || ""}
                onChange={(e) =>
                  handleScoreChange(
                    "listening",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="6.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reading (1-10)
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                step="0.5"
                value={localScores.reading || ""}
                onChange={(e) =>
                  handleScoreChange("reading", parseFloat(e.target.value) || 0)
                }
                placeholder="6.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Writing (1-10)
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                step="0.5"
                value={localScores.writing || ""}
                onChange={(e) =>
                  handleScoreChange("writing", parseFloat(e.target.value) || 0)
                }
                placeholder="6.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speaking (1-10)
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                step="0.5"
                value={localScores.speaking || ""}
                onChange={(e) =>
                  handleScoreChange("speaking", parseFloat(e.target.value) || 0)
                }
                placeholder="6.0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
