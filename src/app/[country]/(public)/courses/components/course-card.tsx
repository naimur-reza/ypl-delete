import Image from "next/image";
import { Clock, GraduationCap, MapPin, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Course } from "../../../../../../prisma/src/generated/prisma/client";
 

interface CourseCardProps {
  course: Course & {
    university?: {
      name: string;
      logo?: string | null;
      location?: string; // Added for the address section
    };
  };
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row items-stretch">
      
      {/* 1. Left: Course Image (Responsive width) */}
      <div className="relative w-full md:w-72 lg:w-80 h-48 md:h-auto shrink-0 overflow-hidden">
        <Image 
          src={  "https://mie-global-te43fd.s3.amazonaws.com/static/images/BMSc-Medical-Education--Intercalated.original.webp"} 
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* 2. Right: Content Area */}
      <div className="flex-1 p-5 md:p-6 flex flex-col">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-auto">
          <div className="space-y-1 max-w-2xl">
            <h3 className="text-xl font-bold text-[#003366] leading-snug group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
              <span className="text-[#E11D48] font-bold text-sm uppercase tracking-wide">
                {course.university?.name || "University Name"}
              </span>
              
              <div className="flex items-center gap-1.5 text-slate-500 text-sm border-l border-slate-200 pl-4">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{course.university?.location || "United Kingdom"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Blocks & CTA Section */}
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          
          <div className="flex gap-3">
            {/* Info Box 1: Study Level */}
            <div className="bg-[#EEF2FF] rounded-lg px-4 py-2 flex flex-col min-w-[120px]">
              <div className="flex items-center gap-1.5 text-[#4338CA] mb-0.5">
                <GraduationCap className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Study Level</span>
              </div>
              <span className="text-sm font-semibold text-slate-700">Undergraduate</span>
            </div>

            {/* Info Box 2: Duration */}
            <div className="bg-[#F0F9FF] rounded-lg px-4 py-2 flex flex-col min-w-[120px]">
              <div className="flex items-center gap-1.5 text-[#0369A1] mb-0.5">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Duration</span>
              </div>
              <span className="text-sm font-semibold text-slate-700">{course.duration || "3 Years"}</span>
            </div>
          </div>

          {/* Action Button */}
          <Link 
            href={`/courses/${course.slug}`}
            className="px-6 py-2.5 border-2 border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white rounded-lg font-bold transition-all duration-200 flex items-center gap-2 text-sm"
          >
            View Details
            <ArrowUpRight className="w-4 h-4" />
          </Link>

        </div>
      </div>
    </div>
  );
}