"use client"

import { useState, useEffect } from "react";
import { getCookie, setCookie } from "cookies-next";
import Image from "next/image";
import { X } from "lucide-react";

interface Country {
  id: string;
  name: string;
  slug: string;
  flag: string | null;
  isoCode: string;
}

export default function CountryBanner() {
  const [detectedCountry, setDetectedCountry] = useState<Country | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if banner was dismissed
    const bannerDismissed = getCookie("country_banner_dismissed");
    if (bannerDismissed) {
      return;
    }

    // Fetch all countries
    fetch(`/api/countries`)
      .then((res) => res.json())
      .then((data) => {
        const fetchedCountries = data?.data || [];

        if (fetchedCountries.length === 0) {
          return;
        }

        // Get detected country from cookie (set by proxy)
        const geoCode = getCookie("detected_geo_origin");

        if (geoCode) {
          const country = fetchedCountries.find(
            (c: Country) => c.isoCode?.toUpperCase() === geoCode.toString().toUpperCase()
          );

          if (country) {
            setDetectedCountry(country);
            setShowBanner(true);
          }
        }
      })
      .catch((error) => {
        console.error("Failed to fetch countries:", error);
      });
  }, []);

  const handleGoToCountry = () => {
    if (detectedCountry) {
      setCookie("user-country", detectedCountry.slug, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
      window.location.href = `/${detectedCountry.slug}`;
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Remember dismissal for 7 days
    setCookie("country_banner_dismissed", "true", {
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  };

  if (!showBanner) return null;

  return (
    <div className="  top-0 left-0 w-full bg-white border-b border-gray-200 shadow-md z-50 animate-in slide-in-from-top">
      <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {detectedCountry?.flag && (
            <Image
              src={detectedCountry.flag}
              alt={detectedCountry.name}
              width={32}
              height={32}
              className="rounded-full shadow"
            />
          )}
          <p className="text-sm md:text-base text-gray-700">
            You are visiting from <strong>{detectedCountry?.name}</strong>.
            Go to the {detectedCountry?.name} website?
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGoToCountry}
            className="px-6 py-2 cursor-pointer text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Yes
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 cursor-pointer text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Stay here
          </button>
          <button
            onClick={handleDismiss}
            className="ml-2 p-2 cursor-pointer hover:bg-gray-100 rounded transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
