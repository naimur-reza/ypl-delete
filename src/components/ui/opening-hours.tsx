"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export type DaySchedule = {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

export type OpeningHoursData = DaySchedule[];

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DEFAULT_SCHEDULE: OpeningHoursData = DAYS_OF_WEEK.map((day) => ({
  day,
  isOpen: day !== "Friday", // Default: Friday closed
  openTime: "10:30",
  closeTime: "19:00",
}));

interface OpeningHoursEditorProps {
  value: OpeningHoursData | null | undefined;
  onChange: (value: OpeningHoursData) => void;
}

export function OpeningHoursEditor({
  value,
  onChange,
}: OpeningHoursEditorProps) {
  const [schedule, setSchedule] = useState<OpeningHoursData>(
    value && Array.isArray(value) && value.length === 7
      ? value
      : DEFAULT_SCHEDULE
  );

  useEffect(() => {
    if (value && Array.isArray(value) && value.length === 7) {
      setSchedule(value);
    }
  }, [value]);

  const handleChange = (
    index: number,
    field: keyof DaySchedule,
    newValue: string | boolean
  ) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], [field]: newValue };
    setSchedule(updated);
    onChange(updated);
  };

  const formatTime12h = (time24: string): string => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold">Opening Hours</Label>
      <div className="border rounded-lg divide-y border-border divide-border">
        {schedule.map((daySchedule, index) => (
          <div
            key={daySchedule.day}
            className="flex items-center gap-4 p-3 hover:bg-muted/50 transition-colors"
          >
            {/* Day Name */}
            <div className="w-28 font-medium text-sm">{daySchedule.day}</div>

            {/* Open/Closed Toggle */}
            <div className="flex items-center gap-2">
              <Switch
                checked={daySchedule.isOpen}
                onCheckedChange={(checked) =>
                  handleChange(index, "isOpen", checked)
                }
              />
              <span className="text-xs text-muted-foreground w-14">
                {daySchedule.isOpen ? "Open" : "Closed"}
              </span>
            </div>

            {/* Time Inputs */}
            {daySchedule.isOpen ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  type="time"
                  value={daySchedule.openTime}
                  onChange={(e) =>
                    handleChange(index, "openTime", e.target.value)
                  }
                  className="w-32 text-sm"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="time"
                  value={daySchedule.closeTime}
                  onChange={(e) =>
                    handleChange(index, "closeTime", e.target.value)
                  }
                  className="w-32 text-sm"
                />
                <span className="text-xs text-muted-foreground ml-2">
                  ({formatTime12h(daySchedule.openTime)} –{" "}
                  {formatTime12h(daySchedule.closeTime)})
                </span>
              </div>
            ) : (
              <div className="flex-1 text-sm text-muted-foreground italic">
                Closed
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Display component for public pages
interface OpeningHoursDisplayProps {
  data: OpeningHoursData | null | undefined;
  className?: string;
}

export function OpeningHoursDisplay({
  data,
  className,
}: OpeningHoursDisplayProps) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  const formatTime12h = (time24: string): string => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Reorder: Start from Tuesday (index 2), wrap around
  const reorderedDays = [
    ...data.slice(2), // Tuesday to Saturday
    ...data.slice(0, 2), // Sunday to Monday
  ];

  return (
    <div className={className}>
      <h3 className="text-xl font-bold text-foreground mb-6">Opening Hours</h3>
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                Day
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                Hours
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reorderedDays.map((daySchedule) => (
              <tr
                key={daySchedule.day}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-foreground">
                  {daySchedule.day}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {daySchedule.isOpen
                    ? `${formatTime12h(daySchedule.openTime)} – ${formatTime12h(
                        daySchedule.closeTime
                      )}`
                    : "Closed"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
