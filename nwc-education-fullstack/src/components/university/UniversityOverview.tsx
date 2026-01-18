import { MarkdownContent } from "@/components/ui/markdown-content";

interface UniversityOverviewProps {
  overview: string;
}

export function UniversityOverview({ overview }: UniversityOverviewProps) {
  return (
    <section className="py-12 md:py-16 bg-white" id="overview">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 border-l-4 border-primary pl-4">
          Overview
        </h2>
        <MarkdownContent content={overview} />
      </div>
    </section>
  );
}
