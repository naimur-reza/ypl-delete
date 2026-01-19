 "use client";

import { useEffect, useState } from "react";

type CountdownProps = {
  targetDate?: string | Date | null;
};

type CountdownState = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const initialState: CountdownState = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export function ApplicationCountdown({ targetDate }: CountdownProps) {
  const [countdown, setCountdown] = useState<CountdownState>(initialState);

  useEffect(() => {
    if (!targetDate) return;
    const target = new Date(targetDate).getTime();
    if (Number.isNaN(target)) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const difference = target - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setCountdown(initialState);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const segments = [
    { label: "Days", value: countdown.days },
    { label: "Hours", value: countdown.hours },
    { label: "Minutes", value: countdown.minutes },
    { label: "Seconds", value: countdown.seconds },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {segments.map((segment) => (
        <div
          key={segment.label}
          className="bg-black text-white rounded-2xl px-4 py-5 text-center shadow-lg"
        >
          <div className="text-3xl font-mono font-semibold leading-none">
            {segment.value.toString().padStart(2, "0")}
          </div>
          <div className="text-xs uppercase tracking-[0.2em] mt-2 text-white/70">
            {segment.label}
          </div>
        </div>
      ))}
    </div>
  );
}
