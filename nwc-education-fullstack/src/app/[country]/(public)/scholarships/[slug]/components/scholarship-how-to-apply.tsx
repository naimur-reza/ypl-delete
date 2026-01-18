import { ArrowRight, Send } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/ui/markdown-content";

interface ScholarshipHowToApplyProps {
  content: string;
}

export function ScholarshipHowToApply({ content }: ScholarshipHowToApplyProps) {
  return (
    <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-200 p-6 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <Send className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">How to Apply</h2>
      </div>
      <MarkdownContent content={content} />
      <div className="mt-8 pt-8 border-t border-blue-200">
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

