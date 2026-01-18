import Image from "next/image";
import { MapPin, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { University } from "../../../../../../prisma/src/generated/prisma/client";
import { CountryAwareLink } from "@/components/common/navbar/country-aware-link";
 

interface UniversityCardProps {
  university: University;
}

export function UniversityCard({ university }: UniversityCardProps) {
  return (
    <div className="group bg-white rounded-3xl border border-slate-100 hover:shadow-2xl transition-all duration-300 flex flex-col h-full relative pt-12 mt-12 w-full max-w-[400px] mx-auto visible">
      
      {/* Top Logo - Floating */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-10 w-24 h-24 bg-white rounded-2xl shadow-lg border border-slate-50 p-2 flex items-center justify-center z-10 transition-transform duration-300 group-hover:-translate-y-12">
        <Image
           src={"https://mie-global-te43fd.s3.amazonaws.com/static/images/amity-london-logo.original.jpg"} // Fallback or use a placeholder
           alt={university.name}
           width={80}
           height={80}
           className="object-contain max-h-full max-w-full"
        />
        {!university.logo && <span className="text-xs text-center font-bold text-slate-700">{university.name.substring(0, 3)}</span>}
      </div>

      <div className="pt-8 px-6 pb-8 flex-1 flex flex-col items-center text-center">
        
        {/* Name & Address */}
        <Link href={`/universities/${university.slug}`} className="block mb-2">
            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">
            {university.name}
            </h3>
        </Link>
        
        <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-6 justify-center">
          <MapPin className="w-3.5 h-3.5" />
          <span>{university.address || "United Kingdom"}</span> 
        </div>

        {/* Description Excerpt */}
        <p className="text-primary/80 font-medium text-sm line-clamp-2 mb-8 px-2 leading-relaxed">
          {university.description ? university.description.substring(0, 100) + "..." : "A world-class institution dedicated to academic excellence and research innovation."}
        </p>

        {/* Stats List */}
        <div className="w-full bg-slate-50 rounded-2xl p-4 space-y-3  text-left">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-blue-600 font-bold text-xs">F</span>
                </div>
                <span className="text-primary font-semibold text-sm">Founded in 1992</span>
            </div>
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-primary font-semibold text-sm">Guardian: #45</span>
            </div>
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <div className="w-4 h-4 rounded-full border-2 border-indigo-600"></div>
                </div>
                 <span className="text-primary font-semibold text-sm">THE: #301-400</span>
            </div>
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 text-pink-600" />
                </div>
                <span className="text-primary font-semibold text-sm">QS: #801-1000</span>
            </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto w-full">
          <CountryAwareLink 
            href={`/universities/${university.slug}`}
            className="block w-full py-3 bg-[#1e2a4a] text-white font-bold rounded-xl shadow-lg hover:bg-[#151f38] hover:shadow-xl transition-all duration-300"
          >
            View Details
          </CountryAwareLink>
        </div>

      </div>
    </div>
  );
}
