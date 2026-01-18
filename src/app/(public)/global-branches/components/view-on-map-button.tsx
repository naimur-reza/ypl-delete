"use client";

import { ExternalLink } from "lucide-react";

interface ViewOnMapButtonProps {
  mapUrl: string;
}

export function ViewOnMapButton({ mapUrl }: ViewOnMapButtonProps) {
  const handleClick = () => {
    if (!mapUrl) return;

    let url = mapUrl;

    // If it's an iframe, extract the src
    if (mapUrl.includes("<iframe")) {
      const match = mapUrl.match(/src="([^"]+)"/);
      if (match && match[1]) {
        url = match[1];
      }
    }

    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
    >
      <ExternalLink className="w-4 h-4" />
      View on Google Maps
    </button>
  );
}
