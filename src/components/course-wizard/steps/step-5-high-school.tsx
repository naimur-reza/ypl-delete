"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HighSchoolData } from "@/hooks/use-course-wizard";

interface Country {
  id: string;
  name: string;
  isoCode: string;
}

interface Step5HighSchoolProps {
  data?: HighSchoolData;
  countries: Country[];
  onDataChange: (data: HighSchoolData) => void;
}

const GRADING_SYSTEMS = [
  "CGPA 4 (1-4)",
  "CGPA 10 (1-10)",
  "Percentage (0-100)",
  "GPA (0-4)",
  "A-F Grades",
];

export function Step5HighSchool({
  data,
  countries,
  onDataChange,
}: Step5HighSchoolProps) {
  const [localData, setLocalData] = useState<HighSchoolData>(
    data || {
      countryOfEducation: "",
      boardOfEducation: "",
      gradingSystem: "",
      score: 0,
      englishPercentage: 0,
    }
  );

  const updateField = <K extends keyof HighSchoolData>(
    field: K,
    value: HighSchoolData[K]
  ) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onDataChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          Tell us your Senior High School story
          <span>🔍</span>
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country of Education <span className="text-red-500">*</span>
          </label>
          <Select
            value={localData.countryOfEducation || ""}
            onValueChange={(value) => updateField("countryOfEducation", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.id} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Board of Education <span className="text-gray-500">(optional)</span>
          </label>
          <Select
            value={localData.boardOfEducation || ""}
            onValueChange={(value) => updateField("boardOfEducation", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select board (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Not specified">Not specified</SelectItem>
              <SelectItem value="CBSE">CBSE</SelectItem>
              <SelectItem value="ICSE">ICSE</SelectItem>
              <SelectItem value="IB">IB</SelectItem>
              <SelectItem value="A-Levels">A-Levels</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grading System <span className="text-red-500">*</span>
          </label>
          <Select
            value={localData.gradingSystem || ""}
            onValueChange={(value) => updateField("gradingSystem", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select grading system" />
            </SelectTrigger>
            <SelectContent>
              {GRADING_SYSTEMS.map((system) => (
                <SelectItem key={system} value={system}>
                  {system}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Score <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            value={localData.score || ""}
            onChange={(e) =>
              updateField("score", parseFloat(e.target.value) || 0)
            }
            placeholder="Enter your score"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            English percentage (1-100) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            min="1"
            max="100"
            value={localData.englishPercentage || ""}
            onChange={(e) =>
              updateField("englishPercentage", parseFloat(e.target.value) || 0)
            }
            placeholder="Enter English percentage"
            className="w-full"
          />
          <div className="mt-2 flex items-start gap-2 text-sm text-blue-600">
            <Info className="h-4 w-4 mt-0.5 shrink-0" />
            <p>
              This score determines if you qualify for a waiver without taking
              an English language test.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2 text-sm text-blue-800">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            To apply for Foundation programs, you need to use your Senior High
            School scores.
          </p>
        </div>
      </div>
    </div>
  );
}
