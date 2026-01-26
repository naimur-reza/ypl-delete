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
 
      </div>
    </section>
  );
}
