import { ClipboardCheck } from "lucide-react";
import { MarkdownContent } from "@/components/ui/markdown-content";

interface CourseEntryRequirementsProps {
  content: string;
}

export function CourseEntryRequirements({ content }: CourseEntryRequirementsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <ClipboardCheck className="w-5 h-5 text-green-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
          Entry Requirements
        </h2>
      </div>
      <MarkdownContent content={content} />
    </div>
  );
}
