import { Award, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Scholarship {
  id: string;
  title: string;
  slug: string;
  amount?: number | null;
  description?: string | null;
}

interface CourseScholarshipsProps {
  scholarships: Scholarship[];
  countrySlug: string;
}

export function CourseScholarships({ scholarships, countrySlug }: CourseScholarshipsProps) {
  if (scholarships.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Award className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
          Scholarships
        </h2>
      </div>

      <div className="space-y-3">
        {scholarships.map((scholarship) => (
          <Link
            key={scholarship.id}
            href={`/${countrySlug}/scholarships/${scholarship.slug}`}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                {scholarship.title}
              </h3>
              {scholarship.amount && (
                <p className="text-sm text-slate-600">
                  Up to {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(scholarship.amount)}
                </p>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
