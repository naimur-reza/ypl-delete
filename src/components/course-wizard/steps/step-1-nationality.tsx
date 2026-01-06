"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Country {
  id: string;
  name: string;
  isoCode: string;
  flag?: string | null;
}

interface Step1NationalityProps {
  countries: Country[];
  selectedCountryId?: string;
  onSelect: (countryId: string) => void;
}

export function Step1Nationality({
  countries,
  selectedCountryId,
  onSelect,
}: Step1NationalityProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return countries;
    }
    const query = searchQuery.toLowerCase();
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.isoCode.toLowerCase().includes(query)
    );
  }, [countries, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What&apos;s your nationality?
        </h2>
        <p className="text-gray-600">Select your country of origin</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search for your country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      <div className="max-h-[400px] overflow-y-auto space-y-2">
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country) => (
            <button
              key={country.id}
              onClick={() => onSelect(country.id)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg border-2 transition-all",
                "hover:border-purple-300 hover:bg-purple-50",
                selectedCountryId === country.id
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 bg-white"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {country.name}
                  </div>
                  <div className="text-sm text-gray-500">{country.isoCode}</div>
                </div>
                {selectedCountryId === country.id && (
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                )}
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No countries found matching &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
