import Image from "next/image";
import { MapPin, Globe, Trophy, Calendar, CheckCircle } from "lucide-react"; // Added Icons
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GradientButton } from "@/components/ui/gradient-button"; // Assuming this exists or standard Button

interface UniversityHeroProps {
  university: {
    name: string;
    thumbnail?: string | null;
    logo?: string | null;
    address?: string | null;
    website?: string | null;
    ranking?: string;
    established?: string;
    famousFor?: string;
    fees?: string;
  };
}

export function UniversityHero({ university }: UniversityHeroProps) {
  return (
    <div className="relative w-full min-h-[500px] lg:h-[60vh] flex items-center bg-slate-900 overflow-hidden">
      {/* Background Image with Overlay */}
      {university.thumbnail ? (
        <>
          <Image
            src={university.thumbnail}
            alt={university.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-primary/20 to-slate-900" />
      )}

      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left: Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            {/* Breadcrumb / Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm font-medium backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              University Profile
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
                {university.name}
              </h1>
              
              {university.address && (
                <div className="flex items-center justify-center lg:justify-start gap-2 text-slate-300 text-lg">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span>{university.address}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              {university.website && (
                <Link href={university.website} target="_blank">
                  <GradientButton className="min-w-[160px] h-11 text-base">
                    Visit Website
                  </GradientButton>
                </Link>
              )}
              <a href="#overview" className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium backdrop-blur transition-all border border-white/10">
                Explore Details
              </a>
            </div>
          </div>

          {/* Right: Modern Stats/Logo Card */}
          <div className="w-full lg:w-[450px] shrink-0">
             <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                
                {/* Logo Area */}
                <div className="flex items-center justify-center mb-8">
                   <div className="w-24 h-24 bg-white p-3 rounded-2xl flex items-center justify-center shadow-lg">
                      {university.logo ? (
                         <Image 
                           src={university.logo} 
                           alt={university.name} 
                           width={80} 
                           height={80} 
                           className="object-contain max-h-full max-w-full"
                         />
                      ) : (
                         <span className="text-2xl font-bold text-primary">{university.name.substring(0, 2)}</span>
                      )}
                   </div>
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                      <div className="flex items-center gap-2 mb-2 text-accent">
                         <Trophy className="w-4 h-4" />
                         <span className="text-xs font-semibold uppercase tracking-wider">Ranking</span>
                      </div>
                      <p className="text-white font-bold text-lg leading-tight">{university.ranking || "N/A"}</p>
                   </div>

                   <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                      <div className="flex items-center gap-2 mb-2 text-accent">
                         <Calendar className="w-4 h-4" />
                         <span className="text-xs font-semibold uppercase tracking-wider">Fees</span>
                      </div>
                      <p className="text-white font-bold text-lg leading-tight truncate">{university.fees || "Ask Counsellor"}</p>
                   </div>
                   
                   {/* Full width feature */}
                   <div className="col-span-2 bg-black/20 rounded-2xl p-4 border border-white/5">
                       <div className="flex items-center gap-2 mb-2 text-accent">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-semibold uppercase tracking-wider">Famous For</span>
                       </div>
                       <p className="text-slate-200 text-sm leading-relaxed">
                          {university.famousFor || "Excellence in various academic disciplines."}
                       </p>
                   </div>
                </div>

             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
