"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { StandardizedTest, SATScores } from "@/hooks/use-course-wizard";

interface Step7SATProps {
  standardizedTest?: StandardizedTest;
  satScores?: SATScores;
  onTestChange: (test: StandardizedTest) => void;
  onScoresChange: (scores: SATScores) => void;
}

const STANDARDIZED_TESTS: StandardizedTest[] = [
  "GMAT",
  "ACT",
  "SAT",
  "GRE",
  "LSAT",
  "none",
];

export function Step7SAT({
  standardizedTest,
  satScores,
  onTestChange,
  onScoresChange,
}: Step7SATProps) {
  const [localScores, setLocalScores] = useState<SATScores>(
    satScores || {
      readingWriting: 0,
      mathematics: 0,
      writingLanguage: 0,
      reading: 0,
      total: 0,
    }
  );

  const handleScoreChange = (field: keyof SATScores, value: number) => {
    const updated = { ...localScores, [field]: value };
    // Auto-calculate total if readingWriting and mathematics are set
    if (field === "readingWriting" || field === "mathematics") {
      updated.total = updated.readingWriting + updated.mathematics;
    }
    setLocalScores(updated);
    onScoresChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Which standardized test have you taken so far?
        </h2>
        <span>👏</span>
      </div>

      <div className="flex flex-wrap gap-3">
        {STANDARDIZED_TESTS.map((test) => (
          <button
            key={test}
            onClick={() => onTestChange(test)}
            className={cn(
              "px-6 py-3 rounded-full border-2 font-medium transition-all",
              "hover:border-purple-300",
              standardizedTest === test
                ? "border-purple-500 bg-purple-50 text-purple-700"
                : "border-gray-200 bg-white text-gray-700"
            )}
          >
            {test === "none" ? "I haven't taken any yet" : test}
          </button>
        ))}
      </div>

      {standardizedTest === "SAT" && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            Enter your SAT results
            <span>📝</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reading and Writing (200-800)
              </label>
              <Input
                type="number"
                min="200"
                max="800"
                value={localScores.readingWriting || ""}
                onChange={(e) =>
                  handleScoreChange(
                    "readingWriting",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mathematics (200-800)
              </label>
              <Input
                type="number"
                min="200"
                max="800"
                value={localScores.mathematics || ""}
                onChange={(e) =>
                  handleScoreChange(
                    "mathematics",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Writing and Language (10-40)
              </label>
              <Input
                type="number"
                min="10"
                max="40"
                value={localScores.writingLanguage || ""}
                onChange={(e) =>
                  handleScoreChange(
                    "writingLanguage",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reading (1-40)
              </label>
              <Input
                type="number"
                min="1"
                max="40"
                value={localScores.reading || ""}
                onChange={(e) =>
                  handleScoreChange("reading", parseInt(e.target.value) || 0)
                }
                placeholder="20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total (400-1600)
              </label>
              <Input
                type="number"
                min="400"
                max="1600"
                value={localScores.total || ""}
                onChange={(e) =>
                  handleScoreChange("total", parseInt(e.target.value) || 0)
                }
                placeholder="400"
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
