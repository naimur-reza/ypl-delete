import { MarkdownContent } from "@/components/ui/markdown-content";

interface ScholarshipOverviewProps {
  content: string;
}

export function ScholarshipOverview({ content }: ScholarshipOverviewProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
        Overview / About the Scholarship
      </h2>
      <MarkdownContent content={content} />
    </div>
  );
}

