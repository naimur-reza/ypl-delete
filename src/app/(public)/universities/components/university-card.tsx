import Image from "next/image";
import { MapPin, ArrowRight, Star, Calendar } from "lucide-react";
import { CountryAwareLink } from "@/components/common/navbar/country-aware-link";
import { University } from "../../../../../prisma/src/generated/prisma/client";

interface UniversityCardProps {
  university: University & {
    destination?: { id: string; name: string } | null;
  };
}

export function UniversityCard({ university }: UniversityCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden">
      {/* Horizontal Layout */}
      <div className="flex flex-col sm:flex-row h-full">
        {/* Thumbnail */}
        <div className="relative h-52 sm:h-auto sm:min-h-[220px] sm:w-[200px] shrink-0 overflow-hidden">
          <Image
            src={
              university.thumbnail ||
              university.logo ||
              "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=400&auto=format&fit=crop"
            }
            alt={university.name}
            fill
            sizes="(max-width: 640px) 100vw, 200px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t sm:bg-linear-to-r from-black/40 to-transparent" />

          {/* Featured badge */}
          {university.isFeatured && (
            <div className="absolute top-3 left-3 px-3 py-1.5 bg-linear-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
              ⭐ Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            {/* Logo and Title */}
            <div className="flex items-start gap-3 mb-3">
              {university.logo && (
                <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-200 p-1.5 flex items-center justify-center shrink-0">
                  <Image
                    src={university.logo}
                    alt={university.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <CountryAwareLink href={`/universities/${university.slug}`}>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {university.name}
                  </h3>
                </CountryAwareLink>
                {(university.address || university.destination) && (
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-primary" />
                    <span className="truncate">
                      {university.destination?.name || university.address || ""}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-4 text-sm mb-4">
              <div className="flex items-center gap-1.5 text-slate-600 bg-blue-50 px-2.5 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-blue-700 font-medium">Est. 1992</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 bg-amber-50 px-2.5 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-amber-700 font-medium">Top 500</span>
              </div>
            </div>

            {university.description && (
              <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                {university.description}
              </p>
            )}
          </div>

          <CountryAwareLink
            href={`/universities/${university.slug}`}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all w-fit group/btn"
          >
            View Details
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </CountryAwareLink>
        </div>
      </div>
    </div>
  );
}
