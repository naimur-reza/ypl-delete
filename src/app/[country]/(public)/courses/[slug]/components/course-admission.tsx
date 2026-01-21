import { GraduationCap, ArrowRight } from "lucide-react";
import { MarkdownContent } from "@/components/ui/markdown-content";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CourseAdmissionProps {
  content?: string | null;
  intakes?: { intake: string }[];
}

export function CourseAdmission({ content, intakes }: CourseAdmissionProps) {
  return (
    <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-200 p-6 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
          Admission
        </h2>
      </div>

      {intakes && intakes.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-slate-600 mb-2">Available Intakes:</p>
          <div className="flex flex-wrap gap-2">
            {intakes.map((i) => (
              <span
                key={i.intake}
                className="px-3 py-1 bg-white/80 rounded-full text-sm font-medium text-slate-700 border border-slate-200"
              >
                {i.intake}
              </span>
            ))}
          </div>
        </div>
      )}

      {content ? (
        <MarkdownContent content={content} />
      ) : (
        <p className="text-slate-500">Contact us for admission details.</p>
      )}

      <div className="mt-6 pt-6 border-t border-blue-200">
        <Link href="/apply-now">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 text-lg"
          >
            Apply Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
