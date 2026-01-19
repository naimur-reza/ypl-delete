"use client";

import { ApplicationCountdown } from "./ApplicationCountdown";

type TimelineStep = {
  title?: string;
  description?: string;
  date?: string;
};

type Props = {
  steps?: TimelineStep[];
  targetDate?: string | Date | null;
  intakeName: string;
};

export function ApplicationTimeline({ steps, targetDate, intakeName }: Props) {
  const hasSteps = steps && steps.length > 0;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Application Timeline
          </h2>
          <p className="text-lg text-gray-600">
            Track key milestones for the {intakeName} intake and stay on time.
          </p>
        </div>

        {targetDate && (
          <div className="bg-blue-50 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-6">
              <p className="text-sm uppercase tracking-[0.2em] text-blue-700 font-semibold">
                Countdown to deadline
              </p>
            </div>
            <ApplicationCountdown targetDate={targetDate} />
          </div>
        )}

        {/* <div className="space-y-4">
          {hasSteps ? (
            <div className="grid gap-4">
              {steps!.map((step, idx) => (
                <div
                  key={`${step.title}-${idx}`}
                  className="rounded-xl border border-gray-200 p-4 sm:p-6 bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                        Step {idx + 1}
                      </p>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {step.title || "Application step"}
                      </h3>
                      {step.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      )}
                    </div>
                    {step.date && (
                      <div className="text-right text-sm text-gray-500">
                        {new Date(step.date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-600">
              Timeline steps will appear here once configured.
            </div>
          )}
        </div> */}
      </div>
    </section>
  );
}
