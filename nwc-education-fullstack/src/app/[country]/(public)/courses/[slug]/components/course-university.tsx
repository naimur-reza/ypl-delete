import { Building2 } from "lucide-react";
import { MarkdownContent } from "@/components/ui/markdown-content";
import Image from "next/image";
import Link from "next/link";

interface CourseUniversityProps {
  university: {
    name: string;
    slug: string;
    logo?: string | null;
    description?: string | null;
    address?: string | null;
    website?: string | null;
  };
  countrySlug: string;
}

export function CourseUniversity({ university, countrySlug }: CourseUniversityProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
          About University
        </h2>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {university.logo && (
          <div className="shrink-0">
            <Image
              src={university.logo}
              alt={university.name}
              width={120}
              height={120}
              className="rounded-xl object-contain bg-slate-50 p-2"
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-2">{university.name}</h3>
          {university.address && (
            <p className="text-slate-600 text-sm mb-3">{university.address}</p>
          )}
          {university.description && (
            <p className="text-slate-600 mb-4 line-clamp-3">{university.description}</p>
          )}
          <Link 
            href={`/${countrySlug}/universities/${university.slug}`}
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            View University Details
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
