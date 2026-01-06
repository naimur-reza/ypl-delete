import { DollarSign } from "lucide-react";
import { MarkdownContent } from "@/components/ui/markdown-content";

interface CourseCostOfStudyProps {
  tuitionMin?: number | null;
  tuitionMax?: number | null;
  currency?: string | null;
  duration?: string | null;
  content?: string | null;
}

export function CourseCostOfStudy({ 
  tuitionMin, 
  tuitionMax, 
  currency = "USD",
  duration,
  content 
}: CourseCostOfStudyProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-amber-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
          Cost of Study
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {(tuitionMin || tuitionMax) && (
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-sm text-slate-500 mb-1">Tuition Fee</p>
            <p className="text-lg font-bold text-slate-900">
              {tuitionMin && tuitionMax 
                ? `${formatCurrency(tuitionMin)} - ${formatCurrency(tuitionMax)}`
                : tuitionMin 
                  ? `From ${formatCurrency(tuitionMin)}`
                  : tuitionMax 
                    ? `Up to ${formatCurrency(tuitionMax)}`
                    : "Contact for details"
              }
            </p>
          </div>
        )}
        {duration && (
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-sm text-slate-500 mb-1">Duration</p>
            <p className="text-lg font-bold text-slate-900">{duration}</p>
          </div>
        )}
      </div>

      {content && <MarkdownContent content={content} />}
    </div>
  );
}
