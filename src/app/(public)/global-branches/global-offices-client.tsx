"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Country, GlobalOffice } from "../../../../prisma/src/generated/prisma/client";

type OfficeWithCountries = GlobalOffice & {
  countries: {
    id: string;
    countryId: string;
    globalOfficeId: string;
    country: Country;
  }[];
};

type GlobalOfficesClientProps = {
  offices: OfficeWithCountries[];
  countryCode: string | null;
};

export default function GlobalOfficesClient({
  offices,
  countryCode,
}: GlobalOfficesClientProps) {
  // Group offices by country
  const officesByCountry = useMemo(() => {
    const grouped: Record<string, { country: Country; offices: GlobalOffice[] }> = {};

    offices.forEach((office) => {
      if (!office.countries || office.countries.length === 0) return;

      office.countries.forEach(({ country }) => {
        if (!country) return;

        const countryName = country.name;
        if (!grouped[countryName]) {
          grouped[countryName] = { country, offices: [] };
        }

        grouped[countryName].offices.push(office);
      });
    });

    // Sort countries alphabetically
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, { country: Country; offices: GlobalOffice[] }>);
  }, [offices]);

  const countryNames = Object.keys(officesByCountry);
  const [selectedCountryName, setSelectedCountryName] = useState<string>(
    countryNames[0] || ""
  );

  const selectedCountryData = officesByCountry[selectedCountryName];

  return (
    <div className="flex flex-col md:flex-row min-h-[600px] bg-white rounded-xl overflow-hidden shadow-xs border border-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-gray-50/50 border-r border-gray-100 p-6 shrink-0">
        <div className="space-y-1">
          {countryNames.map((name) => {
            const count = officesByCountry[name]?.offices?.length || 0;
            return (
              <button
                key={name}
                onClick={() => setSelectedCountryName(name)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg cursor-pointer font-medium transition-all flex items-center justify-between group",
                  selectedCountryName === name
                    ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <span>{name}</span>
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full transition-colors",
                    selectedCountryName === name
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 lg:p-10">
        {selectedCountryData && selectedCountryData.offices.length > 0 ? (
          <>
            <div className="mb-8 border-b border-gray-100 pb-6">
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                {selectedCountryName}
              </h2>
              <p className="text-gray-500">
                We have {selectedCountryData.offices.length} office
                {selectedCountryData.offices.length !== 1 ? "s" : ""} in{" "}
                {selectedCountryName}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {selectedCountryData.offices.map((office) => (
                <div
                  key={office.id}
                  className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col h-full"
                >
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
              <iframe
                src={office.mapEmbedUrl || ""}
                width="100%"
                height="150"
                style={{ border: "none" }}
                allowFullScreen
              />
                    </div>
                    <h3 className="text-2xl font-serif font-medium text-gray-900">
                      {office.name}
                    </h3>
                    {office.subtitle && (
                      <p className="text-sm text-gray-500 mt-1">
                        {office.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4 flex-1 mb-6">
                    {office.phone && (
                      <div className="flex items-start gap-3 text-gray-600">
                        <Phone className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                        <span className="text-sm">{office.phone}</span>
                      </div>
                    )}
                    {office.email && (
                      <div className="flex items-start gap-3 text-gray-600">
                        <Mail className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                        <span className="text-sm break-all">{office.email}</span>
                      </div>
                    )}
                    {office.address && (
                      <div className="flex items-start gap-3 text-gray-600">
                        <MapPin className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed">
                          {office.address}
                        </span>
                      </div>
                    )}
                  </div>

                  <Link
                    href={
                      countryCode
                        ? `/${countryCode}/global-branches/${office.slug}`
                        : `/global-branches/${office.slug}`
                    }
                    className="block"
                  >
                    <Button className="w-full bg-blue-800 hover:bg-blue-900 text-white font-medium py-6 rounded-xl">
                      View office details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500">No offices found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
