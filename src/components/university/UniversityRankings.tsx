import { Trophy } from "lucide-react";
import { MarkdownContent } from "@/components/ui/markdown-content";

interface UniversityRankingsProps {
  ranking: string;
}

export function UniversityRankings({ ranking }: UniversityRankingsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
          <Trophy className="w-5 h-5 text-amber-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
          Rankings
        </h2>
      </div>
      <MarkdownContent content={ranking} />
    </div>
  );
}
