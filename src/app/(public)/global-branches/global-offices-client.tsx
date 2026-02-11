"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Mail,
  Phone,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  Country,
  GlobalOffice,
} from "../../../../prisma/src/generated/prisma/client";


// Helper function to extract src from iframe or convert URL to embed format
function convertToEmbedUrl(mapUrl: string): string {
  if (!mapUrl) return "";

  // If it's an iframe HTML string, extract the src attribute
  if (mapUrl.trim().startsWith("<iframe")) {
    const srcMatch = mapUrl.match(/src="([^"]+)"/);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
    // Try with single quotes
    const srcMatch2 = mapUrl.match(/src='([^']+)'/);
    if (srcMatch2 && srcMatch2[1]) {
      return srcMatch2[1];
    }
    return "";
  }

  // If it's already an embed URL, return as is
  if (mapUrl.includes("/embed") || mapUrl.includes("output=embed")) {
    return mapUrl;
  }

  // For ALL Google Maps URLs, use the simple embed format
  try {
    const url = new URL(mapUrl);

    // If it's a short URL, we can't embed directly
    if (
      url.hostname.includes("goo.gl") ||
      url.hostname.includes("maps.app.goo.gl")
    ) {
      return "";
    }

    // Extract coordinates if present
    const coordMatch = mapUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch) {
      return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed`;
    }

    // Extract place name if present
    const placeMatch = mapUrl.match(/place\/([^\/]+)/);
    if (placeMatch) {
      const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
      return `https://maps.google.com/maps?q=${encodeURIComponent(
        placeName,
      )}&output=embed`;
    }
  } catch (e) {
    // If URL parsing fails, try simple query
  }

  // Fallback: use the URL as search query
  return `https://maps.google.com/maps?q=${encodeURIComponent(
    mapUrl,
  )}&output=embed`;
}

export default function GlobalOfficesClient({
  offices,
  countryCode,
}: {
  offices: (GlobalOffice & {
    city?: string | null;
    countries: {
      id: string;
      countryId: string;
      globalOfficeId: string;
      country: Country;
    }[];
  })[];
  countryCode: string | null;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [expandedCountries, setExpandedCountries] = useState<string[]>([]);

  // Extract countries and their cities, including "Global" category for global offices
  const countriesWithCities = useMemo(() => {
    const countryMap = new Map<string, { name: string; cities: Set<string> }>();
    const cityCountryMap = new Map<string, Set<string>>(); // Track which countries each city belongs to

    offices.forEach((office) => {
      // Use the actual city field from the office
      const city = office.city || office.name.split(" ")[0].trim();

      // Check if this is a global office (has isGlobal = true and no countries)
      const isGlobalOffice = (office as any).isGlobal === true || (!office.countries || office.countries.length === 0);

      if (isGlobalOffice) {
        // Add to "Global" category
        if (!countryMap.has("Global")) {
          countryMap.set("Global", {
            name: "Global",
            cities: new Set(),
          });
        }
        countryMap.get("Global")!.cities.add(city);
        
        // Also track the city
        if (!cityCountryMap.has(city)) {
          cityCountryMap.set(city, new Set());
        }
        cityCountryMap.get(city)!.add("Global");
      }

      office.countries?.forEach(({ country }) => {
        if (country) {
          // Initialize country if not exists
          if (!countryMap.has(country.name)) {
            countryMap.set(country.name, {
              name: country.name,
              cities: new Set(),
            });
          }

          // Track which countries this city belongs to
          if (!cityCountryMap.has(city)) {
            cityCountryMap.set(city, new Set());
          }
          cityCountryMap.get(city)!.add(country.name);

          // Add city to this specific country
          countryMap.get(country.name)!.cities.add(city);
        }
      });
    });

    return Array.from(countryMap.entries())
      .map(([countryName, data]) => ({
        name: countryName,
        cities: Array.from(data.cities).sort(),
      }))
      .sort((a, b) => {
        // Put "Global" at the top
        if (a.name === "Global") return -1;
        if (b.name === "Global") return 1;
        return a.name.localeCompare(b.name);
      });
  }, [offices]);

  // Filter offices
  const filteredOffices = useMemo(() => {
    let officesToFilter = offices;

    // Filter by selected filters (countries and cities)
    if (selectedFilters.length > 0) {
      officesToFilter = officesToFilter.filter((office) => {
        // Extract country and city filters
        const matchingCountries = selectedFilters
          .filter((filter) => filter.startsWith("country:"))
          .map((filter) => filter.replace("country:", ""));

        const matchingCities = selectedFilters
          .filter((filter) => filter.startsWith("city:"))
          .map((filter) => filter.replace("city:", ""));

        // Check country filters
        let matchesCountryFilter = true;
        if (matchingCountries.length > 0) {
          // Check if "Global" filter is selected and this is a global office
          const isGlobalOffice = (office as any).isGlobal === true || (!office.countries || office.countries.length === 0);
          const globalFilterSelected = matchingCountries.includes("Global");

          if (globalFilterSelected && isGlobalOffice) {
            matchesCountryFilter = true;
          } else {
            // Office must have countries and match at least one of the selected countries
            matchesCountryFilter =
              office.countries?.some(
                ({ country }) =>
                  country && matchingCountries.includes(country.name),
              ) || false;
          }
        }

        // Check city filters
        let matchesCityFilter = true;
        if (matchingCities.length > 0) {
          const officeCity = office.city || office.name.split(" ")[0].trim();
          matchesCityFilter = matchingCities.includes(officeCity);
        }

        // Office must match both country AND city filters (if they exist)
        return matchesCountryFilter && matchesCityFilter;
      });
    }

    // Filter by search query (city or office name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      officesToFilter = officesToFilter.filter((office) => {
        const matchesSearch =
          office.name?.toLowerCase().includes(query) ||
          office.city?.toLowerCase().includes(query) ||
          office.address?.toLowerCase().includes(query) ||
          office.email?.toLowerCase().includes(query) ||
          office.phone?.toLowerCase().includes(query);
        return matchesSearch;
      });
    }

    return officesToFilter;
  }, [offices, selectedFilters, searchQuery]);

  // Group offices by country
  const officesByCountry = useMemo(() => {
    const grouped: Record<string, typeof offices> = {};

    if (filteredOffices && Array.isArray(filteredOffices)) {
      filteredOffices.forEach((office) => {
        // Check if this is a global office
        const isGlobalOffice = (office as any).isGlobal === true || (!office.countries || office.countries.length === 0);

        if (isGlobalOffice) {
          // Add to "Global" group
          if (!grouped["Global"]) {
            grouped["Global"] = [];
          }
          grouped["Global"].push(office);
        }

        office.countries?.forEach(({ country }) => {
          if (country) {
            if (!grouped[country.name]) {
              grouped[country.name] = [];
            }
            grouped[country.name].push(office);
          }
        });
      });
    }

    return Object.entries(grouped).sort(([a], [b]) => {
      // Put "Global" at the top
      if (a === "Global") return -1;
      if (b === "Global") return 1;
      return a.localeCompare(b);
    });
  }, [filteredOffices]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  const toggleCountryExpand = (country: string) => {
    setExpandedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country],
    );
  };

  const resetFilters = () => {
    setSelectedFilters([]);
    setSearchQuery("");
  };

  const getEmbedUrl = (office: any) => {
    if (!office.mapUrl) return null;
    return convertToEmbedUrl(office.mapUrl) || null;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 max-w-7xl mx-auto">
      {/* Sidebar Filters - Mobile: Collapsible, Desktop: Sidebar */}
      <div className="w-full lg:w-72 shrink-0 order-2 lg:order-1">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Filters
            </h3>
            {selectedFilters.length > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 touch-manipulation min-h-11 px-2"
              >
                Reset
              </button>
            )}
          </div>

          {/* Hierarchical Countries & Cities or Flat Cities */}
          <div className="space-y-1 max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] overflow-y-auto">
            {countryCode ? (
              // On country-specific route: show only cities (flat list)
              <>
                {countriesWithCities.flatMap((countryData) =>
                  countryData.cities.map((city) => (
                    <label
                      key={city}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 sm:p-2 rounded touch-manipulation min-h-11"
                    >
                      <Checkbox
                        checked={selectedFilters.includes(`city:${city}`)}
                        onCheckedChange={() => toggleFilter(`city:${city}`)}
                        className="touch-manipulation"
                      />
                      <span className="text-sm text-gray-700">{city}</span>
                    </label>
                  )),
                )}
              </>
            ) : (
              // On global route: show countries with nested cities
              <>
                {countriesWithCities.map((countryData) => (
                  <div key={countryData.name}>
                    {/* Country Checkbox */}
                    <div className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded">
                      <button
                        onClick={() => toggleCountryExpand(countryData.name)}
                        className="p-1"
                      >
                        {expandedCountries.includes(countryData.name) ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                      <label className="flex items-center gap-2 cursor-pointer flex-1">
                        <Checkbox
                          checked={selectedFilters.includes(
                            `country:${countryData.name}`,
                          )}
                          onCheckedChange={() =>
                            toggleFilter(`country:${countryData.name}`)
                          }
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {countryData.name}
                        </span>
                      </label>
                    </div>

                    {/* Cities under country */}
                    {expandedCountries.includes(countryData.name) && (
                      <div className="ml-8 mt-1 space-y-1">
                        {countryData.cities.map((city) => (
                          <label
                            key={city}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                          >
                            <Checkbox
                              checked={selectedFilters.includes(`city:${city}`)}
                              onCheckedChange={() =>
                                toggleFilter(`city:${city}`)
                              }
                            />
                            <span className="text-sm text-gray-600">
                              {city}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 order-1 lg:order-2">
        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search Offices"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Available Offices{" "}
            <span className="text-gray-500 font-normal text-base sm:text-lg">
              (
              {filteredOffices && Array.isArray(filteredOffices)
                ? filteredOffices.length
                : 0}{" "}
              Results)
            </span>
          </h2>
        </div>

        {/* Offices List */}
        {officesByCountry.length > 0 ? (
          <div className="space-y-8">
            {officesByCountry.map(([countryName, countryOffices]) => (
              <div key={countryName}>
                {/* Country Header */}
                {!countryCode && (
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {countryName}
                  </h3>
                )}

                {/* Office Cards */}
                <div className="space-y-4">
                  {countryOffices.map((office) => {
                    const embedUrl = getEmbedUrl(office);

                    return (
                      <div
                        key={office.id}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col lg:flex-row">
                          {/* Left Side - Office Details */}
                          <div className="flex-1 p-4 sm:p-6">
                            <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                              {office.name}
                            </h4>

                            <div className="space-y-2 mb-4">
                              {office.address && (
                                <div className="flex items-start gap-2 text-gray-600">
                                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                  <span className="text-xs sm:text-sm">
                                    {office.address}
                                  </span>
                                </div>
                              )}
                              {office.email && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Mail className="w-4 h-4 shrink-0" />
                                  <span className="text-xs sm:text-sm break-all">
                                    {office.email}
                                  </span>
                                </div>
                              )}
                              {office.phone && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Phone className="w-4 h-4 shrink-0" />
                                  <a
                                    href={`tel:${office.phone}`}
                                    className="text-xs sm:text-sm hover:text-blue-600"
                                  >
                                    {office.phone}
                                  </a>
                                </div>
                              )}
                            </div>

                            {/* View Office Button */}
                            <Link
                              href={
                                countryCode
                                  ? `/${countryName.toLowerCase().replace(/\s+/g, '-')}/global-branches/${(office.city || office.name.split(" ")[0].trim()).toLowerCase().replace(/\s+/g, '-')}`
                                  : `/global-branches/${countryName.toLowerCase().replace(/\s+/g, '-')}/${(office.city || office.name.split(" ")[0].trim()).toLowerCase().replace(/\s+/g, '-')}`
                              }
                            >
                              <Button className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white w-full sm:w-auto touch-manipulation min-h-11">
                                View Office
                              </Button>
                            </Link>
                          </div>

                          {/* Right Side - Map */}
                          {embedUrl && (
                            <div className="w-full lg:w-96 shrink-0 h-64 sm:h-80 lg:h-auto">
                              <iframe
                                src={embedUrl}
                                width="100%"
                                height="100%"
                                style={{ border: "none", minHeight: "250px" }}
                                allowFullScreen
                                loading="lazy"
                                title={`Map of ${office.name}`}
                                className="w-full h-full"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-gray-500">
              No offices found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
