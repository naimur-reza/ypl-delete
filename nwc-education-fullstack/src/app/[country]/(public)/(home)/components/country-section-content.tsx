"use client";

import { CountryAwareLink } from "@/components/common/navbar/country-aware-link";
import Image from "next/image";
import { Destination } from "../../../../../../prisma/src/generated/prisma/client";
import { useState } from "react";

const CountrySectionContent = ({
  countries,
}: {
  countries: Pick<Destination, "name" | "id" | "slug" | "thumbnail">[];
}) => {
  const [hoverIndex, setHoverIndex] = useState(0);
  return (
    <div className="grid md:grid-cols-2 gap-16  ">
      {/* Left side - Heading and countries list */}
      <div>
        <div className="space-y-0 border-t border-white/15">
          {countries.map((country, idx) => (
            <div
              key={country.id}
              onMouseEnter={() => setHoverIndex(idx)}
              onMouseLeave={() => setHoverIndex(0)}
            >
              <CountryAwareLink
                href={`/study-abroad/${country.slug}`}
                className="group flex items-center justify-between py-6 px-0 border-b border-white/15 hover:bg-white/5 transition-colors duration-200 cursor-pointer"
              >
                <span className="text-2xl md:text-3xl font-serif font-bold text-white">
                  {country.name}
                </span>
                <svg
                  className="w-7 h-7 text-white group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </CountryAwareLink>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Image */}
      <div className="relative flex justify-center items-center">
        <div className="w-full max-w-lg aspect-3/4 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20">
          <Image
            width={500}
            height={650}
            src={countries[hoverIndex]?.thumbnail || ""}
            alt="Big Ben clock tower in London"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default CountrySectionContent;
