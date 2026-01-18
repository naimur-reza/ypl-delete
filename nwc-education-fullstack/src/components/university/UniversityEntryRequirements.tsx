import { FileCheck } from "lucide-react";
import { MarkdownContent } from "@/components/ui/markdown-content";

interface UniversityEntryRequirementsProps {
  requirements: string;
}

export function UniversityEntryRequirements({ requirements }: UniversityEntryRequirementsProps) {
  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden text-slate-300" id="requirements">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-primary/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
         <div className="flex items-center gap-6 mb-12">
             <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg shrink-0 backdrop-blur-sm">
                <FileCheck className="w-8 h-8 text-accent" />
            </div>
            <div>
                <span className="text-accent font-semibold tracking-wider text-sm uppercase block mb-1">Admission Criteria</span>
                <h2 className="section-title text-white">Entry Requirements</h2>
            </div>
        </div>
        
        <div className="bg-white/5 p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-sm">
            <MarkdownContent 
                content={requirements} 
                className="[&_p]:text-slate-300 [&_li]:text-slate-300 [&_strong]:text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white [&_a]:text-accent hover:[&_a]:text-accent/80"
            />
        </div>
      </div>
    </section>
  );
}
