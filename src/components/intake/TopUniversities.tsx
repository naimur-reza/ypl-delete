 "use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building, MapPin, ArrowRight, Send } from "lucide-react";
import { Button } from "../ui/button";

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
  destinationSlug: string;
  countrySlug?: string;
  intakeName: string;
  title?: string;
  description?: string;
  pageSize?: number;
}

export function TopUniversities({
  universities,
  destinationSlug,
  countrySlug,
  intakeName,
  title,
  description,
  pageSize = 6,
}: TopUniversitiesProps) {
  const baseUrl = countrySlug ? `/${countrySlug}` : "";

  const defaultTitle = `Top Universities for ${intakeName} Intake`;
  const defaultDescription = `Explore prestigious universities accepting applications for the ${intakeName} intake`;

  if (!universities || universities.length === 0) {
    return null;
  }

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

        {/* Universities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {visible.map((university) => (
            <Link
              key={university.id}
              href={`${baseUrl}/universities/${university.slug}`}
              className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200"
            >
              {/* University Image */}
              <div className="relative h-48 bg-gray-100">
                {university.thumbnail ? (
                  <Image
                    src={university.thumbnail}
                    alt={university.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Building className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                {/* Logo Overlay */}
                {university.logo && (
                  <div className="absolute top-4 left-4 bg-white rounded-lg p-2 shadow-lg">
                    <Image
                      src={university.logo}
                      alt={`${university.name} logo`}
                      width={60}
                      height={60}
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* University Info */}
              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {university.name}
                </h3>

                {university.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{university.address}</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-blue-600 font-medium">
                    {intakeName} Intake
                  </span>
                  <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
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
          <Link href={`${baseUrl}/apply-now`} className="inline-flex">
            <Button size="lg" className="gap-2">
              Apply Now <Send className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Need Help Choosing a University?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our expert counselors can help you find the perfect university based
            on your academic background, career goals, and preferences for the{" "}
            {intakeName} intake.
          </p>
          <Link
            href={`${baseUrl}/contact`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Get Free Counseling
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
