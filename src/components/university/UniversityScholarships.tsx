import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Scholarship {
  id: string;
  title: string;
  slug: string;
  amount?: number | null;
  description?: string | null;
}

interface UniversityScholarshipsProps {
  scholarships: Scholarship[];
  countrySlug?: string;
}

export function UniversityScholarships({ scholarships, countrySlug = "uk" }: UniversityScholarshipsProps) {
  if (scholarships.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
          Scholarships & Funding
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {scholarships.map((scholarship) => (
          <div
            key={scholarship.id}
            className="group p-5 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
          >
            <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
              {scholarship.title}
            </h3>

            {scholarship.description && (
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                {scholarship.description}
              </p>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {scholarship.amount && (
                <span className="font-semibold text-slate-900 text-sm">
                  Up to {scholarship.amount.toLocaleString()}
                </span>
              )}
              <Link href={`/${countrySlug}/scholarships/${scholarship.slug}`}>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-xs hover:bg-blue-50"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
