import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";

interface ScholarshipSectionProps {
  countryName: string;
}

export function ScholarshipSection({ countryName }: ScholarshipSectionProps) {
  return (
    <section className="relative py-20 px-6 overflow-hidden bg-slate-900">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
              <Award className="w-4 h-4" />
              <span>Financial Aid Available</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Scholarships to Study in {countryName}
            </h2>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Don't let finances hold you back. Explore a wide range of scholarships, grants, and bursaries available for international students in {countryName}.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="#" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-600/25"
              >
                Find Scholarships
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link 
                href="#" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                Eligibility Check
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-tr from-blue-600 to-emerald-400 rounded-3xl rotate-6 opacity-20 blur-lg"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <div className="space-y-6">
                  {[
                    { label: "Merit-based Scholarships", value: "Up to 100%" },
                    { label: "University Grants", value: "£2,000 - £5,000" },
                    { label: "Government Aid", value: "Full Funding" },
                    { label: "Research Fellowships", value: "Stipend + Fees" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <span className="text-slate-300 font-medium">{item.label}</span>
                      <span className="text-emerald-400 font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
