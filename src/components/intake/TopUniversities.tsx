 "use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building, Send } from "lucide-react";
import { Button } from "../ui/button";
import { CountryAwareLink } from "../common/navbar/country-aware-link";

interface University {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  thumbnail?: string;
  address?: string;
}

interface TopUniversitiesProps {
  universities?: University[];
  intakeName: string;
  title?: string;
  description?: string;
  pageSize?: number;
}

export function TopUniversities({
  universities,
  intakeName,
  title,
  description,
  pageSize = 6,
}: TopUniversitiesProps) {
 

  const defaultTitle = `Top Universities for ${intakeName} Intake`;
  const defaultDescription = `Explore prestigious universities accepting applications for the ${intakeName} intake`;

  if (!universities || universities.length === 0) {
    return null;
  }

  console.log(universities)

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(universities.length / pageSize));

  const visible = useMemo(
    () =>
      universities.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize),
    [page, universities, pageSize],
  );

  const nextPage = () => setPage((p) => Math.min(totalPages, p + 1));
  const prevPage = () => setPage((p) => Math.max(1, p - 1));

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title || defaultTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {description || defaultDescription}
          </p>
        </div>

        {/* Universities List (Table Style) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-12">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[1fr_2fr_1fr] bg-slate-50/50 border-b border-gray-100 py-4 px-6">
            <div className="text-sm font-semibold text-indigo-900/70 uppercase tracking-wider text-center">
              University
            </div>
            <div className="text-sm font-semibold text-indigo-900/70 uppercase tracking-wider text-center">
              University Name
            </div>
            <div className="text-sm font-semibold text-indigo-900/70 uppercase tracking-wider text-center">
              Action
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {visible.map((university) => (
              <div
                key={university.id}
                className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] items-center gap-4 py-6 px-6 hover:bg-slate-50/30 transition-colors"
              >
                {/* Logo Column */}
                <div className="flex justify-center">
                  <div className="relative w-32 h-16 bg-white border border-gray-100 rounded-lg p-2 flex items-center justify-center shadow-sm">
                    {university.logo ? (
                      <Image
                        src={university.logo}
                        alt={`${university.name} logo`}
                        width={100}
                        height={50}
                        className="object-contain rounded-lg p-2"
                      />
                    ) : (
                      <Building className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Name Column */}
                <div className="text-center">
                  <CountryAwareLink
                    href={`/universities/${university.slug}`}
                    className="text-lg font-bold text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    {university.name}
                  </CountryAwareLink>
                </div>

                {/* Action Column */}
                <div className="flex justify-center">
                  <Link href={`/apply-now`}>
                    <Button
                      className="min-w-[140px] bg-linear-to-r from-[#db7993] to-primary hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg shadow-[0_4px_12px_rgba(228,100,124,0.3)] transition-all duration-300 hover:scale-105"
                    >
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination & Apply CTA */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={prevPage} disabled={page === 1}>
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
         
        </div>

 
      </div>
    </section>
  );
}
