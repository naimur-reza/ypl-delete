import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Scholarship {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  amount?: number | null;
}

interface RelatedScholarshipsProps {
  scholarships: Scholarship[];
  countrySlug: string;
}

export function RelatedScholarships({
  scholarships,
  countrySlug,
}: RelatedScholarshipsProps) {
  if (scholarships.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mb-4">
            <Award className="w-4 h-4" />
            <span>More Opportunities</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Related Scholarships
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore other scholarship opportunities that might interest you
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map((scholarship) => (
            <div
              key={scholarship.id}
              className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Award className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {scholarship.title}
              </h3>

              {scholarship.description && (
                <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">
                  {scholarship.description}
                </p>
              )}

              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                {scholarship.amount && (
                  <span className="font-bold text-primary">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(scholarship.amount)}
                  </span>
                )}
                <Link href={`/${countrySlug}/scholarships/${scholarship.slug}`}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full hover:bg-blue-50 group-hover:pr-2 transition-all"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1" />
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
