"use client";

import { cn } from "@/lib/utils";

interface Destination {
  id: string;
  name: string;
  slug: string;
  thumbnail?: string | null;
}

interface Step2DestinationProps {
  destinations: Destination[];
  selectedDestinationId?: string;
  onSelect: (destinationId: string) => void;
}

export function Step2Destination({
  destinations,
  selectedDestinationId,
  onSelect,
}: Step2DestinationProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pick a country for your next adventure
        </h2>
        <p className="text-gray-600">Where would you like to study?</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {destinations.map((destination) => (
          <button
            key={destination.id}
            onClick={() => onSelect(destination.id)}
            className={cn(
              "relative  px-2 py-1.5  rounded-xl border-2 overflow-hidden transition-all",
              "hover:border-purple-300 hover:shadow-md cursor-pointer",
              selectedDestinationId === destination.id
                ? "border-purple-500 shadow-lg ring-2 ring-purple-200 bg-purple-50"
                : "border-gray-200"
            )}
          >
            <div className={cn("flex items-end")}>
              <span className="  font-medium">{destination.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
