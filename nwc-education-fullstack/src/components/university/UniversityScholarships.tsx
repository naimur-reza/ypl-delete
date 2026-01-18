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
    <section className="py-12 md:py-16 bg-slate-50" id="scholarships">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Opportunities</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Scholarships & Funding</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map((scholarship) => (
            <div key={scholarship.id} className="group bg-white rounded-3xl p-8 border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <GraduationCap className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                {scholarship.title}
              </h3>
              
              {scholarship.description && (
                  <p className="text-slate-500 text-sm mb-6 line-clamp-3 flex-1">
                      {scholarship.description}
                  </p>
              )}
              
              <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                  {scholarship.amount && (
                      <span className="font-bold text-slate-900">
                          Up to {scholarship.amount.toLocaleString()}
                      </span>
                  )}
                  <Link href={`/${countrySlug}/scholarships/${scholarship.slug}`}>
                    <Button size="sm" variant="ghost" className="rounded-full hover:bg-blue-50 group-hover:pr-2 transition-all">
                        View Details <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
