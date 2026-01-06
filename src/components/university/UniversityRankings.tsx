import { Trophy } from "lucide-react";
import { MarkdownContent } from "@/components/ui/markdown-content";

interface UniversityRankingsProps {
  ranking: string;
}

export function UniversityRankings({ ranking }: UniversityRankingsProps) {
  return (
    <section className="py-20 bg-white relative overflow-hidden" id="rankings">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
          
          {/* Left: Icon/Visual */}
          <div className="hidden lg:flex w-1/3 justify-center pt-12">
             <div className="relative w-48 h-48 bg-accent/10 rounded-full flex items-center justify-center">
                <Trophy className="w-24 h-24 text-accent" />
                <div className="absolute inset-0 border-4 border-dashed border-accent/30 rounded-full animate-spin-slow" />
             </div>
          </div>

          {/* Right: Content */}
          <div className="flex-1 max-w-4xl pt-8">
            <h2 className="section-title mb-12">Rankings</h2>
            <MarkdownContent content={ranking} className="prose-lg" />
          </div>

        </div>
      </div>
    </section>
  );
}
