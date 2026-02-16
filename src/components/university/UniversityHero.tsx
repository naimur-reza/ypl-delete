import Image from "next/image";
import { ChevronRight, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { CountryAwareLink } from "@/components/common/navbar/country-aware-link";

interface UniversityHeroProps {
  university: {
    name: string;
    thumbnail?: string | null;
    logo?: string | null;
    address?: string | null;
    website?: string | null;
    famousFor?: string | null;
  };
  countrySlug: string;
}

export function UniversityHero({ university, countrySlug }: UniversityHeroProps) {
  return (
    <div className="relative h-[400px] w-full overflow-hidden">
      <Image
        src={
          university.thumbnail ||
          "https://images.unsplash.com/photo-1562774053-701939374585?q=100&w=1400&auto=format&fit=crop"
        }
        alt={university.name}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-900/60 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-center container mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-white/80 text-sm mb-6">
          <Link
            href={`/${countrySlug}`}
            className="hover:text-white transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <CountryAwareLink
            href="/universities"
            className="hover:text-white transition-colors"
          >
            Universities
          </CountryAwareLink>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white font-medium truncate max-w-[200px] md:max-w-none">
            {university.name}
          </span>
        </div>

        <div className="flex items-center gap-5 mb-4">
          {/* University Logo */}
          {university.logo && (
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl p-2 flex items-center justify-center shadow-lg shrink-0">
              <Image
                src={university.logo.trim()}
                alt={university.name}
                width={64}
                height={64}
                className="object-contain max-h-full max-w-full"
              />
            </div>
          )}
          <div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl leading-tight">
              {university.name}
            </h1>
            {university.address && (
              <div className="flex items-center gap-2 text-white/80 mt-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm md:text-base">{university.address}</span>
              </div>
            )}
            {university.famousFor && (
              <div className="flex items-center gap-2 text-white/80 mt-1">
                <Star className="w-4 h-4 text-amber-400" />
                <span className="text-sm">{university.famousFor}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-2">
          <Link href="#overview">
            <button className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-xl shadow-blue-600/20">
              Explore Details
            </button>
          </Link>
          {university.website && (
            <Link
              href={university.website}
              target="_blank"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl backdrop-blur transition-all border border-white/20 flex items-center gap-2"
            >
              Visit Website
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
