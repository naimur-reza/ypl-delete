"use client";

import { useState } from "react";
import { setCookie } from "cookies-next";
import Image from "next/image";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Country {
  id: string;
  name: string;
  slug: string;
  flag: string | null;
  isoCode: string;
}

interface CountrySelectionModalProps {
  detectedCountry?: Country | null;
  allCountries: Country[];
  isOpen: boolean;
  onClose: () => void;
}

export default function CountrySelectionModal({
  detectedCountry,
  allCountries,
  isOpen,
  onClose,
}: CountrySelectionModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleCountrySelect = (country: Country) => {
    // Save selection to cookie
    setCookie("user-country", country.slug, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });

    // Navigate to country-specific site
    router.push(`/${country.slug}`);
    onClose();
  };

  const handleStayGlobal = () => {
    // User wants to see global content, just close modal
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <div className="flex justify-end p-4 pb-0">
          <button
            onClick={handleStayGlobal}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8 pt-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Select Your Region
            </h2>
            {detectedCountry ? (
              <p className="text-gray-600">
                We detected you're from <strong>{detectedCountry.name}</strong>.
                Choose your region to see relevant content.
              </p>
            ) : (
              <p className="text-gray-600">
                Choose your region to see relevant content
              </p>
            )}
          </div>

          {/* Country Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {allCountries.map((country) => (
              <button
                key={country.id}
                onClick={() => handleCountrySelect(country)}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${detectedCountry?.id === country.id
                    ? "border-red-600 bg-red-50 shadow-lg"
                    : "border-gray-200 hover:border-red-300 hover:shadow-md"
                  }`}
              >
                {/* Flag */}
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                  <Image
                    src={country.flag || "/placeholder-flag.png"}
                    alt={country.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Country Name */}
                <span
                  className={`text-sm font-semibold text-center ${detectedCountry?.id === country.id
                      ? "text-red-600"
                      : "text-gray-700"
                    }`}
                >
                  {country.name}
                </span>

                {detectedCountry?.id === country.id && (
                  <span className="text-xs text-red-600 font-medium">
                    Recommended
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Footer Button */}
          <div className="text-center">
            <button
              onClick={handleStayGlobal}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium underline"
            >
              Continue with global content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
