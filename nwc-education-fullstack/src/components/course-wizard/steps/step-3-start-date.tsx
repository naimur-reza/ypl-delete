"use client";

import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import type { MonthRange } from "@/hooks/use-course-wizard";

interface Step3StartDateProps {
  startYear?: number;
  startMonth?: MonthRange;
  onYearChange: (year: number | undefined) => void;
  onMonthChange: (month: MonthRange | undefined) => void;
}

const YEARS = [2026, 2027, 2028];
const MONTH_RANGES: MonthRange[] = [
  "January - March",
  "April - June",
  "July - September",
  "October - December",
];

export function Step3StartDate({
  startYear,
  startMonth,
  onYearChange,
  onMonthChange,
}: Step3StartDateProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calendar className="h-6 w-6 text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            When do you plan to kick-start your studies?
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Start year
          </label>
          <div className="flex flex-wrap gap-3">
            {YEARS.map((year) => (
              <button
                key={year}
                onClick={() =>
                  onYearChange(year === startYear ? undefined : year)
                }
                className={cn(
                  "px-6 py-3 rounded-lg border-2 font-medium transition-all",
                  "hover:border-purple-300",
                  startYear === year
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 bg-white text-gray-700"
                )}
              >
                {year}
              </button>
            ))}
            <button
              onClick={() => onYearChange(undefined)}
              className={cn(
                "px-6 py-3 rounded-lg border-2 font-medium transition-all",
                "hover:border-purple-300",
                startYear === undefined
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-200 bg-white text-gray-700"
              )}
            >
              Help me decide
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Start month
          </label>
          <div className="grid grid-cols-2 gap-3">
            {MONTH_RANGES.map((month) => (
              <button
                key={month}
                onClick={() =>
                  onMonthChange(month === startMonth ? undefined : month)
                }
                className={cn(
                  "px-4 py-3 rounded-lg border-2 font-medium transition-all text-sm",
                  "hover:border-purple-300",
                  startMonth === month
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 bg-white text-gray-700"
                )}
              >
                {month}
              </button>
            ))}
            <button
              onClick={() => onMonthChange(undefined)}
              className={cn(
                "px-4 py-3 rounded-lg border-2 font-medium transition-all text-sm col-span-2",
                "hover:border-purple-300",
                startMonth === undefined
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-200 bg-white text-gray-700"
              )}
            >
              Help me decide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
