"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { setCookie, getCookie } from "cookies-next";
import Image from "next/image";
import { Globe as GlobeIcon } from "lucide-react";

type Country = {
  id: string;
  name: string;
  slug: string;
  flag: string | null;
};

type CountryModalOptimizedProps = {
  countries: Country[];
  currentCountrySlug?: string | null;
};

// Preload country data for faster switching
const preloadCountryData = (countrySlug: string) => {
  if (typeof window !== "undefined") {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = `/${countrySlug}`;
    document.head.appendChild(link);

    // Preload country API data
    fetch(`/api/countries?slug=${countrySlug}`, { priority: "low" });
  }
};

export const CountryModalOptimized = ({
  countries,
  currentCountrySlug,
}: CountryModalOptimizedProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Memoize countries to prevent unnecessary re-renders
  const memoizedCountries = useMemo(() => countries, [countries]);

  const handleCountryChange = async (country: Country) => {
    setIsLoading(true);

    try {
      // Set cookie immediately for faster feedback
      setCookie("user-country", country.slug, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      // Clear global preference
      setCookie("country-preference", "", {
        maxAge: 0,
        path: "/",
      });

      // Preload the target page
      preloadCountryData(country.slug);

      // Optimized navigation
      router.push(`/${country.slug}`);

      // Close modal immediately
      setIsOpen(false);
    } catch (error) {
      console.error("Country change failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoGlobal = () => {
    setIsLoading(true);

    try {
      setCookie("country-preference", "global", {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      setCookie("user-country", "", {
        maxAge: 0,
        path: "/",
      });

      router.push("/");
      setIsOpen(false);
    } catch (error) {
      console.error("Global navigation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get current country data efficiently
  const currentCountryData = useMemo(() => {
    const countryFromCookie = getCookie("user-country")?.toString();
    return (
      memoizedCountries.find((c) => c.slug === countryFromCookie) ||
      memoizedCountries.find((c) => c.slug === currentCountrySlug)
    );
  }, [memoizedCountries, currentCountrySlug]);

  const currentFlag = currentCountryData?.flag;

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Switching...</span>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-white hover:opacity-80 transition"
        disabled={isLoading}
      >
        {currentFlag ? (
          <div className="size-8 rounded-full overflow-hidden border-2 border-white/20 cursor-pointer">
            <Image
              src={currentFlag}
              alt={currentCountryData?.name || "Country flag"}
              width={32}
              height={32}
              className="size-full object-cover"
              priority={true}
            />
          </div>
        ) : (
          <GlobeIcon className="size-8 cursor-pointer" />
        )}
      </button>

      {/* Modal Content */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-center mb-6">
              Where Would You Like to Visit?
            </h2>

            {/* Country Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {/* Global Option */}
              <button
                onClick={handleGoGlobal}
                disabled={isLoading}
                className="flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="size-12 sm:size-14 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <GlobeIcon className="size-6 sm:size-7 text-white" />
                </div>
                <span className="text-sm font-medium">Global</span>
              </button>

              {/* Country Options */}
              {memoizedCountries.map((country) => (
                <button
                  key={country.id}
                  onClick={() => handleCountryChange(country)}
                  disabled={isLoading}
                  className={`flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    currentCountryData?.slug === country.slug
                      ? "ring-2 ring-primary ring-offset-2"
                      : ""
                  }`}
                >
                  <div className="size-12 sm:size-14 rounded-full overflow-hidden border-2">
                    <Image
                      src={country.flag || "/placeholder-flag.png"}
                      alt={country.name}
                      width={48}
                      height={48}
                      className="size-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-sm font-medium text-center">
                    {country.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};
