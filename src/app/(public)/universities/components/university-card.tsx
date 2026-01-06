import Image from "next/image";
import { MapPin, ArrowRight, Star, Calendar } from "lucide-react";
import { CountryAwareLink } from "@/components/common/navbar/country-aware-link";
import { University } from "../../../../../prisma/src/generated/prisma/client";

interface UniversityCardProps {
  university: University & { destination?: { id: string; name: string } | null };
}

export function UniversityCard({ university }: UniversityCardProps) {
  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-32 w-full overflow-hidden">
        <Image
          src={university.thumbnail || university.logo || "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=400&auto=format&fit=crop"}
          alt={university.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        
        {/* Logo overlay */}
        {university.logo && (
          <div className="absolute bottom-2 left-3 w-10 h-10 bg-white rounded-lg shadow-md p-1 flex items-center justify-center">
            <Image
              src={university.logo}
              alt={university.name}
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
        )}

        {/* Featured badge */}
        {university.isFeatured && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-md">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <CountryAwareLink href={`/universities/${university.slug}`}>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
            {university.name}
          </h3>
        </CountryAwareLink>

        {(university.address || university.destination) && (
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-3">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {university.destination?.name || university.address || ""}
            </span>
          </div>
        )}

        {/* Compact Stats Row */}
        <div className="flex items-center gap-3 text-xs mb-3 flex-wrap">
          <div className="flex items-center gap-1 text-slate-600">
            <Calendar className="w-3 h-3 text-blue-500" />
            <span>Est. 1992</span>
          </div>
          <div className="flex items-center gap-1 text-slate-600">
            <Star className="w-3 h-3 text-amber-500" />
            <span>Top 500</span>
          </div>
        </div>

        {university.description && (
          <p className="text-slate-600 text-xs line-clamp-2 mb-3">
            {university.description}
          </p>
        )}

        <CountryAwareLink
          href={`/universities/${university.slug}`}
          className="inline-flex items-center gap-1.5 text-primary font-medium text-xs hover:gap-2 transition-all"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </CountryAwareLink>
      </div>
    </div>
  );
}
